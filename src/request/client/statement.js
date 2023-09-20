import { post } from '../request';

const statement = {
	getBalStatementConfig(){
		return post( window.jpdn_domain_client + 'statement/getBalStatementConfig');
	},
	fetchBalStatementList( postData ){
		return post( window.jpdn_domain_client + 'statement/fetchBalStatementList', postData);
	}
};

export default statement;