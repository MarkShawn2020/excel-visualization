import { Slider } from '@/components/ui/slider'
import React from 'react'
import { useStoreBear } from '@/store'
import { VALUE_RANGE } from '@/config'


export const FilterCol = () => {
	const { setRange } = useStoreBear()
	return (
		<Slider defaultValue={VALUE_RANGE} min={VALUE_RANGE[0]} max={VALUE_RANGE[1]} step={1} onValueChange={setRange}/>
	)
}
