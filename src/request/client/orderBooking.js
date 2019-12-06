import { get, post } from '../request';
import { client } from '../urlMap';
import axios from 'axios';
const orderBooking = {
	//简单纸板下单
	sBuildConfig( fastOrderId ){
		let postData = {
			fast_order_id : fastOrderId
		};
		return post(client.orderBooking.simplePaperBoardConfig, postData);
	},
	sBuildSave( data ){
		let postData = {
			cus_order_id             : data.cusOrderId,
			simple_board_length      : data.boardLength,
			simple_board_width       : data.boardWidth,
			simple_material_type     : data.materialType,
			line_ball_info           : data.lineBallInfo,
			line_ball_formula        : data.lineBallFormula,
			order_quantities         : data.orderQuantities,
			simple_delivery_address  : data.address,
			simple_delivery_date     : data.date,
			simple_delivery_remark   : data.deliveryRemark,
			simple_production_remark : data.productionRemark
		};
		return post(client.orderBooking.simplePaperBoardSave, postData)
	}
};
export default orderBooking;