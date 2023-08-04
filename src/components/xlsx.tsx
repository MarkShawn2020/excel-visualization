import { useControlBear, useInputBear, useVisualizationBear } from '@/store'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { read, WorkBook } from 'xlsx'
import { ws_to_rdg } from '@/lib/excel'
import { useEffect } from 'react'
import _ from 'lodash'
import { LnglatFormat, Row } from '@/config'

export const ReadXlsx = () => {
	
	const { ws, skipRows, cols, setWs, setFileName, setSheetName, setCols, setRows } = useInputBear()
	const { setMap, setCurrent } = useControlBear()
	
	useEffect(() => {
		if (!ws) return
		
		const { cols, rows } = ws_to_rdg<Row>(ws, skipRows)
		setCols(cols)
		setRows(rows)
		const map = _.zipObject(cols.map((col) => col.name) as string[], _.zip(...rows))
		setMap(map)
	}, [ws, skipRows])
	
	useEffect(() => {
		if (!cols?.length) return
		setCurrent(cols[0].name)
	}, [cols])
	
	return (
		<Input id="xlsx" type="file" className={'hidden'} onChange={async (event) => {
			const file = event.target?.files[0]
			if (!file) return toast({ description: '未检测到文件上传', variant: 'destructive' })
			setFileName(file.name)
			
			const reader = new FileReader()
			reader.readAsArrayBuffer(file)
			
			reader.onload = (event) => {
				const data = event.target?.result
				console.log('read file data: ', data)
				if (!data) return toast({ description: '未检测到数据', variant: 'destructive' })
				
				const workbook: WorkBook = read(data, { type: 'array' })
				console.log('read workbook: ', workbook)
				if (!workbook) return toast({ description: '未检测到合法的 WorkBook', variant: 'destructive' })
				
				const worksheetName = workbook.SheetNames[0]
				console.log('read worksheet: ', worksheetName)
				if (!worksheetName) return toast({ description: '未检测到合法的 WorkSheet', variant: 'destructive' })
				setSheetName(worksheetName)
				setWs(workbook.Sheets[worksheetName])
			}
		}}/>
	)
}
