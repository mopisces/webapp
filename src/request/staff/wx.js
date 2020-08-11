import { get, post } from '../request';

const wx = {
	getScanConfig( data ){
		let postData = {
			scan_url_type   : data.urlType,
			redirect_domain : data.domain,
			redirect_port   : data.port
		};
		return post( window.jpdn_domain_staff + 'staffGetWxConfig', postData );
	},
	portValuable(){
		return post( window.jpdn_domain_staff + 'staffPortValuable' );
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
		return post( window.jpdn_domain_staff + 'staffScanCode', postData );
	}
};

export default wx;