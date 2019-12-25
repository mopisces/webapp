import { get, post } from '../request';
import { client } from '../urlMap';
import axios from 'axios';
const groupBuying = {
	faddishList( isTaobao ){
		let postData = {
			is_taobao : isTaobao
		};
		return post(client.groupBuying.faddishList, postData);
	},
	groupBuyDetail( id ){
		let postData = {
			goods_detail_id : id,
			is_taobao       : 0
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
		console.log(data);
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
	sGroupBooking( data ){
		let postData = {
			booking_goods_id         : data.productId,
			cus_order_id             : data.cusOrderId,
			line_ball_info           : data.lineBallInfo,
			line_ball_formula        : data.lineBallFormula,
			simple_board_length      : data.boardLength,
			simple_board_width       : data.boardWidth,
			order_quantities         : data.orderQuantities,
			simple_delivery_date     : data.date,
			simple_delivery_address  : data.address,
			simple_delivery_remark   : data.deliveryRemark,
			simple_production_remark : data.productionRemark
		};
		return post(client.groupBuying.sGroupBooking, postData);
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
			sheet_quantities      : data.bdQty,
			order_quantities      : data.ordQty,
			card_board_quantities : data.bdMultiple,
			delivery_address      : data.address,
			delivery_date         : data.date,
			delivery_remark       : data.deliveryRemark,
			production_remark     : data.productionRemark
		};
		return post(client.groupBuying.cGroupBooking, postData);
	}
};
export default groupBuying;