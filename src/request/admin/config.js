import { get, post } from '../request';
import { admin } from '../urlMap';

const config={
	getConfig(){
		return post(admin.config.getConfig);
	},
	saveConfig( jsonData ){
		let postData = {
			config_json : jsonData
		};
		return post(admin.config.saveConfig,postData);
	}
};
export default config;