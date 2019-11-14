import axios from 'axios';
import { Toast } from 'vant';
import Vue from 'vue';
//Vue.use(Toast);

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
		let auth = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJqcC1lcnAiLCJpYXQiOjE1NzM2ODk1MjQsImV4cCI6MTU3Mzc3NTkyNCwiU1Nob3J0TmFtZSI6bnVsbCwiU3ViRmFjSWQiOiIiLCJ0YWciOiJzdGFmZiIsIlVzZXJOYW1lIjoiQ1IiLCJQYXNzV29yZCI6IkNSIiwiVXNlclR5cGUiOiIxIiwiRVJQSWQiOiJDUiIsIlRhc2tJZCI6bnVsbCwiT25lQ2VudFBheSI6IjAiLCJST1dfTlVNQkVSIjoiMSJ9.DlUYqCfa6acYJIrw4YTMtcX33Bjurs0LSTM3KBoq4N8';
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
		/*Toast.loading({
			mask: true,
			message: '加载中...',
			loadingType: 'spinner'
		});*/
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