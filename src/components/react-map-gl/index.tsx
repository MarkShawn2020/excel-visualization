import React, { useEffect, useRef, useState } from 'react'
import ReactMapGL, { MapRef, NavigationControl, Source } from 'react-map-gl'
import { INITIAL_VIEW_STATE, INITIAL_ZOOM, MAP_LAYERS, MAP_PROJECTION, MAP_SOURCE_ID } from '@/config'
import { BBox } from 'geojson'
import _ from 'lodash'
import { useStore } from '@/store'
import { LanguageControl } from '@/components/react-map-gl/controls/language'
import { ClusterSuperLayer } from '@/components/react-map-gl/layers/cluster.super.layer'
import { SimpleClusterLayer } from '@/components/react-map-gl/layers/cluster.simple.layer'
import { BasicSmLayer } from '@/components/react-map-gl/layers/basic.sm.layer'
import { BasicLgLayer } from '@/components/react-map-gl/layers/basic.lg.layer'
import { featureCollection } from '@turf/helpers'
import { useFeatures } from '@/hooks/use-features' // mark的话 必须加

const Visualization: React.FC = () => {
	const refMap = useRef<MapRef | null>(null)
	
	const [bounds, setBounds] = useState<BBox | undefined>(undefined)
	const [zoom, setZoom] = useState<number>(INITIAL_VIEW_STATE.zoom)
	
	const { colIndex, mapStyle, cols, clusterMode } = useStore()
	const property = cols[colIndex.measure]?.name
	
	const features = useFeatures()
	const data = featureCollection(features) // turf 里有，geojson里没有，ref: https://github.com/Turfjs/turf/issues/2301
	
	console.log({ features, property, clusterMode })
	
	useEffect(() => {
		const { current } = refMap
		return () => {
			Object.values(MAP_LAYERS)
				.forEach((layerId) => {
					const layer = current?.getLayer(layerId)
					// todo: remove layer, https://github.com/visgl/react-map-gl/blob/7.1-release/src/components/layer.ts#:~:text=layer.-,ts,-map.tsx
				})
		}
	}, [])
	
	return (
		<ReactMapGL
			ref={refMap}
			interactiveLayerIds={[MAP_SOURCE_ID]}
			initialViewState={INITIAL_VIEW_STATE}
			minZoom={INITIAL_ZOOM}
			projection={MAP_PROJECTION}
			mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
			mapStyle={mapStyle}
			onRender={() => {
				const newBounds = refMap.current?.getBounds().toArray().flat()
				if (!_.isEqual(newBounds, bounds)) setBounds(newBounds)
				
				const newZoom = refMap.current?.getZoom()
				if (newZoom && newZoom !== zoom) setZoom(newZoom)
			}}
		>
			
			<Source id={MAP_SOURCE_ID} type={'geojson'} data={data}>
				<BasicSmLayer/>
				{property && !clusterMode && <BasicLgLayer features={features} property={property}/>}
			</Source>
			
			{
				property && clusterMode && <ClusterSuperLayer property={property} bounds={bounds} zoom={zoom}/>
				// : <SimpleClusterLayer features={features} clusterMode={clusterMode} property={property}/>
				// )
			}
			
			
			<LanguageControl/>
			
			<NavigationControl/>
		
		</ReactMapGL>
	)
}

export default Visualization
