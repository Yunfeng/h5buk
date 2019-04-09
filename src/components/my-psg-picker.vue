<template>
  <div id="searchPsg" class="weui-mask" v-show="show" style="z-index: 3000;">
    <div class="weui-search-bar weui-search-bar_focusing" id="search_bar">
        <a href="javascript:" class="weui-search-bar__cancel-btn text-danger ml-1" id="search_cancel" @click="cancel()">取消</a>
        <form class="weui-search-bar__form">
            <div class="weui-search-bar__box">
                <i class="weui-icon-search"></i>
                <input type="search" class="weui-search-bar__input" v-model="searchWord" ref="s"/>
                <a href="javascript:" class="weui-icon-clear" id="search_clear"></a>
            </div>
            <label for="search_input" class="weui-search-bar__label" id="search_text" @click.stop="searchPsg()">
                <i class="weui-icon-search"></i>
                <span>搜索</span>
            </label>
        </form>
        <a href="javascript:void(0)" class="weui-search-bar__cancel-btn" id="search_cancel" @click="searchPsg()">查找</a>
    </div>
    <div class="weui-cells weui-cells_access container mt-0" id="search_show">
      <div class="row">
        <div class="card col-12">
          <template v-if="psgs.length > 0">
            <table class="table table-striped table-sm">
              <tbody>
                <tr v-for="(psg,index) in psgs">
                  <td>
                    <strong>{{psg.nameCn}}</strong>
                    <template v-if="psg.idNo">
                      <small>{{psg.idNo}}</small>
                    </template>
                    <template v-else-if="psg.passportNo">
                      <small>{{psg.passportNo}}</small>
                    </template>
                  </td>
                  <td>
                    <span class="float-right mb-2">
                      <button type="button" class="btn btn-success btn-sm " @click.stop="selectThisPsg(index);">确定</button>
                    </span>
                  </td>
                </tr>                
              </tbody>
            </table>
          </template>
          <template v-else-if="searchCount > 0">
            <div class="card-block pb-0 border-bottom-1 text-center">
              <span class="text-danger">未找到乘机人信息</span>
            </div>
          </template>
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
      idType: 0,
      searchCount: 0
    }
  },
  watch: {
    show: function (newVal, oldVal) {
      if (newVal) this.searchCount = 0
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
      this.searchCount++
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
