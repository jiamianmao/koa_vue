<template>
    <div>
      <nav-header></nav-header>
      <nav-bread></nav-bread>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" @click='sortDefault' class="default" :class='{"cur": sortFlag === 0}'>Default</a>
            <a href="javascript:void(0)" @click='sortPrice' :class='{"cur": sortFlag !== 0}' class="price">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
            <a href="javascript:void(0)" class="filterby stopPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd @click='sortPriceRange(0)'>
                  <a :class='{"cur": checkPriceRange === "all"}' href="javascript:void(0)">All</a>
                </dd>
                <dd @click='sortPriceRange(index + 1)' v-for='(item, index) of priceFilter'>
                  <a :class='{"cur": checkPriceRange === index + 1}' href="javascript:void(0)">{{item.startPrice}} - {{item.endPrice}}</a>
                </dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for='goods of list'>
                    <div class="pic">
                      <a :href="goods._id"><img v-lazy="goods.productImage"></a>
                    </div>
                    <div class="main">
                      <div class="name">{{ goods.productName }}</div>
                      <div class="price">
                        <span>¥{{ goods.salePrice }}</span>
                        <span>库存:{{ goods.storeNum }}</span>
                      </div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click='addCart(goods._id)'>加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>

                <div v-show='infinite' class='loadMore' v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                  <img src="../assets/loading-spinning-bubbles.svg">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <nav-footer></nav-footer>
      <modal :mdShow="mdShowCart">
        <p slot="message">加入购物车成功</p>
        <div slot="btnGroup">
            <a href="javascript:;" class="btn  btn--m" @click="mdShowCart = false">继续购物</a>
            <router-link class="btn  btn--m" to="/cart">查看购物车列表</router-link>
        </div>
    </modal>
    </div>
</template>
<script>
  import { ERR_OK } from '../common/config.js'
  import NavHeader from '@/components/nav-header'
  import NavFooter from '@/components/nav-footer'
  import NavBread from '@/components/nav-bread'
  import Modal from '@/components/modal'
  import storage from 'good-storage'
  import { mapMutations } from 'vuex'
  export default{
    data () {
      return {
        list: [],
        busy: true,
        infinite: false,
        priceFilter: [
          {
            'startPrice': 0,
            'endPrice': 100
          }, {
            'startPrice': 100,
            'endPrice': 500
          }, {
            'startPrice': 500,
            'endPrice': 1000
          }, {
            'startPrice': 1000,
            'endPrice': 3000
          }
        ],
        checkPriceRange: 'all',
        mdShowCart: false
      }
    },
    created () {
      this.pageSize = 8
      this.page = 1
      this.sortFlag = 0
      this.api_token = storage.get('api_token')
      this.getGoods()
    },
    methods: {
      getGoods (flag) {
        if (!flag) {
          this.page = 1
        }
        let params = {
          priceLevel: this.checkPriceRange,
          page: this.page,
          pageSize: this.pageSize
        }
        if (this.sortFlag) {
          params.sort = this.sortFlag
        }
        this.$http.get('/api/goods', {
          params
        }).then(res => {
          if (res.data.status === ERR_OK) {
            if (flag) {
              this.list = [...this.list, ...res.data.result]
              this.infinite = false
              if (res.data.result.length < this.pageSize) {
                this.busy = true
              } else {
                this.busy = false
              }
            } else {
              this.list = res.data.result
              this.busy = false
            }
          }
        })
      },
      loadMore () {
        this.busy = true
        // 可以使用lodash的防抖
        setTimeout(() => {
          this.page++
          this.infinite = true
          this.getGoods(true)
        }, 500)
      },
      sortPrice () {
        if (this.sortFlag < 1) {
          this.sortFlag = 1
        } else {
          this.sortFlag = -1
        }
        this.getGoods()
      },
      sortDefault () {
        this.sortFlag = 0
        this.getGoods()
      },
      sortPriceRange (idx) {
        this.checkPriceRange = idx
        this.getGoods()
      },
      addCart (id) {
        this.$http.post('/api/add', {
          id
        }).then(res => {
          if (res.data.status === ERR_OK) {
            this.mdShowCart = true
            this.count(1)
          } else {
            alert(res.data.msg)
          }
        })
      },
      ...mapMutations([
        'count'
      ])
    },
    components: {
      NavHeader,
      NavFooter,
      NavBread,
      Modal
    }
  }
</script>
<style scoped lang='css'>
  .loadMore {
    text-align: center;
    height: 100px;
    line-height: 100px;
  }
</style>