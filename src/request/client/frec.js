import { post } from '../request';

const frec = {
	statisContactConfig(){
		return post( window.jpdn_domain_client + 'frec/getStatisContactConfig');
	},
	fetchStatisContact(data)
	{
		let postData = {
			statis_contact_begin_date: data.beginDate,
			statis_contact_end_date: data.endDate
		}
		return post( window.jpdn_domain_client + 'frec/fetchStatisContact', postData);
	}
};

export default frec;