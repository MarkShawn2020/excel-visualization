import coordinates from '../data/coordinates.json'
import fs from 'fs'
import { IViewState, Point } from '@/ds'


const geoData: Point[] = coordinates.map((item, index) => ({
	type: 'Feature',
	properties: {
		cluster: false,
		cluster_id: index,
		point_count: 1,
		value: Math.floor(Math.random() * 100),
	},
	geometry: {
		type: 'Point',
		coordinates: item,
	},
}))

const fullData = {
	'type': 'FeatureCollection',
	'crs': {
		'type': 'name',
		'properties': {
			'name': 'urn:ogc:def:crs:OGC:1.3:CRS84',
		},
	},
	'features': geoData,
}


fs.writeFileSync('./data/features.geo.json', JSON.stringify(geoData, null, 2), { encoding: 'utf-8' })
fs.writeFileSync('./data/full.geo.json', JSON.stringify(fullData, null, 2), { encoding: 'utf-8' })


