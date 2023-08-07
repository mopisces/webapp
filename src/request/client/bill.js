import { get, post } from '../request';

const bill = {
	getBillCenterConfig( data ){
		return get(window.jpdn_domain_client + 'cusBillCenter/config');
	},
	getStatisData(data){
		let postData = {
			begin_date: data.beginDate,
			end_date: data.endDate
		};
		return post(window.jpdn_domain_client + 'cusBillCenter/statisData', postData);
	}
};
export default bill;