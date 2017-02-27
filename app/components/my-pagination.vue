<template>
  <nav class="float-right" aria-label="Page navigation example" v-if="rowCount > 0">
    <ul class="pagination">
        <li class="page-item"><a  class="page-link">{{rowCount}},{{pageNo}}</a></li>
        <template v-if="pageTotal > 1">
          <li class="page-item" :class="{active: pageNo === 1}"><a @click="goDirectPage('1')" class="page-link">1</a></li>        
          <li class="page-item" v-if="pageNo > 1"><a @click="goPrevPage" class="page-link"><span aria-hidden="true">&laquo;</span></a></li>          
          <li class="page-item" v-if="pageNo < pageTotal"><a @click="goNextPage" class="page-link"><span aria-hidden="false">&raquo;</span></a></li>
          <li class="page-item" :class="{active: pageNo === pageTotal}"><a @click="goDirectPage(pageTotal)" class="page-link">{{pageTotal}}</a></li>        
        </template>        
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'my-pagination',
  props: {
    rowCount: 0,
    pageNo: 0,
    pageTotal: 0
  },
  methods: {
    goPrevPage: function () {
      this.$emit('prev-page')
    },
    goNextPage: function () {
      this.$emit('next-page')
    },
    goDirectPage: function (pageNo) {
      this.$emit('direct-page', pageNo)
    }
  }
}
</script>

