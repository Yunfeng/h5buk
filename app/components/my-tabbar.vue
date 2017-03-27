<template>
	<div class="weui-tab row clearfix">
		<div class="weui-tab__panel"></div>
		<div class="weui-tabbar" style="position:fixed;bottom:0px;">
      <router-link to="/search" class="weui-tabbar__item">
        <div class="weui-tabbar__icon">
            <i class="fa fa-plane fa-2 text-primary" aria-hidden="true"></i>
        </div>
        <p class="weui-tabbar__label">
            机票
        </p>
      </router-link>
      <router-link to="/order" class="weui-tabbar__item">
        <div class="weui-tabbar__icon">
  				<i class="fa fa-home fa-2" aria-hidden="true"></i>
        </div>
				<p class="weui-tabbar__label">订单</p>
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
