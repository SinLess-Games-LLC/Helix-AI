//@ts-check
const webpack = require('webpack')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next')

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
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
}

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
]

module.exports = composePlugins(...plugins)(nextConfig)
