<template>  
  <div>
    <ul class="nav nav-pills flex-column">
      <li class="nav-item">
        <router-link to="/search" class="nav-link">
          航班查询
        </router-link>
      </li>
    </ul>
    <ul class="nav nav-pills flex-column">
      <li class="nav-item">
        <router-link to="/pnr/list" class="nav-link">
          PNR管理(列表)
        </router-link>
      </li>
      <li class="nav-item text-center">
        <router-link to="/pnr/ctcm" class="nav-link">
          缺 CTCM
        </router-link>
      </li>   
      <li class="nav-item text-center">
        <router-link to="/pnr/ctct" class="nav-link">
          缺 CTCT
        </router-link>
      </li>   
      <li class="nav-item text-center">
        <router-link to="/pnr/mobile" class="nav-link">
          备用手机号
        </router-link>
      </li>   
      <li class="nav-item text-center">
        <router-link to="/pnr/syslog" class="nav-link">
          系统日志
        </router-link>
      </li>   
    </ul>
    <ul class="nav nav-pills flex-column">
      <li class="nav-item">
        <router-link to="/tmc" class="nav-link">
          大客户政策
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/ctrp" class="nav-link">
          携程比价
        </router-link>
      </li>
    </ul>
    <ul class="nav nav-pills flex-column">
      <li class="nav-item">
        <router-link to="/order" class="nav-link">
          买家订单
        </router-link>
      </li>
    </ul>
    <ul class="nav nav-pills flex-column">
      <li class="nav-item">
        <router-link to="/qinfo" class="nav-link">
          Q管理
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/tpr" class="nav-link">
          TPR
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/eterm" class="nav-link">
          ETERM
        </router-link>
      </li>
    </ul>
    
    <ul class="nav nav-pills flex-column">
      <li class="nav-item">
        <router-link to="/recharge" class="nav-link">
          充值
        </router-link>
      </li>
    </ul>
    <ul class="nav nav-pills flex-column">
      <li class="nav-item">
        <a href="https://github.com/Yunfeng/h5buk" class="nav-link" target="_blank">
          源码
        </a>
      </li>
    </ul>
  </div>
</template>
