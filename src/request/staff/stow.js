import { get, post } from '../request';
import { staff } from '../urlMap';
import axios from 'axios';

const stow = {
	stowListConfig(){
		return post(staff.stow.stowListConfig);
	},
	stowList(){
		let postData = {
			list_begin_date:'2016-10-28',
			list_end_date:'2019-08-27',
			show_pack:0,
			show_sign:0
		};
		return post(staff.stow.stowList,postData);
	}
}
export default stow;