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
	},
	paperBuyConfig(){
		return post(staff.paperbuy.paperBuyConfig);
	},
	paperBuy( data ){
		let postData = {
			paper_buy_begin_date : data.beginDate,
			paper_buy_end_date   : data.endDate
		};
		return post(staff.paperbuy.paperBuy,postData);
	},
	paperDetail( data ){
		let postData = {
			paper_buy_po_no: data.pONo
		};
		return post(staff.paperbuy.paperDetail,postData);
	}
}
export default paperbuy;