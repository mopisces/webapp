//公共页面
//404 微信扫描
const wxScan                 = () => import('@/components/common/WxScanRes');
//staff权限页面
//布局页面
const staffLayout            = () => import('@/components/common/StaffLayout');
//菜单
const indexMenu              = () => import('@/components/staff/index/Menu');
//订单试算
const clacIndex              = () => import('@/components/staff/calc/Index');
//客户往来统计
const frecCusContact         = () => import('@/components/staff/frec/CusContact');
//收款调账
const frecRecAdjust          = () => import('@/components/staff/frec/RecAdjust');
//库存修改
const stockMStockDetailR     = () => import('@/components/staff/stock/MStockDetailR');
//库区面积
const stockDeliveryArea      = () => import('@/components/staff/stock/DeliveryArea');
//安全库存
const paperSafe              = () => import('@/components/staff/paper/PaperSafe');
//原纸出库
const paperDoStockOut        = () => import('@/components/staff/paper/DoStockOut');
//原纸入库
const paperDoRStockIn        = () => import('@/components/staff/paper/DoRStockIn');
//直接入库
const paperDirectInStock     = () => import('@/components/staff/paper/DirectInStock');
//原纸库存
const paperGetSStocks        = () => import('@/components/staff/paper/GetSStocks');
//客户信用余额
const credWGetCusAmt         = () => import('@/components/staff/cred/WGetCusAmt');
/*//客户信用余额/详情
const credCusAmtDetail       = r => require.ensure([], () => r(require('@/components/staff/cred/CusAmtDetail')), 'credCusAmtDetail');*/
//扫描装货
const stowLists              = () => import('@/components/staff/stow/Lists');
//扫描装货/详情
const stowDetail             = () => import('@/components/staff/stow/Detail');
//生产分析总计
const statisGetProInfo       = () => import('@/components/staff/statis/GetProInfo');
//库存统计
const statisGetOrdStock      = () => import('@/components/staff/statis/GetOrdStock');
//订单统计
const statisGetOrderSum      = () => import('@/components/staff/statis/GetOrderSum');
//退货统计
const statisGetOrdReturnSum  = () => import('@/components/staff/statis/GetOrdReturnSum');
//传单统计
const statisGetSchSum        = () => import('@/components/staff/statis/GetSchSum');
//ERP订单
const erpGetOrders           = () => import('@/components/staff/erp/GetOrders');
//原纸收货
const paperbuyWGetPOIn       = () => import('@/components/staff/paperbuy/WGetPOIn');
//原纸采购
const paperbuyWGetPOMain     = () => import('@/components/staff/paperbuy/WGetPOMain');
//每日订单
const dailyWGetCusOrder      = () => import('@/components/staff/daily/WGetCusOrder');
//每日订单详细信息
const dailyGetOrdersP        = () => import('@/components/staff/daily/GetOrdersP');
//用户管理
const userManage             = () => import('@/components/staff/user/Manage');

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