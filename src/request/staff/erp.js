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
	},
	erpConfig(){
		return post(staff.erp.erpConfig);
	},
	erpOrders( data ){
		let postData={
			erp_begin_date:data.beginDate,
			erp_end_date:data.endDate,
			erp_date_type:data.dateType,
			erp_state:data.erpState,
			erp_cur_page:data.curPage,
			erp_board_length:data.boardLength,
			erp_board_width:data.boardWidth,
			erp_box_length:data.boxLength,
			erp_box_width:data.boxWidth,
			erp_box_height:data.boxHeight,
			erp_order_quantity:data.orderQuantity,
			erp_cus_id:data.cusName,
			erp_order_id:data.orderId
		};
		return post(staff.erp.erpOrders,postData);
	}

}
export default erp;
