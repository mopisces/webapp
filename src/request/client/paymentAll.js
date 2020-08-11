import { get, post } from '../request';

const paymentAll = {
	paymentIndex( cusOrderId ){
		return post( window.jpdn_domain_client + 'paymentIndex', {cus_order_id:cusOrderId});
	},
	payDetail( orderId ){
		let postData = {
			detail_order_id : orderId
		};
		return post( window.jpdn_domain_client + 'payDetail', postData);
	},
	applyRefund( data ){
		let postData = {
			apply_order_id       : data.orderId,
			apply_refund_reason  : data.reason
		};
		return post( window.jpdn_domain_client + 'applyForRefund', postData);
	},
	checkApply( data ){
		let postData = {
			apply_check_id : data.orderId
		};
		return post( window.jpdn_domain_client + 'applyRefund', postData);
	},
	getOrderId( data ){
		let postData = {
			uniqid_id : data.outTradeNo,
			trade_no  : data.tradeNo
		};
		return post( window.jpdn_domain_client + 'gerOrderId',postData);
	}
};

export default paymentAll;