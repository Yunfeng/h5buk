<template>
  <a class="btn" :class="className" @click.stop="click()">
    {{text}}<slot></slot>
  </a>
</template>

<script>
export default {
  props: {
    type: {
      default: 'default'
    },
    text: String,
    mini: Boolean,
    disabled: Boolean,
    plain: Boolean
  },
  computed: {
    className: function () {
      return [
        {
          'weui-btn_mini': this.mini,
          'weui-btn_disabled': this.disabled
        },
        `btn-${this.type}`
      ]
    }
  },
  methods: {
    click: function () {
      this.$emit('click')
    }
  }
}
</script>

