'use client'

import React from 'react'

import Map from 'react-map-gl'
import DeckGL from '@deck.gl/react'

import { INITIAL_VIEW_STATE, MapStyle } from '@/config'
import { LanguageControl } from '@/components/deck.gl/controls/language.control'
import { DrawControl } from '@/components/deck.gl/controls/draw.control'
import data from '../../../../../data/table.json'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useControlBear } from '@/store'
import { Slider } from '@/components/ui/slider'

import { ScatterplotLayer } from '@deck.gl/layers'
import { HexagonLayer } from '@deck.gl/aggregation-layers'

import { DataFilterExtension } from '@deck.gl/extensions'
import { AmbientLight, LightingEffect, PointLight } from '@deck.gl/core'
import { Columns, ColumnType } from '@/__archive__/config'

export const colorRange = [
	[1, 152, 189],
	[73, 227, 206],
	[216, 254, 181],
	[254, 237, 177],
	[254, 173, 84],
	[209, 55, 78],
]

const material = {
	ambient: 0.64,
	diffuse: 0.6,
	shininess: 32,
	specularColor: [51, 51, 51],
}

const ambientLight = new AmbientLight({
	color: [255, 255, 255],
	intensity: 1.0,
})

const pointLight1 = new PointLight({
	color: [255, 255, 255],
	intensity: 0.8,
	position: [-0.144528, 49.739968, 80000],
})

const pointLight2 = new PointLight({
	color: [255, 255, 255],
	intensity: 0.8,
	position: [-3.807751, 54.104682, 8000],
})

const lightingEffect = new LightingEffect({ ambientLight, pointLight1, pointLight2 })


const LocationAggregatorMap = ({
	                               radius = 1000,
	                               upperPercentile = 100,
	                               coverage = 1,
                               }) => {
	const { col, range, setColumn, setRangeValue, setRangeScope } = useControlBear()
	
	const dataFilter = new DataFilterExtension({ filterSize: 1, fp64: false })
	
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
		getRadius: d => d[ColumnType.v1],
		getFillColor: d => [255, 0, 0],
		getLineColor: d => [0, 0, 0],
		
		getFilterValue: d => d[ColumnType.v1],
		filterRange: range.value,
		extensions: [
			dataFilter,
		],
		
		pickable: true,
	})
	
	const hexagonLayer = new HexagonLayer({
		id: 'heatmap',
		colorRange,
		coverage,
		data,
		elevationRange: [0, 3000],
		elevationScale: data && data.length ? 50 : 0,
		extruded: true,
		getPosition: d => d.coordinates,
		pickable: true,
		radius,
		upperPercentile,
		material,
	})
	
	
	return (
		<div>
			<DeckGL
				layers={[
					scatterLayer,
					// hexagonLayer,
					// iconLayer,
				]}
				effects={[lightingEffect]}
				initialViewState={INITIAL_VIEW_STATE}
				controller={{ dragRotate: false }}
				getTooltip={({ object }) => object && console.log(object) && {
					html: Object.entries(object).map(([key, val]) => (
						`<div>${key}: ${val}</div>`
					)).join(''),
				}
				}
			>
				
				<Map
					mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
					reuseMaps
					mapStyle={MapStyle.general}
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
							<TableCell>Select Column</TableCell>
							<TableCell>
								<Select
									defaultValue={ColumnType.v1}
									onValueChange={(col) => {
										setColumn(col)
										setRangeScope(Columns[col].range)
										setRangeValue(Columns[col].range)
									}}>
									<SelectTrigger>
										<SelectValue/>
									</SelectTrigger>
									<SelectContent>
										<SelectItem value={ColumnType.v1}>{ColumnType.v1}</SelectItem>
										<SelectItem value={ColumnType.v2}>{ColumnType.v2}</SelectItem>
									</SelectContent>
								</Select>
							</TableCell>
						</TableRow>
						
						<TableRow>
							<TableCell>Range({range.scope.join('-')})</TableCell>
							<TableCell>
								<Slider defaultValue={range.value} min={range.scope[0]} max={range.scope[1]} step={1} onValueChange={setRangeValue}/>
							</TableCell>
						</TableRow>
					
					
					</TableBody>
				</Table>
			</div>
		</div>
	)
}

export default LocationAggregatorMap
