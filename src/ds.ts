import { ViewState } from 'react-map-gl'
import { Column } from 'react-data-grid'
import { Feature as TurfFeature, Point as TurfPoint } from '@turf/helpers'
import Supercluster from 'supercluster'
import { Feature, Point } from 'geojson'


// Define your view state type
export interface IViewState
	extends ViewState {
	width: number;
	height: number;
}

export interface IProperties {
}


export interface IFeature
	extends TurfFeature<TurfPoint, IProperties>,
		Feature<Point>,
		Supercluster.PointFeature<IProperties> {}

export type ICluster<P extends IProperties> = IFeature & {
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
