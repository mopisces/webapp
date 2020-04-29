import { get, post } from '../request';
import { wechat } from '../urlMap';
const login = {
	checkUserInfo( openid ){
		return post(wechat.login.checkUserInfo,{openid:openid});
	},
	bindAccount( data ){
		let postData = {
			openid    : sessionStorage.getItem('jpdn_webapp_openid'),
			user_name : data.userName,
			user_pass : data.passWord,
			full_name : data.fullName,
			tel_no    : data.phone
		};
		return post(wechat.login.bindAccount,postData);
	}
};
export default login;