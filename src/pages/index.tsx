import { Header } from '@/components/header'
import Index from '@/components/react-map-gl/v2-supercluster'


export default function Home() {
	return (
		<>
			<Header/>
			
			<main className={'w-screen h-screen bg-cyan-800'}>
				
				<div className={'w-full h-full | flex divide-x'}>
					<div id={'control-panel'} className={'w-80 shrink-0 h-full | flex flex-col gap-2 divide-y'}>
						
						<div className={'text-2xl'}>Data Input</div>
						
						
						<div className={'text-2xl'}>Column Select</div>
					
					</div>
					
					<Index/>
				</div>
			
			</main>
		</>
	)
}
