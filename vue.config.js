const { defineConfig } = require('@vue/cli-service')
const path = require("path");
module.exports = defineConfig({
  transpileDependencies: true
})
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = defineConfig({
  assetsDir: 'static',
  devServer: {
    proxy: {
      '/api/*': {
        
       //target: 'http://43.138.29.81:8080/api',
        target: 'http://43.138.22.20:8000/api',
        // ↑这个就是你的接口地址↑
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  },
  transpileDependencies: true,
  chainWebpack: config => {
    config.resolve.alias
        .set('@', resolve('src'))
        .set('src', resolve('src'))
        .set('common', resolve('src/common'))
        .set('components', resolve('src/components'))
        .end()
  },
  
}
 )
