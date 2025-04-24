const webpack = require('webpack');

module.exports = function override(config) {
  // Add polyfills for Node.js modules
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: 'process/browser', // Polyfill for process
      Buffer: ['buffer', 'Buffer'], // Polyfill for Buffer
    }),
  ];

  // Add aliases for required modules
  config.resolve.alias = {
    ...config.resolve.alias,
    process: 'process/browser',
    buffer: 'buffer',
  };

  return config;
};