import axios from 'axios';
import { Dialog, Toast } from 'vant';
import base from './base';
import store from '@/store';
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
		let auth = '';
		sessionStorage.setItem('jpdn-sg-token','eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJqcC1lcnAiLCJpYXQiOjE1ODM0NTMyMzksImV4cCI6MTU4MzUzOTYzOSwicm9vdCI6MiwiZGF0YSI6Im9rXC9vayJ9.nZ2ayazxKtPRrrr9mrLFxzsn54jACXNt7PliIRcIZPI');
		if( sessionStorage.getItem('jpdn-client-token') ){
			auth = sessionStorage.getItem('jpdn-client-token');
		}else if( sessionStorage.getItem('jpdn-staff-token') ){
			auth = sessionStorage.getItem('jpdn-staff-token');
		}else if( sessionStorage.getItem('jpdn-admin-token') ){
			auth = sessionStorage.getItem('jpdn-admin-token');
		}else if( sessionStorage.getItem('jpdn-sg-token') ){
			auth = sessionStorage.getItem('jpdn-sg-token');
		}else{
			auth = '';
		}
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
				if( sessionStorage.getItem('jpdn-staff-token') !== null && sessionStorage.getItem('jpdn-staff-refresh') !== null ){
					let postData = {
						access_token  : sessionStorage.getItem('jpdn-staff-token'),
						refresh_token : sessionStorage.getItem('jpdn-staff-refresh')
					};
					httpServer.post(`${base.index}getToken`,postData).then((res)=>{
						sessionStorage.setItem('jpdn-staff-token',res.data.result.access_token);
						sessionStorage.setItem('jpdn-staff-refresh',res.data.result.refresh_token);
						sessionStorage.setItem('jpdn-staff-username',res.data.result.user_name);
					});
				}
				if( sessionStorage.getItem('jpdn-client-token') !== null && sessionStorage.getItem('jpdn-client-refresh') !== null ){
					let postData = {
						access_token  : sessionStorage.getItem('jpdn-client-token'),
						refresh_token : sessionStorage.getItem('jpdn-client-refresh')
					};
					httpServer.post(`${base.index}getToken`,postData).then((res)=>{
						sessionStorage.setItem('jpdn-client-token',res.data.result.access_token);
						sessionStorage.setItem('jpdn-client-refresh',res.data.result.refresh_token);
						sessionStorage.setItem('jpdn-client-username',res.data.result.user_name);
					});
				}
				/*if( sessionStorage.getItem('jpdn-login-token') !== null && sessionStorage.getItem('jpdn-login-refresh') !== null ){
					let postData = {
						access_token  : sessionStorage.getItem('jpdn-login-token'),
						refresh_token : sessionStorage.getItem('jpdn-login-refresh')
					};
					httpServer.post(`${base.index}getToken`,postData).then((res)=>{
						sessionStorage.setItem('jpdn-login-token',res.data.result.access_token);
						sessionStorage.setItem('jpdn-login-refresh',res.data.result.refresh_token);
						sessionStorage.setItem('jpdn-login-username',res.data.result.user_name);
					});
				}*/
				break;
			case '20216':
				Dialog({ message: '登录过期,请重新登录' }).then(()=>{
					router.push('/group/index')
				});
				break;
			default :
				Toast.fail(msg);
				break;
		}
	}
}
export default httpServer;