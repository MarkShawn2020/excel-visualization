import { useControlBear, useInputBear, useUIBear, useVisualizationBear } from '@/store'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ReadXlsx } from '@/components/xlsx'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapStyle } from '@/config'
import DataGrid from 'react-data-grid'
import { Button } from '@/components/ui/button'

export const ControlPanel = () => {
	const { fileName, sheetName, cols, rows, skipRows, setSkipRows, setRows } = useInputBear()
	const { map, current, scope, setCurrent } = useControlBear()
	const { lnglatCol, setLnglatCol, features } = useVisualizationBear()
	const { mapStyle, setMapStyle } = useUIBear()
	
	console.debug({ fileName, sheetName, cols, rows, map, current, scope })
	
	
	const selectColTitle = cols?.length ? '选择坐标列' : '当前没有可选列'
	
	return (
		<div id={'control-panel'} className={'w-[360px] whitespace-nowrap shrink-0 h-full p-4 | flex flex-col gap-4'}>
			
			<div className={'flex flex-col gap-2'}>
				<div className={'text-2xl'}>数据输入</div>
				<div className="flex items-center gap-2">
					<Label htmlFor="xlsx">跳过开头空行数</Label>
					<Input type={'number'} defaultValue={skipRows} onBlur={(event) => setSkipRows(event.currentTarget.value)}/>
				</div>
				<Button className="flex items-center gap-2" variant={'outline'}>
					<Label htmlFor="xlsx">上传 Excel 表格</Label>
					<ReadXlsx/>
				</Button>
				
				{sheetName && (
					<>
						<p className={'text-muted-foreground'}>当前文件： {fileName}</p>
						<p className={'text-muted-foreground'}>当前表名： {sheetName}</p>
					</>
				)}
				
				{!!cols?.length && <DataGrid className={'w-full'} columns={cols} rows={rows} onRowsChange={setRows}/>}
			</div>
			
			<Separator/>
			<div className={'flex flex-col gap-2'}>
				<div className={'text-2xl'}>数据操作</div>
				
				<div className={'flex items-center gap-2'}>
					<Label>有效坐标个数： {features.length} / {rows.length}</Label>
					<Select value={lnglatCol} onValueChange={setLnglatCol}>
						<SelectTrigger>
							<SelectValue placeholder={selectColTitle}/>
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
							<SelectValue placeholder={selectColTitle}/>
						</SelectTrigger>
						<SelectContent>
							{cols
								.map((col) => col.name)
								.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
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

