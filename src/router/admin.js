//布局页面
const adminLayout  = () => import('@/components/admin/AdminLayout');
//登陆页面
const adminLogin   = () => import('@/components/admin/login/AdminLogin');
//纸板列表
const boardLists   = () => import('@/components/admin/board/Lists');
//纸板产品描述
const boardDescr   = () => import('@/components/admin/board/Descr');
//纸板产品基本信息
const boardEdit    = () => import('@/components/admin/board/Edit');
//添加纸板
const boardAdd     = () => import('@/components/admin/board/Add');
//已删除纸板列表
const boardDel     = () => import('@/components/admin/board/DelLists');
//纸板团购默认图片
const boardDefPic  = () => import('@/components/admin/board/DefaultPic');
//项目配置
const configInfo   = () => import('@/components/admin/config/Config');
//淘宝箱列表
const boxLists     = () => import('@/components/admin/box/Lists');
//淘宝箱编辑
const boxEdit      = () => import('@/components/admin/box/Edit');
//已删除淘宝箱列表
const boxDel       = () => import('@/components/admin/box/DelLists');
//添加淘宝箱
const boxAdd       = () => import('@/components/admin/box/Add');
//淘宝箱团购默认图片
const boxDefPic    = () => import('@/components/admin/box/DefaultPic');
//淘宝箱材质报价
const boxQuoAdd    = () => import('@/components/admin/box/QuoAdd');
//淘宝箱材质报价列表
const boxQuoList   = () => import('@/components/admin/box/QuoBoxList');
//淘宝箱材质报价修改
const boxQuoEdit   = () => import('@/components/admin/box/QuoBoxEdit');
//用户列表
const userLists    = () => import('@/components/admin/user/Lists');
//添加用户
const userAdd      = () => import('@/components/admin/user/Add');
//联系方式列表
const contactLists = () => import('@/components/admin/contact/Lists');
//添加联系方式
const contactAdd   = () => import('@/components/admin/contact/Add');
//图片配置
const imgInfo      = () => import('@/components/admin/img/Logo');
//图片修改
const imgChange    = () => import('@/components/admin/img/ChangeImg');
//项目配置
const configIndex  = () => import('@/components/admin/config/Index');
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
                path:'board/defpic',
                meta: { title: '纸板默认图片' },
                component: boardDefPic,
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
                path:'box/defpic',
                meta: { title: '淘宝箱默认图片' },
                component: boxDefPic,
            },
            {
                path:'box/quoAdd',
                meta: { title: '淘宝箱材质报价' },
                component: boxQuoAdd,
            },
            {
                path:'box/quoList',
                meta: { title: '淘宝箱材质报价列表' },
                component: boxQuoList,
            },
            {
                path:'box/quoEdit',
                name:'quoBoxEdit',
                meta: { title: '淘宝箱材质报价修改' },
                component: boxQuoEdit,
            },
            {
                path:'user/lists',
                meta:{ title: '用户列表' },
                component: userLists
            },
            {
                path:'user/add',
                meta:{ title: '添加用户' },
                component: userAdd
            },
            {
                path:'contact/lists',
                meta:{ title: '联系方式列表' },
                component: contactLists
            },
            {
                path:'contact/add',
                meta:{ title: '添加联系方式' },
                component: contactAdd
            },
            {
                path:'img/info',
                meta:{ title: '图片配置' },
                component: imgInfo
            },
            {
                path:'img/change',
                name:'changeImg',
                meta:{ title: '列表图片修改' },
                component:imgChange
            },
            {
                path:'config/index',
                meta:{ title: '项目配置' },
                component:configIndex
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