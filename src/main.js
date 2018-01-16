// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import Vuelazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import store from './store'
import Fastclick from 'fastclick'
import storage from 'good-storage'
require('./assets/css/init.css')

Vue.prototype.$http = axios

Fastclick.attach(document.body)

Vue.use(Vuelazyload, {
  loading: require('./assets/loading-spinning-bubbles.svg')
})
Vue.use(infiniteScroll)

Vue.config.productionTip = false

axios.defaults.baseURL = '/apis'
axios.defaults.timeout = 5000

axios.interceptors.request.use(
  config => {
    if (storage.get('api_token')) {
      config.headers.Authorization = `token ${storage.get('api_token')}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

axios.interceptors.response.use(
  // 这里token不存在或者失效的时候 不是返回200 而是ctx.throw形式
  res => {
    return res
  },
  error => {
    if (error.response) {
      router.replace({
        path: '/',
        query: { redirect: router.currentRoute.fullPath }
      })
    }
    return Promise.reject(error.response)
  }
)

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (storage.get('api_token')) {
      next()
    } else {
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        }
      })
    }
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
