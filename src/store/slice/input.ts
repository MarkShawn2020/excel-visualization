import { WorkSheet } from 'xlsx'
import { Col, Row } from '@/config'
import { StoreSlice } from '@/store'

export interface InputSlice {
	ws?: WorkSheet
	setWs: (ws: WorkSheet) => void
	
	fileName?: string
	setFileName: (v: string) => void
	
	sheetName?: string
	setSheetName: (v: string) => void
	
	skipRows: number
	setSkipRows: (v: number) => void
	
	rows: Row[]
	setRows: (v: Row[]) => void
	
	cols: Col[]
	setCols: (v: Col[]) => void
	
	map: Record<string, any[]>
	setMap: (v: Record<string, any[]>) => void
}

export const createInputSlice_Immer: StoreSlice<InputSlice> = (set) => ({
	ws: undefined,
	setWs: (v) => set((state) => {state.ws = v}),
	
	fileName: undefined,
	setFileName: (v) => set((state) => {state.fileName = v}),
	
	sheetName: undefined,
	setSheetName: (v) => set((state) => {state.sheetName = v}),
	
	skipRows: 0,
	setSkipRows: (v) => set((state) => {state.skipRows = v}),
	
	rows: [],
	setRows: (v) => set((state) => {state.rows = v}),
	
	cols: [],
	setCols: (v) => set((state) => {state.cols = v}),
	
	map: {},
	setMap: (v) => set((state) => {state.map = v}),
})
