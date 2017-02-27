<template>
  <div class="weui-cell" :class="className">
    <div class="weui-cell__hd"><label class="weui-label">{{labelText}}</label></div>
    <div class="weui-cell__bd">
        <input class="weui-input" v-on:focus="focusEvent($event.target)" :type="dataType" :placeholder="placeholder" :value="value" @input="updateValue($event.target.value)" :readonly="readonly">
    </div>
  </div>
</template>


<script>
export default {
  props: {
    type: String,
    dataType: String,
    labelText: String,
    placeholder: String,
    warned: Boolean,
    value: String,
    readonly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    className: function () {
      return [
        {
          'weui-btn_warn': this.warned
        }
      ]
    }
  },
  methods: {
    updateValue: function (value) {
      this.$emit('input', value)
    },
    focusEvent: function (target) {
      this.$emit('focused')
    }
  }
}
</script>
