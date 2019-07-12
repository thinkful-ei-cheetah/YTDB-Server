const util = require('util')
const xss = require('xss')
const escape = require('pg-escape')

const ChannelService = {
  searchChannels(db, searchTerm){
    return db
      .select('c.title', 'c.yt_id', 'c.thumbnail', 'c.description', 'c.rating_total', 'rating_count')
      .from('channel AS c')
      .leftJoin('channel_keyword AS ck', 'c.id', 'ck.channel_id')
      .leftJoin('keyword AS k', 'ck.keyword_id', 'k.id')
      // .where('c.title', 'ILIKE', searchTerm)
      .where('c.title', 'ILIKE', '%'+searchTerm+'%')
      .orWhere('k.title', 'ILIKE', searchTerm)
  },
  searchChannelsByTopic(db, searchTerm, topicId){
    return db
      .select('c.title', 'c.yt_id', 'c.thumbnail', 'c.description', 'c.rating_total', 'rating_count')
      .from('channel AS c')
      .leftJoin('channel_keyword AS ck', 'c.id', 'ck.channel_id')
      .leftJoin('keyword AS k', 'ck.keyword_id', 'k.id')
      .leftJoin('channel_topic AS ct', 'c.id', 'ct.channel_id')
      .leftJoin('topic AS t', 'ct.topic_id', 't.id')
      // .where('c.title', 'ILIKE', searchTerm)
      // .where({'c.title': searchTerm, 't.titleId': topicId})
      .where({'c.title': '%'+searchTerm+'%', 't.titleId': topicId})
      .orWhere({'k.title': searchTerm, 't.titleId': topicId})
      // .orWhere('k.title', 'ILIKE', searchTerm)
      // .whereIn('t.titleId', topicId)
  },
  channelExisty(db, yt_id){
    return db
      .select('yt_id')
      .from('channel')
      .where('yt_id', yt_id)
      .then(res => {
        if(res.length){
          return true
        }
        else {
          return false
        }
      })
  },
  insertOrUpdateChannels(db, arr){
    return db.transaction( trx => {
      // let date = new Date()
      const queries = arr.map(channel => {
        let data = {
          yt_id: channel.id.channelId,
          title: xss(channel.snippet.channelTitle),
          thumbnail: xss(channel.snippet.thumbnails.default.url),
          description: xss(channel.snippet.description).replace(/['"“＂〃ˮײ″״‶˶]/g, "'")
          // 'date_updated': date
        }
        const insert = trx('channel').insert(data).toString()
        const update = trx('channel').update(data).where('channel.yt_id', channel.id.channelId).toString().replace(/^update\s.*\sset\s/i, '')
        return trx.raw(`${insert} ON CONFLICT (yt_id) DO UPDATE SET ${update}`) //.transacting(trx)
        // return trx.raw('%s ON CONFLICT (yt_id) DO UPDATE SET %s', insert, update) 
      })
      return Promise.all(queries).then(trx.commit).catch(trx.rollback)
    })
  },
  updateKeywords(db, searchTerm){
    return db.transaction(async trx => {
      let existy = await trx('keyword')
        .where('title', searchTerm)
        .select('title')
      if(existy.length){
      }
      else{
        // if it's out of sequence, run this:
        // SELECT pg_catalog.setval(pg_get_serial_sequence('keyword', 'id'), MAX(id)) FROM keyword;
        await trx('keyword')
          .insert({ title: searchTerm })
      }
    })
  },
  insertOrUpdateChannelKeywords(db, searchTerm, channels){
    return db.transaction(async trx => {
      let existy = await trx('channel')
        .select('channel.yt_id', 'channel.title AS channel_title', 'channel_keyword.channel_id', 'channel_keyword.keyword_id', 'keyword.title')
        .rightJoin('channel_keyword', 'channel.id', 'channel_keyword.channel_id')
        .leftJoin('keyword', 'channel_keyword.keyword_id', 'keyword.id')
        .where('keyword.title', 'ILIKE', searchTerm)
      let listy = existy.map(channel => {
        return channel.yt_id
      })
      let searchTermId = await trx('keyword').select('id').where('title', 'ILIKE', searchTerm).first()
      for(let i = 0; i < channels.length; i++){
        if(!listy.includes(channels[i])){
          let channelId = await trx('channel')
            .select('channel.id')
            .where('channel.yt_id', channels[i])
            .first()
          await trx('channel_keyword').insert({channel_id: channelId.id, keyword_id: searchTermId.id})
        }
      }
    })
  },
  insertOrUpdateChannelTopics(db, topicId, channels){
    return db.transaction(async trx => {
      let existy = await trx('channel')
        .select('channel.yt_id', 'channel.title AS channel_title', 'channel_topic.channel_id', 'channel_topic.topic_id', 'topic.title', 'topic.titleId')
        .rightJoin('channel_topic', 'channel.id', 'channel_topic.channel_id')
        .leftJoin('topic', 'channel_topic.topic_id', 'topic.id')
        .where('topic.titleId', 'ILIKE', topicId)
      let listy = existy.map(channel => {
        return channel.yt_id
      })
      let topicIdId = await trx('topic').select('id').where('titleId', 'ILIKE', topicId).first()
      for(let i = 0; i < channels.length; i++){
        if(!listy.includes(channels[i])){
          let channelId = await trx('channel')
            .select('channel.id')
            .where('channel.yt_id', channels[i])
            .first()
          await trx('channel_topic').insert({channel_id: channelId.id, topic_id: topicIdId.id})
        }
      }
    })
  },
  dirtyDetails(db, yt_id){
    return db
      .select('c.id', 'c.title', 'c.yt_id', 'c.thumbnail', 'c.description', 'c.rating_total', 'c.rating_count', 'c.date_updated', 'c.total_videos', 'c.subscriber_count', 'c.view_count', 'c.comment_count')
      // .select('c.title', 'c.yt_id', 'c.thumbnail', 'c.description', 'c.rating_total', 'rating_count', 'k.title AS keyword_title', 't.title AS topic_title', 'c.date_updated', 'c.total_videos', 'c.subscriber_count', 'c.view_count', 'c.comment_count')
      .from('channel AS c')
      // .leftJoin('channel_keyword AS ck', 'c.id', 'ck.channel_id')
      // .leftJoin('keyword AS k', 'ck.keyword_id', 'k.id')
      // .leftJoin('channel_topic AS ct', 'c.id', 'ct.channel_id')
      // .leftJoin('topic AS t', 'ct.topic_id', 't.id')
      .where({yt_id})
      .first()
  },
  myKeywords(db, id){
    return db
      .select('*')
      .from('channel_keyword AS ck')
      .leftJoin('keyword AS k', 'ck.keyword_id', 'k.id')
      .where('ck.channel_id', id)
  },
  myTopics(db, id){
    return db
      .select('*')
      .from('channel_topic AS ct')
      .leftJoin('topic AS t', 'ct.topic_id', 't.id')
      .where('ct.channel_id', id)
  },
  inputDirtyDetails(db, yt_id, statistics){
    let date_updated = new Date()
    return db('channel')
      .update({ total_videos: parseInt(statistics.videoCount), subscriber_count: parseInt(statistics.subscriberCount), view_count: parseInt(statistics.viewCount), comment_count: parseInt(statistics.commentCount), date_updated })
      .where({ yt_id })
  },
  serializeChannel(channel){
    return {
      title: channel.snippet.channelTitle,
      "yt_id": channel.id.channelId,
      thumbnail: channel.snippet.thumbnails.default.url,
      description: channel.snippet.description,
      "rating_total": null,
      "rating_count": null
    }
  },
  serializeDirtyDetails(channel){
    title,
    yt_id,
    thumbnail,
    description,
    rating_total,
    rating_count,
    keyword_title,
    topic_title,
    date_updated,
    total_videos,
    subscriber_count,
    view_count,
    comment_count
  }
}

module.exports = ChannelService