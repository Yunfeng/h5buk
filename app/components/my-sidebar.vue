<template>  
  <div id="accordion" role="tablist" class="row">
    <div class="card col-12 px-0">
      <div class="card-header" role="tab" id="heading2">
          <a data-toggle="collapse" href="#collapse2" aria-expanded="true" aria-controls="collapse2">
              机票 <i class="fa fa-angle-right" aria-hidden="true"></i>
          </a>
      </div>

      <div id="collapse2" class="collapse" role="tabpanel" aria-labelledby="heading2" data-parent="#accordion">
        <ul class="list-group list-group-flush">
          <li class="list-group-item ml-3">
            <router-link to="/tmc/list" class="text-primary">
              机票政策
            </router-link>
            <router-link to="/tmc/buy" class="text-danger small ml-2">
              导入编码
            </router-link>
          </li>
          <li class="list-group-item ml-3">
            <router-link to="/groups" class="text-primary">
              团队机票
            </router-link>
            <router-link to="/group/new" class="text-danger small ml-2">
              新建
            </router-link>
          </li>
          <li class="list-group-item ml-3">
            <router-link to="/order" class="text-warning">
              我的订单
            </router-link>
          </li>
          <li class="list-group-item ml-3">
            <router-link to="/refunds" class="text-warning">
              我的退票
            </router-link>
          </li>
          <li class="list-group-item ml-3">
            <router-link to="/changes" class="text-warning">
              我的改期
            </router-link>
          </li>
          <li class="list-group-item ml-3">
            <router-link to="/search">
              航班查询
            </router-link>
          </li>
          <li class="list-group-item ml-3">
            <router-link to="/eterm">
              eterm指令
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="card col-12 px-0">
      <div class="card-header" role="tab" id="headingTrip">
        <a data-toggle="collapse" href="#collapseTrip" aria-expanded="true" aria-controls="collapseTrip">
          旅游 <i class="fa fa-angle-right" aria-hidden="true"></i>
        </a>
      </div>

      <div id="collapseTrip" class="collapse" role="tabpanel" aria-labelledby="headingTrip" data-parent="#accordion">
        <ul class="list-group list-group-flush">
          <li class="list-group-item ml-3">
            <router-link to="/trips" class="text-danger">
              路线
            </router-link>
            <router-link to="/trip/new" class="text-primary small ml-2">
              新建
            </router-link>
          </li>
          <li class="list-group-item ml-3">
            <router-link to="/trip-orders" class="text-danger">
              订单管理
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="card col-12 px-0">
      <div class="card-header" role="tab" id="headingOne">
          <a data-toggle="collapse" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
            PNR管理 <i class="fa fa-angle-right" aria-hidden="true"></i>
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
      <div class="card-header" role="tab" id="heading4">
          <a data-toggle="collapse" href="#collapse4" aria-expanded="true" aria-controls="collapse4">
              系统管理 <i class="fa fa-angle-right" aria-hidden="true"></i>
          </a>
      </div>

      <div id="collapse4" class="collapse" role="tabpanel" aria-labelledby="heading4" data-parent="#accordion">
        <ul class="list-group list-group-flush">
          <li class="list-group-item ml-3">
            <router-link to="/settings">
              设置
            </router-link>
          </li>          
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
          <li class="list-group-item ml-3">
            <router-link to="/p/insurances">
              保险产品管理
            </router-link>
          </li>
          <li class="list-group-item ml-3">
            <router-link to="/history/rav">
              航班查询记录
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="card col-12 px-0">
      <div class="card-header" role="tab" id="headingArt">
          <a data-toggle="collapse" href="#collapseArt" aria-expanded="true" aria-controls="collapseArt">
              文章 <i class="fa fa-angle-right" aria-hidden="true"></i>
          </a>
      </div>

      <div id="collapseArt" class="collapse" role="tabpanel" aria-labelledby="headingArt" data-parent="#accordion">
        <ul class="list-group list-group-flush">
          <li class="list-group-item ml-3">
            <router-link to="/arts" class="text-danger">
              文章
            </router-link>
            <router-link to="/art/new" class="text-primary small ml-2">
              新建
            </router-link>
          </li>
          <li class="list-group-item ml-3">
            <router-link to="/materials" class="text-danger">
              媒体文件
            </router-link>
          </li>
          <li class="list-group-item ml-3">
            <router-link to="/upload" class="text-danger">
              上传
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="card col-12 px-0">
      <div class="card-header" role="tab" id="heading5">
          <a data-toggle="collapse" href="#collapse5" aria-expanded="true" aria-controls="collapse5">
              公众号管理 <i class="fa fa-angle-right" aria-hidden="true"></i>
          </a>
      </div>

      <div id="collapse5" class="collapse" role="tabpanel" aria-labelledby="heading5" data-parent="#accordion">
        <ul class="list-group list-group-flush">
          <li class="list-group-item ml-3">
            <router-link to="/subscribers">
              关注者
            </router-link>
          </li>
          <li class="list-group-item ml-3">
            <router-link to="/templates">
              消息模板
            </router-link>
          </li>
          <li class="list-group-item ml-3">
            <router-link to="/weixin/menus">
              自定义菜单
            </router-link>
          </li>
          <li class="list-group-item ml-3">
            <router-link to="/weixin/materials">
              素材
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
