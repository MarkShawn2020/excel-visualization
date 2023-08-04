import { Header } from '@/components/header'
import { useHasMounted } from '@/hooks/use-mount'

import ControlPanel from '@/components/control-panel'
import Visualization from '@/components/react-map-gl'

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
							
							<Visualization/>
						
						</main>
					)
			}
		</>
	)
}
