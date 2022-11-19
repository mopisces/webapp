import { get, post } from '../request';

const quo = {
	getCustomer(custId)
	{
		return post( window.jpdn_domain_staff + 'quo/getCustomer',{cus_key_word:custId} );
	},
	getCustomerQuoDetail(data)
	{
		return post( window.jpdn_domain_staff + 'quo/getQuoDetail',{cus_quo_type:data.active,cus_id:data.cusId} );
	}
};

export default quo;