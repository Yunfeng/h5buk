<template>
</template>

<script>
import { getURLParameter } from '../common/common.js'

export default {
  mounted: function () {
    var to = getURLParameter('to')
    var id = getURLParameter('id')

    this.$store.commit('init')

    var code = getURLParameter('code')

    if (code !== undefined && code !== null && code.length > 0) {
      this.$store.dispatch('setWxCode', code)
    } else {
      // 方便开发测试的时候直接使用openid 参数
      var openid = getURLParameter('openid')
      if (openid !== undefined && openid !== null && openid.length > 0) {
        this.$store.dispatch('setWxOpenid', openid)
      }
    }

    if (to !== undefined && to.length > 0) {
      var path = '/' + to
      if (id !== undefined && id.length > 0) {
        path = path + '/' + id
      }
      this.$router.replace(path)
    } else {
      this.$router.push('/login')
    }
  }
}
</script>
