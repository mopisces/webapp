import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export const asyncRouterMap = [
	
];

let routes = [
    {
    	path:'/all/login',
    	name: 'login',
    	component: resolve => require(['../components/pages/LoginAll.vue'], resolve),
    },
    {
        path:'/diff/login',
        name: 'loginCommon',
        component: resolve => require(['../components/pages/LoginDiff.vue'], resolve),
    },
    {
    	path:'/index',
    	name:'index',
    	component: resolve => require(['../components/pages/Index.vue'], resolve),
    }
];


let router = new Router({
    routes: routes,
    mode: 'history'
});

export default router;