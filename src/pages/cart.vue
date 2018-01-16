<template>
  <div>
    <nav-header></nav-header>
    <nav-bread><slot>Cart</slot></nav-bread>

    <div class="container">
      <div class="cart">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>My Cart</span></h2>
        </div>
        <div class="item-list-wrap">
          <div class="cart-item">
            <div class="cart-item-head">
              <ul>
                <li>Items</li>
                <li>Price</li>
                <li>Quantity</li>
                <li>Subtotal</li>
                <li>Edit</li>
              </ul>
            </div>
            <ul class="cart-item-list">
              <li v-for='goods of goodsList'>
                <div class="cart-tab-1">
                  <div class="cart-item-check" @click='editCart("checked", goods)'>
                    <a href="javascipt:;" class="checkbox-btn item-check-btn">
                      <img v-if='goods.checked' src="./radio-checked.png" style='width: 100%;height: 100%;'>
                    </a>
                  </div>
                  <div class="cart-item-pic">
                    <img :src="goods.productImage">
                  </div>
                  <div class="cart-item-title">
                    <div class="item-name">{{ goods.productName }}</div>
                  </div>
                </div>
                <div class="cart-tab-2">
                  <div class="item-price">{{ goods.salePrice }}</div>
                </div>
                <div class="cart-tab-3">
                  <div class="item-quantity">
                    <div class="select-self select-self-open">
                      <div class="select-self-area">
                        <a class="input-sub" @click="editCart('minu', goods)">-</a>
                        <span class="select-ipt">{{ goods.productNum }}</span>
                        <a class="input-add" @click="editCart('add', goods)">+</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total">{{ goods.productNum * goods.salePrice }}</div>
                </div>
                <div class="cart-tab-5">
                  <div class="cart-item-opration">
                    <a href="javascript:;" class="item-edit-btn" @click='delModal(goods._id)'>
                      <img src="./del.png" style='width: 100%;height: 100%;'>
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="cart-foot-wrap">
          <div class="cart-foot-inner">
            <div class="cart-foot-l">
              <div class="item-all-check" @click='toggleSelectAll'>
                <a href="javascipt:;" class="checkbox-btn item-check-btn">
                  <img v-if='selectAll' src="./radio-checked.png" style='width: 100%;height: 100%;'>
                </a>
              </div>
            </div>
            <div class="cart-foot-r">
              <div class="item-total">
                Item total: <span class="total-price">{{ sum }}</span>
              </div>
              <div class="btn-wrap">
                <a class="btn btn--red" @click='checkOut'>Checkout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Modal :mdShow='modalConfirm'>
      <p slot='message'>您确认要删除该商品么？</p>
      <div slot='btnGroup' @click='closeModal'>
        <a class='btn bnt--m' href='javascript:;' @click='delCart'>确定</a>
        <a class='btn bnt--m' href='javascript:;' @click='modalConfirm = false'>关闭</a>
      </div>
    </Modal>

    <nav-footer></nav-footer>
  </div>
</template>
<script>
  import { ERR_OK } from '../common/config.js'
  import NavHeader from '@/components/nav-header'
  import NavFooter from '@/components/nav-footer'
  import NavBread from '@/components/nav-bread'
  import Modal from '@/components/modal'
  import { mapMutations } from 'vuex'
  // import storage from 'good-storage'
  export default{
    data () {
      return {
        goodsList: [],
        modalConfirm: false
      }
    },
    created () {
      this._getCart()
    },
    methods: {
      delModal (id) {
        this.id = id
        this.modalConfirm = true
      },
      closeModal () {
        this.modalConfirm = false
      },
      delCart () {
        this.$http.post('/api/delCart', {
          id: this.id
        }).then(res => {
          if (res.data.status === ERR_OK) {
            this._getCart()
          }
        })
      },
      editCart (flag, goods) {
        if (flag === 'add') {
          goods.productNum++
        } else if (flag === 'minu') {
          if (goods.productNum <= 1) {
            return
          }
          goods.productNum--
        } else {
          goods.checked = !goods.checked
        }
        this.$http.post('/api/editCart', {
          id: goods._id,
          num: goods.productNum,
          checked: goods.checked
        }).then(res => {
          if (res.data.status === ERR_OK) {
            this._getCart()
          }
        })
      },
      toggleSelectAll () {
        let flag = !this.selectAll
        this.goodsList.forEach(item => {
          item.checked = flag
        })
        this.$http.post('/api/editCartAll', {
          'checkedAll': flag
        }).then(res => {
          console.log(res)
        })
      },
      checkOut () {
        if (this.goodsList.length > 0) {
          if (this.goodsList.some(item => {
            return item.checked === true
          })) {
            this.$router.push('/address')
          }
        }
      },
      _getCart () {
        this.$http.get('/api/getCart').then(res => {
          if (res.data.status === ERR_OK) {
            this.goodsList = res.data.result
            let count = 0
            this.goodsList.forEach(item => {
              count += item.productNum
            })
            this.initCount(count)
          }
        })
      },
      ...mapMutations([
        'initCount'
      ])
    },
    computed: {
      sum () {
        let money = 0
        this.goodsList.forEach(item => {
          if (item.checked) {
            money += item.salePrice * item.productNum
          }
        })
        return money
      },
      selectAll () {
        let result = this.goodsList.every(item => {
          return item.checked === true
        })
        return result
      }
    },
    components: {
      NavHeader,
      NavFooter,
      NavBread,
      Modal
    }
  }
</script>
<style>
  .input-sub,.input-add{
    min-width: 40px;
    height: 100%;
    border: 0;
    color: #605F5F;
    text-align: center;
    font-size: 16px;
    overflow: hidden;
    display: inline-block;
    background: #f0f0f0;
  }
  .item-quantity .select-self-area{
    background:none;
    border: 1px solid #f0f0f0;
  }
  .item-quantity .select-self-area .select-ipt{
    display: inline-block;
    padding:0 3px;
    width: 30px;
    min-width: 30px;
    text-align: center;
  }
</style>
