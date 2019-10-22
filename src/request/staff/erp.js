import { get, post } from '../request';
import { staff } from '../urlMap';
import axios from 'axios';

const erp = {
	ordersDetail( data ){
		let postData={
			detail_order_id:data.orderId,
			detail_order_type:data.orderType
		};
		return post(staff.erp.ordersDetail,postData);
	}
}
export default erp;