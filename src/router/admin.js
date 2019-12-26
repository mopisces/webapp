//布局页面
const adminLayout = r => require.ensure([], () => r(require('@/components/admin/AdminLayout')), 'adminLayout');
//菜单页面
const menu        = r => require.ensure([], () => r(require('@/components/admin/index/Menu')), 'menu');
//用户列表
const userList    = r => require.ensure([], () => r(require('@/components/admin/user/Lists')), 'userList');
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
            }
        ]
	}
]; 

export default admin;