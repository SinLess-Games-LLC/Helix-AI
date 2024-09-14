//@ts-check
const webpack = require('webpack')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next')

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  /**
   *
   * Webpack configuration
   *
   */
  webpack(config, { isServer }) {
    // Add any custom webpack plugins here
    config.plugins.push(new webpack.HotModuleReplacementPlugin())

    // Add custom Webpack configurations
    if (!isServer) {
      config.devServer = {
        hot: true,
        open: true,
      }
    }

    return config
  },
  /**
   *
   * Internationalization configuration
   * See: https://nextjs.org/docs/advanced-features/i18n-routing
   *
   */
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ['default', 'en-US', 'tl-PH', 'id-ID'],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: 'default',
  },
}

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
]

module.exports = composePlugins(...plugins)(nextConfig)
