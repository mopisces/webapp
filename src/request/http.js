import { Dialog, Toast } from 'vant';
import router from '@/router';
import { getStorage, setStorage,removeStorage } from '@/util/storage';
import store from '@/store';
var httpServer = axios.create();
httpServer.defaults.timeout = 15000;
httpServer.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
httpServer.interceptors.request.use(
	config => {
		Toast.loading({
			mask: true,
			message: '加载中...',
			loadingType: 'spinner'
		});
		let auth = '';
		if( getStorage('jpdn-client-token', 'sessionStorage') ){
			auth = getStorage('jpdn-client-token', 'sessionStorage');
		}else if( getStorage('jpdn-staff-token', 'sessionStorage') ){
			auth = getStorage('jpdn-staff-token', 'sessionStorage');
		}else if( getStorage('jpdn-admin-token', 'sessionStorage') ){
			auth = getStorage('jpdn-admin-token', 'sessionStorage');
		}else if( getStorage('jpdn-sg-token', 'sessionStorage') ){
			auth = getStorage('jpdn-sg-token', 'sessionStorage');
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
			Toast.fail( JSON.stringify(error) );
			errorHandle.mainHandle(error.data.errorCode,error.data.msg);
			return Promise.reject(error);
		}
	}
);

const errorHandle = {
	mainHandle( errorCode,msg ){
		console.log(errorCode)
		switch(errorCode){
			case 10001:
				Toast.fail('请求方式错误');
				break;
			case 10014:
				Toast.fail(msg ? msg : '微信模块参数错误');
				break;
			case 10203:
				relogin( msg ? msg : '服务器内部错误,请稍后再试' );
				break;
			//支付宝支付参数错误
			case 10300:
				Toast.fail(msg ? msg : '支付宝支付参数错误');
				break;
			//微信模块参数错误
			case 10400:
				Toast.fail(msg ? msg : '微信模块参数错误')
				break;
			//ERP下单系统不可用
			case 20200:
				Toast.fail('ERP下单系统不可用')
			//参数错误
			case 20201:
				Toast.fail(msg ? msg:'查询参数不符合条件');
				if( msg.includes("用户名或密码错误") ){
					relogin(msg);
				}
				break;
			//没有访问权限
			case 20204:
				relogin( msg ? msg : '没有访问权限', 'menu' );
				break;
			//令牌验证失败
			case 20205:
				relogin( msg ? msg : '令牌验证失败' );
				break;
			//数据库操作失败
			case 20220:
				Toast.fail(msg ? msg : '数据库操作失败');
				break;
			//空数据
			case 20250:
				Toast.fail(msg ? msg : '没有更多数据了');
				break;
			//团购失败
			case 20260:
				Toast.fail(msg ? msg : '团购失败');
				break;
			default :
				Toast.fail(msg);
				break;
		}
	}
}

const relogin = ( msg, type='login' )=>{
	Dialog({ message:msg }).then(()=>{
		switch( getStorage('jpdn-login-type') ){
			case 'client':
				removeStorage('jpdn-client-token');
				removeStorage('jpdn-client-refresh');
				removeStorage('jpdn-client-isLogin');
				removeStorage('client-auth-url');
				setStorage('jpdn-client-isLogin',0);
				store.commit('client/setIsLogin',false);
				if( type == 'login'){
					router.push('/group/client/login');
				}else if(type == 'menu'){
					router.push('/client/index/menu');
				}
				break;
			case 'staff':
				removeStorage('jpdn-staff-token');
				removeStorage('jpdn-staff-refresh');
				removeStorage('jpdn-staff-isLogin');
				removeStorage('staff-auth-url');
				setStorage('jpdn-staff-isLogin',0);
				store.commit('staff/setIsLogin',false);
				if( type == 'login'){
					router.push('/group/staff/login');
				}else if(type == 'menu'){
					router.push('/staff/index/menu');
				}
				break;
			case 'admin':
				removeStorage('jpdn-admin-token');
				removeStorage('jpdn-admin-refresh');
				removeStorage('jpdn-admin-username');
				router.push('/admin/login');
				break;
			default:
				router.push('/group/client/login');
				break;
		}
	})
}
export default httpServer;