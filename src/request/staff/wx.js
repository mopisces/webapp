import { get, post } from '../request';
import { staff } from '../urlMap';
import axios from 'axios';
const wx = {
	getScanConfig( data ){
		let postData = {
			scan_url_type : data.urlType
		};
		return post(staff.wx.scanWxConfig,postData);
		//return post(staff.wx.scanWxConfig);
	},
	portValuable(){
		return post(staff.wx.portValuable);
	}
};
export default wx;