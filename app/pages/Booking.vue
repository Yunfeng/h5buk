<template>
	<div id="booking">
    <div class="weui-toptips weui-toptips_warn" style="display:block" v-show="errAlert">{{errMsg}}</div>
    <my-input label-text="出发" placeholder="出发城市" v-model="dcityName" :readonly="true" @focused="dcityFocusedEvent()"></my-input>
    <my-input label-text="到达" placeholder="到达城市" v-model="acityName" :readonly="true" @focused="acityFocusedEvent()"></my-input>
    <my-input label-text="出发日期" placeholder="出发日期" v-model="ddate" id="ddate"></my-input>
    <my-button @click="search()" type="primary">查询航班</my-button>

    <my-city-picker :show="showPicker" @close="cityPickerClosed(val)" :target="targetName"></my-city-picker>

    <div id="loadingToast" v-show="searching">
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast">
        <i class="weui-loading weui-icon_toast"></i>
        <p class="weui-toast__content">数据加载中</p>
    </div>
</div>
  </div>
</template>

<script>
import MyButton from '../components/my-button.vue';
import MyInput from '../components/my-input.vue';
import MyCityPicker from '../components/my-input.vue';
import domCities from '../domCities.js';

export default {
  components:{
    'my-button': MyButton,
    'my-input': MyInput,
    'my-city-picker': MyCityPicker
  },
  data () {
    return {
      targetName: '',
      showDialog: false,
      showPicker: false,
      cities: domCities,
      searching: false,
      errMsg: '',
      errAlert: false
    }
  },
  computed: {
    dcity() {return this.$store.state.searchParams.dcity},
    acity() {return this.$store.state.searchParams.acity},
    ddate() {return this.$store.state.searchParams.ddate},
    dcityName() {return this.$store.state.searchParams.dcityName},
    acityName() {return this.$store.state.searchParams.acityName},
  },
  mounted: function() {
    // console.log('booking.vue is mounted.');
    var self = this;
    var today = new Date();

    $("#ddate input").datepicker({
      dateFormat: "yy-mm-dd",
      showButtonPanel: false,
      showOtherMonths: false,
      selectOtherMonths: false,
      numberOfMonths: 1,
      minDate: today,
      onSelect: function(dateText, inst) {
        self.$store.commit("setDdate", dateText);
      } 
    }); 
  },
  methods: {
    search: function() {
      if (this.dcity.length != 3 || this.dcityName.length < 1 || this.acity.length != 3 || this.acityName.length < 1) {
        this.showErrMsg("请选择出发/到达城市");
        return;
      }

      if (this.dcity === this.acity) {
        this.showErrMsg("出发和到达城市不能相同");
        return;
      }

      if (this.ddate.length <= 8) {
        this.showErrMsg("请选定乘机日期");
        return;
      }

      //查询航班
      // console.log(this.dcityName);
      // console.log(this.acityName);
      // console.log(this.dcity);
      // console.log(this.acity);
      this.searching = true;
      // var self = this;
      // setTimeout(function(){self.searching = false;}, 5000);
      setTimeout(() => this.searching = false, 5000);
    },
    cityPickerClosed: function(val) {
      this.showPicker = val;

    },
    dcityFocusedEvent: function() {
      this.targetName = "Dcity";
      this.showPicker = true;
    },
    acityFocusedEvent: function() {
      this.targetName = "Acity";
      this.showPicker = true;
    },
    showErrMsg: function(msg) {
      this.errMsg = msg;
      this.errAlert = true;
      setTimeout(() => this.errAlert = false, 1500);
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      //console.log("i m in.");
      
    })
  }
}

</script>