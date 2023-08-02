import React, { useState, useEffect } from 'react'
import ReactMapGL, { Marker, Popup, ViewState } from 'react-map-gl'
import useSupercluster from '@/hooks/use-supercluster'
import { Cluster } from 'cluster'
import { BBox, Feature, Point } from 'geojson'
import Supercluster from 'supercluster'
import { FlyToInterpolator } from '@deck.gl/core'

type Viewport = ViewState & {
	width: string,
	height: string
}

const Map: React.FC = () => {
	const [viewport, setViewport] = useState<Viewport>({
		latitude: 0,
		longitude: 0,
		zoom: 2,
		width: '100%',
		height: '100%',
		bearing: 0,
		pitch: 0,
		padding: { top: 0, bottom: 0, left: 0, right: 0 },
	})
	
	const [points, setPoints] = useState<Supercluster.PointFeature<Point>[]>([])
	const [selected, setSelected] = useState<Feature<Point> | null>(null)
	
	const bounds: BBox = [
		viewport.longitude - 180,
		viewport.latitude - 90,
		viewport.longitude + 180,
		viewport.latitude + 90,
	]
	const { clusters, supercluster } = useSupercluster({
		points,
		bounds,
		zoom: viewport.zoom,
		options: { radius: 75, maxZoom: 20 },
	})
	
	return (
		<ReactMapGL
			{...viewport}
			mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
			onViewportChange={setViewport}
			interactiveLayerIds={[`clusters-category`]}
			mapStyle="mapbox://styles/mapbox/streets-v9"
		>
			{clusters.map((cluster) => {
				const [longitude, latitude] = cluster.geometry.coordinates
				const {
					cluster: isCluster,
					point_count: pointCount,
					category,
				} = cluster.properties
				if (isCluster) {
					return (
						<Marker
							key={`cluster-${cluster.id}`}
							latitude={latitude}
							longitude={longitude}
						>
							<div
								className={`cluster-marker cluster-${category}`}
								style={{
									width: `${10 + (pointCount / points.length) * 20}px`,
									height: `${10 + (pointCount / points.length) * 20}px`,
								}}
								onClick={() => {
									const expansionZoom = Math.min(
										supercluster?.getClusterExpansionZoom(cluster.id as number) ?? 0,
										20,
									)
									
									setViewport({
										...viewport,
										latitude,
										longitude,
										zoom: expansionZoom,
										transitionInterpolator: new FlyToInterpolator({
											speed: 2,
										}),
										transitionDuration: 'auto',
									})
								}}
							>
								{pointCount}
							</div>
						</Marker>
					)
				}
				
				return (
					<Marker
						key={`crime-${cluster.properties.cluster_id}`}
						latitude={latitude}
						longitude={longitude}
					>
						<div
							className="crime-marker"
							onClick={() => setSelected(cluster)}
						>
							<img src={`/markers/icon-${category}.png`} alt={category}/>
						</div>
					</Marker>
				)
			})}
			
			{selected && (
				<Popup
					latitude={selected.geometry.coordinates[1]}
					longitude={selected.geometry.coordinates[0]}
					closeButton={true}
					closeOnClick={false}
					onClose={() => setSelected(null)}
				>
					<div>
						<h2>{selected.properties.title}</h2>
						<p>{selected.properties.description}</p>
					</div>
				</Popup>
			)}
		</ReactMapGL>
	)
}

export default Map
