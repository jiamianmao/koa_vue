import Vue from 'vue'
import Router from 'vue-router'
const Home = () => import('@/pages/home')
const Cart = () => import('@/pages/cart')
const Test = () => import('@/pages/test')
const Address = () => import('@/pages/address')
const NewAddress = () => import('@/pages/newAddress')
const OrderConfirm = () => import('@/pages/orderConfirm')
const OederSuccess = () => import('@/pages/orderSuccess')
const My = () => import('@/pages/my')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/my',
      component: My,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/cart',
      component: Cart,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/address',
      component: Address,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/newAddress',
      component: NewAddress,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/orderConfirm',
      component: OrderConfirm,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/orderSuccess',
      component: OederSuccess,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/test',
      component: Test
    }
  ]
})
