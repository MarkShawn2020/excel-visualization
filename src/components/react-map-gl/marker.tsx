import { RefObject, useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import { ICluster, IProperties } from '@/ds'
import { Marker } from 'react-map-gl'

import 'mapbox-gl/dist/mapbox-gl.css'
import { clsx } from 'clsx' // mark的话 必须加

export const markers = new Map<number, RefObject<mapboxgl.Marker | null>>()
export const addMarker = (id: number, val: RefObject<mapboxgl.Marker | null>) => {markers.set(id, val)}
export const delMark = (id: number) => markers[id]?.current?.remove()

export const CreateDonutChart = ({ TOTAL, cluster: { properties: { sum, cnt } } }: {
	cluster: ICluster<IProperties>
	TOTAL: number
}) => {
	const r = 20 + Math.sqrt(sum / TOTAL) * 100
	const r0 = Math.round(r * 0.6)
	const w = r * 2
	// console.log({ TOTAL, sum, r })
	
	return (
		<svg width={w} height={w} viewBox={`0 0 ${w} ${w}`} textAnchor="middle" className={''}>
			{/*{*/}
			{/*	_.range(5).map((i) =>*/}
			{/*		<CreateDonutSegment*/}
			{/*			key={i}*/}
			{/*			start={offsets[i] / total}*/}
			{/*			end={(offsets[i] + counts[i]) / total}*/}
			{/*			r={r}*/}
			{/*			r0={r0}*/}
			{/*		/>,*/}
			{/*	)*/}
			{/*}*/}
			<circle cx={r} cy={r} r={r0 / 4} fill="#ef4444"/>
			<circle cx={r} cy={r} r={r0 / 4} fill="#ef444455" className={clsx('animate-ping origin-center duration-[3000ms]')}/>
			<text dominantBaseline="central" transform={`translate(${r}, ${r})`}>
				{`${sum}(${cnt})`}
			</text>
		</svg>
	)
}
export const CreateDonutSegment = (
	{ start, end, r, r0, color },
) => {
	if (end - start === 1) end -= 0.00001
	const a0 = 2 * Math.PI * (start - 0.25)
	const a1 = 2 * Math.PI * (end - 0.25)
	const x0 = Math.cos(a0),
		y0 = Math.sin(a0)
	const x1 = Math.cos(a1),
		y1 = Math.sin(a1)
	const largeArc = end - start > 0.5 ? 1 : 0
	
	// draw an SVG path
	return (
		<path d={`M ${r + r0 * x0} ${r + r0 * y0} L ${r + r * x0} ${r + r * y0} A ${r} ${r} 0 ${largeArc} 1 ${r + r * x1} ${r + r * y1} L ${r + r0 * x1} ${r + r0 * y1} A ${r0} ${r0} 0 ${largeArc} 0 ${r + r0 * x0} ${r + r0 * y0}`}
		      fill={color}/>
	)
}

export const DynamicMarker = ({ cluster, TOTAL }: {
	cluster: ICluster<IProperties>
	TOTAL: number
}) => {
	const ref = useRef<mapboxgl.Marker | null>(null)
	
	useEffect(() => {
		addMarker(cluster.id, ref)
	}, [])
	
	return (
		<Marker
			ref={ref}
			key={cluster.id}
			longitude={cluster.geometry.coordinates[0]}
			latitude={cluster.geometry.coordinates[1]}
		>
			<CreateDonutChart cluster={cluster} TOTAL={TOTAL}/>
		</Marker>
	)
}
