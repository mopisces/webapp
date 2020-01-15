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
	},

	//纸箱下单
	xBuildConfig( fastOrderId ){
		let postData = {
			fast_order_id : fastOrderId
		};
		return post(client.orderBooking.boxOrderConfig, postData);
	},
	xBuildSave( data ){
		console.log( data );
		let postData = {
			cus_order_id      : data.cusOrderId,
			pon_name          : data.pON,
			external_member   : data.productId,
			order_quantities  : data.orderQuantities,
			delivery_address  : data.address,
			delivery_date     : data.date,
			delivery_remark   : data.deliveryRemark,
			production_remark : data.productionRemark
		};
		return post(client.orderBooking.boxOrderSave, postData);
	},

	//纸箱纸板下单
	cBuildConfig( fastOrderId ){
		let postData = {
			fast_order_id : fastOrderId
		};
		return post(client.orderBooking.boxPaperConfig, postData);
	},
	cBuildSave( data ){
		let postData = {
			cus_order_id          : data.cusOrderId,
			material_type         : data.materialType,
			box_type              : data.boxType,
			box_length            : data.boxLength,
			box_width             : data.boxWidth,
			box_height            : data.boxHeight,
			box_clack             : data.tonLen,
			box_adjust            : data.uLen,
			board_length          : data.length,
			board_width           : data.width,
			sheet_quantities      : data.bdMultiple,
			order_quantities      : data.ordQty,
			card_board_quantities : data.bdQty,
			delivery_address      : data.address,
			delivery_date         : data.date,
			delivery_remark       : data.deliveryRemark,
			production_remark     : data.productionRemark
		};
		return post(client.orderBooking.boxPaperSave, postData);
	},
	getBoxFormula( boxType ){
		let postData = {
			box_type : boxType
		};
		return post(client.orderBooking.getBoxFormula, postData);
	},
	getClackAdjust( materialType = '001' ){
		let postData = {
			material_type : materialType
		};
		return post(client.orderBooking.getClackAdjust, postData);
	}
};
export default orderBooking;