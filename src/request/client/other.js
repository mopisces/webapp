import { get, post } from '../request';

const other = {
	contactWay(){
		return get( window.jpdn_domain_client + 'contactWay');
	},
	getIndexConfig(){
		return get( window.jpdn_domain_client + 'getIndexConfig');
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
		return post( window.jpdn_domain_client + 'register', postData);
	},
	changePass( data ){
		let postData = {
			change_old_pass     : data.oldPass,
			change_new_pass     : data.newPass,
			change_confirm_pass : data.confirmPass
		};
		return post( window.jpdn_domain_client + 'changePwd', postData);
	},
	getAuthUrl(){
		return post( window.jpdn_domain_client + 'getMenuUrl');
	},
	getMenuUserName(){
		return post( window.jpdn_domain_client + 'getClientUserName');
	}
};

export default other;