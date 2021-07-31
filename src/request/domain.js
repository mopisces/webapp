export async function getDomain(){
	await axios.get('http://localhost:41000/v1/index/remoteip/getDomain').then((response)=>{
		window.jpdn_domain_admin     = response.data.result.backStage + 'public/v1/admin/';
		window.jpdn_domain_staff     = response.data.result.backStage + 'public/v1/staff/'
		window.jpdn_domain_client    = response.data.result.backStage + 'public/v1/client/';
		window.jpdn_domain_pay       = response.data.result.backStage + 'public/v1/alipay/';
		window.jpdn_domain_index     = response.data.result.backStage + 'public/v1/index/';
		window.jpdn_domain_wechat    = response.data.result.backStage + 'public/v1/wechat/';
		window.jpdn_domain_sg        = response.data.result.sgDomain + 'public/v1/sg/';
		window.jpdn_domain_amap      = response.data.result.backStage + 'public/v1/amap/';
		window.jpdn_domain_imgDomain = response.data.result.backStage + 'upload/';
		window.jpdn_domain_erp       = response.data.result.erpDomain;
		window.jpdn_domain_wxRediect = response.data.result.pageDomain;
		window.jpdn_demand_type      = response.data.result.demandType;
		window.domainInit = true;
	}).catch((err)=>{
		window.domainInit = false;
	});
}