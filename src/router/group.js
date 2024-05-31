const indexLayout = () => import('@/components/common/ClientLayout')
//团购分类页面
//const groupIndex       = () => import('@/components/group/Index');
//纸板爆款团购列表
//const groupBoardFlag   = () => import('@/components/group/board/FlagLists');
//纸板团购列表
//const groupBoardLists  = () => import('@/components/group/board/Lists');
//纸板团购详情
//const groupBoardDetail = () => import('@/components/group/board/Detail');
//简单纸板下单（需要登陆）
const buildS = () => import('@/components/group/buildboard/S')
//纸箱纸板下单(需要登陆)
const buildC = () => import('@/components/group/buildboard/C')
//淘宝箱精品列表
//const groupBoxFlag     = () => import('@/components/group/box/FlagLists');
//淘宝箱团购列表
//const groupBoxLists    = () => import('@/components/group/box/Lists');
//淘宝箱团购详情
//const groupBoxDetail   = () => import('@/components/group/box/Detail');
//淘宝箱下单(需要登陆)
const buildT = () => import('@/components/group/buildbox/T')

/**
 * 新版本
 */
//团购首页
const mall = ()=> import('@/pages/mall/mall/mall.vue')
//商品详情
const productDetail = ()=> import('@/pages/mall/productDetail/productDetail.vue')

const group = [
    {
        path: '/mall/mall/mall',
        name: 'mall',
        meta: { title: '团购分类', role:'团购', needLogin: true, isGroup:true },
        component: mall
    },
    {
        path: '/mall/product/detail',
        name: 'productDetail',
        meta: { title: '商品详情', role:'团购', needLogin: true, isGroup:true },
        component: productDetail
    },
	{
        path : '/group',
        component : indexLayout,
        meta: { title: '团购下单列表' },
        children : [
            /*{
                path: 'index',
                meta: { title: '团购分类', role:'团购分类', isGroup:true },
                component: groupIndex,
            },
            {
                path: 'board/lists',
                meta: { title: '纸板团购列表', role:'纸板团购列表', isGroup:true },
                component: groupBoardLists,
            },
            {
                path: 'board/flagLists',
                meta: { title: '纸板爆款团购列表', role:'纸板爆款团购列表', isGroup:true },
                component: groupBoardFlag,
            },*/
            {
                path: 'build/s',
                name: 'buildGroupS',
                meta:{ title:'简单纸板下单', role:'团购', needLogin:true, isGroup:true },
                component: buildS
            },
            /*{
                path: 'box/lists',
                meta: { title: '淘宝箱团购列表', role:'淘宝箱团购列表', isGroup:true },
                component: groupBoxLists,
            },*/
            {
                path: 'build/c',
                name: 'buildGroupC',
                meta:{ title:'纸箱纸板下单', role:'团购', needLogin:true, isGroup:true },
                component: buildC
            },
            /*{
                path:'box/flagLists',
                meta: { title: '淘宝箱精品团购列表', role:'淘宝箱精品团购列表', isGroup:true },
                component: groupBoxFlag
            },*/
            {
                path: 'build/t',
                name: 'buildGroupT',
                meta:{ title:'淘宝箱下单', role:'团购', needLogin:true, isGroup:true },
                component: buildT
            },
        ]
    },
    /*{
        path: '/group/board/detail',
        name: 'boardDetail',
        meta:{ title:'纸板团购详情', role:'纸板团购详情', isGroup:true },
        component: groupBoardDetail
    },
    {
        path: '/group/box/detail',
        name: 'boxDetail',
        meta:{ title:'淘宝箱团购详情', role:'淘宝箱团购详情', isGroup:true },
        component: groupBoxDetail
    }*/
];
export default group;