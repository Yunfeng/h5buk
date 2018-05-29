<template>
  <input :id="id" type="text" :placeholder="placeholder" :value="value" @input="updateValue($event.target.value)">
</template>

<script>
import $ from 'jquery'

export default {
  props: {
    placeholder: '',
    value: '',
    id: ''
  },
  mounted: function () {
    var self = this
    const id = '#' + this.id
    $(id).datepicker({
      dateFormat: 'yy-mm-dd',
      autoSize: true,
      showButtonPanel: false,
      showOtherMonths: false,
      selectOtherMonths: false,
      numberOfMonths: 1,
      showOptions: { direction: 'up' },
      onSelect: function (dateText, inst) {
        self.updateValue(dateText)
      },
      beforeShow: function (input) {
        $(input).css({ position: 'relative', zIndex: '1000' })
      }
    })
  },
  methods: {
    updateValue: function (value) {
      this.$emit('input', value)
    }
  }
}
</script>
