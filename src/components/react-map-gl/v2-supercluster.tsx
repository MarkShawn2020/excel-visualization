import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactMapGL, { Layer, MapRef, Marker, NavigationControl, Source, ViewState } from 'react-map-gl'
import { circleLayerProps, CLUSTER_RADIUS, INITIAL_VIEW_STATE, MAP_PROJECTION, MapStyle, sourceProps, textLayerProps } from '@/config'
import { IProperties, IViewState } from '@/ds'
// import Supercluster from 'supercluster'
import { BBox, Feature, Point } from 'geojson'
// import useSupercluster from '@/hooks/use-supercluster'
import { LanguageControl } from '@/components/deck.gl/controls/language.control'
import Supercluster from 'supercluster'
import data from '@/../data/full.geo.json'
import useSupercluster from '@/hooks/use-supercluster'
import { FlyToInterpolator } from '@deck.gl/core'
import { DynamicMarker } from '@/components/react-map-gl/marker'
import _ from 'lodash'
import { usePrevious } from '@radix-ui/react-use-previous'
import { useMarkersBear } from '@/store' // mark的话 必须加

const mapFunction = (p) => ({ ...p, sum: p.value, cnt: 1 })
const reduceFunction = (accumulated, props) => {
	accumulated.sum += props.sum
	accumulated.cnt += props.cnt
}

const Map: React.FC = () => {
	const ref = useRef<MapRef | null>(null)
	const [bounds, setBounds] = useState<BBox | undefined>(undefined)
	const [zoom, setZoom] = useState<number>(INITIAL_VIEW_STATE.zoom)
	const [viewport, setViewport] = useState<IViewState>(INITIAL_VIEW_STATE)
	
	const [features, setFeatures] = useState<Supercluster.PointFeature<IProperties>[]>(data.features)
	const [selected, setSelected] = useState<Feature<Point> | null>(null)
	const { delMarker } = useMarkersBear()
	
	const { clusters: clusters_ = [], supercluster } = useSupercluster<IProperties>({
		points: features,
		bounds,
		zoom,
		options: {
			radius: CLUSTER_RADIUS,
			maxZoom: 20,
			map: mapFunction,
			reduce: reduceFunction,
			log: false,
		},
	})
	const clusters = clusters_.filter((cluster) => cluster.properties.cluster)
	// const clusters = [].filter((cluster) => cluster.properties.cluster)
	
	const previousCluster = usePrevious(clusters)
	previousCluster.forEach((c) => {
		if (!clusters.find((cc) => cc.id === c.id))
			delMarker(c.id)
	})
	
	const refMap = useRef<MapRef | null>(null)
	
	const TOTAL = _.sum(clusters.map((cluster) => cluster.properties.sum))
	console.log('[SuperCluster] ', clusters)
	
	return (
		// {...viewport}
		<ReactMapGL
			ref={refMap}
			initialViewState={INITIAL_VIEW_STATE}
			projection={MAP_PROJECTION}
			mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
			// interactiveLayerIds={[`clusters-category`]}
			mapStyle={MapStyle.light}
			onRender={() => {
				const newBounds = refMap.current?.getBounds().toArray().flat()
				const newZoom = refMap.current?.getZoom()
				// console.log({ bounds, newBounds })
				if (!_.isEqual(newBounds, bounds)) {
					setBounds(newBounds)
				}
				if (newZoom && newZoom !== zoom) {
					setZoom(newZoom)
				}
			}}
		>
			
			<Source {...sourceProps}>
				
				<Layer {...circleLayerProps}/>
				
				<Layer {...textLayerProps}/>
			
			</Source>
			
			{clusters
				.map((cluster) => {
					return (
						<DynamicMarker cluster={cluster} key={cluster.id} TOTAL={TOTAL}/>
					)
				})}
			
			{/*{selected && (*/}
			{/*	<Popup*/}
			{/*		latitude={selected.geometry.coordinates[1]}*/}
			{/*		longitude={selected.geometry.coordinates[0]}*/}
			{/*		closeButton={true}*/}
			{/*		closeOnClick={false}*/}
			{/*		onClose={() => setSelected(null)}*/}
			{/*	>*/}
			{/*		<div>*/}
			{/*			<h2>{selected.properties.title}</h2>*/}
			{/*			<p>{selected.properties.description}</p>*/}
			{/*		</div>*/}
			{/*	</Popup>*/}
			{/*)}*/}
			
			<LanguageControl/>
			<NavigationControl/>
		</ReactMapGL>
	)
}

export default Map
