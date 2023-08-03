import { ViewState } from 'react-map-gl'

export interface IColumn {
	range: number[]
}


// Define your view state type
export interface IViewState
	extends ViewState {
	width: number;
	height: number;
}

export interface IProperties {
	value: number;
}


// Define your point data type
export interface IFeature<P extends IProperties = {}> {
	type: string;
	properties: P
	geometry: {
		type: string;
		coordinates: number[];
	};
}

export type ICluster<P extends IProperties> = IFeature<P> & {
	id: number
	properties: {
		cluster: true
		cluster_id: number
		pointer_count: number
		point_count_abbreviated: number | string
		
		case1: number
		case2: number
		case3: number
		case4: number
		case5: number
		cnt: number
		sum: number | string | any
	}
}
