import { get, post } from '../request';

const statis = {
	getStatisAmonutConfig(){
		return post( window.jpdn_domain_client + 'statis/getAmountStatisConfig');
	},
	getStatisAmountData( postData ){
		return post( window.jpdn_domain_client + 'statis/getAmountStatisData', postData);
	}
};

export default statis;