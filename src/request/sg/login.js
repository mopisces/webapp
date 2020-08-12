import { get, post } from '../request';

const login = {
	login( data ){
		let postData = {
			user_name : data.userName,
			user_pass : data.userPass
		};
		return post( window.jpdn_domain_sg + 'login', postData );
	}
};

export default login;