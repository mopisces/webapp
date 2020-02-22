import { get, post } from '../request';
import { admin } from '../urlMap';

const login={
	login( data ){
		let postData = {
			login_user_name : data.adminName,
			login_user_pass : data.adminPass
		};
		return post(admin.login.login,postData);
	},
	refreshToken(){
		let postData = {
			access_token  : '',
			refresh_token : ''
		};
		return post(admin.login.refresh,postData);
	}
};
export default login;