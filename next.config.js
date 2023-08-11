/** @type {import('next').NextConfig} */
module.exports = {
  output: "export", // ref: https://nextjs.org/docs/pages/building-your-application/deploying/static-exports
  assetPrefix: "./",

  typescript: {
    ignoreBuildErrors: true, // ref: https://nextjs.org/docs/app/building-your-application/configuring/typescript
  },

  experimental: {
    // esmExternals: 'loose', // ref: https://nextjs.org/docs/messages/import-esm-externals
  },
  reactStrictMode: true,

  swcMinify: false, // ref: https://docs.sheetjs.com/docs/demos/static/nextjs/

  webpack: (config, context) => {
    // ref: https://docs.sheetjs.com/docs/demos/static/nextjs/
    /* add to the webpack config module.rules array */
    config.module.rules.push({
      /* `test` matches file extensions */
      test: /\.(numbers|xls|xlsx|xlsb)/,
      /* use the loader script */
      use: [{ loader: "base64-loader" }],
    });
    return config;
  },
};
