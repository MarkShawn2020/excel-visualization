import { zhenzhou } from '@/const'
import { IColumn, IViewState } from '@/ds'


export enum ColumnType {
	v1 = 'v1',
	v2 = 'v2'
}

export const Columns: Record<ColumnType, IColumn> = {
	[ColumnType.v1]: {
		range: [0, 100],
	},
	[ColumnType.v2]: {
		range: [0, 200],
	},
}

export const INITIAL_VIEW_STATE: IViewState = {
	// 郑州经纬度
	longitude: zhenzhou.lon + 1, // 否则就出界面了
	latitude: zhenzhou.lat,
	
	zoom: 7,
	bearing: 0,
	pitch: 15,
	
	width: '100%',
	height: '100%',
	
	padding: { top: 0, left: 0, right: 0, bottom: 0 },
}


export enum MapStyle {
	general = 'mapbox://styles/markshawn2020/clks332uh00bg01o867252fve',
	dark = 'mapbox://styles/mapbox/dark-v9',
	light = 'mapbox://styles/mapbox/light-v11'
}
