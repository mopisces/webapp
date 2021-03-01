import { post } from '../request';

const delivery = {
	dailyConfig(){
		return post( window.jpdn_domain_client + 'delivery/daliyConfig');
	},
	dateInfo(data){
		let postData = {
			delivery_order_date     : data.deliveryDate,
			delivery_board_length   : data.boardLength,
			delivery_board_width    : data.boardWidth,
			delivery_cus_po_no      : data.cusPoNo,
			delivery_order_id       : data.orderId,
			delivery_order_quantity : data.orderQuantity,
			delivery_score_info     : data.scoreInfo,
			delivery_begin_date     : data.beginDate,
			delivery_end_date       : data.endDate
		};
		return post( window.jpdn_domain_client + 'delivery/dateInfo', postData);
	},
	cusInfo(data){
		let postData = {
			delivery_begin_date:data.beginDate,
			delivery_end_date:data.endDate
		};
		return post( window.jpdn_domain_client + 'delivery/cusInfo', postData);
	},
	detail(data){
		let postData = {
			delivery_order_date     : data.deliveryDate,
			delivery_board_length   : data.boardLength,
			delivery_board_width    : data.boardWidth,
			delivery_cus_po_no      : data.cusPoNo,
			delivery_order_id       : data.orderId,
			delivery_order_quantity : data.orderQuantity,
			delivery_score_info     : data.scoreInfo
		};
		return post( window.jpdn_domain_client + 'delivery/detail',postData);
	}
};
export default delivery;