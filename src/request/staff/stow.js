import { get, post } from '../request';
import { staff, erp } from '../urlMap';
import axios from 'axios';

const stow = {
	stowListConfig(){
		return post(staff.stow.stowListConfig);
	},
	stowList( data ){
		let postData = {
			list_begin_date : data.beginDate,
			list_end_date   : data.endDate,
			show_pack       : data.showPack == true ? 1 : 0,
			show_sign       : data.showSign == true ? 1 : 0
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
	getStockArea( data ){
		let postData = {
			str_order_id : data.strOrderId
		};
		return post(staff.stow.getStockArea,postData);
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
			iDNId        : data.iDNId,
            iPListNo     : data.iPListNo,
            iDeliQty     : data.iDeliQty,
            iFreeQty     : data.iFreeQty,
            iSchPNo      : 0,
            dDNPriceAdd  : 0.0,
            dOtherFee    : data.dOtherFee,
            strOrderId   : data.strOrderId,
            strCusId     : '',
            strStockArea : data.strStockArea,
            strDNRemark  : data.strDNRemark,
            strCusSubNo  : data.strCusSubNo,
            OrderType    : data.OrderType,
            bModify      : data.bModify,
		};
		return post(erp.addDNDetail,postData);
	},
	preparePack( data ){
		let postData = {
			iPListNo     : data.pListNo,
			strFactoryId : data.strFactoryId,
			strUserId    : data.strUserId
		};
		return post(erp.preparePack,postData);
	},
	unPreparePack( data ){
		let postData = {
			iPListNo     : data.pListNo,
			strFactoryId : data.strFactoryId,
			strUserId    : data.strUserId
		};
		return post(erp.unPreparePack,postData);
	}
}
export default stow;