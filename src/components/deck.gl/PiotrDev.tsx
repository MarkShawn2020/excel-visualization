'use client'
// components/Map.jsx

import React, { useState } from 'react'

import Map from 'react-map-gl'
import DeckGL from '@deck.gl/react/typed'
import 'mapbox-gl/dist/mapbox-gl.css'

// import map config
import { INITIAL_VIEW_STATE, lightingEffect } from '@/lib/mapconfig'
import { Tooltip } from '@/components/deck.gl/tooltip'
import { mapBox } from '@/config'

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
		upperPercentile = 100,
		coverage = 1,
		data,
	}) => {
	
	const [radius, setRadius] = useState(1000)
	
	return (
		<div>
			<DeckGL
				// layers={layers}
				getTooltip={getTooltip}
				effects={[lightingEffect]}
				initialViewState={INITIAL_VIEW_STATE}
				controller={true}
			>
				<Map
					className=""
					controller={true}
					mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
					mapStyle={mapBox.style}
				/>
				
				<Tooltip data={data} radius={radius} setRadius={setRadius}/>
			
			</DeckGL>
		</div>
	)
}

export default LocationAggregatorMap
