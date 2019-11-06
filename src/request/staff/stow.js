import { get, post } from '../request';
import { staff } from '../urlMap';
import axios from 'axios';

const stow = {
	stowListConfig(){
		return post(staff.stow.stowListConfig);
	},
	stowList(){
		let postData = {
			list_begin_date:'2017-11-06',
			list_end_date:'2019-11-06',
			show_pack:0,
			show_sign:0
		};
		return post(staff.stow.stowList,postData);
	},
	getPDNDetail( data ){
		return post(staff.stow.getPDNDetail,{list_no:data.listNo});
	}
}
export default stow;