<template>
</template>

<script>
import { getURLParameter } from '../../common/common.js'

export default {
  mounted: function () {
    var to = getURLParameter('to')
    var id = getURLParameter('id')

    const authCode = getURLParameter('auth_code')

    if (authCode !== undefined && authCode !== null && authCode.length > 0) {
      this.$store.dispatch('setOpenWorkWxAuthCode', { authCode })
    } else {
      // 方便开发测试的时候直接使用openid 参数
      var openid = getURLParameter('userid')
      if (openid !== undefined && openid !== null && openid.length > 0) {
        this.$store.dispatch('setWorkWxUserid', openid)
      }
    }

    if (to !== undefined && to.length > 0) {
      var path = '/wwopen/' + to
      if (id !== undefined && id.length > 0) {
        path = path + '/' + id
      }
      this.$router.replace(path)
    } else {
      this.$router.push('/wwopen/login')
    }
  }
}
</script>
