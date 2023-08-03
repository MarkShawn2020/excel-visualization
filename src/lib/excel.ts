import { utils, WorkSheet } from 'xlsx'
import { Column, textEditor } from 'react-data-grid'

export type Row = unknown[];
export type AOAColumn = Column<Row>;
export type RowCol = { rows: Row[]; cols: AOAColumn[]; };

/**
 * 第一行是列
 *
 * @param {WorkSheet} ws
 * @param {number} skipRows
 * @return {RowCol}
 */
export function ws_to_rdg<Row extends any[] = []>(ws: WorkSheet, skipRows: number = 1): RowCol {
	/* create an array of arrays */
	const data = utils.sheet_to_json<Row>(ws, { header: 1 }).slice(skipRows)
	const [row, ...rows] = data
	console.debug('parsed rows: ', data)
	
	/* create column array */
	const range = utils.decode_range(ws['!ref'] ?? `A${skipRows + 1}`)
	range.s.r = skipRows // skip one row, ref: https://github.com/SheetJS/sheetjs/issues/463#issuecomment-294053900
	// ws['!ref'] = utils.encode_range(range) // todo: 这里不支持 modify
	console.debug('parsed range: ', range)
	
	const cols = Array.from({ length: range.e.c + 1 }, (_, i) => {
		return {
			key: String(i), // RDG will access row["0"], row["1"], etc
			name: row[i], // utils.encode_col(i), // the column labels will be A, B, etc
			editor: textEditor, // enable cell editing
		}
	})
	console.debug('parsed cols: ', cols)
	
	return { rows, cols } // these can be fed to setRows / setColumns
}
