import { get, post } from '../request';

const ordersManage = {
	erpOrdersConfig(){
		return get( window.jpdn_domain_client + 'erpOrdersConfig');
	},
	erpOrders( data ){
		let postData = {
			erp_begin_date   : data.beginDate,
			erp_end_date     : data.endDate,
			erp_date_type    : data.dateType,
			order_id         : data.orderId,
			border_length    : data.boardLength,
			border_width     : data.boardWidth,
			box_length       : data.boxLength,
			box_width        : data.boxWidth,
			box_height       : data.boxHeight,
			order_quantities : data.orderQuantity,
			is_from_wx       : data.isWx,
			order_type_state : data.orderType,
			cur_page         : data.curPage

		};
		return post( window.jpdn_domain_client + 'erpOrders',postData);
	},
	dailyOrdersConfig(){
		return get( window.jpdn_domain_client + 'dailyOrdersConfig');
	},
	dailyOrdersCusInfo( data ){
		let postData = {
			daily_begin_date : data.beginDate,
			daily_end_date   : data.endDate
		};
		return post( window.jpdn_domain_client + 'cusInfo',postData);
	},
	dailyOrderOptionalDate( data ){
		let postData = {
			daily_begin_date : data.beginDate,
			daily_end_date   : data.endDate,
			order_id         : data.orderId,
			cus_order_id     : data.cusOrderId,
			border_length    : data.borderLength,
			border_width     : data.borderWidth,
			line_ball        : data.lineBall,
			order_quantities : data.orderQuantities,
			daily_order_state: data.orderState
		};
		return post( window.jpdn_domain_client + 'optionalDate',postData);
	},
	dailyOrders( data ){
		let postData = {
			daily_order_state  : data.orderState,
			daily_booking_date : data.bookingDate
		};
		return post( window.jpdn_domain_client + 'dailyOrders',postData);
	},
	commonOrders( data ){
		let postData = {
			common_order_type : data.orderType,
			cur_page          : data.curPage
		};
		return post( window.jpdn_domain_client + 'commonOrders', postData);
	},
	cancelCommon( orderId ){
		return post( window.jpdn_domain_client + 'cancelCommon', { cancel_order_id : orderId });
	},

	//微信订单页面参数
	wechatOrdersConfig(){
		return get( window.jpdn_domain_client + 'wxConfig');
	},
	wechatOrders( data ){
		let postData = {
			wechat_begin_date  : data.beginDate,
			wechat_end_date    : data.endDate,
			wechat_date_type   : data.dateType,
			wechat_group_buy   : data.groupBy,
			wechat_order_type  : data.orderType,
			wechat_order_state : data.orderState,
			cur_page           : data.curPage
		};
		return post( window.jpdn_domain_client + 'wechatOrders',postData);
	},
	wechatBaseDetail( cusOrderId ){
		return post( window.jpdn_domain_client + 'wechatBaseDetail',{ wechat_cus_order_id : cusOrderId });
	},
	wechatGroupDetail( cusOrderId ){
		return post( window.jpdn_domain_client + 'wechatGroupDetail',{ wechat_cus_order_id : cusOrderId });
	},
	detailAll( cusOrderId ){
		return axios.all([
			ordersManage.wechatBaseDetail(cusOrderId),
			ordersManage.wechatGroupDetail(cusOrderId)
		]);
	},
	wechatDelete( data ){
		let postData = {
			wechat_cus_order_id : data.cusOrderId,
			wechat_del_remak    : data.delRemak
		};
		return post( window.jpdn_domain_client + 'wechatDelete', postData);
	},
	wechatSetCommon( data ){
		let postData = {
			wechat_card_flag    : data.cardFlag,
			wechat_cus_order_id : data.orderId
		};
		return post( window.jpdn_domain_client + 'wechatCommon', postData);
	},
	wechatCancel( orderId ){
		return post( window.jpdn_domain_client + 'cancelCommon',{ cancel_order_id:orderId } );
	},
	wechatPayStatusReset( tradeNo ) {
		return post( window.jpdn_domain_client + 'orderManage/wechatPayStatusReset',{ tradeNo: tradeNo } );
	}
};
export default ordersManage;
