import { get, post } from '../request';
import { staff } from '../urlMap';
import axios from 'axios';

const stock = {
	deliveryArea(){
		return post(staff.stock.deliveryArea);
	}
}
export default stock;