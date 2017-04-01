<template>
  <div class="weui-toptips" :class="bgClassName" style="display:block" v-show="errAlert">{{errMsg}}</div>
</template>

<script>
export default {
  computed: {
    errAlert () { return this.$store.state.errAlert },
    errMsg () { return this.$store.state.errMsg },
    errMsgType () { return this.$store.state.errMsgType },
    bgClassName () {
      var val
      var msgType = this.$store.state.errMsgType
      // console.log(msgType)
      if (msgType === undefined || msgType === null) {
        val = 'bg-danger'
      } else {
        val = 'bg-' + msgType
      }

      if (val === 'bg-danger') {
        val += ' fa-2'
      }

      return val
    }
  }
}
</script>
