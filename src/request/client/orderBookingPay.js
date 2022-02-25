import { post } from '../request';

const orderBookingPay = {
	sBuildConfig( fastOrderId ){
		let postData = {
			fast_order_id : fastOrderId
		};
		return post( window.jpdn_domain_client + 'ordersBookingPay/sBuildConfig', postData );
	},
	sBuildSave( data ){
		let postData = {
			cus_order_id          : data.cusOrderId,
			material_type         : data.materialType,
			simple_board_length   : data.boardLength,
			simple_board_width    : data.boardWidth,
			simple_line_ball_info : data.lineBallInfo,
			line_ball_formula     : data.lineBallFormula,
			order_quantities      : data.orderQuantities,
			delivery_date         : data.date,
			delivery_address      : data.address,
			delivery_remark       : data.deliveryRemark,
			production_remark     : data.productionRemark,
			is_edge               : data.isEdge == '净片' ? 0 : 1,
			dOrdPrice             : data.dOrdPrice,
			dOriPrice             : data.dOriPrice,
			dAmt                  : data.dAmt,
			dSLength              : data.dSLength,
			dSWidth               : data.dSWidth,
			dSalesArea            : data.dSalesArea,
			dSquarePrice          : data.dSquarePrice,
			dUnitPrice            : data.dUnitPrice,
			quotaId               : data.quotaId,
		};
		return post( window.jpdn_domain_client + 'ordersBookingPay/sBuildSave', postData );
	},
	cBuildConfig( fastOrderId ){
		let postData = {
			fast_order_id : fastOrderId
		};
		return post( window.jpdn_domain_client + 'ordersBookingPay/cBuildConfig', postData );
	},
	cBuildSave( data ){
		let postData = {
			cus_order_id          : data.cusOrderId,
			material_type         : data.materialType,
			box_type              : data.boxType,
			line_ball_info        : data.lineBallInfo,
			line_ball_formula     : data.lineBallFormula,
			box_length            : data.boxLength,
			box_width             : data.boxWidth,
			box_height            : data.boxHeight,
			box_clack             : data.tonLen,
			box_adjust            : data.uLen,
			box_board_length      : data.length,
			box_board_width       : data.width,
			sheet_quantities      : data.bdMultiple,
			order_quantities      : data.ordQty,
			card_board_quantities : data.bdQty,
			delivery_address      : data.address,
			delivery_date         : data.date,
			delivery_remark       : data.deliveryRemark,
			production_remark     : data.productionRemark,
			is_edge               : data.isEdge == '净片' ? 0 : 1,
			dOrdPrice             : data.dOrdPrice,
			dOriPrice             : data.dOriPrice,
			dAmt                  : data.dAmt,
			dSLength              : data.dSLength,
			dSWidth               : data.dSWidth,
			dSalesArea            : data.dSalesArea,
			dSquarePrice          : data.dSquarePrice,
			dUnitPrice            : data.dUnitPrice,
			quotaId               : data.quotaId,
		};
		return post( window.jpdn_domain_client + 'ordersBookingPay/cBuildSave', postData );
	},
	checkSBuild( data ){
		let postData = {
			check_data_type       : 's',
			cus_order_id          : data.cusOrderId,
			material_type         : data.materialType,
			simple_board_length   : data.boardLength,
			simple_board_width    : data.boardWidth,
			simple_line_ball_info : data.lineBallInfo,
			line_ball_formula     : data.lineBallFormula,
			order_quantities      : data.orderQuantities,
			delivery_date         : data.date,
			delivery_address      : data.address,
			delivery_remark       : data.deliveryRemark,
			production_remark     : data.productionRemark,
			is_edge               : data.isEdge == '净片' ? 0 : 1,
			dOrdPrice             : data.dOrdPrice,
			dOriPrice             : data.dOriPrice,
			dAmt                  : data.dAmt,
			dSLength              : data.dSLength,
			dSWidth               : data.dSWidth,
			dSalesArea            : data.dSalesArea,
			dSquarePrice          : data.dSquarePrice,
			dUnitPrice            : data.dUnitPrice,
			quotaId               : data.quotaId,
		};
		return post( window.jpdn_domain_client + 'ordersBookingPay/checkBuild', postData );
	},
	checkCBuild( data ){
		let postData = {
			check_data_type:'c',
			cus_order_id          : data.cusOrderId,
			material_type         : data.materialType,
			box_type              : data.boxType,
			line_ball_info        : data.lineBallInfo,
			line_ball_formula     : data.lineBallFormula,
			box_length            : data.boxLength,
			box_width             : data.boxWidth,
			box_height            : data.boxHeight,
			box_clack             : data.tonLen,
			box_adjust            : data.uLen,
			box_board_length      : data.length,
			box_board_width       : data.width,
			sheet_quantities      : data.bdMultiple,
			order_quantities      : data.ordQty,
			card_board_quantities : data.bdQty,
			delivery_address      : data.address,
			delivery_date         : data.date,
			delivery_remark       : data.deliveryRemark,
			production_remark     : data.productionRemark,
			is_edge               : data.isEdge == '净片' ? 0 : 1,
			dOrdPrice             : data.dOrdPrice,
			dOriPrice             : data.dOriPrice,
			dAmt                  : data.dAmt,
			dSLength              : data.dSLength,
			dSWidth               : data.dSWidth,
			dSalesArea            : data.dSalesArea,
			dSquarePrice          : data.dSquarePrice,
			dUnitPrice            : data.dUnitPrice,
			quotaId               : data.quotaId,
		};
		return post( window.jpdn_domain_client + 'ordersBookingPay/checkBuild', postData );
	},
}

export default orderBookingPay;