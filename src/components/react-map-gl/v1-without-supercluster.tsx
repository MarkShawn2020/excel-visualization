import ReactMapGl, { Layer, MapRef, NavigationControl, Source } from 'react-map-gl'
import { circleLayerProps, INITIAL_VIEW_STATE, MAP_PROJECTION, MapStyle, sourceId, sourceProps, textLayerProps } from '@/config'
import { useRef, useState } from 'react'
import { ICluster, IProperties } from '@/ds'
import { LanguageControl } from '@/components/deck.gl/controls/language.control'

import { usePrevious } from '@radix-ui/react-use-previous'
import _ from 'lodash'
import { DynamicMarker } from '@/components/react-map-gl/marker'
import { useMarkersBear } from '@/store'

export const V1WithoutSupercluster = () => {
	
	const [clusters, setClusters] = useState<ICluster<IProperties>[]>([])
	const previousClusters = usePrevious(clusters)
	
	const refMap = useRef<MapRef | null>(null)
	const { delMarker } = useMarkersBear()
	
	const updateMarks = () => {
		if (!refMap.current?.isSourceLoaded(sourceId)) return
		
		const newClusters = _.uniqBy(
			_.sortBy(((refMap.current?.querySourceFeatures(sourceId) ?? []) as ICluster<IProperties>[]), 'id')
				.filter((item) => item.properties.cluster),
			'id')
		
		setClusters(newClusters)
		
		previousClusters
			.filter((c) => !newClusters.find((cc) => cc.id === c.id))
			.map((c) => c.id)
			.forEach(delMarker)
	}
	
	return (
		<ReactMapGl
			ref={refMap}
			projection={MAP_PROJECTION}
			initialViewState={INITIAL_VIEW_STATE}
			mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
			mapStyle={MapStyle.light}
			reuseMaps
			onRender={updateMarks}
		>
			
			<Source {...sourceProps}>
				
				<Layer {...circleLayerProps}/>
				
				<Layer {...textLayerProps}/>
				
				{clusters.map((cluster) => <DynamicMarker cluster={cluster} key={cluster.id}/>)}
			
			</Source>
			
			<NavigationControl/>
			
			<LanguageControl/>
		
		</ReactMapGl>
	)
}

export default V1WithoutSupercluster

