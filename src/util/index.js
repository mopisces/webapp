export function trim()
{
	return str.replace(/(^\s*)|(\s*$)/g, "");
};
export function dateTimeFormat( datetime, format )
{
	let dt = new Date(datetime);
	let o = {
		'M+': dt.getMonth() + 1,
		'd+': dt.getDate(),
		'h+': dt.getHours(),
		'm+': dt.getMinutes(),
		's+': dt.getSeconds()
	};
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (dt.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp('(' + k + ')').test(format)) {
			format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
		}
	}
	return format;
};
export function cTypeChange( cType )
{
	switch ( cType ) {
		case 's':
			return '简单纸板';
		case 'c':
			return '纸箱纸板';
		case 'x':
			return '纸箱';
		case 't':
			return '淘宝箱';
		default : 
			return '';
	} 
};
export function changeIcon( iconName )
{
	switch (iconName) {
		case 'icon-dianhua':
			return '电话';
		case 'icon-weixin':
			return '微信';
		case 'icon-QQ':
			return 'QQ';
		case 'icon-dizhi1':
			return '地址';
		default:  '未知';
	}
};
export function deepCopy( routeArr )
{
	return routeArr.map((arr) => {
		arr = Object.assign({}, arr)
			return arr
	});
};
let urlWhiteList = ( search, type )=>
{
	let whiteList;
	if( type == 'staff' ){
		whiteList = [
			'内部人员使用',
			'菜单页面'
		];
	}else{
		whiteList = [
			'外部人员使用',
			'菜单页面',
			'报价规则',
			'报价价格',
			'常用材质',
			'常用订单',
			'微信订单',
			'支付方式',
			'支付完成',
			'申请退款',
			'支付宝跳转页面',
			'支付宝支付页面'
		];
	}
	for (var i = whiteList.length - 1; i >= 0; i--) {
		if( whiteList[i] === search ){
			return true;
			break;
		}
	}
	return false;
}
export function filterAsyncRouter( asyncRouterMap, roles, type )
{
	const accessedRouters = asyncRouterMap.filter( route => { 
		if( typeof(roles) === 'object' && JSON.stringify(roles) !== '[]' ){
			for (var i = roles.length - 1; i >= 0; i--) {
				if( urlWhiteList(route.meta.title, type) || route.meta.title.indexOf(roles[i]) >= 0 ){
					if( route.children && route.children.length){
						route.children = filterAsyncRouter( route.children,roles, type );
					}
					return route;
				}
			}
		}else{
			if( urlWhiteList(route.meta.title, type) || route.meta.title.indexOf(roles) >= 0 ){
				if( route.children && route.children.length ){
					route.children = filterAsyncRouter( route.children,roles, type );
				}
				return route;
			}
		}
	});
	return accessedRouters;
}
