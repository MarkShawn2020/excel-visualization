import { useControl } from 'react-map-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'

export function DrawControl(props: DrawControlProps) {
	useControl(() => new MapboxDraw(props), {
		position: props.position,
	})
	
	return null
}
