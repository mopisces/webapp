import store from '@/store';
import staff from './staff';
import client from './client';
import admin from './admin';
/*import sg from './sg';*/
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
    ...staff,
    ...client,
    ...admin,
    /*...sg,*/
    ...group,
    /*...amap,*/
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
    store.commit('client/setIsLogin',sessionStorage.getItem('jpdn-client-isLogin'));
    window.scrollTo(0,0);
    if( to.meta.title ){
        document.title = to.meta.title;
    }
    if( to.meta.isGroup ){
        store.commit('client/setTabbarActive','group');
    }else{
        store.commit('client/setTabbarActive','menu');
    }
    if( to.meta.sgLogin && ( !sessionStorage.getItem('jpdn-sg-token') ) ){
        next({
            replace:true,
            name:'sgLogin',
        });
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
    }else{
        next();
    }
});

export default router;