import React, { useRef, useState } from 'react'
import ReactMapGL, { MapGeoJSONFeature, MapRef, NavigationControl, Popup, Source, useMap } from 'react-map-gl'
import { INITIAL_VIEW_STATE, INITIAL_ZOOM, MAP_LAYERS, MAP_PROJECTION, MAP_SOURCE_ID } from '@/config'
import { BBox, Position } from 'geojson'
import _ from 'lodash'
import { useStore } from '@/store'
import { LanguageControl } from '@/components/react-map-gl/controls/language'
import { ClusterSuperLayer } from '@/components/react-map-gl/layers/cluster.super.layer'
import { BasicSmLayer } from '@/components/react-map-gl/layers/basic.sm.layer'
import { BasicLgLayer } from '@/components/react-map-gl/layers/basic.lg.layer'
import { featureCollection, Point } from '@turf/helpers'
import { useFeatures } from '@/hooks/use-features'
import { HoverInfo } from '@/components/react-map-gl/supports/hover'

const Visualization: React.FC = () => {
	const refMap = useRef<MapRef | null>(null)
	
	const [bounds, setBounds] = useState<BBox | undefined>(undefined)
	const [zoom, setZoom] = useState<number>(INITIAL_VIEW_STATE.zoom)
	
	const { colIndex, mapStyle, cols, clusterMode } = useStore()
	
	const features = useFeatures()
	const data = featureCollection(features) // turf 里有，geojson里没有，ref: https://github.com/Turfjs/turf/issues/2301
	
	const [hoveredFeature, setHoveredFeature] = useState<MapGeoJSONFeature | null>(null)
	
	const property = colIndex.measure ? cols[colIndex.measure].name : undefined
	console.log({ features, property, clusterMode, hoveredFeature })
	
	return (
		<ReactMapGL
			ref={refMap}
			interactiveLayerIds={[
				...Object.values(MAP_LAYERS),
			]}
			initialViewState={INITIAL_VIEW_STATE}
			minZoom={INITIAL_ZOOM}
			projection={{name: MAP_PROJECTION}}
			mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
			mapStyle={mapStyle}
			onClick={(e) => {
				const feature = (e.features ?? [])[0] as MapGeoJSONFeature
				if (!feature) return
				const [lng, lat] = (feature.geometry as Point).coordinates
				refMap.current?.easeTo({ center: { lng, lat }, zoom: zoom + 1, duration: 1000, essential: true })
			}}
			onMouseEnter={(e) => {
				refMap.current!.getCanvas().style.cursor = 'pointer'
				const feature = e.features![0]
				setHoveredFeature(feature)
			}}
			onMouseOut={() => {
				refMap.current!.getCanvas().style.cursor = ''
				setHoveredFeature(null)
			}}
			onRender={() => {
				const newBounds = refMap.current?.getBounds().toArray().flat() as BBox | undefined
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
			
			{hoveredFeature && (
				<Popup longitude={hoveredFeature.geometry.coordinates[0]} latitude={hoveredFeature.geometry.coordinates[1]} closeButton={false} closeOnClick={false}>
					<HoverInfo {...hoveredFeature}/>
				</Popup>
			)}
			
			
			<LanguageControl/>
			
			<NavigationControl/>
		
		</ReactMapGL>
	)
}

export default Visualization
