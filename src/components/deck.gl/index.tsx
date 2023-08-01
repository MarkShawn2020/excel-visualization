'use client'

import React, { useState } from 'react'

import Map from 'react-map-gl'
import DeckGL from '@deck.gl/react'

import { INITIAL_VIEW_STATE } from '@/lib/mapconfig'
import { mapBox } from '@/config'
import { LanguageControl } from '@/components/deck.gl/controls/language.control'
import { DrawControl } from '@/components/deck.gl/controls/draw.control'
import { DataFilterExtension } from '@deck.gl/extensions'
import { ScatterplotLayer } from '@deck.gl/layers'
import data from '../../../data/table.json'
import { Slider } from '@/components/ui/slider'
import { SliderRange } from '@radix-ui/react-slider'

export const VALUE_RANGE = [0, 200]

export const RangeInput = ({ setRange }: {
	setRange: (values: number[]) => void
}) => {
	return (
		<div className={'absolute inset-4 rounded-md p-4 w-80 h-40 bg-cyan-800 flex justify-center items-center text-slate-200 whitespace-nowrap'}>
			<div className={'flex w-full gap-2'}>
				<p>Range({VALUE_RANGE.join(', ')}): </p>
				<Slider defaultValue={VALUE_RANGE} min={VALUE_RANGE[0]} max={VALUE_RANGE[1]} step={1} onValueChange={setRange}/>
			</div>
		</div>
	)
}


const LocationAggregatorMap = () => {
	const [filter, setFilter] = useState(VALUE_RANGE)
	
	const dataFilter = new DataFilterExtension({
		filterSize: 1,
		// Enable for higher precision, e.g. 1 second granularity
		// See DataFilterExtension documentation for how to pick precision
		fp64: false,
	})
	
	const scatterLayer = new ScatterplotLayer<{ coordinates: number[] }>({
		id: 'scatterplot-layer',
		data,
		opacity: 0.8,
		stroked: true,
		filled: true,
		radiusScale: 1,
		radiusMinPixels: 10,
		radiusMaxPixels: 100,
		lineWidthMinPixels: 1,
		getPosition: d => d.coordinates,
		getRadius: d => d.v1,
		getFillColor: d => [255, 0, 0],
		getLineColor: d => [0, 0, 0],
		
		getFilterValue: d => d.v1,
		filterRange: [filter[0], filter[1]],
		extensions: [
			dataFilter,
		],
		
		pickable: true,
	})
	
	// console.log({ filter })
	
	
	return (
		<div>
			<DeckGL
				layers={[
					scatterLayer,
					// iconLayer,
				]}
				initialViewState={INITIAL_VIEW_STATE}
				controller={{ dragRotate: false }}
				getTooltip={({ object }) => object && `${object.coordinates}`}
			
			>
				
				<Map
					mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
					reuseMaps
					mapStyle={mapBox.style}
					preventStyleDiffing={true}
				>
					<DrawControl
						position="top-left"
						displayControlsDefault={false}
						controls={{
							polygon: true,
							trash: true,
						}}
					/>
					
					<LanguageControl/>
				
				</Map>
			
			</DeckGL>
			
			<RangeInput setRange={setFilter}/>
		</div>
	)
}

export default LocationAggregatorMap
