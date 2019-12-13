export function trim(){
	return str.replace(/(^\s*)|(\s*$)/g, "");
};
export function dateTimeFormat( datetime, format ){
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
export function cTypeChange( cType ){
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