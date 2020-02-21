import { get, post } from '../request';
import { admin } from '../urlMap';
import { dateTimeFormat } from '@/util/index';
const box={
	getConfig(){
		return post(admin.box.getConfig);
	},
	getList( data ){
		let postData = {
			lists_order_type  : data.orderType,
			lists_order_state : data.orderState,
			lists_is_flag     : data.isFlag,
			cur_page          : data.curPage,
			lists_is_delete   : 0
		};
		return post(admin.box.getList,postData);
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
		return post(admin.board.editSave,postData);
	},
	getDelList( data ){
		let postData = {
			lists_order_type  : data.orderType,
			lists_order_state : 0,
			lists_is_flag     : 0,
			cur_page          : data.curPage,
			lists_is_delete   : 1
		};
		return post(admin.box.getList,postData);
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
		return post(admin.box.addSave,postData);
	}
};

export default box;