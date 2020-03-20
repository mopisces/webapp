import { get, post } from '../request';
import { index } from '../urlMap';

const login = {
	login( data ){
		let postData = {
			user_name  : data.userName.toUpperCase(),
			user_pass  : data.userPass,
			user_type  : data.userType,
			sub_fac_id : data.subFactoryId
		};
		return post(index.index.index,postData);
	},
	quickLogin( data ){
		return get(index.index.index,{ get_user_secret : data } );
	}
}
export default login;