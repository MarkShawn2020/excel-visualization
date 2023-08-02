import { Header } from '@/components/header'
import Index from '@/components/react-map-gl/index2'


export default function Home() {
	return (
		<>
			<Header/>
			
			<main className={'w-screen h-screen bg-cyan-800'}>
				
				<Index/>
			
			</main>
		</>
	)
}
