import ReactECharts from 'echarts-for-react'
import { option } from '@/components/echarts/bmap'

export const chart = () => {
	return (
		<ReactECharts
			option={option}
			className={'bg-cyan-100'}
			style={{ width: '640px', height: '360px' }}
			opts={{ renderer: 'svg' }} // use svg to render the chart.
		/>
	
	)
}
