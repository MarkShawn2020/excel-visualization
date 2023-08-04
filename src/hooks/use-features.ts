import { useStore } from '@/store'
import _ from 'lodash'
import { LnglatFormat } from '@/config'
import { IFeature, IProperties } from '@/ds'
import { Point } from '@turf/helpers'

export const useFeatures = (): IFeature[] => {
	const { rows, cols, colIndex: { lnglat: lnglatIndex } } = useStore()
	
	return lnglatIndex < 0
		? []
		: rows
			.filter((row) => String(row[lnglatIndex]).match(LnglatFormat))
			.map((row) => ({
				type: 'Feature',
				properties: _.zipObject(cols.map((v) => v.name), row) as IProperties,
				geometry: {
					type: 'Point',
					coordinates: String(row[lnglatIndex]).match(LnglatFormat).slice(1, 3).map(parseFloat),
				},
			}))
}
