<template>
  <div id="eterm" class="row">
    <div class="col-12 bg-info text-center text-white fa-2">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
        <small>返回</small>
      </span>
      黑屏指令
    </div>

    <div class="col-12 px-0 form-group mt-2">
      <div class="row">
        <div class="col-8">
          <input type="text" class="form-control" placeholder="在此输入查询指令" v-model="hostcmd" @keyup.enter="execCmd();" />
        </div>
        <div class="col-4">
          <button class="btn btn-success" @click.stop="execCmd();">执行</button>
        </div>
      </div>
    </div>
    <div id="eterm-result" class="weui-cell" v-if="cmdResult != null && cmdResult.length > 0 ">
        <div v-html="'<pre>' + cmdResult + '</pre>'">
        </div>
    </div>  

  </div>
</template>

<script>
import $ from 'jquery'

export default {
  data () {
    return {
      hostcmd: '',
      cmdResult: '该功能需要在微信公众号里面使用<br />目前开放了av,fd,nfd指令<br />执行指令要扣除积分<br />您可以签到来赚取积分'
    }
  },
  computed: {
    // acityName() {return this.$store.state.searchParams.acityName},
  },
  mounted: function () {
    // this.search();
  },
  methods: {
    back: function () {
      this.$router.go(-1)
    },
    showErrMsg: function (msg, msgType) {
      this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
    },
    showLoading: function (loadingText) {
      this.$store.commit('showLoading', { 'loading': true, 'loadingText': loadingText })
    },
    hideLoading: function () {
      this.$store.commit('showLoading', { 'loading': false })
    },
    execCmd: function () {
      var self = this

      self.cmdResult = ''

      if (self.hostcmd.length < 6) {
        self.showErrMsg('指令的长度不能少于6')
        return
      }

      this.showLoading('执行中...')

      $.ajax({
        type: 'post',
        url: '/Flight/flights/eterm.do',
        data: {
          'hostcmd': self.hostcmd
        },
        dataType: 'json',
        success: function (jsonResult) {
          if (jsonResult.status === 'OK') {
            self.cmdResult = jsonResult.desc
          } else {
            self.showErrMsg(jsonResult.errmsg, 'danger')
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          if (XMLHttpRequest.status === 403) {
            self.$store.commit('jumpToLogin', self.$router)
          }
        },
        complete: function (XMLHttpRequest, textStatus) {
          self.hideLoading()
        }
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  }
}
</script>
