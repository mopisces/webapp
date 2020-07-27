import { get, post } from '../request';
import { staff } from '../urlMap';
const wx = {
	getScanConfig( data ){
		let postData = {
			scan_url_type   : data.urlType,
			redirect_domain : data.domain,
			redirect_port   : data.port
		};
		return post(staff.wx.scanWxConfig,postData);
	},
	portValuable(){
		return post(staff.wx.portValuable);
	},
	scanQrCode( data ){
		let postData = {
			scan_url_type : data.urlType
		};
		if( data.urlType == '3' ){
			postData.list_no = data.listNo;
			postData.is_edit = data.isEdit;
			postData.order_type = data.orderType;
		}
		return post(staff.wx.scanQrCode,postData);
	}
};
export default wx;