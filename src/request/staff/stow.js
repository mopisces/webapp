import { get, post } from '../request';

const stow = {
	stowListConfig(){
		return post( window.jpdn_domain_staff + 'stowListConfig' );
	},
	stowList( data ){
		let postData = {
			list_begin_date : data.beginDate,
			list_end_date   : data.endDate,
			show_pack       : data.showPack == true ? 1 : 0,
			show_sign       : data.showSign == true ? 1 : 0
		};
		return post( window.jpdn_domain_staff + 'stowList', postData );
	},
	detailConfig(){
		return post( window.jpdn_domain_staff + 'stowDetailConfig' );
	},
	getPDNDetail( data ){
		return post( window.jpdn_domain_staff + 'getPDNDetail', {list_no:data.listNo} );
	},
	getOrdPackInfo( strOrderId ){
		let postData = {
			str_order_id:strOrderId
		};
		return post( window.jpdn_domain_staff + 'getOrdPackInfo', postData );
	},
	getStockArea( strOrderId ){
		let postData = {
			str_order_id : strOrderId
		};
		return post( window.jpdn_domain_staff + 'getStockArea', postData );
	}
};

export default stow;