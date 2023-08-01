import { useControl } from 'react-map-gl'
import MapboxLanguage from '@mapbox/mapbox-gl-language'

/**
 * ref: https://github.com/mapbox/mapbox-gl-language/blob/master/examples/zh-Hans.html
 * @return {null}
 * @constructor
 */
export const LanguageControl = () => {
	useControl(() => new MapboxLanguage({
		defaultLanguage: 'zh-Hans',
	}))
	
	return null
}
