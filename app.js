const express = require('express')
const { connectToDb, getDb } = require('./db')

// init app / middleware

const app = express()

// db connection
let db

connectToDb(err => {
	if (!err) {
		app.listen(3000, () => {
			console.log('listening on port 3000')
		})
		db = getDb()
	}
})

app.get('/api/music-reviews', (req, res) => {
	let records = []
	db.collection('reviews')
		.find() //'cursor' object not data per se, toArray / for each
		.sort({ band: 1 })
		.forEach(record => {
			console.log(record)
			records.push(record)
		})
		.then(console.log(records))
		.then(() => {
			res.status(200).json(records)
		})
		.catch(() => {
			res.status(500).json({ msg: 'Could not fetch the data' })
		})
})
