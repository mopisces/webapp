import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export const asyncRouterMap = [
	
];

let routes = [
    {
    	path:'/admin/login',
    	name: 'test',
    	component: resolve => require(['../components/Login.vue'], resolve),
    }
];


let router = new Router({
    routes: routes,
    mode: 'history'
});

export default router;