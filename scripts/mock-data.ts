import coordinates from '../data/coordinates.json'
import fs from 'fs'

console.log({ coordinates })

const tableData = coordinates.map((item, index) => ({
	coordinates: item,
	index,
	v1: Math.random() * 100,
	v2: Math.random() * 100 + (Math.random() > 0.5) * 100,
}))


const geoData = {
	'type': 'FeatureCollection',
	features: tableData.map((item) => ({
		type: 'Feature',
		geometry: {
			type: 'Point',
			coordinates: [
				item,
				item.v1, // todo: data structure
			],
		},
	})),
}


fs.writeFileSync('./data/table.json', JSON.stringify(tableData, null, 2), { encoding: 'utf-8' })
fs.writeFileSync('./data/data.geojson', JSON.stringify(tableData, null, 2), { encoding: 'utf-8' })


