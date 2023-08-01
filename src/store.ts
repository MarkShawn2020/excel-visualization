import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { produce } from 'immer'
import { Columns, ColumnType } from '@/config'

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
