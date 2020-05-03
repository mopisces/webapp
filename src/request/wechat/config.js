import { get, post } from '../request';
import { wechat } from '../urlMap';
const config = {
	serverInfo(){
		return get(wechat.config.serverInfo);
	}
};
export default config;