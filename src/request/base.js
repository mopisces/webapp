let phpDomain = 'http://localhost:8001/public/v1/';

const base = {
	admin     : 'http://localhost:8001/public/v1/admin/',
	staff     : 'http://localhost:8001/public/v1/staff/',
	client    : 'http://localhost:8001/public/v1/client/',
	pay       : 'http://localhost:8001/public/v1/alipay/',
	index     : 'http://localhost:8001/public/v1/index/',
	sg        : 'http://localhost:8001/public/v1/sg/',
	erp       : 'http://localhost:38081/datasnap/rest/TServerMethods1/',
	imgDomain : 'http://127.0.0.1:8001/upload/'
};

/*const base = {
	admin  : `${phpDomain}admin/`,
	staff  : `${phpDomain}staff/`,
	client : `${phpDomain}client/`,
	pay    : `${phpDomain}alipay/`,
	index  : `${phpDomain}index/`,
	sg     : `${phpDomain}sg/`,
	erp    : `${phpDomain}staff/`,

};*/

export default base;