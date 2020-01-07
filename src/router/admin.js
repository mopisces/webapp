//布局页面
const adminLayout = r => require.ensure([], () => r(require('@/components/admin/AdminLayout')), 'adminLayout');
//菜单页面
const menu        = r => require.ensure([], () => r(require('@/components/admin/index/Menu')), 'menu');
//用户列表
const userList    = r => require.ensure([], () => r(require('@/components/admin/user/Lists')), 'userList');
//添加用户
const userAdd     = r => require.ensure([], () => r(require('@/components/admin/user/AddUser')), 'userAdd');
//联系方式列表
const contactList = r => require.ensure([], () => r(require('@/components/admin/contact/Lists')), 'contactList');
//添加联系方式
const contactAdd  = r => require.ensure([], () => r(require('@/components/admin/contact/Add')), 'contactAdd');
//编辑联系方式
const contactEdit = r => require.ensure([], () => r(require('@/components/admin/contact/Edit')), 'contactEdit');
//支付宝支付信息
const aliPayInfo  = r => require.ensure([], () => r(require('@/components/admin/config/AliPay')), 'aliPayInfo');
//微信支付信息
const wechatInfo  = r => require.ensure([], () => r(require('@/components/admin/config/WechatPay')), 'wechatInfo');
//公共参数
const commonInfo  = r => require.ensure([], () => r(require('@/components/admin/config/Common')), 'commonInfo');
//内部用户参数
const clientInfo  = r => require.ensure([], () => r(require('@/components/admin/config/Client')), 'clientInfo');
//外部用户参数
const staffInfo   = r => require.ensure([], () => r(require('@/components/admin/config/Staff')), 'staffInfo');
//下单参数
const buildInfo   = r => require.ensure([], () => r(require('@/components/admin/config/Build')), 'buildInfo');
//团购参数
const groupInfo   = r => require.ensure([], () => r(require('@/components/admin/config/Group')), 'groupInfo');
//厂商logo
const logoInfo    = r => require.ensure([], () => r(require('@/components/admin/img/Logo')), 'logoInfo');


//纸板列表
const boardLists  = r => require.ensure([], () => r(require('@/components/admin/board/Lists')), 'boardLists');

const admin = [
	{
		path : '/admin',
		component: adminLayout,
        meta: { title: '后台管理人员使用' },
        children:[
        	{
                path:'index/menu',
                meta: { title: '菜单页面' },
                component: menu,
            },
            {
                path:'user/lists',
                meta: { title: '用户列表' },
                component: userList,
            },
            {
                path:'user/add',
                meta: { title: '添加用户' },
                component: userAdd,
            },
            {
                path:'contact/list',
                meta: { title: '联系方式列表' },
                component: contactList,
            },
            {
                path:'contact/add',
                meta: { title: '添加联系方式' },
                component: contactAdd,
            },
            {
                path:'contact/edit',
                meta: { title: '修改联系方式' },
                name: 'contactEdit',
                component: contactEdit,
            },
            {
                path:'config/alipay',
                meta: { title: '支付宝支付信息' },
                component: aliPayInfo,
            },
            {
                path:'config/wechatpay',
                meta: { title: '微信支付信息' },
                component: wechatInfo,
            },
            {
                path:'config/common',
                meta: { title: '公共参数信息' },
                component: commonInfo,
            },
            {
                path:'config/client',
                meta: { title: '内部参数信息' },
                component: clientInfo,
            },
            {
                path:'config/staff',
                meta: { title: '外部参数信息' },
                component: staffInfo,
            },
            {
                path:'config/build',
                meta: { title: '下单参数信息' },
                component: buildInfo,
            },
            {
                path:'config/group',
                meta: { title: '团购参数信息' },
                component: groupInfo,
            },
            {
                path:'img/logo',
                meta: { title: '厂商logo' },
                component: logoInfo,
            },
            {
                path:'board/lists',
                meta: { title: '纸板列表' },
                component: boardLists,
            }
        ]
	}
]; 

export default admin;