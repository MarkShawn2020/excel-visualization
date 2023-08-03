import '@/styles/globals.css'

import 'mapbox-gl/dist/mapbox-gl.css'
import 'react-data-grid/lib/styles.css'


// ⚠️ 不能加下面一行
// import 'mapbox-gl/dist/mapbox-gl.css' // copied from https://github.com/visgl/react-map-gl/blob/7.1-release/examples/get-started/nextjs/pages/index.js
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider defaultTheme={'dark'} attribute={'class'}>
			<Component {...pageProps} />
		</ThemeProvider>
	)
}
