<template>
<div class="weui-picker weui-animate-slide-up" v-show="show"> 
	<div class="weui-picker__hd"> 
		<a href="javascript:;" data-action="cancel" class="weui-picker__action" @click="cancel">取消</a> 
		<a href="javascript:;" data-action="select" class="weui-picker__action" id="weui-picker-confirm" @click="ok">确定</a> 
	</div> 
	<div class="weui-picker__bd">
		<div class="weui-picker__group"> 
			<div class="weui-picker__mask"></div> 
			<div class="weui-picker__indicator"></div> 
			<div class="weui-picker__content">
				<div class="weui-picker__item">飞机票</div>
				<div class="weui-picker__item">火车票</div>
				<div class="weui-picker__item">的士票</div>
				<div class="weui-picker__item">公交票</div>
				<div class="weui-picker__item">其他</div>
			</div> 
		</div>
	</div> 
</div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selectedValue: 0
    }
  }, 
  methods : {
    ok: function() {
      this.selectedValue = 1;
      this.$emit('close', this.selectedValue);
    }, 
    cancel: function() {
      this.selectedValue = 1;
      this.$emit('close', this.selectedValue);
    }
  }
}
</script>