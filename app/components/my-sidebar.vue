<template>  
  <div id="accordion" role="tablist" class="row" v-if="logined">
    <div class="card col-12 px-0">
      <div class="card-header" role="tab" id="heading2">
          <a data-toggle="collapse" href="#collapse2" aria-expanded="true" aria-controls="collapse2">
              机票
          </a>
      </div>

      <div id="collapse2" class="collapse" role="tabpanel" aria-labelledby="heading2" data-parent="#accordion">
        <ul class="list-group list-group-flush">
          <li class="list-group-item ml-3">
            <router-link to="/search">
              航班查询
            </router-link>
          </li>
          <li class="list-group-item ml-3">
            <router-link to="/tmc">
              大客户政策
            </router-link>
          </li>
          <li class="list-group-item ml-3">
            <router-link to="/order">
              买家订单
            </router-link>
          </li>
          <li class="list-group-item ml-3">
            <router-link to="/order/sale">
              卖家订单
            </router-link>
          </li>
          <li class="list-group-item ml-3">
            <router-link to="/eterm">
              ETERM
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="card col-12 px-0">
      <div class="card-header" role="tab" id="headingOne">
          <a data-toggle="collapse" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
            PNR管理
          </a>
      </div>

      <div id="collapseOne" class="collapse" role="tabpanel" aria-labelledby="headingOne" data-parent="#accordion">
        <ul class="list-group list-group-flush">
          <li class="list-group-item ml-3">
            <router-link to="/pnr/list">
              PNR列表
            </router-link>
          </li>
          <li class="list-group-item ml-3">
            <router-link to="/pnr/stat">
              PNR统计
            </router-link>
          </li>
          <li class="list-group-item ml-3">
            <router-link to="/tpr">
              TPR
            </router-link>
          </li>
          <li class="list-group-item ml-3">
            <router-link to="/qinfo">
              Q管理
            </router-link>
          </li>                    
          <li class="list-group-item ml-3">
            <router-link to="/pnr/ctcm">
              缺 CTCM
            </router-link>              
          </li>
          <li class="list-group-item ml-3">
            <router-link to="/pnr/ctct">
              缺 CTCT
            </router-link>
          </li>
          <li class="list-group-item ml-3">
            <router-link to="/pnr/mobile">
              备用手机号
            </router-link>
          </li>
          <li class="list-group-item ml-3">
            <router-link to="/pnr/syslog">
              系统日志
            </router-link>
          </li>
        </ul>
      </div>
    </div>


    <div class="card col-12 px-0">
      <div class="card-header" role="tab" id="heading3">
          <a data-toggle="collapse" href="#collapse3" aria-expanded="true" aria-controls="collapse3">
              其它
          </a>
      </div>

      <div id="collapse3" class="collapse" role="tabpanel" aria-labelledby="heading3" data-parent="#accordion">
        <ul class="list-group list-group-flush">
          <li class="list-group-item ml-3">
            <router-link to="/recharge">
              充值
            </router-link>
          </li>
          <li class="list-group-item ml-3">
            <a href="https://github.com/Yunfeng/h5buk" target="_blank">
              源码
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="card col-12 px-0">
      <div class="card-header" role="tab" id="heading4">
          <a data-toggle="collapse" href="#collapse4" aria-expanded="true" aria-controls="collapse4">
              系统管理
          </a>
      </div>

      <div id="collapse4" class="collapse" role="tabpanel" aria-labelledby="heading4" data-parent="#accordion">
        <ul class="list-group list-group-flush">
          <li class="list-group-item ml-3">
            <router-link to="/customers">
              客户管理
            </router-link>
          </li>
          <li class="list-group-item ml-3">
            <router-link to="/employees">
              员工管理
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  computed: {
    logined () { return this.$store.state.logined }
  }
}
</script>
