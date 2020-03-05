import { get, post } from '../request';
import { client } from '../urlMap';
import axios from 'axios';

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
	}
};

export default other;