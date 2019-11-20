import { get, post } from '../request';
import { staff, erp } from '../urlMap';
import axios from 'axios';

const stock = {
	deliveryArea(){
		return post(staff.stock.deliveryArea);
	},
	mStockDetailR(){
		return post(staff.stock.mStockDetailR);
	},
	getStockDetail( strOrderId ){
		return post(staff.stock.getStockDetail,{ str_order_id : strOrderId })
	},
	erpModify( data ){
		let postData = {
			iOpType      : data.iOpType,
            ikey1        : data.ikey1,
            ikey2        : data.ikey2,
            ikey3        : data.ikey3,
            strOrderId   : data.strOrderId,
            strRemark    : data.strRemark,
            strStockArea : data.strStockArea,
            strFactoryId : data.strFactoryId,
            strUserId    : data.strUserId,
		};
		return post(erp.mStockDetailR,postData);
	}
}
export default stock;