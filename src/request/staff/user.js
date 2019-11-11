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
	}
}
export default user;