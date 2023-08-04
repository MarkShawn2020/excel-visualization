import { ViewState } from 'react-map-gl'
import { Column } from 'react-data-grid'


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
		coordinates: [number, number];
	};
}

export type ICluster<P extends IProperties> = IFeature<P> & {
	id: number
	properties: {
		cluster: true
		cluster_id: number
		pointer_count: number
		point_count_abbreviated: number | string
		
		cnt: number
		sum: number | string | any
	}
}

export type Row = any
export type Col = Column<Row> & { name: string }
