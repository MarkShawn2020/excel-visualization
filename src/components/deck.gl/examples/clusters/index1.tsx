import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import type { MapRef } from 'react-map-gl'
import { Layer, Map, Source } from 'react-map-gl'

import ControlPanel from './control-panel'
import { clusterCountLayer, clusterLayer, unclusteredPointLayer } from './layers'
import type { GeoJSONSource } from 'mapbox-gl'
import Supercluster from 'supercluster'
import { INITIAL_VIEW_STATE } from '@/config'
import { IViewState, IFeature } from '@/ds'

import points from '../../../../../data/features.geo.json'
import DeckGL from '@deck.gl/react'
import { BBox } from '@turf/helpers'
import { TextLayer } from '@deck.gl/layers'
import { LanguageControl } from '@/components/deck.gl/controls/language.control'
// import { TextLayer } from '@deck.gl/layers'


export default function Index1() {
	const mapRef = useRef<MapRef>(null as MapRef)
	
	const onClick = event => {
		const feature = event.features[0]
		if (!feature) return
		
		const clusterId = feature.properties.cluster_id
		
		const mapboxSource = mapRef.current?.getSource('earthquakes') as GeoJSONSource
		mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
			if (err) {
				return
			}
			
			mapRef.current.easeTo({
				center: feature.geometry.coordinates,
				zoom,
				duration: 500,
			})
		})
	}
	const [supercluster, setSupercluster] = useState<Supercluster<IFeature> | null>(null)
	const [viewState, setViewState] = useState<IViewState>(INITIAL_VIEW_STATE)
	const [clusters, setClusters] = useState<IFeature[]>([])
	
	// Load and process data
	useEffect(() => {
		// Assuming "points" is your data
		const index = new Supercluster<IFeature>({
			radius: 40,
			maxZoom: 16,
		})
		index.load(points)
		setSupercluster(index)
	}, [])
	
	// Update clusters on viewport change
	useEffect(() => {
		if (supercluster) {
			const bbox: BBox = [
				viewState.longitude - 10,
				viewState.latitude - 10,
				viewState.longitude + 10,
				viewState.latitude + 10,
			]
			const zoom = viewState.zoom
			const points = supercluster.getClusters(bbox, Math.floor(zoom))
			
			// Add "sum" property to each cluster
			for (const point of points) {
				if (point.properties.cluster) {
					point.properties.value = getClusterSum(point)
				}
			}
			setClusters(points)
		}
	}, [viewState, supercluster])
	
	const getClusterSum = (cluster: IFeature) => {
		// Get all original points in this cluster
		const leaves = supercluster?.getLeaves(cluster.properties.cluster_id, Infinity)
		// Sum their "value" property
		let sum = 0
		for (const leaf of leaves) {
			sum += leaf.properties.value
		}
		return sum
	}
	
	
	return (
		<>
			<Map
				{...viewState}
				mapStyle="mapbox://styles/mapbox/dark-v9"
				mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
				interactiveLayerIds={[clusterLayer.id]}
				onClick={onClick}
				ref={mapRef}
				onViewportChange={newViewport => {setViewState({ ...newViewport })}}
			>
				<Source
					id="earthquakes"
					type="geojson"
					data="https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson"
					cluster={true}
					clusterMaxZoom={14}
					clusterRadius={50}
				>
					<Layer {...clusterLayer} />
					<Layer {...clusterCountLayer} />
					<Layer {...unclusteredPointLayer} />
					
					<DeckGL
						viewState={viewState}
						layers={[
							// new TextLayer({
							// 	id: 'text-layer',
							// 	data: clusters,
							// 	getPosition: d => d.geometry.coordinates,
							// 	getText: d => d.properties.cluster ? `Sum: ${d.properties.value}` : '',
							// 	getSize: 32,
							// }),
						]}
					/>
				</Source>
				
				<LanguageControl/>
			</Map>
			<ControlPanel/>
		</>
	)
}

export function renderToDom(container) {
	createRoot(container).render(<Index1/>)
}
