import React from 'react'

export const Tooltip = ({ radius, setRadius, data }) => {
	const handleRadiusChange = (e) => {
		console.log(e.target.value)
		setRadius(e.target.value)
	}
	
	return (
		<div className="absolute bg-slate-900 text-white min-h-[200px] h-auto w-[250px] top-10 left-5 rounded-lg p-4 text-sm">
			<div className="flex flex-col">
				<h2 className="font-bold text-xl uppercase mb-1">Map controller</h2>
				<h2 className="font-bold text-md uppercase mb-4">INPOST LOCS</h2>
				<input
					name="radius"
					className="w-fit py-2"
					type="range"
					value={radius}
					min={500}
					step={50}
					max={10000}
					onChange={handleRadiusChange}
				/>
				<label htmlFor="radius">
					Radius -{' '}
					<span className="bg-indigo-500 font-bold text-white px-2 py-1 rounded-lg">
                {radius}
              </span>{' '}
					meters
				</label>
				<p>
					{' '}
					<span className="font-bold">{data.length}</span> Locations
				</p>
			</div>
		</div>
	)
}
