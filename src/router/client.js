//外部用户
//布局页面
const clientLayout     = r => require.ensure([], () => r(require('@/components/common/ClientLayout')), 'clientLayout');
//菜单页面
const menu             = r => require.ensure([], () => r(require('@/components/client/index/Menu')), 'menu');
//信用余额
const wGetCusAmt       = r => require.ensure([], () => r(require('@/components/client/cred/WGetCusAmt')), 'wGetCusAmt');
//报价规则
const getQuoRuleByCus  = r => require.ensure([], () => r(require('@/components/client/quo/GetQuoRuleByCus')), 'getQuoRuleByCus');
//报价价格
const getQuoPriceByCus = r => require.ensure([], () => r(require('@/components/client/quo/GetQuoPriceByCus')), 'getQuoPriceByCus');
//ERP订单
const getOrders        = r => require.ensure([], () => r(require('@/components/client/order/GetOrders')), 'getOrders');
//每日订单
const getOrdersP       = r => require.ensure([], () => r(require('@/components/client/order/GetOrdersP')), 'getOrdersP');
//对账单
const getCusFreeMB     = r => require.ensure([], () => r(require('@/components/client/order/GetCusFreeMB')), 'getCusFreeMB');
//常用材质
const lists            = r => require.ensure([], () => r(require('@/components/client/usedboard/Lists')), 'lists');
const client = [
	{
        path:'/client',
        component: clientLayout,
        meta: { title: '外部人员使用' },
        children:[
            {
                path:'index/menu',
                meta: { title: '菜单页面' },
                component: menu,
            },
            {
                path:'cred/wGetCusAmt',
                meta: { title: '信用余额' },
                component: wGetCusAmt,
            },
            {
                path:'quo/getQuoRuleByCus',
                meta: { title: '报价规则' },
                component: getQuoRuleByCus,
            },
            {
                path:'quo/getQuoPriceByCus',
                meta: { title: '报价价格' },
                component: getQuoPriceByCus,
            },
            {
                path:'order/getOrders',
                meta: { title: 'ERP订单' },
                component: getOrders,
            },
            {
                path:'order/getOrdersP',
                meta: { title: '每日订单' },
                component: getOrdersP,
            },
            {
                path:'order/getCusFreeMB',
                meta: { title: '对账单' },
                component: getCusFreeMB,
            },
            {
                path:'usedboard/lists',
                meta: { title: '常用材质' },
                component: lists,
            }
        ]
    }
];
export default client;