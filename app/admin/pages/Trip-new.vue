<template>  
	<div id="art-new" class="row">
    <div class="col-12 bg-primary text-center text-white">
      <span @click="back()" class="float-left">
        <i class="fa fa-angle-left weui-tabbar__icon" aria-hidden="true"></i>
      </span>
      <template v-if="id ===0">
        录入线路
      </template>
      <template v-else>
        修改线路 <small>id: {{id}}</small>
      </template>
    </div>

    <div class="card col-12">
      <table class="table">
        <tr>
          <td>线路名称</td>
          <td>
            <input class="weui-input" placeholder="线路名称" v-model="tripName">
          </td>
        </tr>        
        <tr>
          <td>境内外</td>
          <td>
            <div class="form-group">
                <label class="form-check-label">
                    <input type="radio" class="form-check-input" name="sc.status" value="1" v-model.number="domestic">境内游
                </label>
                <label class="form-check-label">
                    <input type="radio" class="form-check-input" name="sc.status" value="0" v-model.number="domestic">境外游
                </label>
            </div>
          </td>
        </tr>
        <tr>
          <td>出发地</td>
          <td>
            <select class="form-control" v-model.number="tripFromCityId">
              <template v-for="city in cities">
                <option :value="city.id">{{city.cityName}}</option>
              </template>
            </select>
          </td>
        </tr>
        <tr>
          <td>目的地</td>
          <td><input class="weui-input" placeholder="目的地" v-model="tripTo"></td>
        </tr>
        <tr>
          <td>购买链接</td>
          <td><input class="weui-input" placeholder="购买链接" v-model="buyUrl"></td>
        </tr>
        <tr>
          <td>联系方式</td>
          <td><input class="weui-input" placeholder="联系方式" v-model="buyContact"></td>
        </tr>
        <tr>
          <td colspan="2">内容简介(行程特色)</td>
        </tr>
        <tr>
          <td colspan="2">
            <script type="text/plain" id="myEditor" class="col-12">    
            </script>
          </td>
        </tr>
      </table>

      <div class="card-footer">
        <button class="weui-btn weui-btn_primary" @click="createTrip()">创建</button>
      </div>
    </div>

  </div>
</template>

<script>
import { createTrip } from '../../api/trip.js'
import { searchCities } from '../../api/data.js'
import UE from 'UE'

export default {
  data () {
    return {
      id: 0,
      domestic: 1,
      tripName: '',
      tripFrom: '',
      tripFromCityId: 0,
      tripTo: '',
      tripContent: '',
      buyUrl: '',
      buyContact: '',

      editor: null,

      targetName: '',
      showPicker: false,

      cities: []
    }
  },
  watch: {
    tripFromCityId: function (newId) {
      if (newId === undefined) return
      for (let i = 0; i < this.cities.length; i++) {
        const info = this.cities[i]
        // console.log(info)
        // console.log(info.id + ', ' + newId)
        if (info.id === newId) {
          // console.log(info.cityName)
          this.tripFrom = info.cityName
          break
        }
      }
    }
  },
  mounted: function () {
    window.UMEDITOR_HOME_URL = '/ueditor/'
    this.editor = UE.getEditor('myEditor')

    var id = this.$route.params.id
    if (id !== undefined) {
      this.id = parseInt(id)
      this.init()
    }

    this.searchCity()
  },
  destroyed () {
    this.editor.destroy()
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
    searchCity: function () {
      searchCities((jsonResult) => {
        this.cities = jsonResult.dataList
      })
    },
    createTrip: function () {
      var params = {
        'domestic': this.domestic,
        'name': this.tripName,
        'from': this.tripFrom,
        'fromCityId': this.tripFromCityId,
        'to': this.tripTo,
        'content': this.editor.getContent(),
        'buyUrl': this.buyUrl,
        'buyContact': this.buyContact
      }

      this.showLoading()

      createTrip(params,
        (jsonResult) => {
          if (jsonResult.status === 'OK') {
            this.showErrMsg('OK')
            this.$router.replace('/trip/' + jsonResult.returnCode)
          } else {
            this.showErrMsg(jsonResult.errmsg, 'danger')
          }
        },
        () => {},
        () => { this.hideLoading() }
      )
    },
    reset: function () {
      this.id = 0
      this.domestic = 1
      this.tripName = ''
      this.tripFrom = ''
      this.tripFromCityId = 0
      this.tripTo = ''
      this.tripContent = ''
      this.buyUrl = ''
      this.buyContact = ''

      this.editor.setContent(this.tripContent, true)
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
    })
  }
}
</script>
