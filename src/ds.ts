import { ViewState } from 'react-map-gl'

export interface IColumn {
	range: number[]
}

// Define your point data type
export interface Point {
	type: string;
	properties: {
		cluster: boolean;
		cluster_id: number;
		point_count?: number;
		value: number;
	};
	geometry: {
		type: string;
		coordinates: number[];
	};
}

// Define your view state type
export interface IViewState extends ViewState {
	width: number | string;
	height: number | string;
}
