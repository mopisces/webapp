import { get, post } from '../request';
import { staff } from '../urlMap';
const wx = {
	getScanConfig( data ){
		let postData = {
			scan_url_type   : data.urlType,
			redirect_domain : data.domain,
			redirect_port   : data.port
		};
		console.log(postData)
		return post(staff.wx.scanWxConfig,postData);
	},
	portValuable(){
		return post(staff.wx.portValuable);
	}
};
export default wx;