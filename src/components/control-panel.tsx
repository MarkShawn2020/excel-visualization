import { useDisplayColumnBear, useInputSheetBear, useVisualizationBear } from '@/store'
import { useEffect } from 'react'
import _ from 'lodash'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ReadXlsx } from '@/components/xlsx'
import DataGrid from 'react-data-grid'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

export const ControlPanel = () => {
	const { name, cols, rows, skipRows, setSkipRows, setRows } = useInputSheetBear()
	const { map, current, scope, setCurrent, setScope } = useDisplayColumnBear()
	const { lnglatCol, setFeatures, setLnglatCol, setLnglatData } = useVisualizationBear()
	
	console.debug({ name, cols, rows, map, current, scope })
	
	useEffect(() => {
		const vals = map[current]
		const max = _.max(vals)
		const min = _.min(vals)
		console.debug({ current, vals, min, max })
		const t = typeof max === 'number' && typeof min === 'number' ? [min, max] : null
		setScope(t)
	}, [current])
	
	
	return (
		<div id={'control-panel'} className={'w-[360px] whitespace-nowrap shrink-0 h-full p-4 | flex flex-col gap-4'}>
			
			<div className={'flex flex-col gap-2'}>
				<div className={'text-2xl'}>数据输入</div>
				<div className="flex items-center gap-2">
					<Label htmlFor="xlsx">跳过开头空行数</Label>
					<Input type={'number'} defaultValue={skipRows} onBlur={(event) => setSkipRows(event.currentTarget.value)}/>
				</div>
				<div className="flex items-center gap-2">
					<Label htmlFor="xlsx">上传 Excel 表格</Label>
					<ReadXlsx/>
				</div>
				{name && <DataGrid className={'w-full'} columns={cols} rows={rows} onRowsChange={setRows}/>}
			</div>
			
			<Separator/>
			<div className={'flex flex-col gap-2'}>
				<div className={'text-2xl'}>数据操作</div>
				
				<div className={'flex items-center gap-2'}>
					<Label>指定坐标点列名</Label>
					<Select value={lnglatCol} onValueChange={setLnglatCol}>
						<SelectTrigger>
							<SelectValue placeholder={'当前没有可选列'}/>
						</SelectTrigger>
						<SelectContent>
							{cols
								.map((col) => col.name)
								.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
						</SelectContent>
					</Select>
				</div>
				
				<div className={'flex items-center gap-2'}>
					<Label>指定可视化列指标</Label>
					<Select value={current} onValueChange={setCurrent}>
						<SelectTrigger>
							<SelectValue placeholder={'当前没有可选列'}/>
						</SelectTrigger>
						<SelectContent>
							{cols
								.map((col) => col.name)
								.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
						</SelectContent>
					</Select>
				</div>
			
			</div>
		
		</div>
	)
}
