import { post } from '../request';

const delivery = {
	dailyConfig(){
		return post( window.jpdn_domain_staff + 'delivery/daliyConfig');
	},
	staffInfo(data){
		let postData = {
			delivery_begin_date:data.beginDate,
			delivery_end_date:data.endDate
		};
		return post( window.jpdn_domain_staff + 'delivery/staffInfo',postData);
	},
	ListInfo(data){
		let postData = {
			delivery_begin_date:data.beginDate,
			delivery_end_date:data.endDate,
			delivery_cus_id:data.cusName
		};
		return post( window.jpdn_domain_staff + 'delivery/listInfo',postData);
	},
	cusInfo(data){
		let postData = {
			delivery_begin_date:data.beginDate,
			delivery_end_date:data.endDate,
			delivery_cus_id:data.CusId
		};
		return post( window.jpdn_domain_staff + 'delivery/cusInfo',postData);
	},
	dateInfo(data, filter){
		let postData = {
			delivery_board_length   : filter.boardLength,
			delivery_board_width    : filter.boardWidth,
			delivery_cus_po_no      : filter.cusPoNo,
			delivery_order_id       : filter.orderId,
			delivery_order_quantity : filter.orderQuantity,
			delivery_score_info     : filter.scoreInfo,
			delivery_begin_date     : data.beginDate,
			delivery_end_date       : data.endDate,
			delivery_cus_id         : data.cusId
		};
		return post( window.jpdn_domain_staff + 'delivery/dateInfo',postData);
	},
	detail(data){
		let postData = {
			delivery_cus_id         : data.cusId,
			delivery_order_date     : data.deliveryDate,
			delivery_board_length   : data.boardLength,
			delivery_board_width    : data.boardWidth,
			delivery_cus_po_no      : data.cusPoNo,
			delivery_order_id       : data.orderId,
			delivery_order_quantity : data.orderQuantity,
			delivery_score_info     : data.scoreInfo
		};
		return post( window.jpdn_domain_staff + 'delivery/detail',postData);
	}
};

export default delivery;