import { get, post } from '../request';
import { staff } from '../urlMap';
const user = {
	getUserInfo(){
		return post(staff.user.staffUserInfo);
	},
	getUserManageType(){
		return post(staff.user.getUserManageType);
	},
	getWebUserClient(){
		return post(staff.user.getWebUserClient);
	},
	getWebUserStaff(){
		return post(staff.user.getWebUserStaff);
	},
	getCommonQrCode( data ){
		let postData = {
			user_name : data.UserName,
			user_pass : data.PassWord,
			user_type : data.UserType
		};
		return post(staff.user.getCommonQrCode,postData);
	},
	getAuthName( data ){
		return post(staff.user.getAuthName);
	},
	getCommonAuth( data ){
		return post(staff.user.getCommonAuth,{user_name:data.UserName});
	},
	saveAuthName( data ){
		let postData = {
			user_name     : data.userName,
			user_pass     : data.userPass,
			user_type     : data.userType,
			auth_url_name : data.authName			
		};
		return post(staff.user.saveAuthName,postData);
	},
	getQrcode(){
		return post(staff.user.userGetQrcode);
	},
	changePass( data ){
		let postData = {
			old_pass  : data.oldPass,
			new_pass  : data.newPass,
		};
		return post(staff.user.changePass,postData);
	},
	getMenuUserName(){
		return post(staff.user.menuName);
	}
}
export default user;