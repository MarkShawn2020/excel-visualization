'use client'
// components/Map.jsx

import React, { useState } from 'react'

import Map from 'react-map-gl'
import DeckGL from '@deck.gl/react/typed'
import 'mapbox-gl/dist/mapbox-gl.css'
import data from '../../data.json'

// import map config
import IconClusterLayer from '@/components/deck.gl/icon-cluster-layer'
import { IconLayer, ScatterplotLayer } from '@deck.gl/layers/typed'
import { MapView } from '@deck.gl/core/typed'

import maplibregl from 'maplibre-gl'
import { INITIAL_VIEW_STATE } from '@/lib/mapconfig'
import { mapBox } from '@/config'


const layer = new ScatterplotLayer({
	id: 'scatterplot-layer',
	data,
	pickable: true,
	opacity: 0.8,
	stroked: true,
	filled: true,
	radiusScale: 100,
	radiusMinPixels: 1,
	radiusMaxPixels: 100,
	lineWidthMinPixels: 1,
	getPosition: d => d.coordinates,
	getRadius: d => d.size,
	getFillColor: d => [255, 0, 0],
	getLineColor: d => [0, 0, 0],
})

// creating tooltip
export function getTooltip({ object }) {
	if (!object) {
		return null
	}
	const lat = object.position[1]
	const lng = object.position[0]
	const count = object.points.length
	
	return `\
        latitude: ${Number.isFinite(lat) ? lat.toFixed(6) : ''}
        longitude: ${Number.isFinite(lng) ? lng.toFixed(6) : ''}
        ${count} locations here`
}

const LocationAggregatorMap = (
	{
		iconMapping = 'data/location-icon-mapping.json',
		iconAtlas = 'data/location-icon-atlas.png',
		showCluster = true,
		mapStyle = mapBox.style,
	}) => {
	
	const [radius, setRadius] = useState(1000)
	
	
	return (
		<div>
			<DeckGL
				layers={[layer]}
				initialViewState={INITIAL_VIEW_STATE}
				controller={{ dragRotate: false }}
			>
				
				<Map
					mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
					reuseMaps
					mapStyle={mapStyle} preventStyleDiffing={true}/>
			
			</DeckGL>
		</div>
	)
}

export default LocationAggregatorMap
