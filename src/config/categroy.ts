// filters for classifying sourceIds into five categories based on casenitude
import { CircleLayer, SymbolLayer } from 'mapbox-gl'
import { SourceProps } from 'react-map-gl'
import { CLUSTER_RADIUS, SOURCE_LAYER_ID } from '@/config'

const segs = [520, 540, 560, 580, 600]
export const case1 = ['<', ['get', 'value'], segs[0]]
export const case2 = ['all', ['>=', ['get', 'value'], segs[0]], ['<', ['get', 'value'], segs[1]]]
export const case3 = ['all', ['>=', ['get', 'value'], segs[1]], ['<', ['get', 'value'], segs[2]]]
export const case4 = ['all', ['>=', ['get', 'value'], segs[2]], ['<', ['get', 'value'], segs[3]]]
export const case5 = ['>=', ['get', 'value'], segs[3]]
export const colors = ['#0ef906', '#3e122c', '#fd8d3c', '#fc4e2a', '#e31a1c']

export const circleLayerProps: CircleLayer = {
	'id': `${SOURCE_LAYER_ID}_circle`,
	'type': 'circle',
	'source': SOURCE_LAYER_ID,
	'filter': ['!=', 'cluster', true],
	'paint': {
		'circle-color': [
			'case',
			case1,
			colors[0],
			case2,
			colors[1],
			case3,
			colors[2],
			case4,
			colors[3],
			colors[4],
		],
		'circle-opacity': 1,
		'circle-radius': 20,
	},
}
export const symbolLayerProps: SymbolLayer = {
	'id': `${SOURCE_LAYER_ID}_label`,
	'type': 'symbol',
	'source': SOURCE_LAYER_ID,
	'filter': ['!=', 'cluster', true],
	'layout': {
		'text-field': [
			'number-format',
			['get', 'value'],
			{ 'max-fraction-digits': 0 }, // 整数
		],
		'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
		'text-size': 14,
	},
	'paint': {
		'text-color': [
			'case',
			['<', ['get', 'value'], 3],
			'#666666',
			'white',
		],
	},
}

