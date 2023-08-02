import ReactMapGl, { Layer, MapRef, Marker, NavigationControl, Source } from 'react-map-gl'
import { circleLayerProps, INITIAL_VIEW_STATE, MAP_PROJECTION, MapStyle, sourceId, sourceProps, textLayerProps } from '@/config'
import { RefObject, useEffect, useRef, useState } from 'react'
import { ICluster, IProperties } from '@/ds'
import { CreateDonutChart } from '@/components/react-map-gl/utils'
import { LanguageControl } from '@/components/deck.gl/controls/language.control'

import 'mapbox-gl/dist/mapbox-gl.css'
import { usePrevious } from '@radix-ui/react-use-previous'
import mapboxgl from 'mapbox-gl'
import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { produce } from 'immer'
import _ from 'lodash'

const masks = new Map<number, RefObject<mapboxgl.Marker>>()

export const useMarkersBear = create(combine<{ markers: Record<number, RefObject<mapboxgl.Marker | null>> }>({
	markers: {},
}, (set) => ({
	addMarker: (id: number, marker: RefObject<mapboxgl.Marker>) => {
		set(produce((state) => {state.markers[id] = marker}))
	},
	delMarker: (id: number) => {
		set(produce((state) => {state.markers.delete(id)}))
	},
})))

export const DynamicMarker = ({ cluster, clusters }: {
	cluster: ICluster<IProperties>
	clusters: ICluster<IProperties>[]
}) => {
	const ref = useRef<mapboxgl.Marker | null>(null)
	
	const { addMarker } = useMarkersBear()
	useEffect(() => {
		// addMarker(cluster.id, ref)
		masks[cluster.id] = ref
	}, [])
	
	return (
		<Marker
			ref={ref}
			key={cluster.id}
			longitude={cluster.geometry.coordinates[0]}
			latitude={cluster.geometry.coordinates[1]}
		>
			<CreateDonutChart cluster={cluster}/>
		</Marker>
	)
}

export const Index2 = () => {
	
	const [clusters, setClusters] = useState<ICluster<IProperties>[]>([])
	const previousClusters = usePrevious(clusters)
	const { delMarker } = useMarkersBear()
	
	const ref = useRef<MapRef | null>(null)
	
	return (
		<ReactMapGl
			ref={ref}
			projection={MAP_PROJECTION}
			initialViewState={INITIAL_VIEW_STATE}
			mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
			mapStyle={MapStyle.light}
			reuseMaps
			onRender={() => {
				if (!ref.current?.isSourceLoaded(sourceId)) return
				const newClusters = _.uniqBy(
					_.sortBy(((ref.current?.querySourceFeatures(sourceId) ?? []) as ICluster<IProperties>[]), 'id')
						.filter((item) => item.properties.cluster),
					'id')
				const toRemoveClusters = previousClusters
					.filter((c) => !newClusters.find((cc) => cc.id === c.id))
				console.log({ previousClusters, clusters, toRemoveClusters })
				toRemoveClusters.forEach((c) => {
					masks.get(c.id)?.current.remove()
					masks.delete(c.id)
				})
				setClusters(newClusters)
			}}
		>
			
			<Source {...sourceProps}>
				
				<Layer {...circleLayerProps}/>
				
				<Layer {...textLayerProps}/>
			
			</Source>
			
			{
				clusters.map((cluster) =>
					<DynamicMarker cluster={cluster} clusters={clusters} key={cluster.id}/>,
				)
			}
			
			<NavigationControl/>
			<LanguageControl/>
		</ReactMapGl>
	)
}

export default Index2

