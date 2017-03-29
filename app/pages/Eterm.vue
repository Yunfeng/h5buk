<template>
  <div id="eterm" class="row">
    <div class="col-12 bg-info text-center text-white">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
      </span>
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
  

    <div id="loadingToast" v-show="loading">
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast">
        <i class="weui-loading weui-icon_toast"></i>
        <p class="weui-toast__content">{{loadingText}}</p>
      </div>
    </div>

  </div>
</template>

<script>
import $ from 'jquery'

export default {
  data () {
    return {
      errAlert: false,
      errMsg: '',
      loading: false,
      loadingText: '数据加载中',

      hostcmd: '',
      cmdResult: ''
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
    showErrMsg: function (msg) {
      this.errMsg = msg
      this.errAlert = true
      setTimeout(() => { this.errAlert = false }, 1500)
    },
    execCmd: function () {
      var self = this

      self.cmdResult = ''

      if (self.hostcmd.length < 6) {
        self.showErrMsg('航班查询指令的长度不够')
        return
      }

      self.loading = true
      self.loadingText = '数据加载中'

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
            self.showErrMsg(jsonResult.errmsg)
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          if (XMLHttpRequest.status === 403) {
            self.$store.commit('jumpToLogin', self.$router)
          }
        },
        complete: function (XMLHttpRequest, textStatus) {
          self.loading = false
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
