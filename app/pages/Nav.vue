<template>
</template>

<script>
import { getURLParameter } from '../common/common.js'

export default {
  mounted: function () {
    var to = getURLParameter('to')
    var id = getURLParameter('id')

    if (to !== undefined && to.length > 0) {
      var path = '/' + to
      if (id !== undefined && id.length > 0) {
        path = path + '/' + id
      }
      this.$router.replace(path)
    } else {
      this.$router.push('/home')
    }
  }
}
</script>
