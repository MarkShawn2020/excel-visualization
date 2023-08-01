import { ScatterplotLayer } from '@deck.gl/layers/typed'
import data from '@/../../../../data/coordinates.json'

export const scatterLayer = new ScatterplotLayer({
	id: 'scatterplot-layer',
	data,
	pickable: true,
	opacity: 0.8,
	stroked: true,
	filled: true,
	radiusScale: 1,
	radiusMinPixels: 10,
	radiusMaxPixels: 100,
	lineWidthMinPixels: 1,
	getPosition: d => d.coordinates,
	getRadius: d => d.size,
	getFillColor: d => [255, 0, 0],
	getLineColor: d => [0, 0, 0],
})
