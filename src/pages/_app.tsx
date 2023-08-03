import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'

import '@/styles/globals.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import 'react-data-grid/lib/styles.css'

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider defaultTheme={'dark'} attribute={'class'}>
			<Component {...pageProps} />
		</ThemeProvider>
	)
}
