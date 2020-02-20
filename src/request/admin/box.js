import { get, post } from '../request';
import { admin } from '../urlMap';

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
};

export default box;