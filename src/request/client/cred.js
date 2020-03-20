import { get, post } from '../request';
import { client } from '../urlMap';
const cred = {
	creditBalanceAmt(){
		return get(client.cred.creditBalanceAmt);
	},
	statementAccountConfig(){
		return get(client.cred.statementAccountConfig);
	},
	statementAccount( data ){
		let postData = {
			statement_begin_date   : data.beginDate,
			statement_end_date     : data.endDate,
			statement_account_type : data.type
		};
		return post(client.cred.statementAccount, postData);
	}
};
export default cred;