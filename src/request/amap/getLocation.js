import { get, post } from '../request';

const getLocation = {
	getCustomerDN(){
		return get( window.jpdn_domain_amap + 'getLocation/getCustomerDN' );
	},
	saveMapPosition( data ){
		let postData = {
			cus_id       : data.cusId,
			cus_sub_no   : data.cusSubNo,
			map_position : data.lnglat.join(',')
		};
		return post( window.jpdn_domain_amap + 'getLocation/saveMapPosition', postData );
	},
	getAreaData(){
		return get( window.jpdn_domain_amap + 'getArea/areaData' );
	}
};
export default getLocation