import { Dialog } from 'vant';
const errorHandle = {
	mainHandle( errorCode,msg ){
		switch(errorCode){
			case 10014:
				console.log(10014)
				break;
			case 20201:
				Dialog({ message: msg});
				break;
			case 20250:
				//Dialog({ message: '20250' });
				break;
			default :
				//Dialog({ message: '提示123' });
				break;
		}
	}
}
export default errorHandle;