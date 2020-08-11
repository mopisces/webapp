import { get, post } from '../request';

const paperbuy = {
	paperInConfig(){
		return post( window.jpdn_domain_staff + 'staffPaperInConfig' );
	},
	paperInDetail( data ){
		let postData = {
			paper_buy_in_no:data
		};
		return post( window.jpdn_domain_staff + 'staffPaperInDetail', postData );
	},
	paperInMain( data ){
		let postData = {
			paper_buy_order_date:data.buyOrderDate
		};
		return post( window.jpdn_domain_staff + 'staffPaperInMain', postData );
	},
	paperBuyConfig(){
		return post( window.jpdn_domain_staff + 'staffPaperBuyConfig' );
	},
	paperBuy( data ){
		let postData = {
			paper_buy_begin_date : data.beginDate,
			paper_buy_end_date   : data.endDate
		};
		return post( window.jpdn_domain_staff + 'staffPaperBuy', postData );
	},
	paperDetail( data ){
		let postData = {
			paper_buy_po_no: data.PONo
		};
		return post( window.jpdn_domain_staff + 'staffPaperDetail', postData );
	}
};

export default paperbuy;