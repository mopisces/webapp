import { get, post } from '../request';
import { staff } from '../urlMap';

const login = {
	getSF(){
		return get(staff.login.getSF);
	},
	isOpenGroup(){
		return get(staff.login.isOpenGroup);
	}
}
export default login;