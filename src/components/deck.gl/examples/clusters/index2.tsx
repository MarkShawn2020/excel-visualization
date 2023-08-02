import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import type { MapRef } from 'react-map-gl'
import { Layer, Map, Source } from 'react-map-gl'

import ControlPanel from './control-panel'
import { clusterCountLayer, clusterLayer, unclusteredPointLayer } from './layers'
import type { GeoJSONSource } from 'mapbox-gl'
import { INITIAL_VIEW_STATE, MapStyle } from '@/config'

import geoData from '@/../data/data.geo.json'
import { LanguageControl } from '@/components/deck.gl/controls/language.control'

import Supercluster from 'supercluster'
import { bbox as getBbox } from '@turf/bbox'
import { TextLayer } from '@deck.gl/layers'


export default function Index() {
	const mapRef = useRef<MapRef | null>(null)
	const [viewState, setViewState] = useState(INITIAL_VIEW_STATE)
	
	const onClick = event => {
		const feature = event.features[0]
		if (!feature) return
		const clusterId = feature.properties.cluster_id
		
		const mapboxSource = mapRef.current?.getSource('earthquakes') as GeoJSONSource
		mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
			if (err) return
			
			mapRef.current?.easeTo({
				center: feature.geometry.coordinates,
				zoom,
				duration: 500,
			})
		})
	}
	
	
	return (
		<>
			<Map
				{...viewState}
				mapStyle={MapStyle.general}
				mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
				interactiveLayerIds={[clusterLayer.id]}
				onClick={onClick}
				onViewportChange={newViewport => {setViewState({ ...newViewport })}}
				ref={mapRef}
			>
				<Source
					id="earthquakes"
					type="geojson"
					data={geoData}
					cluster={true}
					clusterMaxZoom={14}
					clusterRadius={50}
				>
					<Layer {...clusterLayer} />
					
					<Layer {...unclusteredPointLayer} />
					
					<Layer {...clusterCountLayer} />
				
				</Source>
				
				<LanguageControl/>
			
			</Map>
			<ControlPanel/>
		</>
	)
}

export function renderToDom(container) {
	createRoot(container).render(<Index/>)
}
