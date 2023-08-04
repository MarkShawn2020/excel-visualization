import { create } from 'zustand'
import { combine, persist } from 'zustand/middleware'
import { produce } from 'immer'
import { RefObject } from 'react'
import mapboxgl from 'mapbox-gl'
import { WorkSheet } from 'xlsx'
import { IFeature } from '@/ds'
import { Col, MapStyle, Row } from '@/config'

export interface IInput<R, C> {
	ws?: WorkSheet
	setWs: (ws: WorkSheet) => void
	
	fileName?: string
	setFileName: (v: string) => void
	
	sheetName?: string
	setSheetName: (v: string) => void
	
	skipRows: number
	setSkipRows: (v: number) => void
	
	rows: R[]
	setRows: (v: C[]) => void
	
	cols: C[]
	setCols: (v: C[]) => void
	
	map: Record<string, any[]>
	setMap: (v: Record<string, any[]>) => void
}

export const useInputBear = create<IInput<Row, Col>>(persist(combine({
	ws: undefined,
	fileName: undefined,
	sheetName: undefined,
	skipRows: 0,
	cols: [],
	rows: [],
}, (set) => ({
	setWs: (v: WorkSheet) => set(produce((state) => {state.ws = v})),
	setFileName: (v: string) => set(produce((state) => {state.fileName = v})),
	setSheetName: (v: string) => set(produce((state) => {state.sheetName = v})),
	setSkipRows: (v: number) => set(produce((state) => {state.skipRows = v})),
	setRows: (v: Row[]) => set(produce((state) => {state.rows = v})),
	setCols: (v: Col[]) => set(produce((state) => {state.cols = v})),
	
	setMap: (v) => set(produce((state) => {state.map = v})),
	
})), {
	name: 'input',
}))


export interface IVisualization {
	posColIndex?: number // '0', '1', '2', ...
	setPosIndex: (v: number | undefined) => void
	
	valueColIndex?: number, // undefined 才会让placeholder有效
	setValueColIndex: (v: number | undefined) => void
	
	features: IFeature[]
	setFeatures: (v: IFeature[]) => void
	
	markers: Record<number, RefObject<mapboxgl.Marker | null>>
	addMarker: (id: number, val: RefObject<mapboxgl.Marker | null>) => void
	delMarker: (id: number) => void
}

export const useVisualizationBear = create<IVisualization>(persist((set) => ({
	valueColIndex: undefined,
	setValueColIndex: (v) => set(produce((state) => {state.valueColIndex = v})),
	
	posColIndex: undefined,
	setPosIndex: (v) => set(produce((state) => {state.posColIndex = v})),
	
	features: [],
	setFeatures: (v) => set(produce((state) => {state.features = v})),
	
	markers: {},
	addMarker: (id: number, val: RefObject<mapboxgl.Marker | null>) => set(produce((state) => {
		if (!id in state.markers) state.markers[id] = val
	})),
	delMarker: (id: number) => set(produce((state) => {
		const ref = state.markers[id]
		if (ref) {
			(ref?.current as mapboxgl.Marker | null)?.remove()
			delete state.markers[id]
		}
	})),
}), {
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
