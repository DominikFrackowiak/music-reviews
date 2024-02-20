const express = require('express')
const { connectToDb, getDb } = require('./db')

// init app / middleware

const app = express()
app.use(express.json())

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
		.forEach(record => records.push(record))

		.then(() => {
			res.status(200).json(records)
		})
		.catch(() => {
			res.status(500).json({ msg: 'Could not fetch the data' })
		})
})

app.get('/api/music-reviews/:slug', (req, res) => {
	const slug = req.params.slug

	db.collection('reviews')
		.findOne({ slug })
		.then(doc => res.status(200).json(doc))
		.catch(err =>
			res.status(500).json({ error: 'Could not fetch the document' })
		)
})

app.post('/api/music-reviews', (req, res) => {
	const record = req.body

	db.collection('reviews')
		.insertOne(record)
		.then(result => {
			res.status(201).json(result)
		})
		.catch(err => {
			res.status(500).json({ err: 'Could not create new document' })
		})
})

app.delete('/api/music-reviews/:slug', (req, res) => {
	const slug = req.params.slug

	db.collection('reviews')
		.deleteOne({ slug })
		.then(doc => res.status(200).json(doc))
		.catch(err => res.status(500).json({ err: 'Could not delete the document' }))
})

app.patch('/api/music-reviews/:slug', (req, res) => {
	const updates = req.body
	const slug = req.params.slug

	db.collection('reviews')
		.updateOne({ slug }, { $set: updates })
		.then(result => {
			res.status(201).json(result)
		})
		.catch(err => {
			res.status(500).json({ err: 'Could not update new document' })
		})
})
