import { get, post } from '../request';
import { staff } from '../urlMap';
import axios from 'axios';

const login = {
	getSF(){
		return get(staff.login.getSF);
	},
	
}
export default login;