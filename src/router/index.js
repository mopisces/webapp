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
                path:'index/menu',
                meta: { title: '菜单页面' },
                component: resolve => require(['../components/staff/index/Menu.vue'], resolve),
            },
            {
                path:'calc/index',
                meta: { title: '订单试算' },
                component: resolve => require(['../components/staff/calc/Index.vue'], resolve),
            },
            {
                path:'frec/cusContact',
                meta: { title: '订单试算' },
                component: resolve => require(['../components/staff/frec/CusContact.vue'], resolve),
            },
            {
                path:'frec/recAdjust',
                meta: { title: '收款调账' },
                component: resolve => require(['../components/staff/frec/RecAdjust.vue'], resolve),
            },
            {
                path:'stock/deliveryArea',
                meta: { title: '库区面积' },
                component: resolve => require(['../components/staff/stock/DeliveryArea.vue'], resolve),
            },
            {
                path:'paper/paperSafe',
                meta: { title: '安全库存' },
                component: resolve => require(['../components/staff/paper/PaperSafe.vue'], resolve),
            },
            {
                path:'paper/doStockOut',
                meta: { title: '原纸出库' },
                component: resolve => require(['../components/staff/paper/DoStockOut.vue'], resolve),
            },
            {
                path:'paper/doRStockIn',
                meta: { title: '原纸入库' },
                component: resolve => require(['../components/staff/paper/DoRStockIn.vue'], resolve),
            },
            {
                path:'paper/directInStock',
                meta: { title: '直接入库' },
                component: resolve => require(['../components/staff/paper/DirectInStock.vue'], resolve),
            },
            {
                path:'paper/getSStocks',
                meta: { title: '原纸库存' },
                component: resolve => require(['../components/staff/paper/GetSStocks.vue'], resolve),
            },
            {
                path:'cred/wGetCusAmt',
                meta: { title: '客户信用余额' },
                component: resolve => require(['../components/staff/cred/WGetCusAmt.vue'], resolve),
            },
            {
                path:'cred/cusAmtDetail',
                meta: { title: '客户信用余额/详情' },
                component: resolve => require(['../components/staff/cred/CusAmtDetail.vue'], resolve),
            },
            {
                path:'stow/lists',
                meta: { title: '扫描装货' },
                component: resolve => require(['../components/staff/stow/Lists.vue'], resolve),
            },
            {
                path:'statis/getProInfo',
                meta: { title: '生产分析总计' },
                component: resolve => require(['../components/staff/statis/GetProInfo.vue'], resolve),
            },
            {
                path:'statis/getOrdStock',
                meta: { title: '库存统计' },
                component: resolve => require(['../components/staff/statis/GetOrdStock.vue'], resolve),
            },
            {
                path:'erp/getOrders',
                meta: { title: 'ERP订单' },
                component: resolve => require(['../components/staff/erp/GetOrders.vue'], resolve),
            },
            {
                path:'paperbuy/wGetPOIn',
                meta: { title: '原纸收货' },
                component: resolve => require(['../components/staff/paperbuy/WGetPOIn.vue'], resolve),
            },
            {
                path:'paperbuy/wGetPOMain',
                meta: { title: '原纸采购' },
                component: resolve => require(['../components/staff/paperbuy/wGetPOMain.vue'], resolve),
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