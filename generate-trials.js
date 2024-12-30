const fs = require('fs')

// Read the data.json file
const data = fs.readFileSync('./data.json', 'utf-8')
const parsedData = JSON.parse(data)

// Create a separate file for each object in the array
parsedData.forEach((item, index) => {
	fs.writeFileSync(
		`./trials/trial-${index + 1}.json`,
		JSON.stringify(item, null, 2),
		{ flag: 'w' } // 'w' - Open file for writing. The file is created if it does not exist, or truncated if it exists.
	)
})
