'use client'

import React from 'react'

import Map from 'react-map-gl'
import DeckGL from '@deck.gl/react/typed'

import { INITIAL_VIEW_STATE } from '@/lib/mapconfig'
import { mapBox } from '@/config'
import { iconLayer } from '@/components/deck.gl/layers/icon.layer'
import { LanguageControl } from '@/components/deck.gl/controls/language.control'
import { DrawControl } from '@/components/deck.gl/controls/draw.control'


const LocationAggregatorMap = () => {
	
	
	return (
		<div>
			<DeckGL
				layers={[
					// scatterLayer,
					iconLayer,
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
		</div>
	)
}

export default LocationAggregatorMap
