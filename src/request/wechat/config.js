import { get, post } from '../request';
import { wechat } from '../urlMap';
const config = {
	serverInfo(){
		return get(wechat.config.serverInfo);
	},
	getBindInfo( openid ){
		let postData = {
			openid : openid
		};
		return post(wechat.config.getBindInfo,postData);
	}
};
export default config;