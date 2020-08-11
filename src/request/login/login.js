import { get, post } from '../request';

const login = {
	login( data ){
		let postData = {
			user_name  : data.userName.toUpperCase(),
			user_pass  : data.userPass,
			user_type  : data.userType,
			sub_fac_id : data.subFactoryId
		};
		return post(window.jpdn_domain_index + 'login',postData);
	},
	quickLogin( data ){
		return get(window.jpdn_domain_index + 'login',{ get_user_secret : data } );
	}
}
export default login;