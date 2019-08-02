import { get, post } from '../request';
import { adminUrl } from '../urlMap';
const login={
	login(){
		return get(adminUrl.login,{a:'ssss',b:'ddddd'});
	},
	check(){
		return get('http://localhost:8001/public/v1/webappCustomer/check',{jwt:localStorage.getItem("jwt")});
	}
};
export default login;