import React, { useEffect, useState } from 'react'
import ReactMapGL, { Layer, Source } from 'react-map-gl'
import Supercluster from 'supercluster'
import points from '../../../../data/features.geo.json'
import { INITIAL_VIEW_STATE } from '@/config'
import { IViewState } from '@/ds'

type Point = {
	type: 'Feature',
	properties: {
		cluster: boolean,
		cluster_id: number,
		point_count: number,
		value: number
	},
	geometry: {
		type: 'Point',
		coordinates: [number, number]
	}
};

type Cluster = {
	lat: number,
	lon: number,
	numPoints: number,
	id: number
}

const Map: React.FC = () => {
	const [viewport, setViewport] = useState<IViewState>(
		INITIAL_VIEW_STATE,
		// 	{
		// 	latitude: 0,
		// 	longitude: 0,
		// 	zoom: 2,
		// 	padding: { right: 0, left: 0, top: 0, bottom: 0 },
		// 	pitch: 45,
		// 	bearing: 0,
		// 	width: '100%',
		// 	height: '100%',
		// }
	)
	
	const [clusters, setClusters] = useState<Cluster[]>([])
	
	const getClusters = (viewport: IViewState) => {
		
		const index = new Supercluster({ radius: 40, maxZoom: 16 })
		index.load(points)
		
		const { zoom, latitude, longitude } = viewport
		const bbox = [longitude, latitude, longitude, latitude]
		const zoomInt = Math.floor(zoom)
		
		const clusters = index.getClusters(bbox, zoomInt)
		setClusters(clusters)
	}
	
	useEffect(() => {
		getClusters(viewport)
	}, [viewport])
	
	return (
		<ReactMapGL
			{...viewport}
			mapStyle="mapbox://styles/mapbox/streets-v9"
			mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
			onViewportChange={(nextViewport: IViewState) => setViewport(nextViewport)}
		>
			{clusters.map(cluster => (
				<Source
					key={`cluster-${cluster.id}`}
					type="geojson"
					data={{
						type: 'Feature',
						geometry: {
							type: 'Point',
							coordinates: [cluster.lon, cluster.lat],
						},
						properties: {
							cluster: true,
							cluster_id: cluster.id,
							point_count: cluster.numPoints,
						},
					}}
				>
					<Layer
						id="clusters"
						type="circle"
						paint={{
							'circle-color': {
								property: 'point_count',
								type: 'interval',
								stops: [
									[0, '#51bbd6'],
									[100, '#f1f075'],
									[750, '#f28cb1'],
								],
							},
							'circle-radius': {
								property: 'point_count',
								type: 'interval',
								stops: [
									[0, 20],
									[100, 30],
									[750, 40],
								],
							},
						}}
					/>
				</Source>
			))}
		</ReactMapGL>
	)
}

export default Map
