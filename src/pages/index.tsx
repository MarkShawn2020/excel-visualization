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

export default function Home() {
	const { name, cols, rows, skipRows, setSkipRows, setRows } = useInputSheetBear()
	const { current, range, setCurrent, setRangeScope, setRangeValue } = useDisplayColumnBear()
	
	console.log({ name, cols, rows, current })
	
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
							<Select
								value={current}
								onValueChange={(col) => {
									setCurrent(col)
									// setRangeScope(Columns[col].range)
									// setRangeValue(Columns[col].range)
								}}>
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
							<Label>筛选该列指标范围</Label>
							<Slider defaultValue={range.value} min={range.scope[0]} max={range.scope[1]} step={1} onValueChange={setRangeValue}/>
						</div>
					</div>
				
				</div>
				
				<MapVisualization/>
			
			</main>
		
		</>
	)
}
