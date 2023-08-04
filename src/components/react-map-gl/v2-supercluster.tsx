import React, { useRef, useState } from 'react'
import ReactMapGL, { MapRef, NavigationControl } from 'react-map-gl'
import { INITIAL_VIEW_STATE, INITIAL_ZOOM, MAP_PROJECTION } from '@/config'
import { BBox } from 'geojson'
import _ from 'lodash'
import { useStore } from '@/store'
import { LanguageControl } from '@/components/react-map-gl/controls'
import { Markers } from '@/components/react-map-gl/markers' // mark的话 必须加

const Map: React.FC = () => {
	const refMap = useRef<MapRef | null>(null)
	
	const [bounds, setBounds] = useState<BBox | undefined>(undefined)
	const [zoom, setZoom] = useState<number>(INITIAL_VIEW_STATE.zoom)
	
	const { valueColIndex, mapStyle, cols } = useStore()
	
	
	return (
		<ReactMapGL
			ref={refMap}
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
			
			{valueColIndex && <Markers colName={cols[valueColIndex].name} bounds={bounds} zoom={zoom}/>}
			
			<LanguageControl/>
			<NavigationControl/>
		</ReactMapGL>
	)
}

export default Map
