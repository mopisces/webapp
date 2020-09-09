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
	},
	getVerifyInfo(data){
		let postData = {
			openid : data.openid,
			user_name :data.userName
		};
		return post( window.jpdn_domain_wechat + 'wxVerifyInfo', postData );
	}
};

export default config;