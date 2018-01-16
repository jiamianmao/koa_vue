<template>
  <div>
    <form action="http://localhost:3000/profile" method='post' enctype='multipart/form-data'>
      <input type="file"> 上传
      <button type='submit'>提交</button>
    </form>
    
  </div>
</template>
<script>
  export default {
    data () {
      return {
      }
    }
  }
</script>
<style scoped>
</style>
