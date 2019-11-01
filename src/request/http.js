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
		//let auth = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJqcC1lcnAiLCJpYXQiOjE1NzI1NjY2MzgsImV4cCI6MTU3MjY1MzAzOCwiU1Nob3J0TmFtZSI6IiIsIlN1YkZhY0lkIjoiIiwidGFnIjoiY2xpZW50IiwiVXNlck5hbWUiOiJBUSIsIlBhc3NXb3JkIjoiQVEiLCJVc2VyVHlwZSI6IjAiLCJFUlBJZCI6IkpYQ1EiLCJUYXNrSWQiOm51bGwsIk9uZUNlbnRQYXkiOiIwIiwiUk9XX05VTUJFUiI6IjEifQ.V-0t2KJMdXcFTl5pWZi2UoWgec1IOYC7BNQS_F2843Q';
		let auth = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJqcC1lcnAiLCJpYXQiOjE1NzI1Nzk2NzAsImV4cCI6MTU3MjY2NjA3MCwiU1Nob3J0TmFtZSI6Ilx1NGUxY1x1NjA1MiIsIlN1YkZhY0lkIjoiRFgiLCJ0YWciOiJzdGFmZiIsIlVzZXJOYW1lIjoiMDAxIiwiUGFzc1dvcmQiOiI2LjgzMDE4ZSswMDciLCJVc2VyVHlwZSI6IjEiLCJFUlBJZCI6IjAwMSIsIlRhc2tJZCI6bnVsbCwiT25lQ2VudFBheSI6IjAiLCJST1dfTlVNQkVSIjoiMSJ9.nbX-ts-2pIa_PrQFWUPAxNCBbriA9dxLqlPj5dqpD9c';
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