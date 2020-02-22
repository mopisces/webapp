//布局页面
const adminLayout   = r => require.ensure([], () => r(require('@/components/admin/AdminLayout')), 'adminLayout');
//登陆页面
const adminLogin    = r => require.ensure([], () => r(require('@/components/admin/login/AdminLogin')), 'adminLogin');


//纸板列表
//const boardLists  = r => require.ensure([], () => r(require('@/components/admin/board/Lists')), 'boardLists');
const boardLists   = r => require.ensure([], () => r(require('@/components/admin/board/Lists')), 'boardLists');
//纸板产品描述
const boardDescr   = r => require.ensure([], () => r(require('@/components/admin/board/Descr')), 'boardDescr');
//纸板产品基本信息
const boardEdit    = r => require.ensure([], () => r(require('@/components/admin/board/Edit')), 'boardEdit');
//添加纸板
const boardAdd     = r => require.ensure([], () => r(require('@/components/admin/board/Add')), 'boardAdd');
//已删除纸板列表
const boardDel     = r => require.ensure([], () => r(require('@/components/admin/board/DelLists')), 'boardDel');
//项目配置
const configInfo   = r => require.ensure([], () => r(require('@/components/admin/config/Config')), 'configInfo');
//淘宝箱列表
const boxLists     = r => require.ensure([], () => r(require('@/components/admin/box/Lists')), 'boxLists');
//淘宝箱编辑
const boxEdit      = r => require.ensure([], () => r(require('@/components/admin/box/Edit')), 'boxEdit');
//已删除淘宝箱列表
const boxDel       = r => require.ensure([], () => r(require('@/components/admin/box/DelLists')), 'boxDel');
//添加淘宝箱
const boxAdd       = r => require.ensure([], () => r(require('@/components/admin/box/Add')), 'boxAdd');
//用户列表
const userLists    = r => require.ensure([], () => r(require('@/components/admin/user/Lists')), 'userLists');
//添加用户
const userAdd      = r => require.ensure([], () => r(require('@/components/admin/user/Add')), 'userAdd'); 
//联系方式列表
const contactLists = r => require.ensure([], () => r(require('@/components/admin/contact/Lists')), 'contactLists'); 
//添加联系方式
const contactAdd   = r => require.ensure([], () => r(require('@/components/admin/contact/Add')), 'contactAdd'); 

export const asyncAdminRouterMap = [
    {
        path : '/admin',
        component: adminLayout,
        meta: { title: '后台管理人员使用' },
        children:[
            {
                path:'config/lists',
                meta: { title: '项目配置列表' },
                component: configInfo,
            },
            {
                path:'board/lists',
                meta: { title: '纸板列表' },
                component: boardLists,
            },
            {
                path:'board/descr',
                meta: { title: '产品描述' },
                name : 'descr',
                component: boardDescr,
            },
            {
                path:'board/edit',
                meta: { title: '产品基本信息' },
                name : 'boardEdit',
                component: boardEdit,
            },
            {
                path:'board/add',
                meta: { title: '添加纸板' },
                component: boardAdd,
            },
            {
                path:'board/del',
                mate:{ title: '已删除纸板列表' },
                component:boardDel
            },
            {
                path:'box/lists',
                mate:{ title:'淘宝箱列表' },
                component : boxLists
            },
            {
                path:'box/edit',
                meta: { title: '纸箱基本信息' },
                name : 'boxEdit',
                component: boxEdit,
            },
            {
                path:'box/del',
                meta: { title: '已删除淘宝箱列表' },
                component: boxDel,
            },
            {
                path:'box/add',
                meta: { title: '添加淘宝箱' },
                component: boxAdd,
            },
            {
                path:'user/lists',
                mate:{ title: '用户列表' },
                component: userLists
            },
            {
                path:'user/add',
                mate:{ title: '添加用户' },
                component: userAdd
            },
            {
                path:'contact/lists',
                mate:{ title: '联系方式列表' },
                component: contactLists
            },
            {
                path:'contact/add',
                mate:{ title: '添加联系方式' },
                component: contactAdd
            }
        ]
    }
];

const admin = [
    {
        path:'/admin/login',
        meta: { title: '登陆' },
        component: adminLogin,
    }
]; 

export default admin;