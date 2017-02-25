<template>
	<div class="weui-tab">
		<div class="weui-tab__panel">
            &nbsp;
		</div>
		<div class="weui-tabbar" style="position:fixed;bottom:0px;">
      
      <router-link to="/home" class="weui-tabbar__item">
        <div class="weui-tabbar__icon">
  				<i class="fa fa-home fa-2" aria-hidden="true"></i>
        </div>
				<p class="weui-tabbar__label">首页</p>
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
