<template>
  <div id="searchPsg" class="weui-mask" v-show="show">
    <div class="weui-search-bar weui-search-bar_focusing" id="search_bar">
        <a href="javascript:" class="weui-search-bar__cancel-btn" id="search_cancel" @click="cancel()">取消</a>
        <form class="weui-search-bar__form">
            <div class="weui-search-bar__box">
                <i class="weui-icon-search"></i>
                <input type="search" class="weui-search-bar__input" v-model="searchWord" ref="s"/>
                <a href="javascript:" class="weui-icon-clear" id="search_clear"></a>
            </div>
            <label for="search_input" class="weui-search-bar__label" id="search_text" @click="searchPsg()">
                <i class="weui-icon-search"></i>
                <span>搜索</span>
            </label>
        </form>
        <a href="javascript:" class="weui-search-bar__cancel-btn" id="search_cancel" @click="searchPsg()">查找</a>
    </div>
    <div class="weui-cells weui-cells_access container mt-0" id="search_show">
      <div class="row">
        <div class="card col-12" style="padding-left: 0; padding-right: 0;">
          <table class="table table-hover">
            <thead>
                <tr>
                <th>姓名</th>
                <th>身份证/护照</th>
                <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(psg,index) in psgs">
                    <td>{{psg.nameCn}}</td>
                    <td>
                      {{psg.idNo}}
                      <br />
                      <small>{{psg.passportNo}}</small>
                    </td>
                    <td>
                        <button type="button" @click.stop="selectThisPsg(index);">√</button>
                    </td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
</div>

</template>

<script>
import $ from 'jquery'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      searchWord: '',
      psgs: [],
      name: '',
      idno: '',
      passport: '',
      idType: 0
    }
  },
  watch: {
    show: function (newVal, oldVal) {
      // console.log('new: %s, old: %s', newVal, oldVal)
    }
  },
  updated: function () {
    // console.log('updated.....')
  },
  methods: {
    ok: function () {
      this.$emit('close', 1)
    },
    cancel: function () {
      this.$emit('close', 0)
    },
    searchPsg: function () {
      var self = this
      var searchWord = self.searchWord.toUpperCase()

      $.ajax({
        type: 'post',
        url: '/Flight/psgs/searchPsg.do',
        data: { 'sc.name': searchWord },
        dataType: 'json',
        success: function (jsonResult) {
          if (jsonResult !== null) {
            self.psgs = jsonResult.dataList
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
    },
    selectThisPsg: function (index) {
      this.name = this.psgs[index].nameCn
      this.idno = this.psgs[index].idNo
      this.passport = this.psgs[index].passportNo
      this.idType = 0

      if (this.idno !== null && this.idno.length > 0) {
        this.idType = 1
      } else if (this.passport !== null && this.passport.length > 0) {
        this.idType = 2
        this.idno = this.passport
      }

      this.$emit('close', 1, this.name, this.idType, this.idno)
    }
  }
}
</script>
