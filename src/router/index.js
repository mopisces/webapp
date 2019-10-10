import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export const asyncRouterMap = [
	
];

let routes = [
    {
        path:'/entrance',
        component: resolve => require(['../components/pages/login/LoginHeader.vue'], resolve),
        meta: { title: '登录公共头部' },
        children:[
            {
                path:'login/site',
                meta: { title: '登录入口' },
                component: resolve => require(['../components/pages/login/LoginSite.vue'], resolve),
            },
            {
                path:'login/exact',
                meta: { title: '具体登录' },
                component: resolve => require(['../components/pages/login/LoginExact.vue'], resolve),
            }
        ]
    },
    {
        path:'/staff',
        component: resolve => require(['../components/common/StaffLayout.vue'], resolve),
        meta: { title: '内部人员使用' },
        children:[
            {
                path:'calc/index',
                meta: { title: '登录入口' },
                component: resolve => require(['../components/staff/calc/Index.vue'], resolve),
            }
        ]
    },
    {
    	path:'/index',
    	name:'index',
    	component: resolve => require(['../components/pages/home/HomeNew.vue'], resolve),
    }
];


let router = new Router({
    routes: routes,
    mode: 'history'
});

export default router;