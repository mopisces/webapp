import store from '@/store';
//生管模块布局
const sgLayout = r => require.ensure([], () => r(require('@/components/sg/SgLayout')), 'SgLayout');
//菜单页面
const menu     = r => require.ensure([], () => r(require('@/components/sg/index/Menu')), 'menu');
//备料页面
const bl       = r => require.ensure([], () => r(require('@/components/sg/select/BL')), 'bl');
//备料查看页面
const blms     = r => require.ensure([], () => r(require('@/components/sg/select/BLMS')), 'blms');
//生产订单页面
const scdd     = r => require.ensure([], () => r(require('@/components/sg/select/SCDD')), 'scdd');
//完工订单页面
const wgdd     = r => require.ensure([], () => r(require('@/components/sg/select/WGDD')), 'wgdd');
//生管监控页面
const webSocket = r => require.ensure([], () => r(require('@/components/sg/monitor/WebSocket')), 'webSocket');
const sg = [
    {
        path:'/sg',
        component: sgLayout,
        meta: { title: '生管监控' },
        children:[
            {
                path : 'menu',
                meta : { title: '菜单页面' },
                component: menu,
            },
        	{
        		path : 'select/bl',
                meta : { title: '备料' },
                component: bl,
        	},
            {
                path : 'select/blms',
                meta : { title: '备料查看' },
                component: blms,
            },
            {
                path : 'select/scdd',
                meta : { title: '生产订单' },
                component: scdd,
            },
            {
                path : 'select/wgdd',
                meta : { title: '完工订单' },
                component: wgdd,
            },
            {
                path : 'monitor/websocket',
                meta : { title: '生管监控' },
                component: webSocket,
            }
        ]
    }
]; 
export default sg;