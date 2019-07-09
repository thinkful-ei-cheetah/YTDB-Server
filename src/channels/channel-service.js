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
      const queries = arr.map(channel => {
        let data = {
          yt_id: channel.id.channelId,
          title: channel.snippet.channelTitle,
          thumbnail: channel.snippet.thumbnails.default.url,
          descritption: channel.snippet.descritption,
          'date_updated': Date.now()
        }
        // console.log(data)
        const insert = trx('channel').insert(data).toString()
        const update = trx('channel').update(data).where('yt_id', channel.id.channelId) //.whereRaw(`channel.yt_id = '${channel.id.channelId}'`)
        // console.log(trx.raw(`${insert} ON DUPLICATE KEY UPDATE ${update}`).transacting(trx).client['Client_PG'])
        return trx.raw(`${insert} ON CONFLICT ("yt_id") DO UPDATE SET ${update}`).transacting(trx)
        // return util.format(
        //   '%s ON DUPLICATE KEY UPDATE %s',
        //   insert, //.toString(),
        //   update //.toString().replace(/^update\s.*\sset\s/i, '')
        // )
      })
      // console.log(queries)
      return Promise.all(queries).then(trx.commit).catch(trx.rollback)
    })
  },
//   const createUser = async ({ email, name }) => {
//   const insert = knex('users').insert({ email, name }).toString()

//   const update = knex('users')
//     .update({ name })
//     .whereRaw(`users.email = '${email}'`)
//   const query = util.format(
//     '%s ON CONFLICT (email) DO UPDATE SET %s',
//     insert.toString(),
//     update.toString().replace(/^update\s.*\sset\s/i, '')
//   )

//   await db.raw(query)
// }
  // insertOrUpdate(tableName, rows){

  //   return DB.transaction((trx) => {

  //       const queries = rows.map((tuple) => {

  //           const insert = trx(tableName).insert(tuple).toString()
  //           const update = trx(tableName).update(tuple).toString().replace(/^update(.*?)set\s/gi, '')

  //           return trx.raw(`${insert} ON DUPLICATE KEY UPDATE ${update}`).transacting(trx)
  //       })

  //       return Promise.all(queries).then(trx.commit).catch(trx.rollback)
  //   })
  // }
  // insertOrUpdateChannel(db, arr){
  //   return db
  //     .transaction((trx) => {
  //       const queries = arr.map(channel => {
  //         const insert = trx('channel').insert(content)
  //         const update = trx('channel').where(channel).update(content)
  //         return trx.raw(`${insert} ON DUPLICATE KEY UPDATE ${update}`).transacting(trx)
  //       })
  //       return Promise.all(queries).then(trx.commit).catch(trx.rollback)
  //     })
  // }
}

module.exports = ChannelService