import { get, post } from '../request';
import { client } from '../urlMap';

const orderBooking = {
	/**
	 * [sBuildConfig 简单纸板下单页面参数]
	 * @param  mix fastOrderId [快速下单ID]
	 * @return [axios promise object]
	 */
	sBuildConfig( fastOrderId ){
		let postData = {
			fast_order_id : fastOrderId
		};
		return post(client.orderBooking.simplePaperBoardConfig, postData);
	},
	/**
	 * [sBuildCheck 简单纸板下单前校验参数]
	 * @param  object data [下单参数]
	 * @return [axios promise object]
	 */
	sBuildCheck( data ){
		let postData = {
			check_data_type          : 's',
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
		return post(client.orderBooking.checkBuild, postData);
	},
	/**
	 * [sBuildSave 简单纸板下单]
	 * @param  object data [下单参数]
	 * @return [axios promise object]
	 */
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

	/**
	 * [xBuildConfig 纸箱下单页面参数]
	 * @param  mix fastOrderId [快速下单ID号]
	 * @return [axios promise object]
	 */
	xBuildConfig( fastOrderId ){
		let postData = {
			fast_order_id : fastOrderId
		};
		return post(client.orderBooking.boxOrderConfig, postData);
	},
	/**
	 * [xBuildCheck 纸箱下单数据校验]
	 * @param  object data [下单参数]
	 * @return [axios promise object]
	 */
	xBuildCheck( data ){
		let postData = {
			check_data_type   : 'x',
			cus_order_id      : data.cusOrderId,
			pon_name          : data.pON,
			external_member   : data.productId,
			order_quantities  : data.orderQuantities,
			delivery_address  : data.address,
			delivery_date     : data.date,
			delivery_remark   : data.deliveryRemark,
			production_remark : data.productionRemark
		};
		return post(client.orderBooking.checkBuild, postData);
	},
	/**
	 * [xBuildSave 纸箱下单保存]
	 * @param  object data [下单参数]
	 * @return [axios promise object]
	 */
	xBuildSave( data ){
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
	cBuildCheck( data ){
		let postData = {
			check_data_type       : 'c',
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
		return post(client.orderBooking.checkBuild, postData);
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
	},
	getCalcArea( data ){
		let postData = {
			area_length  : data.areaLength,
			area_width   : data.areaWidth,
			area_bd_qty  : data.areaBdQty,
			area_ord_qty : data.areaOrdQty
		};
		return post(client.orderBooking.getCalcArea, postData);
	}
};
export default orderBooking;