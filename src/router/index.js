import store from '@/store';
import { getStorage } from '@/util/storage';
import staff from './staff';
import client from './client';
import admin from './admin';
import group from './group';
/*import amap from './amap';*/
Vue.use(VueRouter);
//404
const error404    = () => import('@/components/common/404');
/*微信授权生成二维码*/
const wxQrCode    = () => import('@/components/login/WxQrCode');
/*授权登陆界面*/
const login       = () => import('@/components/login/Login');
/*审核绑定页面*/
const check       = () => import('@/components/common/Check');
/*库区剩余*/
const areaChart   = () => import('@/components/echart/Area');
/*登陆页面*/
const indexLayout = () => import('@/components/common/ClientLayout');
//注册页面
const register    = () => import('@/components/client/index/Register');
//员工登陆
const loginStaff  = () => import('@/components/login/StaffLogin');
//客户登陆
const loginClient = () => import('@/components/login/ClientLogin');
//联系我们
const contact     = () => import('@/components/client/index/Contact');
//测试扫码
const scanCode = () => import('@/components/common/ScanCodePage');
let routes = [
    {
        path : '/group',
        component : indexLayout,
        meta: { title: '团购及未登录' },
        children :[
            {
                path : 'register',
                meta : { title: '注册页面', isGroup:true },
                component: register,
            },
            {
                path : 'staff/login',
                alias: 'staff/login?token=:token',
                name : 'staffLogin',
                meta: { title: '员工登录', role:'员工登录', isGroup:true },
                component: loginStaff,
            },
            {
                path : 'client/login',
                alias: 'client/login?token=:token',
                name : 'clientLogin',
                meta: { title: '客户登录', role:'客户登录', isGroup:true },
                component: loginClient,
            },
            {
                path:'contact',
                meta: { title: '联系我们', role:'联系我们', isGroup:true },
                component: contact,
            }
        ]
    },
    {
        path:'/echart/area',
        component: areaChart,
        meta:{ title: '库区剩余' }
    },
    {
        path : '/login/index',
        component: login,
        meta:{ title: '新登陆接口' }
    },
    {
        path:'/common/verify',
        component:check,
        meta:{ title: '审核绑定' }
    },
    {
        path : '/login/wxQrCode',
        component: wxQrCode,
        meta:{ title: '微信授权生成二维码登陆' }
    },
    {
        path : '/common/scanCode',
        component: scanCode,
        meta:{ title: '扫描二维码/条形码' }
    },
    ...staff,
    ...client,
    ...admin,
    ...group,
    //...amap,
    {
        path:'*',
        component : error404,
        meta : { title:'您访问的页面不存在' }
    },
];


let router = new VueRouter({
    routes: routes,
    mode: 'history'
});

router.beforeEach((to, from, next) => {
    if( to.name != 'staffLogin' || to.name != 'clientLogin' ){
        if( getStorage('jpdn-login-type') == 'client' ){
            store.commit('client/setIsLogin',getStorage('jpdn-client-isLogin', 'sessionStorage') == 1 ? true : false);
        }
        if( getStorage('jpdn-login-type') == 'staff' ){
            store.commit('staff/setIsLogin',getStorage('jpdn-staff-isLogin', 'sessionStorage') == 1 ? true : false);
        }
        //store.commit('staff/setIsLogin',getStorage('jpdn-staff-isLogin'));
    }
    window.scrollTo(0,0);
    
    if( to.meta.title ){
        document.title = to.meta.title;
    }
    if( to.meta.isGroup ){
        store.commit('client/setTabbarActive','group');
    }else{
        store.commit('client/setTabbarActive','menu');
    }
    if( to.meta.needLogin && ( !getStorage('jpdn-client-isLogin', 'sessionStorage') && to.params ) ){
        next({
            replace:true,
            name:'clientLogin',
            params:Object.assign(to.params,{redirectName:to.name})
        });
    }else if( store.state.staff.isLogin && getStorage('staff-auth-url') && store.state.staff.navList == null ){
        store.dispatch('staff/permission', JSON.parse(getStorage('staff-auth-url')));
        router.addRoutes(store.state.staff.navList);
        next({ ...to, replace: true });
    }else if( store.state.client.isLogin &&getStorage('client-auth-url') && store.state.client.navList == null ){
        store.dispatch('client/permission', JSON.parse(getStorage('client-auth-url')));
        router.addRoutes(store.state.client.navList);
        next({ ...to, replace: true });
    }else if( getStorage('jpdn-admin-token', 'sessionStorage') && store.state.admin.navList == null ){
        store.dispatch('admin/permission');
        router.addRoutes(store.state.admin.navList);
        next({ ...to, replace: true });
    }else{
        next();
    }
});

export default router;