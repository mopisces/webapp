import store from '@/store';
import staff from './staff';
import client from './client';
import admin from './admin';
import sg from './sg';
import group from './group';
import { groupCheck } from '@/util';
Vue.use(VueRouter);
//404
const error404 = () => import('@/components/common/404');
const wxScan   = () => import('@/components/common/WxScanRes');
const wxQrCode = () => import('@/components/login/WxQrCode');
const wxAuthLogin = () => import('@/components/login/WxAuthLogin');
const login = () => import('@/components/login/Login');
let routes = [
    {
        path : '/login/index',
        component: login,
        meta:{ title: '新登陆接口' }
    },
    {
        path : '/login/wxQrCode',
        component: wxQrCode,
        meta:{ title: '微信授权生成二维码登陆' }
    },
    {
        path : '/login/wxAuthLogin',
        component: wxAuthLogin,
        meta:{ title: '微信授权登陆' }
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
    ...staff,
    ...client,
    ...admin,
    ...sg,
    ...group
];


let router = new VueRouter({
    routes: routes,
    mode: 'history'
});

router.beforeEach((to, from, next) => {
    store.commit('client/setIsLogin',sessionStorage.getItem('jpdn-client-isLogin'));
    window,scrollTo(0,0);
    if( to.meta.title ){
        document.title = to.meta.title;
    }
    if( to.meta.isGroup ){
        store.commit('client/setTabbarActive','group');
    }else{
        store.commit('client/setTabbarActive','menu');
    }
    if( to.meta.needLogin && ( !sessionStorage.getItem('jpdn-client-isLogin') && to.params ) ){
        next({
            replace:true,
            name:'clientLogin',
            params:Object.assign(to.params,{redirectName:to.name})
        });
    }else if( sessionStorage.getItem('staff-auth-url') && store.state.staff.navList == null ){
        store.dispatch('staff/permission', JSON.parse(sessionStorage.getItem('staff-auth-url')));
        router.addRoutes(store.state.staff.navList);
        next({ ...to, replace: true });
    }else if( sessionStorage.getItem('client-auth-url') && store.state.client.navList == null ){
        store.dispatch('client/permission', JSON.parse(sessionStorage.getItem('client-auth-url')));
        router.addRoutes(store.state.client.navList);
        next({ ...to, replace: true });
    }else if( sessionStorage.getItem('jpdn-admin-token') && store.state.admin.navList == null ){
        store.dispatch('admin/permission');
        router.addRoutes(store.state.admin.navList);
        next({ ...to, replace: true });
    }else if( sessionStorage.getItem('jpdn-sg-token') && store.state.sg.navList == null ){
        store.dispatch('sg/permission');
        router.addRoutes(store.state.sg.navList);
        next({ ...to, replace: true });
    }else{
        next();
    }
});

export default router;