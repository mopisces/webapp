import { get, post } from '../request';

const customer = {
	fetchCustomerList( data ){
		let postData = {
			cus_id: data.cusId,
		};
		return post( window.jpdn_domain_staff + 'customer/fetchList', postData);
	}
}
export default customer;