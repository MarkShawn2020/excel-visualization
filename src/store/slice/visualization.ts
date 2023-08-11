import { IFeature } from '@/ds'
import { RefObject } from 'react'
import mapboxgl from 'mapbox-gl'
import { MapStyle } from '@/config'
import { StoreSlice } from '@/store'

export interface ColKeyMap {
	lnglat?: number
	measure?: number
	category?: number
}

export type ColKey = keyof ColKeyMap

export interface VisualizationSlice {
	
	clusterMode: boolean
	setClusterMode: (v: boolean) => void
	
	colIndex: ColKeyMap
	setColIndex: (key: ColKey, val: number | undefined) => void
	
	markers: Record<number, RefObject<mapboxgl.Marker | null>>
	addMarker: (id: number, val: RefObject<mapboxgl.Marker | null>) => void
	delMarker: (id: number) => void
	
	mapStyle: MapStyle
	setMapStyle: (v: MapStyle) => void
	
	colors: string[]
	setColors: (key: number, v: string) => void
}

export const createVisualizationSlice_Immer: StoreSlice<VisualizationSlice> = (set) => ({
	
	clusterMode: false,
	setClusterMode: (v) => set((state) => {state.clusterMode = v}),
	
	colIndex: {
		lnglat: undefined,
		category: undefined,
		measure: undefined,
	},
	setColIndex: (key, val) => set(state => {state.colIndex[key] = val}),
	
	markers: {},
	addMarker: (id, val) => set((state => {
		if (!(id in state.markers)) state.markers[id] = val
	})),
	delMarker: (id) => set((state => {
		const ref = state.markers[id]
		if (ref) {
			(ref?.current as mapboxgl.Marker | null)?.remove()
			delete state.markers[id]
		}
	})),
	
	mapStyle: MapStyle.light,
	setMapStyle: (v) => set((state) => {state.mapStyle = v}),
	
	colors: ['#fca5a5', '#ef4444', '#b91c1c', '#7f1d1d'],
	setColors: (key, v) => set((state) => {state.colors[key] = v}),
})

