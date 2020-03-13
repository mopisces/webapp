import { get, post } from '../request';
import { admin } from '../urlMap';
import { dateTimeFormat } from '@/util/index';
const board={
	getList( data ){
		let postData = {
			lists_order_type  : data.orderType,
			lists_order_state : data.orderState,
			lists_is_flag     : data.isFlag,
			cur_page          : data.curPage,
			lists_is_delete   : 0
		};
		return post(admin.board.getList,postData);
	},
	del( data ){
		let postData = {
			order_id   : data.Id,
			order_type : data.BoardId == null ? 1 : 2
		};
		return post(admin.board.del,postData);
	},
	changeFlag( data ){
		let postData = {
			order_id       : data.orderId,
			order_type     : data.orderType,
			change_is_flag : data.isFlag
		};
		return post(admin.board.changeFlag,postData);
	},
	saveDescr( data ){
		let postData = {
			order_id      : data.id,
			order_type    : data.orderType,
			descr_content : data.descr
		};
		return post(admin.board.saveDescr,postData);
	},
	boardIdSelect(){
		return post(admin.board.boardIdSelect);
	},
	editConfig( data ){
		let postData = {
			edit_order_id : data.id,
			edit_type     : data.type
		};
		return post(admin.board.editConfig,postData);
	},
	editSave( data ){
		let postData = {
			save_board_id       : data.boardId,
			save_order_id       : data.id,
			save_order_type     : 1,
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
	addConfig(){
		return post(admin.board.addConfig);
	},
	addSave( data ){
		let postData = {
			add_board_id       : data.boardId,
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
			add_last_price     : data.lastPrice,
		};
		return post(admin.board.addSave,postData);
	},
	getDelList( data ){
		let postData = {
			lists_order_type  : data.orderType,
			lists_order_state : 0,
			lists_is_flag     : 0,
			cur_page          : data.curPage,
			lists_is_delete   : 1
		};
		return post(admin.board.getList,postData);
	},
	undel( data ){
		let postData = {
			undel_order_type : data.MatNo == null ? '1' : '2',
			order_id         : data.Id
		};
		return post(admin.board.undel,postData);
	},
	delPic( data ){
		let postData = {
			default_pic_type : data.type,
			pic_name         : data.picName
		};
		return post(admin.board.delPic,postData);
	}
};
export default board;