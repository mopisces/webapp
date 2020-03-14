let phpDomain = 'http://test.leaper.ltd:1110/';//'http://localhost:8001/';

const base = {
	admin     : `${phpDomain}public/v1/admin/`,
	staff     : `${phpDomain}public/v1/staff/`,
	client    : `${phpDomain}public/v1/client/`,
	pay       : `${phpDomain}public/v1/alipay/`,
	index     : `${phpDomain}public/v1/index/`,
	sg        : `${phpDomain}public/v1/sg/`,
	imgDomain : `${phpDomain}upload/`,
	erp       : 'http://localhost:38081/datasnap/rest/TServerMethods1/',
	on80Port  : 'http://luodangfrp2.leaper.ltd/',
	wxRediect : 'http://test.leaper.ltd:1104'
};

export default base;