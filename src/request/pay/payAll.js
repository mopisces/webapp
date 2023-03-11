import { get, post } from '../request';

const payAll = {
	alipay( data ){
		let postData = {
			cus_order_id : data.cusOrderId,
			total_amount : data.total
		};

		return post( window.jpdn_domain_pay + 'alipay', postData );
	},
	wechatPay( data ){
		let postData = {
			trade_type   : data.tradeType,
			cus_order_id : data.cusOrderId
		};
		return post( window.jpdn_domain_pay + 'wxpay', postData );
	},
	creditPay( data ){
		let postData = {
			cus_order_id : data.cusOrderId,
			total_amount : data.total
		};
		return post( window.jpdn_domain_pay + 'creditpay', postData );
	},
	wxPayForJsapi( data ){
		let postData = {
			code  : data.code,
			token : data.token
		};
		return post( window.jpdn_domain_pay + 'wxPayForJsapi', postData );
	},
	ysbPay( data ){
		let postData = {
			trade_type   : data.tradeType,
			cus_order_id : data.cusOrderId
		};
		return post( window.jpdn_domain_pay + 'ysb/pay', postData )
	}
};

export default payAll;