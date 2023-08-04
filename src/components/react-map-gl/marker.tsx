import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import { ICluster, IProperties } from '@/ds'
import { Marker, useMap } from 'react-map-gl'

import { clsx } from 'clsx'
import { useStore } from '@/store'
import { useHover } from '@mantine/hooks' // mark的话 必须加


export const DynamicMarker = ({ cluster, total, zoom }: {
	cluster: ICluster<IProperties>
	zoom: number
	total: {
		sum: any
		cnt: number
	}
}) => {
	const map = useMap()
	const ref = useRef<mapboxgl.Marker | null>(null)
	const { hovered, ref: refHover } = useHover()
	
	const { addMarker } = useStore()
	
	useEffect(() => {
		addMarker(cluster.id, ref)
	}, [])
	
	const { geometry, properties } = cluster
	const isPct = typeof properties.sum === 'number' // 不能用 total.sum
	const [lon, lat] = geometry.coordinates
	const display = isPct ? [properties.sum.toFixed(1), properties.cnt].join('\n') : properties.cnt.toString()
	
	const r = 40 + Math.sqrt(isPct ? properties.sum / total.sum : properties.cnt / total.cnt) * 80
	const w = r * 2
	
	console.debug({ cluster, display, total, r, hovered })
	
	
	return (
		<>
			<Marker ref={ref} key={cluster.id} longitude={lon} latitude={lat} onClick={() => {
				console.log('clicked')
				map.current?.easeTo({
					center: cluster.geometry.coordinates,
					essential: true,
					// pitch: 0,
					// bearing: 0,
					zoom: zoom + 1,
					duration: 1000,
				})
			}}>
				<div ref={refHover}>
					<svg width={w} height={w} viewBox={`0 0 ${w} ${w}`} textAnchor="middle">
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
						<circle cx={r} cy={r} r={r / 2} fill="#ef444455" className={clsx('animate-ping origin-center anim-duration-[3000ms]')}/>
						<text dominantBaseline="central" transform={`translate(${r}, ${r})`} fill={'white'} fontSize={14}>
							{display.split('\n').map((line, index) => (
								<tspan key={index} x={0} y={`${.9 * (index)}em`}>{line}</tspan>
							))}
						</text>
					</svg>
				</div>
			
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
	{ start, end, r, r0, color }: {
		start: number
		end: number
		r: number
		r0: number
		color: string
	},
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
