import { get, post } from '../request';

const cred = {
	wGetCusAmt( data ){
		let postData = {
			cus_id: data.cusId,
			is_stopped: data.isStopped,
			is_settle_day:data.isSettleDay
		};
		return post( window.jpdn_domain_staff + 'wGetCusAmt',postData);
	},
	cusAmtDetail( data ){
		return post( window.jpdn_domain_staff + 'cusAmtDetail', {detail_cus_id:data.cusId} );
	}
}
export default cred;