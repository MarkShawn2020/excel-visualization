import { Header } from '@/components/header'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const LocationAggregatorMap = dynamic(() => import('../components/deck.gl/PiotrDev'), { ssr: false })


export default function Home() {
	const [details, setDetails] = useState([])
	// const [coordinates, setCoordinates] = useState([])
	//
	// useEffect(() => {
	// 	const getData = async () => {
	// 		const response = await fetch(
	// 			'https://api-shipx-pl.easypack24.net/v1/points?per_page=28000',
	// 		)
	//
	// 		const data = await response.json()
	// 		setDetails(data.items)
	//
	// 		// Create an array of geo coordinates pairs
	// 		const coords = data.items.map((item) => [
	// 			item.location.longitude,
	// 			item.location.latitude,
	// 		])
	// 		setCoordinates(coords)
	// 	}
	// 	getData()
	// }, [])
	
	return (
		<>
			<Header/>
			
			<main className={'w-screen h-screen bg-cyan-800'}>
				
				<LocationAggregatorMap/>
			
			</main>
		</>
	)
}
