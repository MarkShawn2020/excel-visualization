import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { ICluster, IProperties } from '@/ds'
import { Marker, Popup } from 'react-map-gl'

import { clsx } from 'clsx'
import { useMarkersBear } from '@/store'
import { useHover } from '@mantine/hooks' // mark的话 必须加


export const DynamicMarker = ({ cluster, TOTAL }: {
	cluster: ICluster<IProperties>
	TOTAL: number
}) => {
	const ref = useRef<mapboxgl.Marker | null>(null)
	const { hovered, ref: refHover } = useHover()
	
	const { addMarker } = useMarkersBear()
	
	useEffect(() => {
		addMarker(cluster.id, ref)
	}, [])
	
	const { geometry, properties } = cluster
	const [lon, lat] = geometry.coordinates
	const display = `${properties.sum.toFixed(1)}\n(${properties.cnt})`
	
	const r = 40 + Math.sqrt(properties.sum / TOTAL) * 80
	const w = r * 2
	
	console.log({ cluster, display, TOTAL, r, hovered })
	
	
	return (
		<>
			<Marker ref={ref} key={cluster.id} longitude={lon} latitude={lat}>
				<svg width={w} height={w} viewBox={`0 0 ${w} ${w}`} textAnchor="middle"
					// className={'bg-cyan-800'}
				>
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
					<circle cx={r} cy={r} r={r / 2} fill="#ef4444"/>
					{/*<circle cx={r} cy={r} r={r / 2} fill="#ef444455" className={clsx('animate-ping origin-center anim-duration-[3000ms]')}/>*/}
					<text dominantBaseline="central" transform={`translate(${r}, ${r})`} fill={'white'} fontSize={14} ref={refHover}>
						{display.split('\n').map((line, index) => (
							<tspan key={index} x={0} y={`${.9 * (index)}em`}>{line}</tspan>
						))}
					</text>
				</svg>
			
			</Marker>
			
			{hovered && (
				<div className={'absolute inset-0 w-60 h-fit  | bg-card text-accent-foreground flex flex-col gap-1'}>
					{Object.entries(properties).map(([key, val]) => (
						<div key={key}>
							{key}: {val}
						</div>
					))}
				</div>
			)}
		</>
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
