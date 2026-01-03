//公共页面
//404 微信扫描
const wxScan                 = () => import('@/components/common/WxScanRes');
//staff权限页面
//布局页面
const staffLayout            = () => import('@/components/common/StaffLayout');
//const staffLayout = ()=> import('@/components/layout/staff')
//菜单 @/components/staff/index/Menu
const indexMenu = () => import('@/pages/staff/menu/menu.vue')
//订单试算
const clacIndex              = () => import('@/components/staff/calc/Index');
//客户往来统计 @/components/staff/frec/CusContact
const frecCusContact = () => import('@/pages/staff/customer/cusContact.vue')
//收款调账 @/pages/staff/customer/recAdjust.vue
const frecRecAdjust = () => import('@/components/staff/frec/RecAdjust')
//库存修改
const stockMStockDetailR     = () => import('@/components/staff/stock/MStockDetailR');
//库区面积 @/components/staff/stock/DeliveryArea
const stockDeliveryArea = () => import('@/pages/staff/paper/getDeliArea.vue')
//安全库存 @/components/staff/paper/PaperSafe
const paperSafe = () => import('@/pages/staff/paper/getPaperSafe.vue')
//原纸出库
const paperDoStockOut        = () => import('@/components/staff/paper/DoStockOut');
//原纸日用量 @/components/staff/paper/DailyUsed
const paperDailyUsed = () => import('@/pages/staff/paper/getDailyUsed.vue')
//原纸入库
const paperDoRStockIn        = () => import('@/components/staff/paper/DoRStockIn');
//直接入库
const paperDirectInStock     = () => import('@/components/staff/paper/DirectInStock');
//原纸库存 @/components/staff/paper/GetSStocks
const paperGetSStocks = () => import('@/pages/staff/paper/getPaperStock.vue')
//库存预计
//const getExpectStock         = () => import('@/components/staff/paper/GetExpectStock');
//客户信用余额 @/components/staff/cred/WGetCusAmt
const credWGetCusAmt = () => import('@/pages/staff/customer/getCusAmt.vue')
//扫描装货@/pages/staff/tool/stow/stowList
const stowLists              = () => import('@/components/staff/stow/Lists');
//扫描装货/详情
const stowDetail             = () => import('@/components/staff/stow/Detail');
//生产分析总计 @/components/staff/statis/GetProInfo
const statisGetProInfo = () => import('@/pages/staff/statis/getProInfo.vue');
//生产分析总计2
//const statisGetProInfo2  = () => import('@/components/staff/statis/GetProInfo2');
//库存统计 @/components/staff/statis/GetOrdStock
const statisGetOrdStock = () => import('@/pages/staff/statis/getOrdStock.vue');
//订单统计 @/components/staff/statis/GetOrderSum
const statisGetOrderSum = () => import('@/pages/staff/statis/getOrdSum.vue');
//订单统计2 @/components/staff/statis/GetOrderSum2
const statisGetOrderSum2 = () => import('@/pages/staff/statis/getOrdSum2.vue');
//退货统计 @/components/staff/statis/GetOrdReturnSum
const statisGetOrdReturnSum  = () => import('@/pages/staff/statis/getOrdReturnSum.vue');
//传单统计 @components/staff/statis/GetSchSum
const statisGetSchSum = () => import('@/pages/staff/statis/getSchSum.vue'); 
//统计模块详细列表
const statisDetail = () => import('@/pages/staff/statis/ordDetail.vue')
//ERP订单 @/components/staff/erp/GetOrders
const erpGetOrders = () => import('@/pages/staff/tool/getErpOrder.vue')
//原纸收货 @/components/staff/paperbuy/WGetPOIn
const paperbuyWGetPOIn = () => import('@/pages/staff/paper/getPOIn.vue') 
//原纸采购 @/components/staff/paperbuy/WGetPOMain
const paperbuyWGetPOMain = () => import('@/pages/staff/paper/getPOMain.vue')
//每日订单 @/components/staff/daily/WGetCusOrder
const dailyWGetCusOrder = () => import('@/pages/staff/customer/daily/getDailyOrd.vue')
//每日订单详细信息 @/components/staff/daily/GetOrdersP
const dailyGetOrdersP = () => import('@/pages/staff/customer/daily/getDailyOrdDetail.vue');
//用户管理
const userManage             = () => import('@/components/staff/user/Manage');
//接单统计 @/components/staff/hide/SaleStatis
const saleStatis = () => import('@/pages/staff/statis/saleStatis.vue');
//客户每日送货 @/components/staff/delivery/GetDNMain
const deliveryDaily = () => import('@/pages/staff/customer/delivery/getDeliDaily.vue')
//客户每日送货详情 @/components/staff/delivery/GetCusOrdersList
const deliveryOrdersList = () => import('@/pages/staff/customer/delivery/getDeliDailyDetail.vue');
//报价查询 @/components/staff/quo/customerQuo
const customerQuo = () => import('@/pages/staff/customer/quo/getQuoList.vue')
//报价查询详细页 @/components/staff/quo/QuoDetail
const quoDetail = () => import('@/pages/staff/customer/quo/getQuoDetail.vue')
//客户查询 @/components/staff/customer/CustomerInfo
const customerInfo = () => import('@/pages/staff/customer/custInfo.vue');

