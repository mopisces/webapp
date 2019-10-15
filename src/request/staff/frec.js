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
	recAdjustMain( data ){
		//console.log(data);
		let postData = {
			adjust_type : data.adjustType,
			date_type: 0,
			frec_begin_date: '2017-10-12',
			frec_end_date: '2019-08-27',
			pay_type: 8 
		};
		return post(staff.frec.recAdjustMain,postData);
	},
}
export default frec;