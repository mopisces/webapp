import { get, post } from '../request';
import { staff } from '../urlMap';
import axios from 'axios';

const frec = {
	cusPicker( keyword ){
		return post(staff.frec.cusPicker,{cus_key_word:keyword});
	},
	cusContact( data ){
		return post(staff.frec.cusContact,{cus_id:data.cusName,task_id:data.taskId});
	}
}
export default frec;