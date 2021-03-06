import { get, post } from '../request';

const erp = {
	ordersDetail( data ){
		let postData={
			detail_order_id   : data.orderId,
			detail_order_type : data.orderType
		};
		return post( window.jpdn_domain_staff + 'staffOrdersDetail', postData );
	},
	erpConfig(){
		return post( window.jpdn_domain_staff + 'staffErpConfig');
	},
	erpOrders( data ){
		let postData={
			erp_begin_date     : data.beginDate,
			erp_end_date       : data.endDate,
			erp_date_type      : data.dateType,
			erp_state          : data.erpState,
			erp_cur_page       : data.curPage,
			erp_board_length   : data.boardLength,
			erp_board_width    : data.boardWidth,
			erp_box_length     : data.boxLength,
			erp_box_width      : data.boxWidth,
			erp_box_height     : data.boxHeight,
			erp_order_quantity : data.orderQuantity,
			erp_cus_id         : data.cusName,
			erp_order_id       : data.orderId
		};

		return post( window.jpdn_domain_staff + 'staffErp', postData );
	}
};

export default erp;
