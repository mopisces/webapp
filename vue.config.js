module.exports = {
  chainWebpack: config =>{
    config.plugins.delete('prefetch');
  },
  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        'import': [
          './src/theme'
        ]
      }
    }
  },
  configureWebpack:{
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
      'XEUtils':'XEUtils'
    }
  },
  devServer: {
    disableHostCheck: true,
    port: 1103,
  },
  lintOnSave: false 
}
