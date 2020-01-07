import { get, post } from '../request';
import { admin } from '../urlMap';

const board={
	getConfig(){
		return post(admin.board.getConfig);
	},
	getList( data ){
		let postData = {
			lists_order_type  : data.orderType,
			lists_order_state : data.orderState,
			lists_is_flag     : data.isFlag,
			cur_page          : 1,
			lists_is_delete   : 0
		};
		return post(admin.board.getList,postData);
	}
};
export default board;