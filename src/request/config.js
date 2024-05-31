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
				window.jpdn_domain_admin     = response.data.backStage + 'v1/admin/';
				window.jpdn_domain_staff     = response.data.backStage + 'v1/staff/'
				window.jpdn_domain_client    = response.data.backStage + 'v1/client/';
				window.jpdn_domain_pay       = response.data.backStage + 'v1/alipay/';
				window.jpdn_domain_index     = response.data.backStage + 'v1/index/';
				window.jpdn_domain_wechat    = response.data.backStage + 'v1/wechat/';
				window.jpdn_domain_amap      = response.data.backStage + 'v1/amap/';
				window.jpdn_domain_imgDomain = response.data.imgDomain;
				window.jpdn_domain_erp       = response.data.erpDomain;
				window.jpdn_domain_wxRediect = response.data.pageDomain;
				resolve();
			},err =>{
				reject();
			});
		});
	}
}

export default config