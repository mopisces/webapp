import { get, post } from '../request';
import { client } from '../urlMap';

const other = {
	contactWay(){
		return get(client.index.contactWay);
	},
	getIndexConfig(){
		return get(client.index.indexConfig);
	},
	register( data ){
		let postData = {
			reg_user_name      : data.userName,
			reg_user_pass      : data.passWord,
			reg_confim_pass    : data.confirmPass,
			reg_chi_name       : data.chiName,
			reg_short_name     : data.shortName,
			reg_erp_id         : data.erpId,
			reg_dn_address     : data.dnAddress,
			reg_contact_person : data.contactPerson,
			reg_contact_phone  : data.contactPhone,
			reg_fax_no         : data.faxNo,
		};
		return post(client.index.register, postData);
	},
	changePass( data ){
		let postData = {
			change_old_pass     : data.oldPass,
			change_new_pass     : data.newPass,
			change_confirm_pass : data.confirmPass
		};
		return post(client.index.clientPwd, postData);
	},
	getAuthUrl(){
		return post(client.index.authUrl);
	}
};

export default other;