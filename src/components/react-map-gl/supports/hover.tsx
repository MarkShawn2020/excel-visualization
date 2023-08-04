import { IFeature } from '@/ds'
import React from 'react'
import { clsx } from 'clsx'

export const HoverInfo = (props: IFeature) => {
	// console.log('[Hover] ', { props })
	return (
		<div className={clsx(
			// 'absolute inset-0 w-60 h-fit',
			// 'bg-card',
			// 'text-accent-foreground',
			'text-slate-950',
			'flex flex-col gap-1',
		)}>
			{Object.entries(props.properties).map(([key, val]) => (
				<div key={key}>
					{key}: {val}
				</div>
			))}
		</div>
	)
}
