<template>
  <div class="row col-12 fixed-bottom" style="opacity: 0.9;">
    <div class="weui-tabbar">
      <router-link to="/search" class="weui-tabbar__item">
        <div class="weui-tabbar__icon">
            <i class="fa fa-plane fa-2 text-primary" aria-hidden="true"></i>
        </div>
        <p class="weui-tabbar__label">
            机票
        </p>
      </router-link>
      <router-link to="/booking" class="weui-tabbar__item" v-if="flightCount > 0">
        <div class="weui-tabbar__icon">
            <i class="fa fa-shopping-cart fa-2 text-danger" aria-hidden="true"></i>
        </div>
        <p class="weui-tabbar__label">
            购物车
        </p>
      </router-link>      
      <router-link to="/orders" class="weui-tabbar__item">
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

<script>
export default {
  computed: {
    // flightCount () { return this.$store.state.order.flights.length }
    flightCount () { return 1 }
  }
}
</script>

<style>
.weui-tabbar {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  position: absolute;
  z-index: 500;
  bottom: 0;
  width: 100%;
  background-color: #F7F7FA;
}
.weui-tabbar:before {
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 1px;
  border-top: 1px solid #C0BFC4;
  color: #C0BFC4;
  -webkit-transform-origin: 0 0;
          transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
          transform: scaleY(0.5);
}
.weui-tabbar__item {
  display: block;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
          flex: 1;
  padding: 5px 0 0;
  font-size: 0;
  color: #999999;
  text-align: center;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.weui-tabbar__item.weui-bar__item_on .weui-tabbar__icon,
.weui-tabbar__item.weui-bar__item_on .weui-tabbar__icon > i,
.weui-tabbar__item.weui-bar__item_on .weui-tabbar__label {
  color: #09BB07;
}
.weui-tabbar__icon {
  display: inline-block;
  width: 27px;
  height: 27px;
}
i.weui-tabbar__icon,
.weui-tabbar__icon > i {
  font-size: 24px;
  color: #999999;
}
.weui-tabbar__icon img {
  width: 100%;
  height: 100%;
}
.weui-tabbar__label {
  text-align: center;
  color: #999999;
  font-size: 10px;
  line-height: 1.8;
}	
</style>
