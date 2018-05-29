<template>
  <div class="row col-12 fixed-bottom">
    <div class="weui-tabbar">
      <router-link to="/qinfos" class="weui-tabbar__item">
        <div class="weui-tabbar__icon">
            <i class="fa fa-plane fa-2 text-primary" aria-hidden="true"></i>
        </div>
        <p class="weui-tabbar__label">
            Q
        </p>
      </router-link>
      <router-link to="/pnrs" class="weui-tabbar__item">
        <div class="weui-tabbar__icon">
            <i class="fa fa-ship fa-2 text-warning" aria-hidden="true"></i>
        </div>
        <p class="weui-tabbar__label">
            PNR
        </p>
      </router-link>

      <router-link to="/login" class="weui-tabbar__item">
        <div class="weui-tabbar__icon">
          <i class="fa fa-user-circle fa-2" aria-hidden="true"></i>
        </div>                    
        <p class="weui-tabbar__label">我</p>
      </router-link>      
    </div>
  </div>
</template>
