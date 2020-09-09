import axios from 'axios';

const config = {
	requestUrl : '/domain.json',
	urlMap:{
		lists:()=>{
			return window.jpdn_domain + 'adminLists'
		}
	},
	requestRemoteIp: ()=>{
		return new Promise((resolve, reject) => {
			axios.get(config.requestUrl).then(response =>{
				window.jpdn_domain_admin     = response.data.backStage + 'public/v1/admin/';
				window.jpdn_domain_staff     = response.data.backStage + 'public/v1/staff/'
				window.jpdn_domain_client    = response.data.backStage + 'public/v1/client/';
				window.jpdn_domain_pay       = response.data.backStage + 'public/v1/alipay/';
				window.jpdn_domain_index     = response.data.backStage + 'public/v1/index/';
				window.jpdn_domain_wechat    = response.data.backStage + 'public/v1/wechat/';
				window.jpdn_domain_sg        = response.data.backStage + 'public/v1/sg/';
				window.jpdn_domain_amap      = response.data.backStage + 'public/v1/amap/';
				window.jpdn_domain_imgDomain = response.data.backStage + 'upload/';
				window.jpdn_domain_erp       = response.data.erpDomain;
				window.jpdn_domain_wxRediect = response.data.pageDomain;
				window.jpdn_demand_type      = response.data.demandType;
				resolve();
			},err =>{
				reject();
			});
		});
	}
}

export default config