import { get, post } from '../request';
import { wechat } from '../urlMap';
const login = {
	/*checkUserInfo( openid ){
		return post(wechat.login.checkUserInfo,{openid:openid});
	},*/
	bindAccount( data ){
		let postData = {
			openid    : sessionStorage.getItem('jpdn_webapp_openid'),
			user_name : data.userName,
			user_pass : data.passWord,
			full_name : data.fullName,
			tel_no    : data.phone
		};
		return post(wechat.login.bindAccount,postData);
	},
	/*wxStaffLogin( data ){
		let postData = {
			openid   : sessionStorage.getItem('jpdn_webapp_openid'),
			sub_fact : data.subFacId
		};
		return post(wechat.login.wxStaffLogin,postData);
	},*/
	wxMulitLogin( data ){
		let postData = {
			openid    : sessionStorage.getItem('jpdn_webapp_openid'),
			sub_fact  : data.subFacId,
			acc_name  : data.userName,
			user_type : data.userType
		};
		return post(wechat.login.wxMulitLogin,postData);
	},
	wxBindVerify(openid){
		let postData = {
			openid : openid,
		};
		return post(wechat.login.wxBindVerify,postData);
	}
};
export default login;