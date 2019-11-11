import { get, post } from '../request';
import { staff } from '../urlMap';
import axios from 'axios';
const user = {
	getUserInfo(){
		return post(staff.user.staffUserInfo);
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
		return post(staff.user.getAuthName,{user_name:data.UserName});
	}
}
export default user;