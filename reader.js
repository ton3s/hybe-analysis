const express = require('express')
const { engine } = require('express-handlebars')
const fs = require('fs').promises // Use promises version of fs for async/await

const app = express()
const port = 3000

// Set up Handlebars middleware
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

// Serve static files
app.use(express.static('public'))

// Route to display the JSON data
app.get('/', async (req, res) => {
	try {
		// Read the JSON file from the filesystem
		const data = await fs.readFile('./trials/trial-1.json', 'utf8')
		const jsonData = JSON.parse(data) // Parse the JSON data

		res.render('home', { data: jsonData }) // Render the data to the handlebars template
	} catch (error) {
		res.status(500).send('Error reading data from file: ' + error)
	}
})

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`)
})
