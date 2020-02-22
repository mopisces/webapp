import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import client from './client';
import admin from './admin';
Vue.use(Router);
//公共页面
//团购及未登录页面布局
const indexLayout            = r => require.ensure([], () => r(require('@/components/common/IndexLayout')), 'indexLayout');
//注册页面
const register               = r => require.ensure([], () => r(require('@/components/client/index/Register')), 'register');
//登录
const loginSelect            = r => require.ensure([], () => r(require('@/components/login/LoginSelect')), 'loginSelect');
//员工登陆
const loginStaff             = r => require.ensure([], () => r(require('@/components/login/StaffLogin')), 'loginStaff');
//客户登陆
const loginClient            = r => require.ensure([], () => r(require('@/components/login/ClientLogin')), 'loginClient');
//联系我们
const contact                = r => require.ensure([], () => r(require('@/components/client/index/Contact')), 'contact');
//团购分类页面
const groupIndex             = r => require.ensure([], () => r(require('@/components/group/Index')), 'groupIndex');
//纸板爆款团购列表
const groupBoardFlag         = r => require.ensure([], () => r(require('@/components/group/board/FlagLists')), 'groupBoardFlag');
//纸板团购详情
const groupBoardDetail       = r => require.ensure([], () => r(require('@/components/group/board/Detail')), 'groupBoardDetail');
//简单纸板下单（需要登陆）
const buildS                 = r => require.ensure([], () => r(require('@/components/group/buildboard/S')), 'buildS');
//纸箱纸板下单(需要登陆)
const buildC                 = r => require.ensure([], () => r(require('@/components/group/buildboard/C')), 'buildC');
//404
const error404               = r => require.ensure([], () => r(require('@/components/common/404')), 'error404');
const wxScan                 = r => require.ensure([], () => r(require('@/components/common/WxScanRes')), 'wxScan');

let routes = [
    {
        path : '/group',
        component : indexLayout,
        meta: { title: '团购及未登录' },
        children : [
            {
                path : 'register',
                meta : { title: '注册页面' },
                component: register,
            },
            {
                path : 'login',
                alias: 'login?token=:token',
                meta: { title: '登录选择界面' },
                component: loginSelect,
            },
            {
                path : 'staff/login',
                alias: 'staff/login?token=:token',
                meta: { title: '员工登录' },
                component: loginStaff,
            },
            {
                path : 'client/login',
                alias: 'client/login?token=:token',
                meta: { title: '客户登录' },
                component: loginClient,
            },
            {
                path:'contact',
                meta: { title: '联系我们' },
                component: contact,
            },
            {
                path: 'index',
                meta: { title: '团购分类' },
                component: groupIndex,
            },
            {
                path: 'board/flagLists',
                meta: { title: '纸板爆款团购列表' },
                component: groupBoardFlag,
            },
            {
                path: 'board/detail',
                name: 'boardDetail',
                meta:{ title:'纸板团购详情' },
                component: groupBoardDetail
            },
            {
                path: 'build/s',
                name: 'buildGroupS',
                meta:{ title:'简单纸板下单' },
                component: buildS
            },
            {
                path: 'build/c',
                name: 'buildGroupC',
                meta:{ title:'纸箱纸板下单' },
                component: buildC
            }
            
        ]
    },
    {
        path : '/common/wxscan',
        component: wxScan,
        meta:{ title: '微信扫一扫' }
    },
    {
        path:'*',
        component : error404,
        meta : { title:'您访问的页面不存在' }
    },
    ...client,
    ...admin
];


let router = new Router({
    routes: routes,
    mode: 'history'
});

router.beforeEach((to, from, next) => {
    if( sessionStorage.getItem('auth-url') && store.state.staff.navList == null ){
        store.dispatch('staff/permission', JSON.parse(sessionStorage.getItem('auth-url')));
        router.addRoutes(store.state.staff.navList);
        next({ ...to, replace: true });
    }else if( sessionStorage.getItem('jpdn-client-token') && store.state.client.navList == null ){
        store.dispatch('client/permission');
        router.addRoutes(store.state.client.navList);
        next({ ...to, replace: true });
    }else if( sessionStorage.getItem('jpdn-admin-token') && store.state.admin.navList == null ){
        store.dispatch('admin/permission');
        router.addRoutes(store.state.admin.navList);
        next({ ...to, replace: true });
    }else{
        next();
    }
});

export default router;