<template>
</template>

<script>
import { getURLParameter } from '../../common/common.js'

export default {
  mounted: function () {
    var to = getURLParameter('to')
    var id = getURLParameter('id')

    const authCode = getURLParameter('auth_code')
    const code = getURLParameter('code')
    const state = getURLParameter('state')

    if (authCode !== undefined && authCode !== null && authCode.length > 0) {
      this.$store.dispatch('setWwopenAuthCode', authCode)
    } else if (code !== undefined && code !== null && code.length > 0) {
      this.$store.dispatch('setWwopenCode', code)
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
