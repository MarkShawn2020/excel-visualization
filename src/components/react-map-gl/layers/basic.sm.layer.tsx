import { Layer } from 'react-map-gl'
import { MAP_LAYERS, MAP_MIN_SM_CIRCLE_SIZE, MAP_SOURCE_ID } from '@/config'
import { colors } from '@/config/categroy'

export const BasicSmLayer = () => {
	
	
	return (
		<Layer {...({
			'id': MAP_LAYERS.basic_sm_circle,
			'type': 'circle', // ref: https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#circle
			'source': MAP_SOURCE_ID,
			'paint': {
				'circle-color': colors[4],
				'circle-opacity': .8,
				'circle-radius': MAP_MIN_SM_CIRCLE_SIZE,
			},
		})}/>
	
	)
}
