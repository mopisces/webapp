import axios from 'axios';
import { Toast } from 'vant';
import Vue from 'vue';
Vue.use(Toast);

const errorHandle = (errorCode,msg) => {
	switch(errorCode){
		case 10014:
			/*some code*/
			break;
	}

}

var httpServer = axios.create();
httpServer.defaults.timeout = 5000;
httpServer.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
httpServer.interceptors.request.use(
	config => {
		let auth = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJqcC1lcnAiLCJpYXQiOjE1NzE3ODg4MjIsImV4cCI6MTU3MTg3NTIyMiwiU1Nob3J0TmFtZSI6IiIsIlN1YkZhY0lkIjoiIiwidGFnIjoiY2xpZW50IiwiVXNlck5hbWUiOiJBUSIsIlBhc3NXb3JkIjoiQVEiLCJVc2VyVHlwZSI6IjAiLCJFUlBJZCI6IkpYQ1EiLCJUYXNrSWQiOm51bGwsIk9uZUNlbnRQYXkiOiIwIiwiUk9XX05VTUJFUiI6IjEifQ.JC5jVVStOKlTxj7bhflKkPC-XU6zHZ8-XuVF4AHCxAo';
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
			errorHandle(response.data.errorCode,response.data.msg);
		}
		Toast.loading({
			mask: true,
			message: '加载中...'
		});
		return Promise.resolve(response);
	},
	error =>{
		if( error ){
			errorHandle(error.data.errorCode,error.data.msg);
			return Promise.reject(error);
		}
	}
);


export default httpServer;