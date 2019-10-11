import { get, post } from '../request';
import { staff } from '../urlMap';
import axios from 'axios';

const frec = {
	cusPicker( keyword ){
		return post(staff.frec.cusPicker,{cus_key_word:keyword});
	},
	cusContact( cusId ){
		return post(staff.frec.cusContact,{cus_id:cusId});
	}
}
export default frec;