//公共页面
//登录
const loginSelect            = r => require.ensure([], () => r(require('@/components/login/LoginSelect')), 'loginSelect');
//404
const error404               = r => require.ensure([], () => r(require('@/components/common/404')), 'error404');
const wxScan                 = r => require.ensure([], () => r(require('@/components/common/WxScanRes')), 'wxScan');
//staff权限页面
//布局页面
const staffLayout            = r => require.ensure([], () => r(require('@/components/common/StaffLayout')), 'staffLayout');
//菜单
const indexMenu              = r => require.ensure([], () => r(require('@/components/staff/index/Menu')), 'indexMenu');
//订单试算
const clacIndex              = r => require.ensure([], () => r(require('@/components/staff/calc/Index')), 'clacIndex');
//客户往来统计
const frecCusContact         = r => require.ensure([], () => r(require('@/components/staff/frec/CusContact')), 'frecCusContact');
//收款调账
const frecRecAdjust          = r => require.ensure([], () => r(require('@/components/staff/frec/RecAdjust')), 'frecRecAdjust');
//库存修改
const stockMStockDetailR     = r => require.ensure([], () => r(require('@/components/staff/stock/MStockDetailR')), 'stockMStockDetailR');
//库区面积
const stockDeliveryArea      = r => require.ensure([], () => r(require('@/components/staff/stock/DeliveryArea')), 'stockDeliveryArea');
//安全库存
const paperSafe              = r => require.ensure([], () => r(require('@/components/staff/paper/PaperSafe')), 'paperSafe');
//原纸出库
const paperDoStockOut        = r => require.ensure([], () => r(require('@/components/staff/paper/DoStockOut')), 'paperDoStockOut');
//原纸入库
const paperDoRStockIn        = r => require.ensure([], () => r(require('@/components/staff/paper/DoRStockIn')), 'paperDoRStockIn');
//直接入库
const paperDirectInStock     = r => require.ensure([], () => r(require('@/components/staff/paper/DirectInStock')), 'paperDirectInStock');
//原纸库存
const paperGetSStocks        = r => require.ensure([], () => r(require('@/components/staff/paper/GetSStocks')), 'paperGetSStocks');
//客户信用余额
const credWGetCusAmt         = r => require.ensure([], () => r(require('@/components/staff/cred/WGetCusAmt')), 'credWGetCusAmt');
/*//客户信用余额/详情
const credCusAmtDetail       = r => require.ensure([], () => r(require('@/components/staff/cred/CusAmtDetail')), 'credCusAmtDetail');*/
//扫描装货
const stowLists              = r => require.ensure([], () => r(require('@/components/staff/stow/Lists')), 'stowList');
//扫描装货/详情
const stowDetail             = r => require.ensure([], () => r(require('@/components/staff/stow/Detail')), 'stowDetail');
//生产分析总计
const statisGetProInfo       = r => require.ensure([], () => r(require('@/components/staff/statis/GetProInfo')), 'statisGetProInfo');
//库存统计
const statisGetOrdStock      = r => require.ensure([], () => r(require('@/components/staff/statis/GetOrdStock')), 'statisGetOrdStock');
//订单统计
const statisGetOrderSum      = r => require.ensure([], () => r(require('@/components/staff/statis/GetOrderSum')), 'statisGetOrderSum');
//退货统计
const statisGetOrdReturnSum  = r => require.ensure([], () => r(require('@/components/staff/statis/GetOrdReturnSum')), 'statisGetOrdReturnSum');
//传单统计
const statisGetSchSum        = r => require.ensure([], () => r(require('@/components/staff/statis/GetSchSum')), 'statisGetSchSum');
//ERP订单
const erpGetOrders           = r => require.ensure([], () => r(require('@/components/staff/erp/GetOrders')), 'erpGetOrders');
//原纸收货
const paperbuyWGetPOIn       = r => require.ensure([], () => r(require('@/components/staff/paperbuy/WGetPOIn')), 'paperbuyWGetPOIn');
//原纸采购
const paperbuyWGetPOMain     = r => require.ensure([], () => r(require('@/components/staff/paperbuy/WGetPOMain')), 'paperbuyWGetPOMain');
//每日订单
const dailyWGetCusOrder      = r => require.ensure([], () => r(require('@/components/staff/daily/WGetCusOrder')), 'dailyWGetCusOrder');
//每日订单详细信息
const dailyGetOrdersP        = r => require.ensure([], () => r(require('@/components/staff/daily/GetOrdersP')), 'dailyGetOrdersP');
//用户管理
const userManage             = r => require.ensure([], () => r(require('@/components/staff/user/Manage')), 'userManage');

