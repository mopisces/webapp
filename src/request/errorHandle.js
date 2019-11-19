import { Dialog } from 'vant';
import base from './base';
const errorHandle = {
	mainHandle( errorCode,msg ){
		switch(errorCode){
			case 10014:
				console.log(10014)
				break;
			case 20201:
				let postData = {
					access_token  : sessionStorage.getItem('jpdn-login-token'),
					refresh_token : sessionStorage.getItem('jpdn-login-refresh')
				};
				/*post(`${base.index}getToken`,postData).then((res)=>{
					console.log(res)
				});*/
				//Dialog({ message: msg + '111'});
				break;
			case 20250:
				//Dialog({ message: '20250' });
				break;
			case 20215:

				break;
			case 20216:

				break;
			default :

				//Dialog({ message: '提示123' });
				break;
		}
	}
}
export default errorHandle;