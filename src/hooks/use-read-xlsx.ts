import { useControlBear, useInputBear } from '@/store'
import { useEffect } from 'react'
import { ws_to_rdg } from '@/lib/excel'
import { Row } from '@/config'
import _ from 'lodash'
import { toast } from '@/components/ui/use-toast'
import { read, WorkBook } from 'xlsx'

export const useReadXlsx = () => {
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
		setCurrent('0')
	}, [cols])
	
	return (filePath: string, blob: Blob) => {
		if (!filePath) return toast({ description: '未检测到文件', variant: 'destructive' })
		setFileName(filePath)
		
		const reader = new FileReader()
		reader.readAsArrayBuffer(blob)
		
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
	}
}
