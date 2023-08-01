import { Slider } from '@/components/ui/slider'
import React from 'react'


export const VALUE_RANGE = [0, 200]

export const FilterCol = ({ setRange }: {
	setRange: (values: number[]) => void
}) => {
	return (
		<Slider defaultValue={VALUE_RANGE} min={VALUE_RANGE[0]} max={VALUE_RANGE[1]} step={1} onValueChange={setRange}/>
	)
}
