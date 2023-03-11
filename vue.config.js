//const TimeStamp = new Date().getTime();
const CompressionPlugin = require('compression-webpack-plugin');

let timeStamp = new Date().getTime();
module.exports = {
  filenameHashing:false,
  chainWebpack: config =>{
    config.plugins.delete('prefetch');
    /*config.output.filename('js/[name].?t='+TimeStamp+'.js').end();
    config.output.chunkFilename('js/[name]?t='+TimeStamp+'.js').end();*/
  },
  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        'import': [
          './src/theme'
        ]
      }
    },
    extract:{
      filename: `css/[name]-${timeStamp}.css`,
      chunkFilename: `css/chunk-[id]-${timeStamp}.css`,
    }
  },
  configureWebpack:{
    output:{
      filename: `js/js[name]-${timeStamp}.js`,
      chunkFilename: `js/chunk-[id]-${timeStamp}.js`,
    },
    performance:{
      hints:'warning',
      maxEntrypointSize: 50000000,
      maxAssetSize: 30000000,
      assetFilter: function(assetFilename) {
        return assetFilename.endsWith('.js');
      }
    },
    externals:{
      'vue' : 'Vue',
      'vuex': 'vuex',
      'axios':'axios',
      'vue-router':'VueRouter',
      'element-ui':'ElementUI',
      'vant':'vant',
      'echarts':'echarts',
      'XEUtils':'XEUtils',
      'VTable':'VTable'
    },
    plugins:[
      new CompressionPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js$|\.html$|\.css$|\.jpg$|\.jpeg$|\.png/,
        threshold: 10240,
        minRatio: 0.8,
        deleteOriginalAssets:false
      })
    ]
  },
  devServer: {
    disableHostCheck: true,
    port: 50000/*,
    https: true*/
  },
  lintOnSave: false 
}
