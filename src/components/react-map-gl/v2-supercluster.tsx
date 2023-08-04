import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactMapGL, { MapRef, NavigationControl } from 'react-map-gl'
import { CLUSTER_RADIUS, INITIAL_VIEW_STATE, LnglatFormat, MAP_PROJECTION, MAX_ZOOM } from '@/config'
import { IFeature, IProperties } from '@/ds'
import { BBox } from 'geojson'
import useSupercluster from '@/hooks/use-supercluster'
import { DynamicMarker } from '@/components/react-map-gl/marker'
import _ from 'lodash'
import { usePrevious } from '@radix-ui/react-use-previous'
import { useControlBear, useInputBear, useMarkersBear, useUIBear, useVisualizationBear } from '@/store'
import { LanguageControl } from '@/components/react-map-gl/controls' // mark的话 必须加

const Map: React.FC = () => {
	const { cols, rows } = useInputBear()
	const { current } = useControlBear()
	const { lnglatCol, features, setFeatures } = useVisualizationBear()
	const { delMarker } = useMarkersBear()
	const { mapStyle } = useUIBear()
	
	useEffect(() => {
		const colIndex = cols.findIndex((v) => v.name === lnglatCol)
		if (colIndex < 0) return
		
		const features = rows
			.map((row) => ({
				type: 'Feature',
				properties: _.zipObject(cols.map((v) => v.name), row),
				geometry: {
					type: 'Point',
					coordinates: String(row[colIndex]).match(LnglatFormat)?.slice(1, 3).map(parseFloat),
				},
			}))
			.filter((feature) => feature.geometry.coordinates)
		setFeatures(features)
		console.debug({ features })
	}, [lnglatCol])
	
	const [bounds, setBounds] = useState<BBox | undefined>(undefined)
	const [zoom, setZoom] = useState<number>(INITIAL_VIEW_STATE.zoom)
	
	const mapFunction = useCallback((p) => ({
			...p,
			sum: p[current],
			cnt: 1,
		}),
		[current])
	
	const reduceFunction = useCallback((accumulated, props) => {
		accumulated.sum += props.sum
		accumulated.cnt += props.cnt
	}, [])
	
	
	const { clusters: clusters_ = [], supercluster } = useSupercluster<IFeature<IProperties>>({
		points: features,
		bounds,
		zoom,
		options: {
			radius: CLUSTER_RADIUS,
			maxZoom: MAX_ZOOM,
			map: mapFunction,
			reduce: reduceFunction,
			log: false,
			minPoints: 1,
		},
	})
	const clusters = clusters_
		.map((cluster) => _.merge({}, cluster, {
			properties: {
				sum: cluster.properties.sum ?? cluster.properties[current],
				cnt: cluster.properties.cnt ?? 1,
			},
		}))
	
	const previousCluster = usePrevious(clusters)
	previousCluster.forEach((c) => {
		if (!clusters.find((cc) => cc.id === c.id))
			delMarker(c.id)
	})
	
	const refMap = useRef<MapRef | null>(null)
	
	const total = {
		sum: _.sum(clusters.map((cluster) => cluster.properties.sum)),
		cnt: _.sum(clusters.map((cluster) => cluster.properties.cnt)),
	}
	
	console.debug({ features, clusters, clusters_ })
	
	return (
		<ReactMapGL
			ref={refMap}
			initialViewState={INITIAL_VIEW_STATE}
			projection={MAP_PROJECTION}
			mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
			// interactiveLayerIds={[`clusters-category`]}
			mapStyle={mapStyle}
			onRender={() => {
				const newBounds = refMap.current?.getBounds().toArray().flat()
				if (!_.isEqual(newBounds, bounds)) setBounds(newBounds)
				
				const newZoom = refMap.current?.getZoom()
				if (newZoom && newZoom !== zoom) setZoom(newZoom)
			}}
		>
			
			
			{clusters.map((cluster) => <DynamicMarker cluster={cluster} key={cluster.id} total={total} zoom={zoom}/>)}
			
			<LanguageControl/>
			<NavigationControl/>
		</ReactMapGL>
	)
}

export default Map
