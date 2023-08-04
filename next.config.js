/** @type {import('next').NextConfig} */
module.exports = {
	
	typescript: {
		ignoreBuildErrors: true, // ref: https://nextjs.org/docs/app/building-your-application/configuring/typescript
	},
	
	experimental: {
		// esmExternals: 'loose', // ref: https://nextjs.org/docs/messages/import-esm-externals
		
	},
	reactStrictMode: true,
	
	webpack: (config, context) => ({
		...config
	})
}

