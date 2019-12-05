import { get, post } from '../request';
import { client } from '../urlMap';
import axios from 'axios';
const orderBooking = {
	//简单纸板下单
	sBuildConfig( fastOrderId ){
		let postData = {
			fast_order_id : fastOrderId
		};
		return post(client.orderBooking.simplePaperBoardConfig, postData);
	},
};
export default orderBooking;