<template>
    <div>
      <nav-header></nav-header>
      <div class="container">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>check out</span></h2>
        </div>
        <!-- 进度条 -->
        <div class="check-step">
          <ul>
            <li class="cur"><span>Confirm</span> address</li>
            <li class="cur"><span>View your</span> order</li>
            <li class="cur"><span>Make</span> payment</li>
            <li class="cur"><span>Order</span> confirmation</li>
          </ul>
        </div>

        <div class="order-create">
          <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
          <div class="order-create-main">
            <h3>Congratulations! <br>Your order is under processing!</h3>
            <p>
              <span>Order ID：{{ orderId }}</span>
              <span>Order total：{{ orderTotal }}</span>
            </p>
            <div class="order-create-btn-wrap">
              <div class="btn-l-wrap">
                <router-link to='/cart' tag='a' class='btn btn--m'>Cart List</router-link>
              </div>
              <div class="btn-r-wrap">
                <router-link to='/' tag='a' class='btn btn--m'>Goods List</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <nav-footer></nav-footer>
    </div>
</template>
<script>
  import { ERR_OK } from '../common/config.js'
  import NavHeader from '@/components/nav-header'
  import NavFooter from '@/components/nav-footer'
  export default{
    data () {
      return {
        orderId: '',
        orderTotal: 0
      }
    },
    created () {
      this.orderId = this.$route.query.orderId
      this._getOrderOne()
    },
    methods: {
      _getOrderOne () {
        this.$http.get('/api/getOrderOne', {
          params: {
            orderId: this.orderId
          }
        }).then(res => {
          let r = res.data
          if (r.status === ERR_OK) {
            this.orderId = r.result.orderId
            this.orderTotal = r.result.orderTotal
          }
        })
      }
    },
    components: {
      NavHeader,
      NavFooter
    }
  }
</script>