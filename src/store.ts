import { create } from 'zustand'
import { combine, persist } from 'zustand/middleware'
import { produce } from 'immer'
import { RefObject } from 'react'
import mapboxgl from 'mapbox-gl'
import { WorkSheet } from 'xlsx'
import { IFeature, IProperties } from '@/ds'
import { ColumnType } from '@/__archive__/config'
import { MapStyle } from '@/config'

export const useInputBear = create(persist(combine({
	ws: undefined,
	fileName: '',
	sheetName: '',
	skipRows: 0,
	cols: [],
	rows: [],
}, (set) => ({
	setWs: (v: WorkSheet) => set(produce((state) => {state.ws = v})),
	setFileName: (v: string) => set(produce((state) => {state.fileName = v})),
	setSheetName: (v: string) => set(produce((state) => {state.sheetName = v})),
	setSkipRows: (v: number) => set(produce((state) => {state.skipRows = v})),
	setCols: (v: any[]) => set(produce((state) => {state.cols = v})),
	setRows: (v: any[]) => set(produce((state) => {state.rows = v})),
})), {
	name: 'input',
}))

export const useControlBear = create(persist(combine({
	map: {},
	current: undefined, // undefined 才会让placeholder有效
	scope: undefined,
}, (set) => ({
	setMap: (v: Record<string, any[]>) => set(produce((state) => {state.map = v})),
	setCurrent: (v: ColumnType) => set(produce((state) => {state.current = v})),
	setScope: (v: [number, number]) => set(produce((state) => {state.scope = v})),
})), {
	name: 'display',
}))

export const useVisualizationBear = create(persist(combine({
	features: [],
	lnglatCol: undefined,
}, (set) => ({
	setFeatures: (v: IFeature<IProperties>[]) => set(produce((state) => {state.features = v})),
	setLnglatCol: (v: string) => set(produce((state) => {state.lnglatCol = v})),
})), {
	name: 'visualization',
}))

/**
 * 这个不要持久化
 */
export const useMarkersBear = create(combine({}, (set) => ({
	addMarker: (id: number, val: RefObject<mapboxgl.Marker | null>) => set((state) => {
		const on = id in state
		return on ? state : { ...state, [id]: val }
	}),
	delMarker: (id: number) => set((state) => {
		const ref = state[id]
		if (ref) {
			(ref?.current as mapboxgl.Marker | null)?.remove()
			const { [id]: val, ...others } = state
			return others
		} else {
			return state
		}
	}),
})))


export const useUIBear = create(persist(combine({
	mapStyle: MapStyle.light,
}, (set) => ({
	setMapStyle: (v: MapStyle) => set(produce((state) => {state.mapStyle = v})),
})), {
	name: 'UI',
}))
