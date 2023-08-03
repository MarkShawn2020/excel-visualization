import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { produce } from 'immer'
import { Columns, ColumnType } from '@/config'
import { RefObject } from 'react'
import mapboxgl from 'mapbox-gl'

export const useStoreBear = create(combine({
	col: ColumnType.v1,
	range: {
		value: Columns[ColumnType.v1].range,
		scope: Columns[ColumnType.v1].range,
	},
	
}, (set) => ({
	setColumn: (v: ColumnType) => set(produce((state) => {state.col = v})),
	setRangeScope: (v: number[]) => set(produce((state) => {state.range.scope = v})),
	setRangeValue: (v: number[]) => set(produce((state) => {state.range.value = v})),
})))

export const useMarkersBear = create(combine({}, (set) => ({
	addMarker: (id: number, val: RefObject<mapboxgl.Marker | null>) => set((state) => {
		console.log(`addMarker(id=${id})`)
		return id in state ? state : { ...state, [id]: val }
	}),
	delMarker: (id: number) => set((state) => {
		const ref = state[id]
		console.log(`delMarker(id=${id})`)
		if (ref) {
			(ref?.current as mapboxgl.Marker | null)?.remove()
			const { [id]: val, ...others } = state
			return others
		} else {
			return state
		}
	}),
})))
