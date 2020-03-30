import { get, post } from '../request';
import { client } from '../urlMap';

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
			apply_refund_reason  : data.reason
		};
		return post(client.paymentAll.applyRefund,postData);
	},
	checkApply( data ){
		let postData = {
			apply_check_id : data.orderId
		};
		return post(client.paymentAll.checkApply,postData);
	},
	getOrderId( data ){
		let postData = {
			uniqid_id : data.outTradeNo,
			trade_no  : data.tradeNo
		};
		return post(client.paymentAll.getOrderId,postData);
	}
};

export default paymentAll;