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
import { FilterCol, VALUE_RANGE } from '@/components/deck.gl/extensions/filter-col'
import { SelectContent, SelectItem, SelectTrigger, Select, SelectGroup, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export const columns = ['v1', 'v2']

export const SelectCol = () => {
	return (
		<Select>
			<SelectTrigger>
				<SelectValue placeholder={'select one column'}/>
			</SelectTrigger>
			
			<SelectContent>
				<SelectGroup>
					{columns.map((col) => (
						<SelectItem value={col} key={col}>{col}</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
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
			
			<div className={'dark absolute inset-4 w-80 h-60 rounded-lg p-4 | bg-cyan-900 text-slate-200 font-medium'}>
				<Table className={'caption-top'}>
					<TableCaption>A list of your recent invoices.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className={'w-[150px]'}>Item</TableHead>
							<TableHead>Operation</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell>Range({VALUE_RANGE.join(', ')})</TableCell>
							<TableCell><FilterCol setRange={setFilter}/></TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</div>
	)
}

export default LocationAggregatorMap
