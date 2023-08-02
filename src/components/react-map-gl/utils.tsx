// code for creating an SVG donut chart from feature properties
import { colors } from '@/config'
import { ICluster, IProperties } from '@/ds'

export const CreateDonutChart = (props: { cluster: ICluster<IProperties> }) => {
	const properties = props.cluster.properties
	const offsets = []
	const counts = [
		properties.mag1,
		properties.mag2,
		properties.mag3,
		properties.mag4,
		properties.mag5,
	]
	let total = 0
	for (const count of counts) {
		offsets.push(total)
		total += count
	}
	const fontSize =
		total >= 1000 ? 22 : total >= 100 ? 20 : total >= 10 ? 18 : 16
	const r =
		total >= 1000 ? 50 : total >= 100 ? 32 : total >= 10 ? 24 : 18
	const r0 = Math.round(r * 0.6)
	const w = r * 2
	// console.log({ counts, offsets, total, r0, r, w })
	
	return (
		<svg width={w} height={w} viewBox={`0 0 ${w} ${w}`} textAnchor="middle" style={{ font: `${fontSize}px sans-serif`, display: 'block' }}>
			{
				counts.map((i) =>
					<CreateDonutSegment
						key={i}
						start={offsets[i] / total}
						end={(offsets[i] + counts[i]) / total}
						r={r}
						r0={r0}
						color={colors[i]}/>,
				)
			}
			<circle cx={r} cy={r} r={r0} fill="white"/>
			<text dominantBaseline="central" transform={`translate(${r}, ${r})`}>
				{total}
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
