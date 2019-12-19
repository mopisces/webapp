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
//常用订单
const orderList        = r => require.ensure([], () => r(require('@/components/client/usedorder/Lists')), 'orderList');
//微信订单
const wxList           = r => require.ensure([], () => r(require('@/components/client/wxorder/Lists')), 'wxList');
//简单纸板下单
const sBuild           = r => require.ensure([], () => r(require('@/components/client/build/S')), 'sBuild');
//纸箱纸板下单
const cBuild           = r => require.ensure([], () => r(require('@/components/client/build/C')), 'cBuild');
//纸箱下单
const xBuild           = r => require.ensure([], () => r(require('@/components/client/build/X')), 'xBuild');


//支付方式
const payWay           = r => require.ensure([], () => r(require('@/components/pay/order/Way')), 'payWay');

/*//团购及未登录页面布局
const indexLayout      = r => require.ensure([], () => r(require('@/components/common/IndexLayout')), 'indexLayout');
//注册页面
const register         = r => require.ensure([], () => r(require('@/components/client/index/Register')), 'register');*/
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
            },
            {
                path:'usedorder/lists',
                meta: { title: '常用订单' },
                component: orderList,
            }
            ,
            {
                path:'wxorder/lists',
                meta: { title: '微信订单' },
                component: wxList,
            },
            {
                path:'build/s',
                name: 'sBuild',
                meta: { title: '简单纸板下单' },
                component: sBuild,
            },
            {
                path:'build/c',
                name: 'cBuild',
                meta: { title: '纸箱纸板下单' },
                component: cBuild,
            },
            {
                path:'build/x',
                name: 'xBuild',
                meta: { title: '纸箱下单' },
                component: xBuild,
            }

            ,
            {
                path:'pay/way',
                name: 'payWay',
                meta: { title: '支付方式' },
                component: payWay,
            }
        ]
    }
];
export default client;