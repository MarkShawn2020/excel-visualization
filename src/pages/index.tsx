import { Header } from '@/components/header'
import { useHasMounted } from '@/hooks/use-mount'

import MapVisualization from '@/components/react-map-gl/v2-supercluster'
import ControlPanel from '@/components/control-panel'

export default function Home() {
	
	const hasMounted = useHasMounted()
	
	return (
		<>
			<Header/>
			{
				!hasMounted
					? 'Loading...'
					: (
						<main className={'w-screen h-screen | flex divide-x'}>
							
							<ControlPanel/>
							
							<MapVisualization/>
						
						</main>
					)
			}
		</>
	)
}