export const asyncStaffRouterMap = [
    {
        path:'/staff',
        component: staffLayout,
        meta: { title: '内部人员使用' },
        children:[
            {
                path:'index/menu',
                meta: { title: '菜单页面' },
                component: indexMenu,
            },
            {
                path:'calc/index',
                meta: { title: '订单试算' },
                component: clacIndex,
            },
            {
                path:'frec/cusContact',
                meta: { title: '客户往来统计' },
                component: frecCusContact,
            },
            {
                path:'frec/recAdjust',
                meta: { title: '收款调账' },
                component: frecRecAdjust,
            },
            {
                path:'stock/mStockDetailR',
                meta: { title: '库存修改' },
                component: stockMStockDetailR,
            },
            {
                path:'stock/deliveryArea',
                meta: { title: '库区面积' },
                component: stockDeliveryArea,
            },
            {
                path:'paper/paperSafe',
                meta: { title: '安全库存' },
                component: paperSafe,
            },
            {
                path:'paper/doStockOut',
                meta: { title: '原纸出库' },
                component: paperDoStockOut,
            },
            {
                path:'paper/doRStockIn',
                meta: { title: '原纸入库' },
                component: paperDoRStockIn,
            },
            {
                path:'paper/directInStock',
                meta: { title: '直接入库' },
                component: paperDirectInStock,
            },
            {
                path:'paper/getSStocks',
                meta: { title: '原纸库存' },
                component: paperGetSStocks,
            },
            {
                path:'cred/wGetCusAmt',
                meta: { title: '客户信用余额' },
                component: credWGetCusAmt,
            },
            /*{
                path:'cred/cusAmtDetail',
                meta: { title: '客户信用余额/详情' },
                component: credCusAmtDetail,
            },*/
            {
                path:'stow/lists',
                meta: { title: '扫描装货' },
                component: stowLists,
            },
             {
                path:'stow/detail',
                name:'stow/detail',
                meta: { title: '扫描装货/详情' },
                component: stowDetail,
            },
            {
                path:'statis/getProInfo',
                meta: { title: '生产分析总计' },
                component: statisGetProInfo,
            },
            {
                path:'statis/getOrdStock',
                meta: { title: '库存统计' },
                component: statisGetOrdStock,
            },
            {
                path:'statis/getOrderSum',
                meta: { title: '订单统计' },
                component: statisGetOrderSum,
            },
            {
                path:'statis/getOrdReturnSum',
                meta: { title: '退货统计' },
                component: statisGetOrdReturnSum,
            },
            {
                path:'statis/getSchSum',
                meta: { title: '传单统计' },
                component: statisGetSchSum,
            },
            {
                path:'erp/getOrders',
                meta: { title: 'ERP订单' },
                component: erpGetOrders,
            },
            {
                path:'paperbuy/wGetPOIn',
                meta: { title: '原纸收货' },
                component: paperbuyWGetPOIn,
            },
            {
                path:'paperbuy/wGetPOMain',
                meta: { title: '原纸采购' },
                component: paperbuyWGetPOMain,
            },
            {
                path:'daily/wGetCusOrder',
                meta: { title: '客户每日订单' },
                component: dailyWGetCusOrder,
            },
            {
                path:'daily/getOrdersP',
                meta: { title: '客户每日订单详细信息' },
                component: dailyGetOrdersP,
            },
            {
                path:'user/manage',
                meta: { title: '用户管理' },
                component: userManage,
            }
        ]
    }
];

const staff = [
	{
        path : '/common/wxscan',
        component: wxScan,
        meta:{ title: '微信扫一扫' }
    },
];

export default staff;