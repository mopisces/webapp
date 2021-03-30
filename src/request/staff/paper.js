import { get, post } from '../request';

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
		return post( window.jpdn_domain_staff + 'staffPaperSafe', postData );
	},
	paperConfig( url ){
		return post( window.jpdn_domain_staff + 'staffPaperConfig' );
	},
	stockConfig(){
		return post( window.jpdn_domain_staff + 'staffSStockConfig' );
	},
	stockMain( data ){
		let postData = {
			search_paper_data : data.searchData,
			search_paper_type : data.dataType
		};
		return post( window.jpdn_domain_staff + 'staffSStock', postData );
	},
	paperGetInInfo( inNo ){
		let postData = {
			stock_in_info_no : inNo
		};
		return post( window.jpdn_domain_staff + 'staffPaperGetInInfo', postData );
	},
	paperDoRStockIn( data ){
		let postData = {
			stock_in_no      : data.stockInNo,
			stock_in_op_time : data.inOpTime,
			stock_in_weight  : data.inWeight
		};
		return post( window.jpdn_domain_staff + 'staffPaperDoRStockIn', postData );
	},
	paperGetOutInfo( outNo ){
		let postData = {
			stock_out_info_no : outNo
		};
		return post( window.jpdn_domain_staff + 'staffPaperGetOutInfo', postData );
	},
	paperOutMain( data ){
		let postData = {
			stock_out_op_time  : data.stockOutOpTime,
			stock_out_no       : data.stockOutNo,
			stock_out_op_class : data.stockOutOpClass,
			stock_out_s_flute  : data.stockOutSFlute,
			stock_out_bzwt     : data.stockOutBzwt
		};
		return post( window.jpdn_domain_staff + 'staffPaperOutMain', postData );
	},
	directInConfig(){
		return post( window.jpdn_domain_staff + 'staffPaperDirectInConfig' );
	},
	getLastSchArea( orderId ){
		return post( window.jpdn_domain_staff + 'staffPaperGetLastSchArea', { direct_in_order_id : orderId } );
	},
	getOrdSchArea( orderId ){
		return post( window.jpdn_domain_staff + 'staffPaperGetOrdSchArea', { direct_in_order_id : orderId } );
	},
	getOrdInInfo( orderId ){
		return post( window.jpdn_domain_staff + 'staffPapergetOrdInInfo', { direct_in_order_id : orderId } );
	},
	paperDailyUsedConfig(){
		return post( window.jpdn_domain_staff + 'dailyUsed/config');
	},
	paperDailyUsedInfo( date ){
		return post( window.jpdn_domain_staff + 'dailyUsed/info',{ paper_daily_used_date : date });
	},
	paperDailyUsedDetail( data ){
		return post( window.jpdn_domain_staff + 'dailyUsed/detail',{ paper_daily_used_date : data.OutDate, paper_daily_used_code:data.PaperCode });
	},
};

export default paper;