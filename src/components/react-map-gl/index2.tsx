import Map, { Layer, MapRef, Marker, NavigationControl, Source } from 'react-map-gl'
import { circleLayerProps, INITIAL_VIEW_STATE, MAP_PROJECTION, MapStyle, sourceId, sourceProps, textLayerProps } from '@/config'
import { useRef, useState } from 'react'
import { ICluster, IProperties } from '@/ds'
import { CreateDonutChart } from '@/components/react-map-gl/utils'
import { LanguageControl } from '@/components/deck.gl/controls/language.control'

import 'mapbox-gl/dist/mapbox-gl.css';


export const Index2 = () => {
	
	const [clusters, setClusters] = useState<ICluster<IProperties>[]>([])
	
	const ref = useRef<MapRef | null>(null)
	
	console.log(clusters.map((cluster) => ({
		id: cluster.id,
		pos: JSON.stringify(cluster.geometry.coordinates),
	})))
	
	return (
		<Map
			projection={MAP_PROJECTION}
			initialViewState={INITIAL_VIEW_STATE}
			mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
			mapStyle={MapStyle.light}
			reuseMaps
			onRender={() => {
				if (!ref.current?.isSourceLoaded(sourceId)) return
				const newClusters = ((ref.current?.querySourceFeatures(sourceId) ?? []) as ICluster<IProperties>[])
				const validNewClusters = newClusters.filter((item) => item.properties.cluster)
				setClusters(validNewClusters)
			}}
			ref={ref}
		>
			
			<Source {...sourceProps}>
				
				<Layer {...circleLayerProps}/>
				
				<Layer {...textLayerProps}/>
			
			</Source>
			
			{
				clusters?.map((cluster) =>
					<Marker
						key={cluster.id}
						longitude={cluster.geometry.coordinates[0]}
						latitude={cluster.geometry.coordinates[1]}
					>
						<CreateDonutChart cluster={cluster}/>
					</Marker>,
				)
			}
			
			<NavigationControl/>
			<LanguageControl/>
		</Map>
	)
}

export default Index2

