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
httpServer.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
httpServer.interceptors.request.use(
	config => {
		let auth = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJqcC1lcnAiLCJpYXQiOjE1NzU2MDE4ODIsImV4cCI6MTU3NTY4ODI4MiwiU1Nob3J0TmFtZSI6IiIsIlN1YkZhY0lkIjoiIiwidGFnIjoiY2xpZW50IiwiVXNlck5hbWUiOiJBUSIsIlBhc3NXb3JkIjoiQVEiLCJVc2VyVHlwZSI6IjAiLCJFUlBJZCI6IkpYQ1EiLCJUYXNrSWQiOm51bGwsIk9uZUNlbnRQYXkiOiIwIiwiUk9XX05VTUJFUiI6IjEifQ.rbBfNiZ4k4G9o2QEK6-MjKjoiZO3T-gdhQ5juxIlWIo';
		//let auth = sessionStorage.getItem('jpdn-login-token') == null ? '' : sessionStorage.getItem('jpdn-login-token');
		config.headers.Authentication = auth;
		return config;
	},
	error => {
		Promise.error(error);
	}
);

httpServer.interceptors.response.use(
	response =>{
		if( response.status !== 200 || response.data.errorCode != '00000' ){
			errorHandle.mainHandle(response.data.errorCode,response.data.msg);
		}
		/*Toast.loading({
			mask: true,
			message: '加载中...',
			loadingType: 'spinner'
		});*/
		return Promise.resolve(response);
	},
	error =>{
		if( error ){
			errorHandle.mainHandle(error.data.errorCode,error.data.msg);
			return Promise.reject(error);
		}
	}
);

const errorHandle = {
	mainHandle( errorCode,msg ){
		switch(errorCode){
			case 10014:
				console.log(10014)
				break;
			case 20201:
				Dialog({ message: msg });
				break;
			case 20250:
				//Dialog({ message: '20250' });
				break;
			case 20215:
				if( sessionStorage.getItem('jpdn-login-token' !== null) && sessionStorage.getItem('jpdn-login-refresh') !== null ){
					let postData = {
						access_token  : sessionStorage.getItem('jpdn-login-token'),
						refresh_token : sessionStorage.getItem('jpdn-login-refresh')
					};
					httpServer.post(`${base.index}getToken`,postData).then((res)=>{
						console.log(res)
					});
				}
				break;
			case 20216:
				Dialog({ message: '登录过期,请重新登录' }).then(()=>{
					router.push('/login/select')
				});
				break;
			default :
				//Dialog({ message: '提示123' });
				break;
		}
	}
}
export default httpServer;