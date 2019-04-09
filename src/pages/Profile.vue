<template>
  <div id="register" class="row">
    <div class="col-12 bg-info text-white text-center fa-2">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left fa-2" aria-hidden="true"></i>
        <small>返回</small>
      </span>
      账户设置
    </div> 
    <div class="card col-12">
      <div class="card-body">
        <form>
          <div class="form-group">
            <input type="input" class="form-control" placeholder="用户名"  v-model="username">
            <small class="text-muted">通过桌面登录系统时使用，只能设置一次</small>
          </div>
          <div class="form-group">
            <input type="input" class="form-control" placeholder="密码"  v-model="password">
            <small class="text-muted">留空表示不修改密码</small>
          </div>
          <div class="form-group">
            <input type="input" class="form-control" placeholder="姓名"  v-model="realName">
            <small class="text-muted">真实姓名</small>
          </div>
          <div class="form-group">
            <input type="input" class="form-control" placeholder="手机号"  v-model="mobileNo">
            <small class="text-muted">联系电话</small>
          </div>
        </form>
      </div>
      <div class="card-footer">
        <button class="btn btn-success btn-block" type="button" @click.stop="save()">保存</button>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { getProfile, updateProfile } from '../api/user.js'

export default {
  data () {
    return {
      user: null,

      username: '',
      password: '',
      realName: '',
      mobileNo: ''
    }
  },
  computed: {
    sessionUsername () { return this.$store.state.username },
    userInfo () { return this.$store.state.userInfo }
  },
  mounted: function () {
    this.getProfile()
  },
  methods: {
    back: function () {
      this.$router.go(-1)
    },
    showErrMsg: function (msg, msgType) {
      this.$store.dispatch('showAlertMsg', { 'errMsg': msg, 'errMsgType': msgType })
    },
    save: function () {
      const params = {
        'username': this.username,
        'password': this.password,
        'realName': this.realName,
        'mobileNo': this.mobileNo
      }

      updateProfile(params, v =>  {
        console.log(v)
        if (v.status !== 'OK') {
          this.showErrMsg(v.errmsg, 'danger')
        } else {
          this.showErrMsg('修改成功')
        }
      })
    },
    getProfile: function () {
      getProfile(v => {
        this.username = v.username
        this.realName = v.realName
        this.mobileNo = v.mobileNo
      })
    }
  }
}

</script>
