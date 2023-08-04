import { useInputBear, useUIBear, useVisualizationBear } from '@/store'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LnglatFormat, MapStyle, Row } from '@/config'
import DataGrid from 'react-data-grid'
import { Button } from '@/components/ui/button'
import { clsx } from 'clsx'
import { useReadXlsx } from '@/hooks/use-read-xlsx'
import { useEffect } from 'react'
import _ from 'lodash'

export const ControlPanel = () => {
	const { fileName, sheetName, cols, rows, skipRows, setSkipRows, setRows, map } = useInputBear()
	const { posColIndex, setPosIndex, features, setFeatures, valueColIndex, setValueColIndex } = useVisualizationBear()
	const { mapStyle, setMapStyle } = useUIBear()
	
	
	const selectColTitle = cols?.length ? '选择坐标列' : '当前没有可选列'
	const readXlsx = useReadXlsx()
	
	useEffect(() => {
		if (posColIndex === undefined) return
		
		const features = rows
			.map((row) => ({
				type: 'Feature',
				properties: _.zipObject(cols.map((v) => v.name), row),
				geometry: {
					type: 'Point',
					coordinates: String(row[posColIndex]).match(LnglatFormat)?.slice(1, 3).map(parseFloat),
				},
			}))
			.filter((feature) => feature.geometry.coordinates)
		setFeatures(features)
		console.debug({ features })
	}, [posColIndex])
	
	console.log({ fileName, sheetName, cols, rows, map, valueColIndex })
	
	
	return (
		<div id={'control-panel'} className={'w-[360px] whitespace-nowrap shrink-0 h-full p-4 | flex flex-col gap-4'}>
			
			<div className={'flex flex-col gap-2'}>
				<div className={'text-2xl'}>数据输入</div>
				<div className="flex items-center gap-2">
					<Label htmlFor="xlsx">跳过开头空行数</Label>
					<Input type={'number'} defaultValue={skipRows} onBlur={(event) => setSkipRows(parseInt(event.currentTarget.value))}/>
				</div>
				<div className={'flex items-center gap-2'}>
					<Label
						className={clsx(
							'flex-1 flex items-center gap-2',
							'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none' +
							' focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
							'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
							'h-10 px-4 py-2',
							'cursor-pointer',
						)}
						htmlFor="xlsx">
						上传本地表</Label>
					<Input className={'hidden'} id={'xlsx'} type={'file'} onChange={(event) => {
						const file = event.currentTarget?.files[0]
						readXlsx(file.name, file)
					}}/>
					
					<Button className={'flex-1'} variant={'outline'} onClick={async () => {
						const fp = '/data/sheets/sample.xlsx'
						const blob = await (await fetch(fp)).blob()
						readXlsx(fp, blob)
					}}>打开案例表</Button>
				</div>
				
				{sheetName && (
					<>
						<p className={'text-muted-foreground'}>当前文件： {fileName}</p>
						<p className={'text-muted-foreground'}>当前表名： {sheetName}</p>
					</>
				)}
				
				{!!cols?.length && <DataGrid<Row> className={'w-full'} columns={cols} rows={rows} onRowsChange={setRows}/>}
			</div>
			
			<Separator/>
			<div className={'flex flex-col gap-2'}>
				<div className={'text-2xl'}>数据操作</div>
				
				<div className={'flex items-center gap-2'}>
					<Label>有效坐标个数： {features.length} / {rows.length}</Label>
					<Select value={posColIndex?.toString()} onValueChange={(v) => setPosIndex(parseInt(v))}>
						<SelectTrigger>
							<SelectValue placeholder={selectColTitle}/>
						</SelectTrigger>
						<SelectContent>
							{cols.map((v) => <SelectItem key={v.key} value={v.key}>{v.name}</SelectItem>)}
						</SelectContent>
					</Select>
				</div>
				
				<div className={'flex items-center gap-2'}>
					<Label>指定可视化列指标</Label>
					<Select value={valueColIndex?.toString()} onValueChange={(v) => setValueColIndex(parseInt(v))}>
						<SelectTrigger>
							<SelectValue placeholder={selectColTitle}/>
						</SelectTrigger>
						<SelectContent>
							{cols.map((v) => <SelectItem key={v.key} value={v.key}>{v.name}</SelectItem>)}
						</SelectContent>
					</Select>
				</div>
			
			</div>
			
			<Separator/>
			<div className={'flex flex-col gap-2'}>
				<div className={'text-2xl'}>UI</div>
				
				
				<div className={'flex items-center gap-2'}>
					<Label>地图风格</Label>
					<Select value={mapStyle} onValueChange={setMapStyle}>
						<SelectTrigger>
							<SelectValue placeholder={'选择'}/>
						</SelectTrigger>
						<SelectContent>
							{Object.entries(MapStyle)
								.map(([k, v]) => <SelectItem key={k} value={v}>{k}</SelectItem>)}
						</SelectContent>
					</Select>
				</div>
			</div>
		
		
		</div>
	)
}

export default ControlPanel

