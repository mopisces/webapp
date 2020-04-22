const GenerateAssetPlugin = require('generate-asset-webpack-plugin');
let createConfig = function(compilation){
  let cfgJson = {
    server_url:"http://127.0.0.1"
  };
  
  return JSON.stringify(cfgJson);
}
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
    plugins:[
      new GenerateAssetPlugin({
        filename: 'domainConfig.json',
        fn: (compilation, cb)=>{
          cb(null, createConfig(compilation))
        }
      })
    ],
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
      'vant':'vant'
    }
  },
  devServer: {
    disableHostCheck: true,
    port: 1103,
  },
  lintOnSave: false 
}
