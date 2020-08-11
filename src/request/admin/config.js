import { get, post } from '../request';

const config={
	getConfig(){
		return post( window.jpdn_domain_admin + 'adminConfig' );
	},
	saveConfig( jsonData ){
		let postData = {
			config_json : jsonData
		};
		return post( window.jpdn_domain_admin + 'adminSaveConfig', postData);
	}
};
export default config;