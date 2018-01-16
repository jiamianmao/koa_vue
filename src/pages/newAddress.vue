<template>
    <div>
      <nav-header></nav-header>
      <nav-bread><slot>newAddress</slot></nav-bread>
      
      <div class="box">
        <p>
          <label for="name">收货人</label>
          <input type="text" id='name' v-model.trim='form.userName'>
        </p>
        <p>
          <label for='address'>收货地址</label>
          <input type="text" id='address' v-model.trim='form.address'>
        </p>
        <p>
          <label for="tel">手机号</label>
          <input type="tel" id='tel' v-model.trim='form.tel'>
        </p>
        <p>
          <label for="postcode">邮编</label>
          <input class='input' type="text" id='postcode' v-model.trim='form.postCode'>
        </p>
        <p>
          <button class='btn' @click='submit'>提交</button>
        </p>
      </div>

      <nav-footer></nav-footer>
    </div>
</template>
<style>
</style>
<script>
  import { ERR_OK } from '../common/config.js'
  import NavHeader from '@/components/nav-header'
  import NavFooter from '@/components/nav-footer'
  import NavBread from '@/components/nav-bread'
  export default{
    data () {
      return {
        form: {}
      }
    },
    methods: {
      submit () {
        this.$http.post('/api/editAddress', this.form).then(res => {
          if (res.data.status === ERR_OK) {
            this.$router.push('/address')
          }
        })
      }
    },
    components: {
      NavHeader,
      NavFooter,
      NavBread
    }
  }
</script>
<style lang="stylus" scoped>
  .box
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    p
      diaplay: flex;
      flex-flow: row nowrap;
      height: 60px;
      margin-top: 20px;
      label
        height: 60px;
        width: 100px;
      input
        width: 200px;
        height: 100%;
</style>