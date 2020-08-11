import { get, post } from '../request';
import { dateTimeFormat } from '@/util/index';

const box={
	getConfig(){
		return post( window.jpdn_domain_admin + 'adminBoxConfig' );
	},
	getList( data ){
		let postData = {
			lists_order_type  : data.orderType,
			lists_order_state : data.orderState,
			lists_is_flag     : data.isFlag,
			cur_page          : data.curPage,
			lists_is_delete   : 0,
			box_l_min         : data.boxLMin,
			box_l_max         : data.boxLMax,
			box_w_min         : data.boxWMin,
			box_w_max         : data.boxWMax,
			box_h_min         : data.boxHMin,
			box_h_max         : data.boxHMax,
			box_title         : data.title
		};
		return post( window.jpdn_domain_admin + 'adminBoxLists', postData );
	},
	editSave( data ){
		let postData = {
			save_order_id       : data.id,
			save_order_type     : 2,
			save_mat_no         : data.matNo,
			save_title          : data.title,
			save_market_price   : data.marketPrice,
			save_cus_max        : data.cusMax,
			save_cus_total      : data.total,
			save_begin_time     : dateTimeFormat(data.dateTime[0],'yyyy-MM-dd hh:mm:ss'),
			save_end_time       : dateTimeFormat(data.dateTime[1],'yyyy-MM-dd hh:mm:ss'),
			save_is_flag        : data.isFlag,
			save_is_range_price : data.isRangePrice,
			save_range_price    : JSON.stringify( data.rangePrice ),
			save_build_min      : data.buildMin,
			save_build_max      : data.buildMax,
			save_price          : data.price,
			save_first_to       : data.firstTo,
			save_first_price    : data.firstPrice,
			save_last_from      : data.lastFrom,
			save_last_price     : data.lastPrice
		};
		return post( window.jpdn_domain_admin + 'adminBoardEsave', postData );
	},
	getDelList( data ){
		let postData = {
			lists_order_type  : data.orderType,
			lists_order_state : 0,
			lists_is_flag     : 0,
			cur_page          : data.curPage,
			lists_is_delete   : 1,
			box_l_min         : data.boxLMin,
			box_l_max         : data.boxLMax,
			box_w_min         : data.boxWMin,
			box_w_max         : data.boxWMax,
			box_h_min         : data.boxHMin,
			box_h_max         : data.boxHMax,
			box_title         : data.title
		};
		return post( window.jpdn_domain_admin + 'adminBoxLists', postData );
	},
	addSave( data ){
		let postData = {
			add_mat_no         : data.matNo,
			add_title          : data.title,
			add_market_price   : data.marketPrice,
			add_cus_max        : data.cusMax,
			add_cus_total      : data.total,
			add_begin_time     : dateTimeFormat(data.dateTime[0],'yyyy-MM-dd hh:mm:ss'),
			add_end_time       : dateTimeFormat(data.dateTime[1],'yyyy-MM-dd hh:mm:ss'),
			add_is_default_pic : data.isDefaultPic,
			add_is_flag        : data.isFlag,
			add_is_range_price : data.isRangePrice,
			add_range_price    : JSON.stringify( data.rangePrice ),
			add_build_min      : data.buildMin,
			add_build_max      : data.buildMax,
			add_price          : data.price,
			add_first_to       : data.firstTo,
			add_first_price    : data.firstPrice,
			add_last_from      : data.lastFrom,
			add_last_price     : data.lastPrice
		};
		return post( window.jpdn_domain_admin + 'adminBoxAdd', postData );
	},
	quoAddConfig(){
		return post( window.jpdn_domain_admin + 'adminBoxQuoAddConfig');
	},
	quoAdd( data ){
		let postData = {
			quo_board_id       : data.boardId,
			add_market_price   : data.marketPrice,
			add_cus_max        : data.cusMax,
			add_cus_total      : data.total,
			add_begin_time     : dateTimeFormat(data.dateTime[0],'yyyy-MM-dd hh:mm:ss'),
			add_end_time       : dateTimeFormat(data.dateTime[1],'yyyy-MM-dd hh:mm:ss'),
			add_is_default_pic : data.isDefaultPic,
			add_is_flag        : data.isFlag,
			add_is_range_price : data.isRangePrice,
			add_range_price    : JSON.stringify( data.rangePrice ),
			add_build_min      : data.buildMin,
			add_build_max      : data.buildMax,
			add_price          : data.price,
			add_first_to       : data.firstTo,
			add_first_price    : data.firstPrice,
			add_last_from      : data.lastFrom,
			add_last_price     : data.lastPrice
		};
		return post( window.jpdn_domain_admin + 'adminBoxQuoAdd', postData );
	},
	quoBoxList( data ){
		let postData = {
			lists_order_type : data.orderType,
			cur_page         : data.curPage
		};
		return post(  window.jpdn_domain_admin + 'adminBoxQuoList', postData );
	},
	delQuoBox( data ){
		let postData = {
			del_quo_board_id : data.BoardId,
			del_quo_id       : data.Id
		};
		return post( window.jpdn_domain_admin + 'adminBoxQuoDel', postData );
	},
	editQuoBox(data){
		return post( window.jpdn_domain_admin + 'adminBoxQuoEdit', {edit_id:data.id} );
	},
	saveQuoBox( data ){
		let postData = {
			edit_id            : data.id,
			edit_board_id      : data.boardId,
			add_market_price   : data.marketPrice,
			add_cus_max        : data.cusMax,
			add_cus_total      : data.total,
			add_begin_time     : dateTimeFormat(data.dateTime[0],'yyyy-MM-dd hh:mm:ss'),
			add_end_time       : dateTimeFormat(data.dateTime[1],'yyyy-MM-dd hh:mm:ss'),
			add_is_default_pic : data.isDefaultPic,
			add_is_flag        : data.isFlag,
			add_is_range_price : data.isRangePrice,
			add_range_price    : JSON.stringify( data.rangePrice ),
			add_build_min      : data.buildMin,
			add_build_max      : data.buildMax,
			add_price          : data.price,
			add_first_to       : data.firstTo,
			add_first_price    : data.firstPrice,
			add_last_from      : data.lastFrom,
			add_last_price     : data.lastPrice
		};
		return post( window.jpdn_domain_admin + 'adminBoxQuoSave', postData );
	},
	adjustQuoBox(){
		return post( window.jpdn_domain_admin + 'adminBoxQuoAdjust' );
	}
};

export default box;