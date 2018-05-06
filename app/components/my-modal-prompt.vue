<template>
  <div class="modal" :id="id" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
            <h6 class="modal-title">
              <slot name="title">
                修改备注
              </slot>
            </h6>
            <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>                                                                
        </div>
        <div class="modal-body" v-if="hideBody === false">
          <form role="form" class="form-horizontal">
            <div class="form-group row">
              <div class="col-12">
                <input type="text" class="form-control" v-model.trim="remark" placeholder="请在此输入内容" />
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" @click.stop="cancel()">取消</button>
            <button type="button" class="btn btn-primary" @click.stop="ok()">确定</button>
        </div>
      </div>
    </div>                    
  </div>
</template>


<script>
import $ from 'jquery'

export default {
  props: {
    id: {
      type: String,
      default: 'modalPrompt'
    },
    nullable: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      resolve: '',
      reject: '',
      promise: '',
      remark: '',
      hideBody: false
    }
  },
  methods: {
    ok: function () {
      if (!this.nullable && this.remark.trim().length < 1) {
        return
      }

      $(this.$el).modal('hide')
      this.resolve(this.remark)
    },
    cancel: function () {
      $(this.$el).modal('hide')
      this.reject(null)
    },
    modal: function (val) {
      this.hideBody = false
      if (val !== undefined && val !== null) {
        if (val === 'YesOrNo') {
          this.remark = val
          this.hideBody = true
        } else {
          this.remark = val
        }
      } else {
        this.remark = ''
      }

      $(this.$el).modal()

      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
      return this.promise
    }
  }
}
</script>
