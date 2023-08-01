import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { produce } from 'immer'
import { Columns, VALUE_RANGE } from '@/config'

export const useStoreBear = create(combine({
	col: Columns.v1,
	range: {
		value: VALUE_RANGE,
		scope: VALUE_RANGE,
	},
	
}, (set) => ({
	setColumn: (v: Columns) => set(produce((state) => {state.col = v})),
	setRangeValue: (v: number[]) => set(produce((state) => {state.range.value = v})),
	setRangeScope: (v: number[]) => set(produce((state) => {state.scope.value = v})),
})))
