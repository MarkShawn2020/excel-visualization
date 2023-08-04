import { create } from 'zustand'
import { combine, persist } from 'zustand/middleware'
import { produce } from 'immer'
import { RefObject } from 'react'
import mapboxgl from 'mapbox-gl'
import { WorkSheet } from 'xlsx'
import { IFeature, IProperties } from '@/ds'
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
})), {
	name: 'input',
}))

export interface IControl {
	map: Record<string, any[]>
	current?: number
	scope?: [number, number]
}

export const useControlBear = create<IControl>(persist(combine({
	map: {},
	current: undefined, // undefined 才会让placeholder有效
	scope: undefined,
}, (set) => ({
	setMap: (v) => set(produce((state) => {state.map = v})),
	setCurrent: (v) => set(produce((state) => {state.current = v})),
	setScope: (v) => set(produce((state) => {state.scope = v})),
})), {
	name: 'display',
}))

export interface IVisualization {
	features: IFeature[]
	setFeatures: (v: IFeature[]) => void
	
	lnglatKey?: string // '0', '1', '2', ...
	setLnglatKey: (v: string) => void
}

export const useVisualizationBear = create<IVisualization>(persist(combine({
	features: [],
	lnglatCol: undefined,
}, (set) => ({
	setFeatures: (v) => set(produce((state) => {state.features = v})),
	setLnglatKey: (v) => set(produce((state) => {state.lnglatKey = v})),
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
