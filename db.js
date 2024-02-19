const { MongoClient } = require('mongodb')

let dbConnection

module.exports = {
	connectToDb: (cb) => {
		MongoClient.connect('mongodb://localhost:27017/music-reviews')
			.then(client => {
				dbConnection = client.db()
    return cb()
			})
			.catch(err => {
    console.log(err)
    cb(err)
   })
	}, // initially connect to db
	getDb: () => dbConnection, // return db connection
}


