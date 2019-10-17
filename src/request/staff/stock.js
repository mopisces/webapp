import { get, post } from '../request';
import { staff } from '../urlMap';
import axios from 'axios';

const stock = {
	deliveryArea(){
		return post(staff.frec.deliveryArea);
	}
}
export default stock;