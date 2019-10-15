import { get, post } from '../request';
import { staff } from '../urlMap';
import axios from 'axios';

const frec = {
	cusPicker( keyword ){
		return post(staff.frec.cusPicker,{cus_key_word:keyword});
	},
	cusContact( data ){
		return post(staff.frec.cusContact,{cus_id:data.cusName,task_id:data.taskId});
	},
	recAdjustConfig(){
		return post(staff.frec.recAdjustConfig);
	},
	recAdjustMain( result ){
		console.log(result.adjustType);
		let postData = {
			cus_id : result.cusName,
			task_id: result.taskId,
			adjust_type : result.adjustType,
			date_type: result.dateType,
			frec_begin_date: result.beginDate,
			frec_end_date: result.endDate,
			pay_type: result.payType
		};
		return post(staff.frec.recAdjustMain,postData);
	},
}
export default frec;