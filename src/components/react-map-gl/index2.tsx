import Map, { Layer, LayerProps, MapRef, Marker, NavigationControl, Source, SourceProps } from 'react-map-gl'
import { INITIAL_VIEW_STATE, MapStyle } from '@/config'
import fullGeoData from '../../../data/full.geo.json'
import { useEffect, useRef, useState } from 'react'
import { Feature, MultiPoint } from 'geojson'
import { CircleLayer, SymbolLayer } from 'mapbox-gl'

// filters for classifying earthquakes into five categories based on magnitude
const mag1 = ['<', ['get', 'value'], 10]
const mag2 = ['all', ['>=', ['get', 'value'], 20], ['<', ['get', 'value'], 50]]
const mag3 = ['all', ['>=', ['get', 'value'], 50], ['<', ['get', 'value'], 100]]
const mag4 = ['all', ['>=', ['get', 'value'], 100], ['<', ['get', 'value'], 200]]
const mag5 = ['>=', ['get', 'value'], 200]

// colors to use for the categories
const colors = ['#0ef906', '#3e122c', '#fd8d3c', '#fc4e2a', '#e31a1c']

const circleLayerProps: CircleLayer = {
	'id': 'earthquake_circle',
	'type': 'circle',
	'source': 'earthquakes',
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

const textLayerProps: SymbolLayer = {
	'id': 'earthquake_label',
	'type': 'symbol',
	'source': 'earthquakes',
	'filter': ['!=', 'cluster', true],
	'layout': {
		'text-field': [
			'number-format',
			['get', 'value'],
			{ 'min-fraction-digits': 1, 'max-fraction-digits': 1 },
		],
		'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
		'text-size': 10,
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

// code for creating an SVG donut chart from feature properties
function createDonutChart(props) {
	const offsets = []
	const counts = [
		props.mag1,
		props.mag2,
		props.mag3,
		props.mag4,
		props.mag5,
	]
	let total = 0
	for (const count of counts) {
		offsets.push(total)
		total += count
	}
	const fontSize =
		total >= 1000 ? 22 : total >= 100 ? 20 : total >= 10 ? 18 : 16
	const r =
		total >= 1000 ? 50 : total >= 100 ? 32 : total >= 10 ? 24 : 18
	const r0 = Math.round(r * 0.6)
	const w = r * 2
	
	return (
		<div>
			<div>
				<svg width={w} height={w} viewBox={`0 0 ${w} ${w}`} textAnchor="middle" style={{ font: `${fontSize}px sans-serif`, display: 'block' }}>
					{
						counts.map((i) => donutSegment(
							offsets[i] / total,
							(offsets[i] + counts[i]) / total,
							r,
							r0,
							colors[i],
						))
					}
					<circle cx={r} cy={r} r={r0} fill="white"/>
					<text dominant-baseline="central" transform={`translate(${r}, ${r})`}>
						${total.toLocaleString()}
					</text>
				</svg>
			</div>
		</div>
	)
}

function donutSegment(start, end, r, r0, color) {
	if (end - start === 1) end -= 0.00001
	const a0 = 2 * Math.PI * (start - 0.25)
	const a1 = 2 * Math.PI * (end - 0.25)
	const x0 = Math.cos(a0),
		y0 = Math.sin(a0)
	const x1 = Math.cos(a1),
		y1 = Math.sin(a1)
	const largeArc = end - start > 0.5 ? 1 : 0
	
	// draw an SVG path
	return `<path d="M ${r + r0 * x0} ${r + r0 * y0} L ${r + r * x0} ${
		r + r * y0
	} A ${r} ${r} 0 ${largeArc} 1 ${r + r * x1} ${r + r * y1} L ${
		r + r0 * x1
	} ${r + r0 * y1} A ${r0} ${r0} 0 ${largeArc} 0 ${r + r0 * x0} ${
		r + r0 * y0
	}" fill="${color}" />`
}

export const sourceProps: SourceProps = {
	id: 'earthquakes',
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

type IFeature = Feature<MultiPoint, { cluster_id: string | number }>

export const Index2 = () => {
	const [markers, setMarkers] = useState<IFeature[]>([])
	console.log('[markers]', markers)
	
	const ref = useRef<MapRef | null>(null)
	
	return (
		<Map
			initialViewState={INITIAL_VIEW_STATE}
			mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
			mapStyle={MapStyle.light}
			reuseMaps
			onRender={() => {
				// setMarkers(ref.current?.querySourceFeatures('earthquakes') as IFeature[])
			}}
			ref={ref}
		>
			
			<Source {...sourceProps}>
				
				<Layer {...circleLayerProps}/>
				
				<Layer {...textLayerProps}/>
				
				{
					markers
						?.map((marker) => {
							const [lon, lat] = marker.geometry.coordinates
							const el = createDonutChart(marker.properties)
							return (
								<Marker key={marker.id}
								        longitude={lon as number}
								        latitude={lat as number}
								>
									{el}
								</Marker>
							)
						})
				}
			
			</Source>
			
			
			<NavigationControl/>
		</Map>
	)
}

export default Index2

