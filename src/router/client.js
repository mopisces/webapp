//外部用户
//布局页面
const clientLayout     = () => import('@/components/common/ClientLayout');
//菜单页面 @/components/client/index/Menu
const menu = () => import('@/pages/client/menu/menu.vue');
//信用余额 @/components/client/cred/WGetCusAmt
const wGetCusAmt = () => import('@/pages/client/cred/getCusAmt.vue')
//信用余额详情 @/components/client/cred/WGetCusDetail
const wGetCusDetail    = () => import('@/pages/client/cred/getCusDetail.vue')
//报价规则 @/components/client/quo/GetQuoRuleByCus
const getQuoRuleByCus  = () => import('@/pages/client/quo/getQuoRuleByCus.vue')
//报价价格 @/components/client/quo/GetQuoPriceByCus
const getQuoPriceByCus = () => import('@/pages/client/quo/getQuoPriceByCus.vue')
//ERP订单 @/components/client/order/GetOrders
const getOrders = () => import('@/pages/client/getErpOrdList.vue')
//每日订单 @/components/client/order/GetOrdersP
const getOrdersP = () => import('@/pages/client/getDailyOrd.vue')
//每日送货 @/components/client/delivery/Index
const deliveryDaily = () => import('@/pages/client/getDeliOrd.vue')
//对账单 @/components/client/order/GetCusFreeMB
const getCusFreeMB = () => import('@/pages/client/getCusFreeMB.vue')
//对账单明细
//const cusFreeMBTable     = () => import('@/components/client/order/CusFreeMBTable');
//常用材质 @/components/client/usedboard/Lists
const lists = () => import('@/pages/client/commonly/getMat.vue');
//常用订单 @/components/client/usedorder/Lists
const orderList = () => import('@/pages/client/commonly/getOrd.vue');
//微信订单 @/components/client/wxorder/Lists
const wxList = () => import('@/pages/client/wxOrd/getWxOrdList.vue');
//简单纸板下单
const sBuild = () => import('@/components/client/build/SBuild');
//纸箱纸板下单 @/pages/client/build/buildC.vue
const cBuild = () => import('@/components/client/build/CBuild');
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
//往来统计 @/components/client/frec/statisContact 
const statisContact = () => import('@/pages/client/getStatisContact.vue')
//发票中心 @/components/client/bill/BillCenter
const billCenter = () => import('@/pages/client/bill/getBillCenter.vue')
//订单统计 @/components/client/statis/AmountStatis @/pages/cleint/statis/amountStatis.vue
const amountStatis = ()=> import('@/pages/client/statis/amountStatis.vue');
//余额流水 @/components/client/statement/BalStatement
const balStatement = ()=> import('@/pages/client/cred/balStatement.vue');

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
                path:'cred/wGetCusDetail',
                meta: { title: '客户信用余额明细2', role:'客户信用余额明细' },
                component: wGetCusDetail,
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
            //{
            //    path:'order/cusFreeMBTable',
            //    meta: { title: '对账单明细', role:'对账单2' },
            //    component: cusFreeMBTable,
            //},
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
            },
            {
                path:'frec/statisContact',
                name: 'statisContact',
                meta: { title: '往来统计', role:'往来统计' },
                component: statisContact,
            },
            {
                path:'bill/billCenter',
                name: 'billCenter',
                meta: { title: '开票信息', role:'开票信息' },
                component: billCenter,
            },
            {
                path:'statis/amountStatis',
                name: 'amountStatis',
                meta: { title: '订单统计', role:'订单统计' },
                component: amountStatis,
            },
            {
                path:'statement/balStatement',
                name: 'balStatement',
                meta: { title: '客户信用余额明细', role:'客户信用余额明细' },
                component: balStatement,
            },
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