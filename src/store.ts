import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { produce } from 'immer'
import { RefObject } from 'react'
import mapboxgl from 'mapbox-gl'
import { WorkSheet } from 'xlsx'
import { IFeature, IProperties } from '@/ds'
import { ColumnType } from '@/__archive__/config'
import { MapStyle } from '@/config'

export const useInputSheetBear = create(combine({
	ws: undefined,
	name: '',
	skipRows: 0,
	cols: [],
	rows: [],
}, (set) => ({
	setWs: (v: WorkSheet) => set(produce((state) => {state.ws = v})),
	setName: (v: string) => set(produce((state) => {state.name = v})),
	setSkipRows: (v: number) => set(produce((state) => {state.skipRows = v})),
	setCols: (v: any[]) => set(produce((state) => {state.cols = v})),
	setRows: (v: any[]) => set(produce((state) => {state.rows = v})),
})))

export const useDisplayColumnBear = create(combine({
	map: {},
	current: undefined, // undefined 才会让placeholder有效
	scope: undefined,
}, (set) => ({
	setMap: (v: Record<string, any[]>) => set(produce((state) => {state.map = v})),
	setCurrent: (v: ColumnType) => set(produce((state) => {state.current = v})),
	setScope: (v: [number, number]) => set(produce((state) => {state.scope = v})),
})))

export const useVisualizationBear = create(combine({
	features: [],
	lnglatCol: undefined,
}, (set) => ({
	setFeatures: (v: IFeature<IProperties>[]) => set(produce((state) => {state.features = v})),
	setLnglatCol: (v: string) => set(produce((state) => {state.lnglatCol = v})),
})))

export const useMarkersBear = create(combine({}, (set) => ({
	addMarker: (id: number, val: RefObject<mapboxgl.Marker | null>) => set((state) => {
		const on = id in state
		// console.log(`addMarker(id=${id}), ${on ? '(passed)' : '✅'}`)
		// console.log('previous state: ', state)
		return on ? state : { ...state, [id]: val }
	}),
	delMarker: (id: number) => set((state) => {
		const ref = state[id]
		// console.log(`delMarker(id=${id}), ${ref ? '✅' : '(passed)'}`)
		// console.log('previous state: ', state)
		if (ref) {
			(ref?.current as mapboxgl.Marker | null)?.remove()
			const { [id]: val, ...others } = state
			return others
		} else {
			return state
		}
	}),
})))


export const useUIBear = create(combine({
	mapStyle: MapStyle.light,
}, (set) => ({
	setMapStyle: (v: MapStyle) => set(produce((state) => {state.mapStyle = v})),
})))
