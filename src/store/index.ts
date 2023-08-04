import { create, StateCreator } from 'zustand'
import { createInputSlice_Immer, InputSlice } from '@/store/slice/input'
import { createVisualizationSlice_Immer, VisualizationSlice } from '@/store/slice/visualization'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export type StoreState = InputSlice & VisualizationSlice


export type StoreSlice<T> = StateCreator<StoreState,
	[
		['zustand/devtools', never],
		['zustand/persist', unknown], // ref: https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md#middlewares-and-their-mutators-reference
		['zustand/immer', never],
	],
	[],
	T>

export const useStore = create<StoreState>()(
	devtools(
		persist(
			immer(
				(...a) => ({
					...createInputSlice_Immer(...a),
					...createVisualizationSlice_Immer(...a),
				}),
			), { name: 'zustand' },
		),
	),
)
