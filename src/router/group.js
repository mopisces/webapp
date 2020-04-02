const indexLayout      = () => import('@/components/common/ClientLayout');
//注册页面
const register         = () => import('@/components/client/index/Register');
//员工登陆
const loginStaff       = () => import('@/components/login/StaffLogin');
//客户登陆
const loginClient      = () => import('@/components/login/ClientLogin');
//联系我们
const contact          = () => import('@/components/client/index/Contact');
//团购分类页面
const groupIndex       = () => import('@/components/group/Index');
//纸板爆款团购列表
const groupBoardFlag   = () => import('@/components/group/board/FlagLists');
//纸板团购列表
const groupBoardLists  = () => import('@/components/group/board/Lists');
//纸板团购详情
const groupBoardDetail = () => import('@/components/group/board/Detail');
//简单纸板下单（需要登陆）
const buildS           = () => import('@/components/group/buildboard/S');
//纸箱纸板下单(需要登陆)
const buildC           = () => import('@/components/group/buildboard/C');
//淘宝箱精品列表
const groupBoxFlag     = () => import('@/components/group/box/FlagLists');
//淘宝箱团购列表
const groupBoxLists    = () => import('@/components/group/box/Lists');
//淘宝箱团购详情
const groupBoxDetail   = () => import('@/components/group/box/Detail');
//淘宝箱下单(需要登陆)
const buildT           = () => import('@/components/group/buildbox/T');
//404
const error404         = () => import('@/components/common/404');
const wxScan           = () => import('@/components/common/WxScanRes');
const group = [
	    {
        path : '/group',
        component : indexLayout,
        meta: { title: '团购及未登录' },
        children : [
            {
                path : 'register',
                meta : { title: '注册页面' },
                component: register,
            },
            {
                path : 'staff/login',
                alias: 'staff/login?token=:token',
                meta: { title: '员工登录', role:'员工登录' },
                component: loginStaff,
            },
            {
                path : 'client/login',
                alias: 'client/login?token=:token',
                name : 'clientLogin',
                meta: { title: '客户登录', role:'客户登录' },
                component: loginClient,
            },
            {
                path:'contact',
                meta: { title: '联系我们', role:'联系我们' },
                component: contact,
            },
            {
                path: 'index',
                meta: { title: '团购分类', role:'团购分类' },
                component: groupIndex,
            },
            {
                path: 'board/lists',
                meta: { title: '纸板团购列表', role:'纸板团购列表' },
                component: groupBoardLists,
            },
            {
                path: 'board/flagLists',
                meta: { title: '纸板爆款团购列表', role:'纸板爆款团购列表' },
                component: groupBoardFlag,
            },
            {
                path: 'board/detail',
                name: 'boardDetail',
                meta:{ title:'纸板团购详情', role:'纸板团购详情' },
                component: groupBoardDetail
            },
            {
                path: 'build/s',
                name: 'buildGroupS',
                meta:{ title:'简单纸板下单', role:'简单纸板下单' },
                component: buildS
            },
            {
                path: 'box/lists',
                meta: { title: '淘宝箱团购列表', role:'淘宝箱团购列表' },
                component: groupBoxLists,
            },
            {
                path: 'build/c',
                name: 'buildGroupC',
                meta:{ title:'纸箱纸板下单', role:'纸箱纸板下单' },
                component: buildC
            },
            {
                path:'box/flagLists',
                meta: { title: '淘宝箱精品团购列表', role:'淘宝箱精品团购列表' },
                component: groupBoxFlag
            },
            {
                path: 'box/detail',
                name: 'boxDetail',
                meta:{ title:'淘宝箱团购详情', role:'淘宝箱团购详情' },
                component: groupBoxDetail
            },
            {
                path: 'build/t',
                name: 'buildGroupT',
                meta:{ title:'淘宝箱下单', role:'淘宝箱下单' },
                component: buildT
            },
        ]
    }
];
export default group;