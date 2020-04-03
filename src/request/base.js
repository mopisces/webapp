let phpDomain = 'http://localhost:8001/';//'http://test.leaper.ltd:1110/';//后台接口domain
//let phpDomain = 'http://test.leaper.ltd:1110/';

const base = {
	admin     : `${phpDomain}public/v1/admin/`,   //后台管理地址
	staff     : `${phpDomain}public/v1/staff/`,   //后台内部用户地址
	client    : `${phpDomain}public/v1/client/`,  //后台外部用户地址
	pay       : `${phpDomain}public/v1/alipay/`,  //后台支付地址
	index     : `${phpDomain}public/v1/index/`,   //后台登陆地址
	sg        : `${phpDomain}public/v1/sg/`,      //后台生管地址
	imgDomain : `${phpDomain}upload/`,            //图片存放地址
	erp       : 'http://localhost:38081/datasnap/rest/TServerMethods1/',  //erp接口地址
	on80Port  : 'http://luodangfrp2.leaper.ltd/',  //微信扫一扫80端口地址
	wxRediect : 'http://test.leaper.ltd:1104'      //线上前台页面地址
};

export default base;