import { get, post } from '../request';
import { staff, erp } from '../urlMap';
import axios from 'axios';

const stow = {
	stowListConfig(){
		return post(staff.stow.stowListConfig);
	},
	stowList(){
		let postData = {
			list_begin_date : '2017-11-06',
			list_end_date   : '2019-11-06',
			show_pack       : 0,
			show_sign       : 0
		};
		return post(staff.stow.stowList,postData);
	},
	detailConfig(){
		return post(staff.stow.detailConfig);
	},
	getPDNDetail( data ){
		return post(staff.stow.getPDNDetail,{list_no:data.listNo});
	},
	erpDelDNDetail( data ){
		let postData = {
			iPListNo     : data.iPListNo,
			iDNId        : data.iDNId,
			strFactoryId : data.strFactoryId,
			strUserId    : data.strUserId
		};
		return post(erp.delDNDetail,postData);
	}
}
export default stow;