export const asyncStaffRouterMap = [
    {
        path:'/staff',
        component: staffLayout,
        meta: { title: '内部人员使用', role:'内部人员使用' },
        children:[
            {
                path:'calc/index',
                meta: { title: '订单试算', role:'订单试算' },
                component: clacIndex,
            },
            {
                path:'frec/cusContact',
                meta: { title: '客户往来统计', role:'客户往来统计' },
                component: frecCusContact,
            },
            {
                path:'frec/recAdjust',
                meta: { title: '收款调账', role:'收款调账' },
                component: frecRecAdjust,
            },
            {
                path:'stock/mStockDetailR',
                meta: { title: '库存修改', role:'库存修改' },
                component: stockMStockDetailR,
            },
            {
                path:'stock/deliveryArea',
                meta: { title: '库区面积', role:'库区面积' },
                component: stockDeliveryArea,
            },
            {
                path:'paper/paperSafe',
                meta: { title: '安全库存', role:'安全库存' },
                component: paperSafe,
            },
            {
                path:'paper/doStockOut',
                meta: { title: '原纸出库', role:'原纸出库' },
                component: paperDoStockOut,
            },
            {
                path:'paper/dailyUsed',
                meta: { title: '原纸日用量', role:'原纸日用量' },
                component: paperDailyUsed,
            },
            {
                path:'paper/doRStockIn',
                meta: { title: '原纸入库', role:'原纸入库' },
                component: paperDoRStockIn,
            },
            {
                path:'paper/directInStock',
                meta: { title: '直接入库', role:'直接入库' },
                component: paperDirectInStock,
            },
            {
                path:'paper/getSStocks',
                meta: { title: '原纸库存', role:'原纸库存' },
                component: paperGetSStocks,
            },
            //{
            //    path:'paper/getExpectStock',
            //    meta: { title: '库存预计', role:'库存预计' },
            //    component: getExpectStock,
            //},
            {
                path:'cred/wGetCusAmt',
                meta: { title: '客户信用余额', role:'客户信用余额' },
                component: credWGetCusAmt,
            },
            {
                path:'stow/lists',
                meta: { title: '扫描装货', role:'扫描装货' },
                component: stowLists,
            },
             {
                path:'stow/detail',
                name:'stow/detail',
                meta: { title: '扫描装货/详情', role:'扫描装货/详情' },
                component: stowDetail,
            },
            {
                path:'statis/getProInfo',
                meta: { title: '生产分析总计', role:'生产分析总计'},
                component: statisGetProInfo,
            },
            //{
            //    path:'statis/getProInfo2',
            //    meta: { title: '生产分析总计2', role:'生产分析总计' },
            //    component: statisGetProInfo2,
            //},
            {
                path:'statis/getOrdStock',
                meta: { title: '库存统计', role:'库存统计' },
                component: statisGetOrdStock,
            },
            {
                path:'statis/getOrderSum',
                meta: { title: '订单统计', role:'订单统计' },
                component: statisGetOrderSum,
            },
            {
                path:'statis/getOrderSum2',
                name: 'getOrderSum2',
                meta: { title: '订单统计2', role:'订单统计2' },
                component: statisGetOrderSum2,
            },
            {
                path:'statis/getOrdReturnSum',
                meta: { title: '退货统计', role:'退货统计' },
                component: statisGetOrdReturnSum,
            },
            {
                path:'statis/getSchSum',
                meta: { title: '传单统计', role:'传单统计' },
                component: statisGetSchSum,
            },
            {
                path:'erp/getOrders',
                meta: { title: 'ERP订单', role:'ERP订单' },
                component: erpGetOrders,
            },
            {
                path:'paperbuy/wGetPOIn',
                meta: { title: '原纸收货', role:'原纸收货' },
                component: paperbuyWGetPOIn,
            },
            {
                path:'paperbuy/wGetPOMain',
                meta: { title: '原纸采购', role:'原纸采购' },
                component: paperbuyWGetPOMain,
            },
            {
                path:'daily/wGetCusOrder',
                meta: { title: '客户每日订单', role:'客户每日订单' },
                component: dailyWGetCusOrder,
            },
            {
                path:'daily/getOrdersP',
                meta: { title: '客户每日订单详细信息', role:'客户每日订单详细信息' },
                component: dailyGetOrdersP,
            },
            {
                path:'user/manage',
                meta: { title: '用户管理', role:'用户管理' },
                component: userManage,
            },
            {
                path:'statis/saleStatis',
                meta: { title: '接单统计', role:'接单统计' },
                component:saleStatis
            },
            {
                path:'delivery/daily',
                meta: { title: '客户每日送货', role:'客户每日送货' },
                component:deliveryDaily
            },
            {
                path:'delivery/getCusOrdersList',
                meta: { title: '客户每日送货详细信息', role:'客户每日送货详细信息' },
                component:deliveryOrdersList
            },
            {
                path:'quo/customerQuo',
                meta: { title: '报价查询', role: '报价查询' },
                component:customerQuo
            },
            {
                path:'quo/quoDetail',
                meta: { title: '报价查询详细', role: '报价查询' },
                component:quoDetail
            },
            {
                path:'customer/customerInfo',
                meta: { title: '客户查询', role:'客户查询' },
                component: customerInfo,
            },
        ]
    }
];

const staff = [
    {
        path:'/staff',
        component: staffLayout,
        meta: { title: '内部人员使用', role:'内部人员使用' },
        children:[
            {
                path:'index/menu',
                meta: { title: '菜单页面', role:'菜单页面' },
                component: indexMenu,
            },
            {
                path: "statis/fetchDetail",
                meta: { title: "统计详情", role: '内部人员使用' },
                component: statisDetail
            }
        ]
    },
	{
        path : '/common/wxscan',
        component: wxScan,
        meta:{ title: '微信扫一扫' }
    },
];

export default staff;