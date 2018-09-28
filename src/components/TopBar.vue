<template>
	<header id="header" class="u-header">

	  <div class="u-header__section">
	  	<!-- Topbar -->
	    <div class="container u-header__hide-content py-1">
	      <div class="d-flex align-items-center mb-0">
	        <div class="ml-auto">

	        </div>

	        <ul class="list-inline ml-2 mb-0">
	          <li class="list-inline-item" v-if="!logined">
	            <router-link id="sidebarNavToggler" class="btn btn-xs u-btn--icon u-btn-text-secondary u-sidebar__toggler" :to="`/wwopen/login`" role="button">
	              <span class="fa fa-user-circle u-btn--icon__inner font-size-14"></span>
	            </router-link>
	          </li>

            <!-- Account Login -->
            <li class="list-inline-item position-relative" v-else>
							<a id="sidebarAccountInvoker" class="btn btn-xs u-btn-text-secondary u-sidebar--account__toggle-bg ml-1" href="javascript:;" role="button"
							   aria-controls="sidebarAccount"
							   aria-haspopup="true"
							   aria-expanded="false"
							   data-unfold-event="click"
							   data-unfold-hide-on-scroll="false"
							   data-unfold-target="#sidebarAccount"
							   data-unfold-type="css-animation"
							   data-unfold-animation-in="fadeInRight"
							   data-unfold-animation-out="fadeOutRight"
							   data-unfold-duration="500">
							  <span class="position-relative">
							    <span class="u-sidebar--account__toggle-text">{{username}}</span>
							    <img class="u-sidebar--account__toggle-img" src="/public/assets/avatar/avatar-100.jpg" alt="">
							  </span>
							</a>

							<aside id="sidebarAccount" class="u-sidebar u-unfold--css-animation u-unfold--hidden" aria-labelledby="sidebarAccountInvoker">
							  <div class="u-sidebar__scroller">
							    <div class="u-sidebar__container">
							      <div class="u-sidebar--account__footer-offset">
							        <div class="d-flex justify-content-between align-items-center pt-4 px-7">
							          <h3 class="h6 mb-0">我的账户</h3>

							          <button type="button" class="close ml-auto"
							                  aria-controls="sidebarAccount"
							                  aria-haspopup="true"
							                  aria-expanded="false"
							                  data-unfold-event="click"
							                  data-unfold-hide-on-scroll="false"
							                  data-unfold-target="#sidebarAccount"
							                  data-unfold-type="css-animation"
							                  data-unfold-animation-in="fadeInRight"
							                  data-unfold-animation-out="fadeOutRight"
							                  data-unfold-duration="500">
							            <span aria-hidden="true">×</span>
							          </button>
							        </div>

							        <div class="js-scrollbar u-sidebar__body">
							          <header class="d-flex align-items-center u-sidebar--account__holder mt-3">
							            <div class="position-relative">
							              <img class="u-sidebar--account__holder-img" src="/public/assets/avatar/avatar-100.jpg" alt="">
							            </div>
							            <div class="ml-3">
							              <strong>{{username}}</strong>
							            </div>

							            <div class="btn-group position-relative ml-auto mb-auto">
							              <a id="sidebar-account-settings-invoker" class="btn btn-xs u-btn--icon u-btn-text-secondary rounded" href="javascript:;" role="button"
							                      aria-controls="sidebar-account-settings"
							                      aria-haspopup="true"
							                      aria-expanded="false"
							                      data-toggle="dropdown"
							                      data-unfold-event="click"
							                      data-unfold-hide-on-scroll="false"
							                      data-unfold-target="#sidebar-account-settings"
							                      data-unfold-type="css-animation"
							                      data-unfold-duration="300"
							                      data-unfold-delay="300"
							                      data-unfold-animation-in="slideInUp"
							                      data-unfold-animation-out="fadeOut">
							              </a>

							              
							            </div>
							          </header>

							          <div class="u-sidebar__content--account">
							            <ul class="list-unstyled u-sidebar--account__list">
							              <li class="u-sidebar--account__list-item">
							                <a class="u-sidebar--account__list-link" href="#">
							                  <span class="fa fa-user-circle u-sidebar--account__list-icon mr-2"></span>
							                  Profile
							                </a>
							              </li>
							              <li class="u-sidebar--account__list-item">
							                <a class="u-sidebar--account__list-link" href="#">
							                  <span class="fa fa-cogs u-sidebar--account__list-icon mr-2"></span>
							                  Settings
							                </a>
							              </li>

							              <li class="u-sidebar--account__list-item">
							                <a class="u-sidebar--account__list-link" href="javascript:void(0);" @click.stop="logout()">
                  							<i class="fa fa-sign-out-alt u-list__link-icon mr-1"></i>
							                  退出
							                </a>
							              </li>

							              
							            </ul>

							          </div>
							        </div>
							      </div>

							    </div>
							  </div>
							</aside>            
						</li>
						<!-- End Account Login -->
	        
	        </ul>

	      </div>
	    </div>
	    <!-- End Topbar -->

	    <div class="container" v-if="logined">
	      <nav class="navbar navbar-expand-md u-header__navbar">
	        <a class="navbar-brand u-header__navbar-brand u-header__navbar-brand-top-space" href="/" aria-label="Front">
	          <!-- <img src="/public/assets/svg/logos/logo.svg" alt="Logo"> -->
	          <img src="/public/images/logo-dark.png" alt="Logo">
	        </a>

	        <button type="button" class="navbar-toggler btn u-hamburger"
	                aria-label="Toggle navigation"
	                aria-expanded="false"
	                aria-controls="navBarBasic"
	                data-toggle="collapse"
	                data-target="#navBarBasic">
	          <span id="hamburgerTrigger" class="u-hamburger__box">
	              <span class="u-hamburger__inner"></span>
	            </span>
	        </button>

	        <div id="navBarBasic" class="collapse navbar-collapse py-0">
	          <ul class="navbar-nav u-header__navbar-nav ml-lg-auto">
	            <li class="nav-item">
	            	<router-link to="/search" class="nav-link u-header__nav-link">
					      	航班预定   
					      </router-link>
	            </li>

	            <li class="nav-item">
	              <router-link to="/orders" class="nav-link u-header__nav-link">
					      	订单   
					      </router-link>
	            </li>

	            <template v-if="isAdmin">
		            <li class="nav-item">
		              <router-link to="/wwopen/departments" class="nav-link u-header__nav-link">
						      	部门   
						      </router-link>
		            </li>
		            <li class="nav-item">
		              <router-link to="/wwopen/users" class="nav-link u-header__nav-link">
						      	成员   
						      </router-link>
		            </li>	            	
	            </template>

	          </ul>
	        </div>
	      </nav>
	    </div>

	  </div>


	</header>
</template>

<script>
	import $ from 'jquery'
	import { logout } from '../api/user.js'
	
	export default {
		computed: {
			logined () { return this.$store.state.logined },
	    username () {
	      return this.$store.state.username
	    },
	    isAdmin () { return this.$store.state.isAdmin }
		},
		mounted: function () {
			// console.log($('#header'))
			$.HSCore.components.HSHeader.init($('#header'));
		},
		updated: function () {
		  this.$nextTick(function () {
		    // Code that will run only after the
		    // entire view has been re-rendered
				$.HSCore.components.HSUnfold.init($('[data-unfold-target]'), {
	        afterOpen: function () {
	          $(this).find('input[type="search"]').focus();
	        }
	      });		    
		  })
		},
		methods: {
	    logout: function () {
	    	logout( v => {
	    		if (v.status === 'OK') {
            this.$store.commit('logout')
            this.$router.push("/wwopen/login")
          }
	    	})
	    }		
		}
	}
</script>