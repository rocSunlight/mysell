// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import goods from 'components/goods/goods'
import ratings from 'components/ratings/ratings'
import seller from 'components/seller/seller'

Vue.use(VueRouter)
Vue.use(VueResource)

const routes = [{
  path: '/',
  component: goods
}, {
  path: '/goods',
  component: goods
}, {
  path: '/ratings',
  component: ratings
}, {
  path: '/seller',
  component: seller
}]

// 实例化个vuerouter
const router = new VueRouter({
  routes, // （缩写）相当于 routes: routes
  linkActiveClass: 'active'
})
// 默认指定路径
router.push('/goods')

// 实例化一个vue
new Vue({
  el: '#app',
  router,
  render: h => h(App)
}).$mount()

