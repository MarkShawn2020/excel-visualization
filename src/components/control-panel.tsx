import { useStore } from '@/store'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapStyle } from '@/config'
import DataGrid from 'react-data-grid'
import { Button } from '@/components/ui/button'
import { clsx } from 'clsx'
import { useReadXlsx } from '@/hooks/use-read-xlsx'
import { Switch } from '@/components/ui/switch'
import { Row } from '@/ds'
import { useFeatures } from '@/hooks/use-features'
import { IconBoxMultiple1, IconBoxMultiple2, IconBoxMultiple3 } from '@tabler/icons-react'


export const ControlPanel = () => {
	const {
		fileName, sheetName, cols, rows, skipRows, setSkipRows, setRows, map,
		clusterMode, setClusterMode, mapStyle, setMapStyle, colIndex, setColIndex, colors, setColors,
	} = useStore()
	
	const selectColTitle = cols?.length ? '选择坐标列' : '当前没有可选列'
	const readXlsx = useReadXlsx()
	const features = useFeatures()
	
	console.log({ fileName, sheetName, cols, rows, map })
	
	return (
		<div id={'control-panel'} className={'w-[360px] h-full overflow-y-auto |  whitespace-nowrap shrink-0 p-4 | flex flex-col gap-4'}>
			
			<div className={'flex flex-col gap-2 '}>
				<div className={'text-2xl inline-flex items-center gap-2'}><IconBoxMultiple1 className={'text-green-500'}/>数据输入</div>
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
				
				{!!cols?.length && <DataGrid<Row> columns={cols} rows={rows} onRowsChange={setRows}/>}
			</div>
			
			<Separator/>
			<div className={'flex flex-col gap-2'}>
				<div className={'text-2xl inline-flex items-center gap-2'}><IconBoxMultiple2 className={'text-indigo-500'}/>数据操作</div>
				
				
				<div className={'flex items-center gap-2'}>
					<Label>指定坐标点列指标（{features.length} / {rows.length}）</Label>
					<Select value={colIndex.lnglat?.toString()} onValueChange={(v) => setColIndex('lnglat', parseInt(v))}>
						<SelectTrigger>
							<SelectValue placeholder={selectColTitle}/>
						</SelectTrigger>
						<SelectContent>
							{cols.map((v) => <SelectItem key={v.key} value={v.key}>{v.name}</SelectItem>)}
						</SelectContent>
					</Select>
				</div>
				<p className={'text-muted-foreground text-sm whitespace-normal'}>该列为坐标点，基于格式匹配，可决定有多少圈圈</p>
				
				
				<div className={'flex items-center gap-2'}>
					<Label>指定可视化列指标</Label>
					<Select value={colIndex.measure?.toString()} onValueChange={(v) => setColIndex('measure', parseInt(v))}>
						<SelectTrigger>
							<SelectValue placeholder={selectColTitle}/>
						</SelectTrigger>
						<SelectContent>
							{cols.map((v) => <SelectItem key={v.key} value={v.key}>{v.name}</SelectItem>)}
						</SelectContent>
					</Select>
				</div>
				<p className={'text-muted-foreground text-sm whitespace-normal'}>该列为目标数值，可决定圈圈的大小（其中数值列为百分比大小，非数值列为等宽）</p>
				
				<div className={'flex items-center gap-2'}>
					<Label>指定分类列指标</Label>
					<Select value={colIndex.category?.toString()} onValueChange={(v) => setColIndex('category', parseInt(v))}>
						<SelectTrigger>
							<SelectValue placeholder={selectColTitle}/>
						</SelectTrigger>
						<SelectContent>
							{cols.map((v) => <SelectItem key={v.key} value={v.key}>{v.name}</SelectItem>)}
						</SelectContent>
					</Select>
				</div>
				<p className={'text-muted-foreground text-sm whitespace-normal'}>该列为分类，可决定圈圈的分层颜色</p>
				
				<div className={'flex items-center gap-2'}>
					<Label>启用聚类模式</Label>
					<Switch checked={clusterMode} onCheckedChange={setClusterMode}/>
				</div>
				<p className={'text-muted-foreground text-sm whitespace-normal'}>启用后将基于坐标距离自动聚类，只显示该 zoom 放缩级别下的单元</p>
			
			
			</div>
			
			<Separator/>
			<div className={'flex flex-col gap-2'}>
				<div className={'text-2xl inline-flex items-center gap-2'}><IconBoxMultiple3 className={'text-pink-500'}/>UI</div>
				
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
				
				<div className={'flex items-center gap-2'}>
					<Label>色盘</Label>
					{colors.map((color, index) => (
						<Input type={'color'} value={color} key={index} className={'p-0'} onChange={(event) => {
							setColors(index, event.currentTarget.value)
						}}/>
					))}
				</div>
			</div>
		
		
		</div>
	)
}

export default ControlPanel

