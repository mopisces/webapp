import { get, post } from '../request';

const cred = {
	creditBalanceAmt(){
		return get(window.jpdn_domain_client + 'creditBalanceAmt');
	},
	statementAccountConfig(){
		return get(window.jpdn_domain_client + 'statementAccountConfig');
	},
	statementAccount( data ){
		let postData = {
			statement_begin_date   : data.beginDate,
			statement_end_date     : data.endDate,
			statement_account_type : data.type
		};
		return post(window.jpdn_domain_client + 'statementAccount', postData);
	},
	cusFreeMBTable( data ){
		let postData = {
			fmb_table_begin_date   : data.beginDate,
			fmb_table_end_date     : data.endDate,
		};
		return post(window.jpdn_domain_client + 'cusFreeMBTable', postData);
	},
	cusFreeMBTableDetail( data ){
		let postData = {
			
		};
		return post(window.jpdn_domain_client + 'cusFreeMBTableDetail', postData);
	}
};
export default cred;