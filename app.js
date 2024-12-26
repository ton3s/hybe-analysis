const fs = require('fs')

// Read the data.json file
const data = fs.readFileSync('./data.json', 'utf-8')
const parsedData = JSON.parse(data)

// Create a separate file for each object in the array
parsedData.forEach((item, index) => {
	fs.writeFileSync(
		`./trials/trial-${index + 1}.txt`,
		JSON.stringify(item, null, 2)
	)
})
