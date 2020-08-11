import { get, post } from '../request';

const stock = {
	deliveryArea(){
		return post( window.jpdn_domain_staff + 'deliveryArea' );
	},
	mStockDetailR(){
		return post( window.jpdn_domain_staff + 'mStockDetailR' );
	},
	getStockDetail( strOrderId ){
		return post( window.jpdn_domain_staff + 'getStockDetail', { str_order_id : strOrderId })
	}
};

export default stock;