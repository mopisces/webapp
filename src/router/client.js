//外部用户
//布局页面
const clientLayout     = () => import('@/components/common/ClientLayout');
//菜单页面
const menu             = () => import('@/components/client/index/Menu');
//信用余额
const wGetCusAmt       = () => import('@/components/client/cred/WGetCusAmt');
//报价规则
const getQuoRuleByCus  = () => import('@/components/client/quo/GetQuoRuleByCus');
//报价价格
const getQuoPriceByCus = () => import('@/components/client/quo/GetQuoPriceByCus');
//ERP订单
const getOrders        = () => import('@/components/client/order/GetOrders');
//每日订单
const getOrdersP       = () => import('@/components/client/order/GetOrdersP');
//每日送货
const deliveryDaily    = () => import('@/components/client/delivery/Index');
//对账单
const getCusFreeMB     = () => import('@/components/client/order/GetCusFreeMB');
//对账单明细
//const cusFreeMBTable     = () => import('@/components/client/order/CusFreeMBTable');
//常用材质
const lists            = () => import('@/components/client/usedboard/Lists');
//常用订单
const orderList        = () => import('@/components/client/usedorder/Lists');
//微信订单
const wxList           = () => import('@/components/client/wxorder/Lists');
//简单纸板下单
const sBuild           = () => import('@/components/client/build/S');
//纸箱纸板下单
const cBuild           = () => import('@/components/client/build/C');
//纸箱下单
const xBuild           = () => import('@/components/client/build/X');
//支付方式
const payWay           = () => import('@/components/pay/order/Way');
//支付详细信息
const payDetail        = () => import('@/components/pay/order/Detail');
//申请退款
const payApply         = () => import('@/components/pay/order/Apply');
//支付宝支付页面
const aliPay           = () => import('@/components/pay/order/AliPay');
//支付宝returnUrl
const aliReturnUrl     = () => import('@/components/pay/order/AliReturn');
//简单纸板下单并支付
const sBuildPay        = () => import('@/components/client/buildpay/S');
//纸箱纸板下单并支付
const cBuildPay        = () => import('@/components/client/buildpay/C');
export const asyncClientRouterMap = [
    {
        path:'/client',
        component: clientLayout,
        meta: { title: '外部人员使用', role:'外部人员使用' },
        children:[
            {
                path:'cred/wGetCusAmt',
                meta: { title: '信用余额', role:'信用余额' },
                component: wGetCusAmt,
            },
            {
                path:'quo/getQuoRuleByCus',
                meta: { title: '报价规则', role:'报价查询' },
                component: getQuoRuleByCus,
            },
            {
                path:'quo/getQuoPriceByCus',
                meta: { title: '报价价格', role:'报价查询' },
                component: getQuoPriceByCus,
            },
            {
                path:'order/getOrders',
                meta: { title: 'ERP订单', role:'ERP订单' },
                component: getOrders,
            },
            {
                path:'order/getOrdersP',
                meta: { title: '每日订单', role:'每日订单' },
                component: getOrdersP,
            },
            {
                path:'order/getCusFreeMB',
                meta: { title: '对账单', role:'对账单' },
                component: getCusFreeMB,
            },
            /*{
                path:'order/cusFreeMBTable',
                meta: { title: '对账单明细', role:'对账单2' },
                component: cusFreeMBTable,
            },*/
            {
                path:'usedboard/lists',
                meta: { title: '常用材质', role:'纸板下单' },
                component: lists,
            },
            {
                path:'usedorder/lists',
                meta: { title: '常用订单', role:'纸板下单' },
                component: orderList,
            },
            {
                path:'build/s',
                name: 'sBuild',
                meta: { title: '简单纸板下单', role:'纸板下单' },
                component: sBuild,
            },
            {
                path:'build/c',
                name: 'cBuild',
                meta: { title: '纸箱纸板下单', role:'纸板下单' },
                component: cBuild,
            },
            {
                path:'build/x',
                name: 'xBuild',
                meta: { title: '纸箱下单', role:'纸箱下单' },
                component: xBuild,
            },
            {
                path:'wxorder/lists',
                meta: { title: '微信订单', role:'微信订单' },
                component: wxList,
            },
            {
                path:'delivery/daily',
                meta: { title: '每日送货', role:'每日送货' },
                component: deliveryDaily,
            },
            {
                path:'buildpay/s',
                name: 'sBuildPay',
                meta: { title: '简单纸板下单', role:'纸板支付下单' },
                component: sBuildPay,
            },
            {
                path:'buildpay/c',
                name: 'cBuildPay',
                meta: { title: '纸箱纸板下单', role:'纸板支付下单' },
                component: cBuildPay,
            }
        ]
    }
];

const client = [
    {
        path:'/client',
        component: clientLayout,
        meta: { title: '外部人员使用' },
        children:[
            {
                path:'index/menu',
                meta: { title: '菜单页面', role: '菜单页面' },
                component: menu,
            },
            {
                path:'pay/way',
                name: 'payWay',
                meta: { title: '支付方式', role:'支付方式' },
                component: payWay,
            },
            {
                path:'pay/detail',
                name: 'payDetail',
                meta: { title: '支付完成', role:'支付完成' },
                component: payDetail,
            },
            {
                path:'pay/apply',
                name: 'payApply',
                meta: { title: '申请退款', role:'申请退款' },
                component: payApply,
            },
            {
                path:'alipay/index',
                meta: { title: '支付宝支付页面', role:'支付宝支付页面' },
                name: 'alipay',
                component: aliPay,
            },
            {
                path:'alipay/return',
                meta: { title: '支付宝跳转页面', role:'支付宝跳转页面' },
                component: aliReturnUrl,
            }
        ]
    }
];
export default client;