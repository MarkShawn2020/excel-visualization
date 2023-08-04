import { DynamicMarker } from '@/components/react-map-gl/marker'
import React, { useCallback } from 'react'
import useSupercluster from '@/hooks/use-supercluster'
import { CLUSTER_RADIUS, MAX_ZOOM } from '@/config'
import _ from 'lodash'
import { useVisualizationBear } from '@/store'
import { usePrevious } from '@mantine/hooks'

export const Markers = ({ bounds, zoom, colName }) => {
	const { features, delMarker } = useVisualizationBear()
	
	const mapFunction = useCallback((p) => ({ ...p, sum: p[colName], cnt: 1 }), [colName])
	const reduceFunction = useCallback((accumulated, props) => {
		accumulated.sum += props.sum
		accumulated.cnt += props.cnt
	}, [])
	
	const { clusters: clusters_ = [], supercluster } = useSupercluster({
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
				sum: cluster.properties.sum ?? cluster.properties[colName],
				cnt: cluster.properties.cnt ?? 1,
			},
		}))
	
	const previousCluster = usePrevious(clusters) ?? []
	previousCluster.forEach((c) => {
		if (!clusters.find((cc) => cc.id === c.id))
			delMarker(c.id)
	})
	
	const total = {
		sum: _.sum(clusters.map((cluster) => cluster.properties.sum)),
		cnt: _.sum(clusters.map((cluster) => cluster.properties.cnt)),
	}
	
	console.debug({ features, clusters })
	
	return (
		<>
			{clusters.map((cluster) => <DynamicMarker cluster={cluster} key={cluster.id} total={total} zoom={zoom}/>)}
		</>
	)
}
