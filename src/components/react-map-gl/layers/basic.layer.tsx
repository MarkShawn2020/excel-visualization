import { Layer, Source, SourceProps } from 'react-map-gl'
import { CLUSTER_RADIUS, SOURCE_LAYER_ID } from '@/config'
import { case1, case2, case3, case4, circleLayerProps, colors, symbolLayerProps } from '@/config/categroy'
import { featureCollection } from '@turf/helpers'

export const BasicLayer = ({ features, clusterMode, property }: {
	features,
	clusterMode?: boolean
	property?: string
}) => {
	
	const data = featureCollection(features) // turf 里有，geojson里没有，ref: https://github.com/Turfjs/turf/issues/2301
	
	const sourceProps: SourceProps = {
		id: SOURCE_LAYER_ID,
		data,
		type: 'geojson',
	}
	console.log('[BasicLayer] ', data)
	
	return (
		<Source {...sourceProps}>
			
			<Layer {...({
				'id': `${SOURCE_LAYER_ID}_circle`,
				'type': 'circle',
				'source': SOURCE_LAYER_ID,
				'paint': {
					'circle-color': [colors[4]],
					'circle-opacity': .8,
					'circle-radius': 3,
					'circle-stroke-width': 1,
					'circle-stroke-opacity': .5,
					'circle-stroke-color': 'black',
					
				},
			})}/>
			
			{
				property && (
					<Layer {...({
							'id': `${SOURCE_LAYER_ID}_label`,
							'type': 'symbol',
							'source': SOURCE_LAYER_ID,
							'layout': {
								'text-field': [
									'number-format',
									['get', property],
									{ 'max-fraction-digits': 0 }, // 整数
								],
								'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
								'text-size': 14,
							},
							'paint': {
								'text-color': [
									'case',
									['<', ['get', property], 3],
									'#666666',
									'white',
								],
							},
						}
					)}/>
				)
			}
		
		</Source>
	)
}
