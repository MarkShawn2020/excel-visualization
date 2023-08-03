import DataGrid from 'react-data-grid'

import { Columns, ColumnType } from '@/config'
import { useDisplayColumnBear, useInputSheetBear } from '@/store'

import { Select, SelectValue, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { Header } from '@/components/header'
import MapVisualization from '@/components/react-map-gl/v2-supercluster'
import { ReadXlsx } from '@/components/xlsx'
import { clsx } from 'clsx'
import { Input } from '@/components/ui/input'
import { useEffect } from 'react'
import _ from 'lodash'

export default function Home() {
	const { name, cols, rows, skipRows, setSkipRows, setRows } = useInputSheetBear()
	const { map, current, scope, filter, setCurrent, setScope, setFilter } = useDisplayColumnBear()
	
	console.log({ name, cols, rows, map, current, scope, filter })
	
	useEffect(() => {
		const vals = map[current]
		const max = _.max(vals)
		const min = _.min(vals)
		console.debug({ current, vals, min, max })
		const t = typeof max === 'number' && typeof min === 'number' ? [min, max] : null
		setScope(t)
		setFilter(t)
	}, [current])
	
	return (
		<>
			<Header/>
			<main className={'w-screen h-screen | flex divide-x'}>
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
							<Label>筛选列指标</Label>
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
						
						<Label>筛选列指标范围 {!scope && '（请先选择合法的数值列）'}</Label>
						<div className={'flex items-center gap-2'}>
							{
								scope && (
									<>
										{scope.map((v) => v.toFixed(0)).join(' - ')}
										<Slider min={scope[0]} max={scope[1]}
										        value={filter}
										        step={1}
										        minStepsBetweenThumbs={1} // Prevent thumb overlap
										        onValueChange={(v) => {
											        console.log('filter: ', v)
											        setFilter(v)
										        }}/>
									</>
								)
							}
						</div>
					</div>
				
				</div>
				
				<MapVisualization/>
			
			</main>
		
		</>
	)
}
