import axios from 'axios';

const config = {
	requestUrl : '/domain.json',
	baseUrl:{
		domain:''
	},
	requestRemoteIp: ()=>{
		return new Promise((resolve, reject) => {
			axios.get(config.requestUrl).then(response =>{
				config.baseUrl.domain = response.data.domain;
				sessionStorage.setItem('domain',response.data.domain)
				resolve();
			},err =>{
				reject();
			});
		});
	}
}

export default config