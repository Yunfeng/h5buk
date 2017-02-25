<template>
<div class="weui-grids" style="padding: 0">
    <router-link to="/search" class="weui-grid">
        <div class="weui-grid__icon">
            <i class="fa fa-plane fa-2" aria-hidden="true"></i>
        </div>
        <p class="weui-grid__label">
            航班查询
        </p>
    </router-link>
    <router-link to="/tmc" class="weui-grid">
        <div class="weui-grid__icon">
            <i class="fa fa-fire fa-2" aria-hidden="true"></i>
        </div>
        <p class="weui-grid__label">
            大客户政策
        </p>
    </router-link>
    <router-link to="/order" class="weui-grid">
        <div class="weui-grid__icon">
            <i class="fa fa-book fa-2" aria-hidden="true"></i>
        </div>
        <p class="weui-grid__label">
            买家订单
        </p>
    </router-link>
    <router-link to="/order/sale" class="weui-grid">
        <div class="weui-grid__icon">
            <i class="fa fa-book fa-2" aria-hidden="true"></i>
        </div>
        <p class="weui-grid__label">
            卖家订单
        </p>
    </router-link>
    <router-link to="/qinfo" class="weui-grid">
        <div class="weui-grid__icon">
            <i class="fa fa-info-circle fa-2" aria-hidden="true"></i>
        </div>
        <p class="weui-grid__label">
            Q管理
        </p>
    </router-link>
    <router-link to="/pnr" class="weui-grid">
        <div class="weui-grid__icon">
            <i class="fa fa-info-circle fa-2" aria-hidden="true"></i>
        </div>
        <p class="weui-grid__label">
            PNR管理
        </p>
    </router-link>
    <router-link to="/eterm" class="weui-grid">
        <div class="weui-grid__icon">
            <i class="fa fa-info-circle fa-2" aria-hidden="true"></i>
        </div>
        <p class="weui-grid__label">
            ETERM
        </p>
    </router-link>
    <a href="https://github.com/Yunfeng/h5buk" class="weui-grid hidden" target="_blank">
        <div class="weui-grid__icon">
            <i class="fa fa-book fa-2" aria-hidden="true"></i>
        </div>
        <p class="weui-grid__label">
            源码
        </p>
    </a>
</div>
</template>

<style>
.fa-2 {
    font-size: 2em
}
</style>
