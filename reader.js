const express = require('express')
const { engine } = require('express-handlebars')
const fs = require('fs').promises
const path = require('path')

const app = express()
const port = 3000

app.engine(
	'handlebars',
	engine({
		helpers: {
			eq: (v1, v2) => v1 === v2,
		},
	})
)
app.set('view engine', 'handlebars')
app.set('views', './views')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.get('/', async (req, res) => {
	const trialNumber = req.query.trial || '1' // Ensure it's a string
	try {
		const files = await fs.readdir('./trials')
		const trialFiles = files.filter(
			(file) => file.startsWith('trial-') && file.endsWith('.json')
		)
		const trialNumbers = trialFiles
			.map((file) => file.match(/trial-(\d+)\.json/))
			.filter((match) => match)
			.map((match) => match[1]) // Keep as string
			.sort((a, b) => parseInt(a, 10) - parseInt(b, 10))

		const data = await fs.readFile(`./trials/trial-${trialNumber}.json`, 'utf8')
		const jsonData = JSON.parse(data)

		res.render('home', {
			data: jsonData,
			trialNumber,
			trialNumbers,
		})
	} catch (error) {
		console.log(error)
		res.status(500).send('Error reading data from file or directory: ' + error)
	}
})

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`)
})
