import { get, post } from '../request';
import { client } from '../urlMap';
import axios from 'axios';
const cred = {
	creditBalanceAmt(){
		return get(client.cred.creditBalanceAmt);
	}
};
export default cred;