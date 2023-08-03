import { useDisplayColumnBear, useInputSheetBear } from '@/store'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { read, WorkBook, WorkSheet } from 'xlsx'
import { ws_to_rdg } from '@/lib/excel'
import { useEffect, useState } from 'react'
import _ from 'lodash'

export const ReadXlsx = () => {
	
	const { ws, skipRows, cols, setWs, setName, setCols, setRows } = useInputSheetBear()
	const { setMap, setCurrent } = useDisplayColumnBear()
	
	useEffect(() => {
		if (!ws) return
		
		const { cols, rows } = ws_to_rdg(ws, skipRows)
		setCols(cols)
		setRows(rows)
		const transposedRows = _.zip(...rows)
		console.log('parsed sheet data: ', { cols, rows, transposedRows })
		setMap(_.zipObject(
				cols.map((col) => col.name) as string[],
				transposedRows,
			),
		)
	}, [ws, skipRows])
	
	useEffect(() => {
		if (!cols?.length) return
		setCurrent(cols[0].name)
	}, [cols])
	
	return (
		<Input id="xlsx" type="file" onChange={async (event) => {
			const file = event.target?.files[0]
			if (!file) return toast({ description: '未检测到文件上传', variant: 'destructive' })
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
				setName(worksheetName)
				setWs(workbook.Sheets[worksheetName])
			}
		}}/>
	)
}
