import { get, post } from '../request';
import { wechat } from '../urlMap';
const config = {
	serverInfo(){
		return get(wechat.config.serverInfo);
	},
	getBindInfo(){
		let postData = {
			openid : sessionStorage.getItem('jpdn_webapp_openid')
		};
		return post(wechat.config.getBindInfo,postData);
	}
};
export default config;