import axios from 'axios';
import { Dialog, Toast } from 'vant';
import base from './base';
//import errorHandle from './errorHandle';
/*import Vue from 'vue';
Vue.use(Toast);*/

/*const errorHandle = (errorCode,msg) => {
	switch(errorCode){
		case 10014:
			
			break;
	}
}*/

var httpServer = axios.create();
httpServer.defaults.timeout = 5000;
httpServer.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
httpServer.interceptors.request.use(
	config => {
		Toast.loading({
			mask: true,
			message: '加载中...',
			loadingType: 'spinner'
		});
		//let auth = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJqcC1lcnAiLCJpYXQiOjE1NzU4NTQ4NTksImV4cCI6MTU3NTk0MTI1OSwiU1Nob3J0TmFtZSI6IiIsIlN1YkZhY0lkIjoiIiwidGFnIjoiY2xpZW50IiwiVXNlck5hbWUiOiJBUSIsIlBhc3NXb3JkIjoiQVEiLCJVc2VyVHlwZSI6IjAiLCJFUlBJZCI6IkpYQ1EiLCJUYXNrSWQiOm51bGwsIk9uZUNlbnRQYXkiOiIwIiwiUk9XX05VTUJFUiI6IjEifQ.z3ehHt3a9QwxcZbFSBq6EGYn--bsMwYyUGzo7qzBBuM';
		let auth = sessionStorage.getItem('jpdn-login-token') == null ? '' : sessionStorage.getItem('jpdn-login-token');
		config.headers.Authentication = auth;
		return config;
	},
	error => {
		Toast.clear();
		Promise.error(error);
	},
	
);

httpServer.interceptors.response.use(
	response =>{
		Toast.clear();
		if( response.status !== 200 || response.data.errorCode != '00000' ){
			errorHandle.mainHandle(response.data.errorCode,response.data.msg);
		}
		return Promise.resolve(response);
	},
	error =>{
		Toast.clear();
		if( error ){
			errorHandle.mainHandle(error.data.errorCode,error.data.msg);
			return Promise.reject(error);
		}
	}
);

const errorHandle = {
	mainHandle( errorCode,msg ){
		switch(errorCode){
			case '10014':
				Toast.fail(msg);
				break;
			case '20201':
				Toast.fail(msg);
				break;
			case '20250':
				Toast.fail(msg);
				break;
			case '20215':
				if( sessionStorage.getItem('jpdn-login-token')  !== null && sessionStorage.getItem('jpdn-login-refresh') !== null ){
					let postData = {
						access_token  : sessionStorage.getItem('jpdn-login-token'),
						refresh_token : sessionStorage.getItem('jpdn-login-refresh')
					};
					httpServer.post(`${base.index}getToken`,postData).then((res)=>{
						sessionStorage.setItem('jpdn-login-token',res.data.result.access_token);
						sessionStorage.setItem('jpdn-login-refresh',res.data.result.refresh_token);
						sessionStorage.setItem('jpdn-login-username',res.data.result.user_name);
					});
				}
				break;
			case '20216':
				Dialog({ message: '登录过期,请重新登录' }).then(()=>{
					router.push('/login/select')
				});
				break;
			default :
				Toast.fail(msg);
				break;
		}
	}
}
export default httpServer;