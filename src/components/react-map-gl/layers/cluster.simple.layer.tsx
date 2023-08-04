import { Layer, Source, SourceProps } from 'react-map-gl'
import { CLUSTER_RADIUS, MAP_SOURCE_ID } from '@/config'
import { circleLayerProps, symbolLayerProps } from '@/config/categroy'
import { featureCollection } from '@turf/helpers'

export const SimpleClusterLayer = ({ features, clusterMode, property }: {
	features,
	clusterMode?: boolean
	property: string
}) => {
	
	const data = featureCollection(features) // turf 里有，geojson里没有，ref: https://github.com/Turfjs/turf/issues/2301
	
	const sourceProps: SourceProps = {
		id: MAP_SOURCE_ID,
		data,
		'type': 'geojson',
		...(clusterMode ? {
			'cluster': true,
			'clusterRadius': CLUSTER_RADIUS,
			'clusterProperties': {
				'cnt': ['+', 1],
				'sum': ['+', ['get', 'value']],
			},
		} : {}),
	}
	
	return (
		<Source {...sourceProps}>
			
			<Layer {...circleLayerProps}/>
			
			<Layer {...symbolLayerProps}/>
		
		</Source>
	)
}
