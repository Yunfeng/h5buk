<template>
  <div id="airports"  class="card">
    <table class="table table-striped table-hover table-sm">
        <thead>
            <tr>
                <th>三字代码</th>
                <th>城市代码</th>
                <th>城市名</th>
                <th>机场中文名</th>
                <th>国家代码</th>
            </tr>                        
        </thead>
        <tbody>
            <tr v-for="(info, index) in airports">
                <td>{{info.threeCode}}</td>
                <td>{{info.cityCode}}</td>
                <td>{{info.cityName}}</td>
                <td>{{info.nameCN}}</td>
                <td>{{info.countryCode}}</td>
            </tr>

        </tbody>
    </table>
    <nav id="pagination-box" class="float-right">
      <my-pagination name='pagination' :row-count='sc.rowCount' :page-total='sc.pageTotal' :page-no='sc.pageNo' @next-page='nextPage' @prev-page='prevPage' @direct-page='directPage'></my-pagination>
    </nav>
  </div>
</template>

<script>
  import MyPagination from '../components/my-pagination.vue'
  export default {
    asyncData ({ store, route }) {
      // return the Promise from the action
      console.log('asyncData')
      // return store.commit('getAirports')
    },
    components: {
      MyPagination
    },
    computed: {
      airports () {
        return this.$store.state.airports
      },
      sc () {
        return this.$store.state.sc
      }
    },
    beforeCreate: function () {
      // console.log('Airports.vue beforeCreate')
    },
    created: function () {
      // console.log('Airports.vue created')
    },
    mounted: function () {
      this.search()
    },
    methods: {
      search: function () {
        this.$store.dispatch('getAirports', this.sc)
      },
      prevPage: function () {
        this.sc.pageNo = this.sc.pageNo - 1
        if (this.sc.pageNo < 1) this.sc.pageNo = 1
        this.search()
      },
      nextPage: function () {
        this.sc.pageNo = this.sc.pageNo + 1
        this.search()
      },
      directPage: function (pageNo) {
        this.sc.pageNo = pageNo
        this.search()
      }
    }
  }
</script>