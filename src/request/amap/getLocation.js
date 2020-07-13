import { get, post } from '../request';
import { amap } from '../urlMap';

const getLocation = {
	getCustomerDN(){
		return get(amap.getLocation.getCustomerDN);
	},
	saveMapPosition( data ){
		let postData = {
			cus_id       : data.cusId,
			cus_sub_no   : data.cusSubNo,
			map_position : data.lnglat.join(',')
		};
		return post(amap.getLocation.saveMapPosition, postData);
	},
	getAreaData(){
		return get(amap.getArea.areaData);
	}
};
export default getLocation