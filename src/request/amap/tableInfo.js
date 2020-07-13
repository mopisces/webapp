import { get, post } from '../request';
import { amap } from '../urlMap';

const tableInfo = {
	getTableInfo(){
		return get(amap.tableInfo.getTableInfo);
	},
	getUnPackList(){
		return get(amap.tableInfo.getUnPackList);
	},
	getPDNCus( pListNo ){
		return post(amap.tableInfo.getPDNCus,{p_list_no:pListNo});
	},
	getPackDetail(){
		return post(amap.tableInfo.getPackDetail);
	},
	getDistance(){
		return post(amap.tableInfo.getDistance)
	}
};

export default tableInfo;