<template>
<div class="weui-grids row">
    <router-link to="/order" class="weui-grid">
        <div class="weui-grid__icon">
            <i class="fa fa-plane fa-2" aria-hidden="true"></i>
        </div>
        <p class="weui-grid__label">
            机票订单
        </p>
    </router-link>
    <router-link to="/trip-orders" class="weui-grid">
        <div class="weui-grid__icon">
            <i class="fa fa-ship fa-2" aria-hidden="true"></i>
        </div>
        <p class="weui-grid__label">
            度假订单
        </p>
    </router-link>
</div>
</template>
