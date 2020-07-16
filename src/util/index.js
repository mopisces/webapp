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
export function filterAsyncRouter( asyncRouterMap, roles, type )
{
	const accessedRouters = asyncRouterMap.filter( route => { 
		if( typeof(roles) === 'object' && JSON.stringify(roles) !== '[]' ){
			for (var i = roles.length - 1; i >= 0; i--) {
				if( urlWhiteList(route.meta.role, type) || route.meta.role.indexOf(roles[i]) >= 0 ){
					if( route.children && route.children.length){
						route.children = filterAsyncRouter( route.children,roles, type );
					}
					return route;
				}
			}
		}else{
			if( urlWhiteList(route.meta.role, type) || route.meta.role.indexOf(roles) >= 0 ){
				if( route.children && route.children.length ){
					route.children = filterAsyncRouter( route.children,roles, type );
				}
				return route;
			}
		}
	});
	return accessedRouters;
};

export function secondsFormat( seconds )
{
	return [parseInt(seconds / 60 / 60), parseInt(seconds / 60 % 60), parseInt(seconds % 60)].join(':').replace(/\b(\d)\b/g, '0$1');
};

export function urlWhiteList( roleName, type )
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
			'微信订单',
			'支付方式',
			'支付完成',
			'申请退款',
			'支付宝跳转页面',
			'支付宝支付页面'
		];
	}
	for (var i = whiteList.length - 1; i >= 0; i--) {
		if( whiteList[i] === roleName ){
			return true;
			break;
		}
	}
	return false;
};

export function groupCheck( toName )
{
	let checkList = [
		'buildGroupT',
		'buildGroupS',
		'buildGroupC'
	];
	for( var i = checkList.length - 1; i >= 0; i-- ){
		if( checkList[i] === toName ){
			return true;
			break;
		}
	}
	return false;
}
export function submitForm( url, params )
{
	var temp = document.createElement("form");
	temp.action = url;
    temp.method = "post";
    temp.style.display = "none";
    for (var x in params) {
    	var opt   = document.createElement("input");
	    opt.type  = 'hidden';
	    opt.name  = x;
	    opt.value = params[x];
	    temp.appendChild(opt);
    }
    document.body.appendChild(temp);
    temp.submit();
    return temp;
};
export function mapLoader ()
{
	return new Promise((resolve, reject) => {
		if (window.AMap) {
			resolve(window.AMap);
		}else{
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.async = true;
			script.src = 'http://webapi.amap.com/maps?v=1.4.5&key=83ca63ae8f018bc0424e0f3f38eee0f0&plugin=AMap.TruckDriving,AMap.Driving,AMap.Geocoder,AMap.ToolBar,AMap.Autocomplete,AMap.PlaceSearch,AMap.GeometryUtil,ElasticMarker,Map3D,AMap.MouseTool&callback=initAMap';
			script.onerror = reject;
			document.head.appendChild(script);
		}
		window.initAMap = () => {
			resolve(window.AMap)
		}
	});
};
export function echartLoader()
{
	
}