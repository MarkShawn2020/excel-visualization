import { IconLayer } from '@deck.gl/layers/typed'
import data from '@/../data/table.json'
import 'mapbox-gl/dist/mapbox-gl.css'


export const ICON_MAPPING = {
	marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
}

export const iconLayer = new IconLayer({
	id: 'icon-layer',
	data,
	pickable: true,
	// iconAtlas and iconMapping are required
	// getIcon: return a string
	iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
	iconMapping: ICON_MAPPING,
	getIcon: d => 'marker',
	
	sizeScale: 1,
	getPosition: d => d.coordinates,
	sizeMinPixels: 10,
	sizeMaxPixels: 100,
	getSize: d => d.v1 / 3,
	getColor: d => [d.v2, 50, 50],
})
