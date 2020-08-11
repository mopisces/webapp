import { get, post } from '../request';

const login = {
	bindAccount( data ){
		let postData = {
			openid    : sessionStorage.getItem('jpdn_webapp_openid'),
			user_name : data.userName,
			user_pass : data.passWord,
			full_name : data.fullName,
			tel_no    : data.phone
		};
		return post( window.jpdn_domain_wechat + 'bindAccount', postData );
	},
	wxMulitLogin( data ){
		let postData = {
			openid    : sessionStorage.getItem('jpdn_webapp_openid'),
			sub_fact  : data.subFacId,
			acc_name  : data.userName,
			user_type : data.userType
		};
		return post( window.jpdn_domain_wechat + 'wxMulitLogin', postData );
	},
	wxBindVerify(openid){
		let postData = {
			openid : openid,
		};
		return post( window.jpdn_domain_wechat + 'wxBindVerify', postData );
	}
};

export default login;