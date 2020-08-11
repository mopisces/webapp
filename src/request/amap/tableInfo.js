import { get, post } from '../request';

const tableInfo = {
	getTableInfo(){
		return get( window.jpdn_domain_amap + 'tableData/getTableData' );
	},
	getUnPackList(){
		return get( window.jpdn_domain_amap + 'tableData/getUnPackList' );
	},
	getPDNCus( pListNo ){
		return post( window.jpdn_domain_amap + 'tableData/getPDNCus', {p_list_no:pListNo} );
	},
	getPackDetail(){
		return post( window.jpdn_domain_amap + 'tableData/getSelSchPackDetail' );
	},
	getDistance(){
		return post( window.jpdn_domain_amap + 'distanceInfo/getDistance')
	}
};

export default tableInfo;