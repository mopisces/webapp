import { get, post } from '../request';
import { client } from '../urlMap';
const groupBuying = {
	faddishList( isTaobao ){
		let postData = {
			is_taobao : isTaobao
		};
		return post(client.groupBuying.faddishList, postData);
	},
	groupBuyDetail( data ){
		let postData = {
			goods_detail_id : data.id,
			is_taobao       : data.isTaobao
		};
		return post(client.groupBuying.groupBuyDetail, postData);
	},
	getSConfig( goodsId ){
		let postData = {
			is_taobao        : 0,
			booking_goods_id : goodsId			
		};
		return post(client.groupBuying.sConfig, postData);
	},
	getAreaCost( data ){
		let postData = {
			area_cost_id     : data.productId,
			board_length     : data.boardLength,
			board_width      : data.boardWidth
		};
		if( data.orderQuantities ){
			postData['order_quantities'] = data.orderQuantities
		}else{
			postData['sheet_quantities'] = data.sheetQuantities
		}
		return post(client.groupBuying.getAreaCost, postData);
	},
	getBoxCost( data ){
		let postData = {
			box_cost_id  : data.productId,
			box_cost_qty : data.orderQuantities
		};
		return post(client.groupBuying.getBoxCost, postData);
	},
	sGroupBooking( data ){
		let postData = {
			booking_goods_id         : data.productId,
			cus_order_id             : data.cusOrderId,
			line_ball_info           : data.lineBallInfo,
			line_ball_formula        : data.lineBallFormula,
			simple_board_length      : data.boardLength,
			simple_board_width       : data.boardWidth,
			group_order_qty          : data.orderQuantities,
			simple_delivery_date     : data.date,
			simple_delivery_address  : data.address,
			simple_delivery_remark   : data.deliveryRemark,
			simple_production_remark : data.productionRemark
		};
		return post(client.groupBuying.sGroupBooking, postData);
	},
	sCheck( data ){
		let postData = {
			goods_type               : 's',
			booking_goods_id         : data.productId,
			cus_order_id             : data.cusOrderId,
			line_ball_info           : data.lineBallInfo,
			line_ball_formula        : data.lineBallFormula,
			simple_board_length      : data.boardLength,
			simple_board_width       : data.boardWidth,
			group_order_qty          : data.orderQuantities,
			simple_delivery_date     : data.date,
			simple_delivery_address  : data.address,
			simple_delivery_remark   : data.deliveryRemark,
			simple_production_remark : data.productionRemark
		};
		return post(client.groupBuying.bCheck, postData);
	},
	getCConfig( goodsId ){
		let postData = {
			is_taobao        : 0,
			booking_goods_id : goodsId			
		};
		return post(client.groupBuying.cConfig, postData);
	},
	getBoxFormula( boxType ){
		let postData = {
			box_type : boxType
		};
		return post(client.groupBuying.getBoxFormula, postData);
	},
	cGroupBooking( data ){
		let postData = {
			booking_goods_id      : data.productId,
			cus_order_id          : data.cusOrderId,
			box_type              : data.boxType,
			box_length            : data.boxLength,
			box_width			  : data.boxWidth,
			box_height            : data.boxHeight,
			box_clack             : data.tonLen,
			box_adjust            : data.uLen,
			board_length          : data.length,
			board_width           : data.width,
			sheet_quantities      : data.bdMultiple,
			group_order_qty       : data.ordQty,
			group_bd_qty          : data.bdQty,
			line_ball_info        : data.lineBallInfo,
			delivery_address      : data.address,
			delivery_date         : data.date,
			delivery_remark       : data.deliveryRemark,
			production_remark     : data.productionRemark
		};
		return post(client.groupBuying.cGroupBooking, postData);
	},
	cCheck( data ){
		let postData = {
			goods_type            : 'c',
			booking_goods_id      : data.productId,
			cus_order_id          : data.cusOrderId,
			box_type              : data.boxType,
			box_length            : data.boxLength,
			box_width			  : data.boxWidth,
			box_height            : data.boxHeight,
			box_clack             : data.tonLen,
			box_adjust            : data.uLen,
			board_length          : data.length,
			board_width           : data.width,
			sheet_quantities      : data.bdMultiple,
			group_order_qty       : data.ordQty,
			group_bd_qty          : data.bdQty,
			line_ball_info        : data.lineBallInfo,
			delivery_address      : data.address,
			delivery_date         : data.date,
			delivery_remark       : data.deliveryRemark,
			production_remark     : data.productionRemark
		};
		return post(client.groupBuying.bCheck, postData);
	},
	getTConfig( id ){
		let postData = {
			booking_goods_id : id,
			is_taobao        : 1,
		};
		return post(client.groupBuying.tConfig,postData);
	},
	tGroupBooking( data ){
		let postData = {
			booking_goods_id  : data.productId,
			group_order_qty   : data.orderQuantities,
			delivery_address  : data.address,
			delivery_date     : data.date,
			delivery_remark   : data.deliveryRemark,
			production_remark : data.productionRemark,
		};
		return post(client.groupBuying.tGroupBooking, postData);
	},
	tCheck( data ){
		let postData = {
			goods_type        : 't',
			booking_goods_id  : data.productId,
			group_order_qty   : data.orderQuantities,
			delivery_address  : data.address,
			delivery_date     : data.date,
			delivery_remark   : data.deliveryRemark,
			production_remark : data.productionRemark,
		};
		return post(client.groupBuying.bCheck, postData);
	},
	groupBuyList( data ){
		let postData = {
			group_state : data.state,
			filter_name : data.filterName,
			cur_page    : data.curPage,
			is_taobao   : data.isTaoBao
		};
		if( data.isTaoBao == 1 ){
			postData.box_l_min = data.boxLMin;
			postData.box_l_max = data.boxLMax;
			postData.box_w_min = data.boxWMin;
			postData.box_w_max = data.boxWMax;
			postData.box_h_min = data.boxHMin;
			postData.box_h_max = data.boxHMax;
		}
		return post(client.groupBuying.groupBuyList, postData);
	},
	groupBuyFilter( data ){
		let postData = {
			group_state : data.state,
			is_taobao   : data.isTaoBao
		};
		return post(client.groupBuying.groupBuyFilter, postData);
	},
	flagName( data ){

		let postData = {
			is_taobao   : data.isTaoBao
		};
		return post(client.groupBuying.flagName, postData);
	}
};
export default groupBuying;