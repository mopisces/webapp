//生管登陆页面
const sgLogin  = () => import('@/components/login/SgLogin');
//生管模块布局
const sgLayout = () => import('@/components/sg/SgLayout');
//菜单页面
const menu     = () => import('@/components/sg/index/Menu');
//备料页面
const bl       = () => import('@/components/sg/select/BL');
//备料查看页面
const blms     = () => import('@/components/sg/select/BLMS');
//生产订单页面
const scdd     = () => import('@/components/sg/select/SCDD');
//完工订单页面
const wgdd     = () => import('@/components/sg/select/WGDD');
//生管监控页面
const webSocket = () => import('@/components/sg/monitor/WebSocket');
//修改
const alter    = () => import('@/components/sg/alter/Index');
//用户管理
const user     = () => import('@/components/sg/user/Index');
//生产进度
const statistic = () => import('@/components/sg/statistic/Index');
const sg = [
    {
        path:'/sg/login',
        component: sgLogin,
        name:'sgLogin',
        meta: { title: '生管监控登陆' }
    },
    {
        path:'/sg',
        component: sgLayout,
        meta: { title: '生管监控', sgLogin:true },
        children:[
            {
                path : 'select/bl',
                meta : { title: '备料', sgLogin:true },
                component: bl,
            },
            {
                path : 'select/blms',
                meta : { title: '备料查看', sgLogin:true },
                component: blms,
            },
            {
                path : 'select/scdd',
                meta : { title: '生产订单', sgLogin:true },
                component: scdd,
            },
            {
                path : 'select/wgdd',
                meta : { title: '完工订单', sgLogin:true },
                component: wgdd,
            },
            {
                path : 'monitor/websocket',
                meta : { title: '生管监控', sgLogin:true },
                component: webSocket,
            },
            {
                path : 'menu/index',
                meta : { title: '菜单页面', sgLogin:true },
                component: menu,
            },
            {
                path : 'user/index',
                meta : { title: '用户管理', sgLogin:true },
                component: user,
            },
            {
                path : 'alter/index',
                meta : { title: '菜单页面', sgLogin:true },
                component: alter,
            },
            {
                path : 'statistic/index',
                meta : { title: '生产进度', sgLogin:true },
                component: statistic,
            }
        ]
    }
]; 
export default sg;