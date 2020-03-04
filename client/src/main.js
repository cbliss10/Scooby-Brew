import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import { routes } from './routes'

Vue.config.productionTip = false

const router = new VueRouter({
  routes
})

Vue.use(VueRouter);

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
