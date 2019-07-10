const util = require('util')

const ChannelService = {
  searchChannels(db, searchTerm){
    return db
      .select('c.title', 'c.yt_id', 'c.thumbnail', 'c.description', 'c.rating_total', 'rating_count')
      .from('channel AS c')
      .leftJoin('channel_keyword AS ck', 'c.id', 'ck.channel_id')
      .leftJoin('keyword AS k', 'ck.keyword_id', 'k.id')
      .where('c.title', 'ILIKE', searchTerm)
      .orWhere('k.title', 'ILIKE', searchTerm)
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
          title: channel.snippet.channelTitle,
          thumbnail: channel.snippet.thumbnails.default.url,
          description: channel.snippet.description
          // 'date_updated': date
        }
        const insert = trx('channel').insert(data).toString()
        const update = trx('channel').update(data).where('channel.yt_id', channel.id.channelId).toString().replace(/^update\s.*\sset\s/i, '')
        return trx.raw(`${insert} ON CONFLICT (yt_id) DO UPDATE SET ${update}`) //.transacting(trx)
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
  searchChannels(db, searchTerm){
    return db
      .select('c.title', 'c.yt_id', 'c.thumbnail', 'c.description', 'c.rating_total', 'rating_count')
      .from('channel AS c')
      .leftJoin('channel_keyword AS ck', 'c.id', 'ck.channel_id')
      .leftJoin('keyword AS k', 'ck.keyword_id', 'k.id')
      .where('c.title', 'ILIKE', searchTerm)
      .orWhere('k.title', 'ILIKE', searchTerm)
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
  }
}

module.exports = ChannelService