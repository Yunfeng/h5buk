<template>

<div v-show="show">
    <div class="weui-mask"></div>
    <div class="weui-dialog">
        <div class="weui-dialog__hd"><strong class="weui-dialog__title"><slot name="title">弹窗标题</slot></strong></div>
        <div class="weui-dialog__bd"><slot name="content">弹窗内容，告知当前页面信息等</slot></div>
        <div class="weui-dialog__ft">
            <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" @click="ok()">确定</a>
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
    },
    maskTransition: {
      type: String,
      default: 'vux-fade'
    },
    dialogTransition: {
      type: String,
      default: 'vux-dialog'
    },
    hideOnBlur: Boolean,
    scroll: {
      type: Boolean,
      default: true
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