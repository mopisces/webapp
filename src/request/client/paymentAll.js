import { get, post } from '../request';
import { client } from '../urlMap';
import axios from 'axios';

const paymentAll = {
	paymentIndex( cusOrderId ){
		return post(client.paymentAll.paymentIndex,{cus_order_id:cusOrderId});
	},
	payDetail( orderId ){
		let postData = {
			detail_order_id : orderId
		};
		return post(client.paymentAll.payDetail,postData);
	},
	applyRefund( data ){
		let postData = {
			apply_order_id       : data.orderId,
			apply_refound_reason : data.reason
		};
		return post(client.paymentAll.applyRefund,postData);
	}
};

export default paymentAll;