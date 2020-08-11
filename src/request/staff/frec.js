import { get, post } from '../request';

const frec = {
	cusPicker( keyword ){
		return post( window.jpdn_domain_staff + 'frecCusPicker', {cus_key_word:keyword} );
	},
	cusContact( data ){
		return post( window.jpdn_domain_staff + 'frecCusContact', {cus_id:data.cusName,task_id:data.taskId} );
	},
	recAdjustConfig(){
		return post( window.jpdn_domain_staff + 'frecAdjustConfig' );
	},
	recAdjustMain( result ){
		let postData = {
			cus_id : result.cusName,
			task_id: result.taskId,
			adjust_type : result.adjustType,
			date_type: result.dateType,
			frec_begin_date: result.beginDate,
			frec_end_date: result.endDate,
			pay_type: result.payType
		};
		return post( window.jpdn_domain_staff + 'frecAdjustMain', postData );
	},
}
export default frec;