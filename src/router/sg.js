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
export const asyncSgRouterMap = [

];

const sg = [
    {
        path:'/sg/login',
        component: sgLogin,
        meta: { title: '生管监控登陆' }
    },
    {
        path:'/sg',
        component: sgLayout,
        meta: { title: '生管监控', role:'生管监控' },
        children:[
            {
                path : 'menu',
                meta : { title: '菜单页面', role:'菜单页面' },
                component: menu,
            },
            {
                path : 'select/bl',
                meta : { title: '备料', role:'备料' },
                component: bl,
            },
            {
                path : 'select/blms',
                meta : { title: '备料查看', role:'备料查看' },
                component: blms,
            },
            {
                path : 'select/scdd',
                meta : { title: '生产订单', role:'生产订单' },
                component: scdd,
            },
            {
                path : 'select/wgdd',
                meta : { title: '完工订单', role:'完工订单' },
                component: wgdd,
            },
            {
                path : 'monitor/websocket',
                meta : { title: '生管监控', role:'生管监控' },
                component: webSocket,
            },
            {
                path : 'alter/index',
                meta : { title: '修改', role:'修改' },
                component: alter,
            }
        ]
    }
]; 
export default sg;