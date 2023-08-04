import { zhenzhou } from '@/const'
import { IViewState } from '@/ds'


export const CLUSTER_RADIUS = 80
export const INITIAL_ZOOM = 7 // max zoom
export const MAX_ZOOM = 30


export const INITIAL_VIEW_STATE: IViewState = {
	// 郑州经纬度
	longitude: zhenzhou.lon + 1, // 否则就出界面了
	latitude: zhenzhou.lat,
	
	zoom: INITIAL_ZOOM,
	bearing: 0,
	pitch: 0, // 加了这个会旋转，尚未完全掌握。。
	
	width: 0,
	height: 0,
	
	padding: { top: 0, left: 0, right: 0, bottom: 0 },
}


export enum MapStyle {
	general = 'mapbox://styles/markshawn2020/clks332uh00bg01o867252fve',
	dark = 'mapbox://styles/mapbox/dark-v11',
	light = 'mapbox://styles/mapbox/light-v11'
}

export const MAP_SOURCE_ID = 'shit'

export enum MAP_LAYERS {
	basic_sm_circle = `${MAP_SOURCE_ID}_sm`,
	basic_lg_circle = `${MAP_SOURCE_ID}_circle_lg`,
	basic_lg_label = `${MAP_SOURCE_ID}_text_lg`,
}

export const MAP_PROJECTION = 'albers' // 最适合查看小区域
export const MAP_MIN_SM_CIRCLE_SIZE = 3
export const MAP_MIN_LG_CIRCLE_SIZE = 14
export const MAP_MAX_LG_CIRCLE_SIZE = 28

export const LnglatFormat = /^([\d.]+),([\d.]+)$/

