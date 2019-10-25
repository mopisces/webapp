import { get, post } from '../request';
import { staff } from '../urlMap';
import axios from 'axios';

const paperbuy = {
	paperInConfig(){
		return post(staff.paperbuy.paperInConfig);
	},
	paperInDetail( data ){
		let postData = {
			paper_buy_in_no:data
		};
		return post(staff.paperbuy.paperInDetail,postData);
	},
	paperInMain( data ){
		let postData = {
			paper_buy_order_date:data.buyOrderDate
		};
		return post(staff.paperbuy.paperInMain,postData);
	}
}
export default paperbuy;