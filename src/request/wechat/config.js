import { get, post } from '../request';

const config = {
	serverInfo(){
		return get( window.jpdn_domain_wechat + 'wxConfig' );
	},
	getBindInfo( openid ){
		let postData = {
			openid : openid
		};
		return post( window.jpdn_domain_wechat + 'wxBindInfo', postData );
	}
};

export default config;