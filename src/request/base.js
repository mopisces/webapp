import { backStage, erpDomain, pageDomain } from '../../public/domain.js';
/*import axios from 'axios';
function getDomain(){
	axios.get('/domainConfig.json').then((res)=>{
		console.log(res)
		window.jpdnApiUrl = res.data;
	}).catch(err=>{
		console.log(err)
	});
};
async function getBaseUrl(){
	await getDomain();
}
getBaseUrl();*/
const base = {
	admin     : `${backStage}public/v1/admin/`,   //后台管理地址
	staff     : `${backStage}public/v1/staff/`,   //后台内部用户地址
	client    : `${backStage}public/v1/client/`,  //后台外部用户地址
	pay       : `${backStage}public/v1/alipay/`,  //后台支付地址
	index     : `${backStage}public/v1/index/`,   //后台登陆地址
	sg        : `${backStage}public/v1/sg/`,      //后台生管地址
	imgDomain : `${backStage}upload/`,            //图片存放地址
	erp       : erpDomain,                    //erp接口地址
	wxRediect : pageDomain                    //前端页面地址
};
export default base;
