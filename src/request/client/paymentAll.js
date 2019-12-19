import { get, post } from '../request';
import { client } from '../urlMap';
import axios from 'axios';

const paymentAll = {
	paymentIndex( cusOrderId ){
		return post(client.paymentAll.paymentIndex,{cus_order_id:cusOrderId});
	}
};

export default paymentAll;