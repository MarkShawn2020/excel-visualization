import { IFeature } from '@/ds'
import { RefObject } from 'react'
import mapboxgl from 'mapbox-gl'
import { MapStyle } from '@/config'
import { StoreSlice } from '@/store'

export interface VisualizationSlice {
	posColIndex?: number // undefined 才会让placeholder有效, '0', '1', '2', ...
	setPosIndex: (v: number | undefined) => void
	
	valueColIndex?: number,
	setValueColIndex: (v: number | undefined) => void
	
	clusterMode: boolean
	setClusterMode: (v: boolean) => void
	
	catColIndex?: number
	setCatColIndex: (v: number | undefined) => void
	
	features: IFeature[]
	setFeatures: (v: IFeature[]) => void
	
	markers: Record<number, RefObject<mapboxgl.Marker | null>>
	addMarker: (id: number, val: RefObject<mapboxgl.Marker | null>) => void
	delMarker: (id: number) => void
	
	mapStyle: MapStyle
	setMapStyle: (v: MapStyle) => void
}

export const createVisualizationSlice_Immer: StoreSlice<VisualizationSlice> = (set) => ({
	valueColIndex: undefined,
	setValueColIndex: (v) => set((state) => {state.valueColIndex = v}),
	
	posColIndex: undefined,
	setPosIndex: (v) => set((state) => {state.posColIndex = v}),
	
	clusterMode: false,
	setClusterMode: (v) => set((state) => {state.clusterMode = v}),
	
	catColIndex: undefined,
	setCatColIndex: (v) => set((state) => {state.catColIndex = v}),
	
	features: [],
	setFeatures: (v) => set((state) => {state.features = v}),
	
	markers: {},
	addMarker: (id, val) => set((state => {
		if (!id in state.markers) state.markers[id] = val
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
})

