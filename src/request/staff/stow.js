import { get, post } from '../request';
import { staff, erp } from '../urlMap';
import axios from 'axios';

const stow = {
	stowListConfig(){
		return post(staff.stow.stowListConfig);
	},
	stowList(){
		let postData = {
			list_begin_date : '2019-05-08',
			list_end_date   : '2019-11-08',
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
	getOrdPackInfo( data ){
		let postData = {
			str_order_id:data.strOrderId
		};
		return post(staff.stow.getOrdPackInfo,postData);
	},
	erpDelDNDetail( data ){
		let postData = {
			iPListNo     : data.iPListNo,
			iDNId        : data.iDNId,
			strFactoryId : data.strFactoryId,
			strUserId    : data.strUserId
		};
		return post(erp.delDNDetail,postData);
	},
	erpAddDNDetail( data ){
		let postData = {
			iDNId        : data,
            iPListNo     : data,
            iDeliQty     : data,
            iFreeQty     : data,
            iSchPNo      : 0,
            dDNPriceAdd  : 0.0,
            dOtherFee    : data,
            strOrderId   : data,
            strCusId     : '',
            strStockArea : data,
            strDNRemark  : data,
            strCusSubNo  : data,
            OrderType    : data,
            bModify      : data,
            strFactoryId : '',
            strUserId    : '',
		};
		return post(erp.addDNDetail,postData);
	}
}
export default stow;