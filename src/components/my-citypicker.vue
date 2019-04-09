<template>
  <div id="searchCity" class="weui-mask" v-show="show">
    <div class="weui-search-bar weui-search-bar_focusing" id="search_bar">
        <a href="javascript:" class="weui-search-bar__cancel-btn" id="search_cancel" v-on:click="cancel($event.target)">取消</a>
        <form class="weui-search-bar__form">
            <div class="weui-search-bar__box">
                <i class="weui-icon-search"></i>
                <input type="search" class="weui-search-bar__input" v-model="searchWord" ref="s"/>
                <a href="javascript:" class="weui-icon-clear" id="search_clear"></a>
            </div>
            <label for="search_input" class="weui-search-bar__label" id="search_text" v-on:click="readySearch($event.target)">
                <i class="weui-icon-search"></i>
                <span>搜索</span>
            </label>
        </form>
        <a href="javascript:" class="weui-search-bar__cancel-btn" id="search_cancel" v-on:click="ok($event.target)">确定</a>
    </div>
    <div class="weui-cells weui-cells_access" id="search_show" style="margin-top: 0px;">
        <div class="weui-cell city-selected"   v-for="(item, index) in searchCity()" @click="selectCity(item[0], item[1], index)" :class="{'weui-cell_selected': index === indexSelected}">
            <div class="weui-cell__bd weui-cell_primary">
                <p>{{item[1]}} ({{item[0]}})</p>
            </div>
            <i class="weui-icon-success-no-circle" v-if="index === indexSelected"></i>
        </div>      
    </div>
  </div>
</template>

<script>
import domCities from '../domCities.js'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    target: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      searchWord: '',
      selectedValue: 0,
      focusing: false,
      cities: domCities.citys,
      hotCities: domCities.hotCities,
      indexSelected: -1
    }
  },
  watch: {
    show: function (newVal, oldVal) {
      if (newVal) {
        this.searchWord = ''
        this.indexSelected = -1
      }
    }
  },
  updated: function () {
    var self = this
    this.$nextTick(function () {
      self.$refs.s.focus()
    })
  },
  methods: {
    ok: function () {
      this.selectedValue = 1
      this.$emit('close', this.selectedValue)
    },
    cancel: function () {
      this.selectedValue = 1
      this.$emit('close', this.selectedValue)
    },
    readySearch: function (target) {
      // console.log(target)
      this.focusing = true
    },
    cancelSearch: function (target) {
      // console.log(target)
      this.focusing = false
    },
    selectCity: function (cityCode, cityName, index) {
      // console.log(val)
      this.indexSelected = index
      var str = 'set' + this.target
      // console.log(str)
      this.$store.commit(str, { 'cityCode': cityCode, 'cityName': cityName })
      this.$emit('close', this.selectedValue)
    },
    searchCity: function () {
      var searchWord = this.searchWord.toUpperCase()

      if (searchWord.length === 0) return this.hotCities

      var returnCities = this.cities.filter(function (city) {
        return city[0].indexOf(searchWord) > -1 || city[1].indexOf(searchWord) > -1 || city[2].indexOf(searchWord) > -1 || city[3].indexOf(searchWord) > -1
      })

      return returnCities
    }
  }
}
</script>

<style>
.weui-cell.city-selected:hover {
  background-color: #d0e9c6;
}

.weui-cell.city-selected.weui-cell_selected {
  background-color: #d9edf7;
}
</style>
