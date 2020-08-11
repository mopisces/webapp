import { get, post } from '../request';

const user = {
	getUserInfo(){
		return post( window.jpdn_domain_staff + 'staffUserInfo' );
	},
	getUserManageType(){
		return post( window.jpdn_domain_staff + 'staffUserManageType' );
	},
	getWebUserClient(){
		return post( window.jpdn_domain_staff + 'staffWebUserClient' );
	},
	getWebUserStaff(){
		return post( window.jpdn_domain_staff + 'staffWebUserStaff' );
	},
	getCommonQrCode( data ){
		let postData = {
			user_name : data.UserName,
			user_pass : data.PassWord,
			user_type : data.UserType
		};
		return post( window.jpdn_domain_staff + 'staffGetCommonQrcode', postData );
	},
	getAuthName( data ){
		return post( window.jpdn_domain_staff + 'staffGetAuthName' );
	},
	getCommonAuth( data ){
		return post( window.jpdn_domain_staff + 'staffCommonAuth', {user_name:data.UserName} );
	},
	saveAuthName( data ){
		let postData = {
			user_name     : data.userName,
			user_pass     : data.userPass,
			user_type     : data.userType,
			auth_url_name : data.authName			
		};
		return post( window.jpdn_domain_staff + 'staffSaveAuthUrl', postData );
	},
	getQrcode(){
		return post( window.jpdn_domain_staff + 'staffUserGetQrcode' );
	},
	changePass( data ){
		let postData = {
			old_pass  : data.oldPass,
			new_pass  : data.newPass,
		};
		return post( window.jpdn_domain_staff + 'staffChangePwd', postData );
	},
	getMenuUserName(){
		return post( window.jpdn_domain_staff + 'getStaffUserName' );
	}
};

export default user;