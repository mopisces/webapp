import { get, post } from '../request';
import { admin } from '../urlMap';

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
	}
};
export default board;