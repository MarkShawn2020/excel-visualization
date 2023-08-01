import coordinates from '../data/coordinates.json'
import fs from 'fs'

console.log({ coordinates })

const data = coordinates.map((item, index) => ({
	coordinates: item,
	index,
	v1: Math.random() * 100,
	v2: Math.random() * 100 + (Math.random() > 0.5) * 100,
}))


fs.writeFileSync(
	'./data/table.json',
	JSON.stringify(data, null, 2),
	{ encoding: 'utf-8' },
)


