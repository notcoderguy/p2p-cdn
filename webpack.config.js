module.exports = {
    //...
    resolve: {
      fallback: {
        dns: require.resolve('dns'),
        net: require.resolve('net'),
        tls: require.resolve('tls'),
        stream: require.resolve('stream-browserify'),
        crypto: require.resolve('crypto-browserify')
      }
    }
  };