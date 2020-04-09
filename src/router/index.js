import store from '@/store';
import staff from './staff';
import client from './client';
import admin from './admin';
import sg from './sg';
import group from './group';
Vue.use(VueRouter);
//404
const error404 = () => import('@/components/common/404');
const wxScan   = () => import('@/components/common/WxScanRes');

let routes = [
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
    if( to.meta.title ){
        document.title = to.meta.title;
    }
    if( sessionStorage.getItem('staff-auth-url') && store.state.staff.navList == null ){
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