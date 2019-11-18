import { get, post } from '../request';
import { staff,erp } from '../urlMap';
import axios from 'axios';

const paper = {
	staffPaperSafe( data ){
		let postData = {
			safe_paper_state : data.safePaperState,
			safe_paper_type  : data.safePaperType,
			safe_paper_code  : data.safePaperCode,
			safe_paper_width : data.safePaperWidth,
			safe_paper_name  : data.safePaperName,
			safe_s_remark    : data.safeSRemark,
		};
		return post(staff.paper.staffPaperSafe,postData);
	},
	paperConfig( url ){
		return post(staff.paper.paperConfig);
	},
	stockConfig(){
		return post(staff.paper.stockConfig);
	},
	stockMain( data ){
		let postData = {
			search_paper_data : data.searchData,
			search_paper_type : data.dataType
		};
		return post(staff.paper.stockMain,postData);
	},
	paperGetInInfo( inNo ){
		let postData = {
			stock_in_info_no : inNo
		};
		return post(staff.paper.paperGetInInfo,postData);
	},
	paperDoRStockIn( data ){
		let postData = {
			stock_in_no      : data.stockInNo,
			stock_in_op_time : data.inOpTime,
			stock_in_weight  : data.inWeight
		};
		return post(staff.paper.paperDoRStockIn,postData);
	},
	paperGetOutInfo( outNo ){
		let postData = {
			stock_out_info_no : outNo
		};
		return post(staff.paper.paperGetOutInfo,postData);
	},
	paperOutMain( data ){
		let postData = {
			stock_out_op_time  : data.stockOutOpTime,
			stock_out_no       : data.stockOutNo,
			stock_out_op_class : data.stockOutOpClass,
			stock_out_s_flute  : data.stockOutSFlute,
			stock_out_bzwt     : data.stockOutBzwt
		};
		return post(staff.paper.paperOutMain,postData);
	},
	directInConfig(){
		return post(staff.paper.directInConfig);
	},
	getLastSchArea( orderId ){
		return post(staff.paper.getLastSchArea,{ direct_in_order_id : orderId });
	},
	getOrdSchArea( orderId ){
		return post(staff.paper.getOrdSchArea,{ direct_in_order_id : orderId });
	},
	getOrdInInfo( orderId ){
		return post(staff.paper.getOrdInInfo,{ direct_in_order_id : orderId });
	},
	directInStock( data ){
		let postData = {
			iQty         : data.iQty,
			dInDate      : data.iQty,
			strOrderId   : data.strOrderId,
			strRemark    : data.strRemark,
			strWorkGorup : data.strWorkGorup,
			strStockArea : data.strStockArea,
			strSchArea   : data.strSchArea,
			strFactoryId : data,
			strUserId    : data
		};
		return post(erp.DirectInStock,postData);
	}
}
export default paper;