export const zhenzhou = {
	lon: 113.6249,
	lat: 34.7472,
}

export const mapBox = {
	style: 'mapbox://styles/markshawn2020/clks332uh00bg01o867252fve',
}


export enum ColumnType {
	v1 = 'v1',
	v2 = 'v2'
}

export interface IColumn {
	range: number[]
}

export const Columns: Record<ColumnType, IColumn> = {
	[ColumnType.v1]: {
		range: [0, 100],
	},
	[ColumnType.v2]: {
		range: [0, 200],
	},
}

