import React, { useRef, useState } from 'react'
import ReactMapGL, { MapRef, NavigationControl, Source } from 'react-map-gl'
import { INITIAL_VIEW_STATE, INITIAL_ZOOM, MAP_PROJECTION, SOURCE_LAYER_ID } from '@/config'
import { BBox } from 'geojson'
import _ from 'lodash'
import { useStore } from '@/store'
import { LanguageControl } from '@/components/react-map-gl/controls/language'
import { SuperClusterLayer } from '@/components/react-map-gl/layers/supercluster.layer'
import { SimpleClusterLayer } from '@/components/react-map-gl/layers/simple.layer'
import { BasicLayer } from '@/components/react-map-gl/layers/basic.layer' // mark的话 必须加

const Visualization: React.FC = () => {
	const refMap = useRef<MapRef | null>(null)
	
	const [bounds, setBounds] = useState<BBox | undefined>(undefined)
	const [zoom, setZoom] = useState<number>(INITIAL_VIEW_STATE.zoom)
	
	const { valueColIndex, mapStyle, cols, clusterMode, features } = useStore()
	console.log({ valueColIndex, mapStyle, cols, clusterMode, features })
	
	return (
		<ReactMapGL
			ref={refMap}
			interactiveLayerIds={[SOURCE_LAYER_ID]}
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
			
			<BasicLayer features={features}/>
			
			{
				typeof valueColIndex !== 'undefined' && (
					clusterMode
						? <SuperClusterLayer colName={cols[valueColIndex].name} bounds={bounds} zoom={zoom}/>
						: <SimpleClusterLayer features={features} clusterMode={clusterMode}/>
				)
			}
			
			<LanguageControl/>
			<NavigationControl/>
		</ReactMapGL>
	)
}

export default Visualization
