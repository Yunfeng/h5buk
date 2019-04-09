<template>
  <div class="form-group row">
        <div class="col-6">
            <input class="form-control" placeholder="请输入验证码" :value="value" @input="updateValue($event.target.value)">
        </div>
        <div class="col-6">
            <img class="img-fluid" :id="imgId">
        </div>
    </div>
</template>

<script>
export default {
  props: {
    labelText: String,
    imgId: String,
    warned: Boolean,
    value: String
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
    }
  }
}
</script>
