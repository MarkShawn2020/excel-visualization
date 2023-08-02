import { zhenzhou } from '@/const'
import { IColumn, IViewState } from '@/ds'
import { CircleLayer, SymbolLayer } from 'mapbox-gl'
import { SourceProps } from 'react-map-gl'
import fullGeoData from '../data/full.geo.json'


export enum ColumnType {
	v1 = 'v1',
	v2 = 'v2'
}

export const Columns: Record<ColumnType, IColumn> = {
	[ColumnType.v1]: {
		range: [0, 100],
	},
	[ColumnType.v2]: {
		range: [0, 200],
	},
}


export const INITIAL_VIEW_STATE: IViewState = {
	// 郑州经纬度
	longitude: zhenzhou.lon + 1, // 否则就出界面了
	latitude: zhenzhou.lat,
	
	zoom: 7,
	bearing: 0,
	pitch: 15,
	
	width: '100%',
	height: '100%',
	
	padding: { top: 0, left: 0, right: 0, bottom: 0 },
	
}


export enum MapStyle {
	general = 'mapbox://styles/markshawn2020/clks332uh00bg01o867252fve',
	dark = 'mapbox://styles/mapbox/dark-v9',
	light = 'mapbox://styles/mapbox/light-v11'
}

export const sourceId = 'shit'

// filters for classifying sourceIds into five categories based on magnitude
const segs = [520, 540, 560, 580, 600]
export const mag1 = ['<', ['get', 'value'], segs[0]]
export const mag2 = ['all', ['>=', ['get', 'value'], segs[0]], ['<', ['get', 'value'], segs[1]]]
export const mag3 = ['all', ['>=', ['get', 'value'], segs[1]], ['<', ['get', 'value'], segs[2]]]
export const mag4 = ['all', ['>=', ['get', 'value'], segs[2]], ['<', ['get', 'value'], segs[3]]]
export const mag5 = ['>=', ['get', 'value'], segs[3]]
// colors to use for the categories
export const colors = ['#0ef906', '#3e122c', '#fd8d3c', '#fc4e2a', '#e31a1c']
export const circleLayerProps: CircleLayer = {
	'id': `${sourceId}_circle`,
	'type': 'circle',
	'source': sourceId,
	'filter': ['!=', 'cluster', true],
	'paint': {
		'circle-color': [
			'case',
			mag1,
			colors[0],
			mag2,
			colors[1],
			mag3,
			colors[2],
			mag4,
			colors[3],
			colors[4],
		],
		'circle-opacity': 1,
		'circle-radius': 20,
	},
}
export const textLayerProps: SymbolLayer = {
	'id': `${sourceId}_label`,
	'type': 'symbol',
	'source': sourceId,
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
export const sourceProps: SourceProps = {
	id: sourceId,
	'type': 'geojson',
	data: fullGeoData,
	'cluster': true,
	'clusterRadius': 80,
	'clusterProperties': {
		// keep separate counts for each magnitude category in a cluster
		'mag1': ['+', ['case', mag1, 1, 0]],
		'mag2': ['+', ['case', mag2, 1, 0]],
		'mag3': ['+', ['case', mag3, 1, 0]],
		'mag4': ['+', ['case', mag4, 1, 0]],
		'mag5': ['+', ['case', mag5, 1, 0]],
	},
}
export const MAP_PROJECTION = 'albers' // 最适合查看小区域
