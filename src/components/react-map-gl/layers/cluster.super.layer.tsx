import { DynamicMarker } from '@/components/react-map-gl/supports/marker'
import React, { useCallback } from 'react'
import useSupercluster from '@/hooks/use-supercluster'
import { CLUSTER_RADIUS, MAX_ZOOM } from '@/config'
import _ from 'lodash'
import { useStore } from '@/store'
import { usePrevious } from '@mantine/hooks'
import { useFeatures } from '@/hooks/use-features'
import { IProperties } from '@/ds'
import { BBox } from 'geojson'
import Supercluster from 'supercluster'

export const ClusterSuperLayer = ({ bounds, zoom, property }: {
	bounds: BBox | undefined
	zoom: number
	property: string
}) => {
	const { delMarker } = useStore()
	const features = useFeatures()
	
	const mapFunction = useCallback((p) => ({ ...p, sum: p[property], cnt: 1 }), [property])
	const reduceFunction = useCallback((accumulated, props) => {
		accumulated.sum += props.sum
		accumulated.cnt += props.cnt
	}, [])
	
	const points = features as Supercluster.PointFeature<IProperties>[] // todo: 可以不 as 吗
	const { clusters: clusters_ = [], supercluster } = useSupercluster({
		points,
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
				sum: cluster.properties.sum ?? cluster.properties[property],
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
