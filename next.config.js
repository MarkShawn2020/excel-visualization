/** @type {import('next').NextConfig} */
module.exports = {
	experimental: {
		// esmExternals: 'loose', // ref: https://nextjs.org/docs/messages/import-esm-externals
	},
	reactStrictMode: true,
	
	webpack: (config, context) => ({
		...config
	})
}

