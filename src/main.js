import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from '@/plugins/axios/axios'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
import vdr from 'vue-draggable-resizable-gorkys'

import qs from "qs"
Vue.use(qs)
// 导入默认样式
import 'vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css'
import VueDraggableResizable from 'vue-draggable-resizable'
// optionally import default styles
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
import Vuetify from 'vuetify'
import vuetify from '@/plugins/vuetify'
Vue.use(Vuetify)
Vue.component('vue-draggable-resizable', VueDraggableResizable)
Vue.component('vdr', vdr)


Vue.use(ElementUI);
Vue.prototype.$axios = axios;
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
Vue.config.productionTip = false
new Vue({
  router,
  store,
  vuetify,
  el: '#app',
  render: h => h(App)
}).$mount('#app')
