import { get, post } from '../request';
import { sg } from '../urlMap';

const login = {
	login( data ){
		let postData = {
			user_name : data.userName,
			user_pass : data.userPass
		};
		return post(sg.login.login,postData);
	}
};
export default login;