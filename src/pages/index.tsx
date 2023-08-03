import { Header } from '@/components/header'
import MapVisualization from '@/components/react-map-gl/v2-supercluster'
import { ControlPanel } from '@/components/control-panel'

export default function Home() {
	
	
	return (
		<>
			<Header/>
			<main className={'w-screen h-screen | flex divide-x'}>
				
				<ControlPanel/>
				
				<MapVisualization/>
			
			</main>
		
		</>
	)
}
