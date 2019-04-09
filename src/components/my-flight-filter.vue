<template>
  <div class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>                                                                
        </div>
        <div class="modal-body py-0">
          <div class="card py-0">
          <form role="form" class="form-horizontal">

        <div class="form-group row mt-2">
          <label class="col-4 text-right">共享航班</label>
          <div class="col-6">
            <div class="form-check">
              <label class="form-check-label">
                <input class="form-check-input" type="checkbox" v-model="filter.showCodeShare"> 显示共享航班
              </label>
            </div>
          </div>
        </div>

        <div class="form-group row">
          <label class="col-4 col-form-label text-right">排序</label>
          <div class="col-6 px-0" style="border-bottom: 1px solid #5bc0de;">
            <select v-model="filter.sortBy" class="form-control  border-0" >
              <option value="0">起飞时间升序</option>
              <option value="1">起飞时间降序</option>
              <option value="2">最低价格升序</option>
              <option value="3">最低价格降序</option>
            </select>                
          </div>
        </div>

        <div class="form-group row">
          <label class="col-4 col-form-label text-right">航空公司</label>
          <div class="col-6 px-0" style="border-bottom: 1px solid #5bc0de;">
            <select v-model="filter.filterByCarrier" class="form-control  border-0" >
              <option value="">全部航司</option>
                <template v-for="carrier in carrierInfos">
                  <option v-bind:value="carrier.code">
                    {{carrier.code}} {{carrier.name}}
                </option>
                </template>
            </select>                
          </div>
        </div>

        <div class="form-group row">
          <label class="col-4 col-form-label text-right">起飞时间</label>
          <div class="col-6 px-0"  style="border-bottom: 1px solid #5bc0de;">
            <select v-model="filter.filterByTime" class="form-control  border-0" >
              <option value="0">所有时间</option>
                          <option value="1">00:00-06:00</option>
                          <option value="2">06:01-12:00</option>
                          <option value="3">12:01-18:00</option>
                          <option value="4">18:00-23:59</option>
            </select>                
          </div>
        </div>

          </form>

          </div>
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
    show: {
      type: Boolean,
      default: false
    },
    carrierInfos: {
      type: Array
    }
  },
  data () {
    return {
      resolve: '',
      reject: '',
      promise: '',

      filter: {
        showCodeShare: false,
        filterByCarrier: '',
        filterByTime: '0',
        sortBy: 0
      }      
    }
  },
  methods: {
    ok: function () {
      $(this.$el).modal('hide')
      this.resolve(this.filter)
    },
    cancel: function () {
      $(this.$el).modal('hide')
      this.reject(null)
    },
    modal: function () {      
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
