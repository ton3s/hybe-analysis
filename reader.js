const express = require('express')
const bodyParser = require('body-parser')
const { engine } = require('express-handlebars')
const fs = require('fs').promises
const path = require('path')
const axios = require('axios')
require('dotenv').config()
const { OpenAI } = require('openai')

const app = express()
const port = 3000

// OpenAI API key and setup
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY, // Replace with your actual API key
})

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

// Middleware to parse JSON bodies
app.use(bodyParser.json())

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }))

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

app.post('/explain', (req, res) => {
	const text = req.body.text
	getExplanation(text)
		.then((explanation) => {
			res.json({ explanation: explanation })
		})
		.catch((error) => {
			console.error('Error fetching explanation:', error)
			res.status(500).json({ error: 'Failed to fetch explanation' })
		})
})

async function getExplanation(text) {
	console.log('Text:', text)
	const completion = await openai.chat.completions.create({
		model: 'gpt-4o-mini', // Use the correct model identifier
		messages: [
			{ role: 'developer', content: 'You are a helpful assistant.' },
			{
				role: 'user',
				content: `Explain in layman's terms: ${text}`,
			},
		],
	})
	const explanation = completion.choices[0].message // Ensure you're accessing the correct property
	console.log('Explanation:', explanation)
	return explanation.content
}

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`)
})
