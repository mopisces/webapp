import { get, post } from '../request';
import { pay } from '../urlMap';

const payAll = {
	alipay( data ){
		let postData = {
			cus_order_id : data.cusOrderId,
			total_amount : data.total
		};
		return post(pay.alipay,postData);
	},
	wechatPay( data ){
		let postData = {
			trade_type      : data.tradeType,
			cus_order_id    : data.cusOrderId,
			redirect_domain : 'http://test.leaper.ltd:1104',
		};
		return post(pay.wxpay,postData);
	},
	wxPayForJsapi( data ){
		let postData = {
			code  : data.code,
			token : data.token
		};
		return post(pay.wxPayForJsapi,postData);
	},
	wxPayJwt( data ){
		let postData = {
			token : data
		};
		return post(pay.wxPayJwt,postData);
	}
}
export default payAll;