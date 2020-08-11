import { get, post } from '../request';

const login={
	login( data ){
		let postData = {
			login_user_name : data.adminName,
			login_user_pass : data.adminPass
		};
		return post( window.jpdn_domain_admin + 'login', postData);
	},
	refreshToken(){
		let postData = {
			access_token  : '',
			refresh_token : ''
		};
		return post( window.jpdn_domain_admin + 'refresh',postData);
	}
};
export default login;