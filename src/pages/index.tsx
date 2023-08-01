import { Header } from '@/components/header'
import dynamic from 'next/dynamic'
import Clusters from '@/components/deck.gl/clusters'

const MyMap = dynamic(() => import('../components/deck.gl'), { ssr: false })


export default function Home() {
	return (
		<>
			<Header/>
			
			<main className={'w-screen h-screen bg-cyan-800'}>
				
				{/*<MyMap/>*/}
				<Clusters/>
			
			</main>
		</>
	)
}
