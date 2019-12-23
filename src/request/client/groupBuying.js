import { get, post } from '../request';
import { client } from '../urlMap';
import axios from 'axios';
const groupBuying = {
	faddishList( isTaobao ){
		let postData = {
			is_taobao : isTaobao
		};
		return post(client.groupBuying.faddishList, postData);
	},
	groupBuyDetail( id ){
		let postData = {
			goods_detail_id : id,
			is_taobao       : 0
		};
		return post(client.groupBuying.groupBuyDetail, postData);
	}
};
export default groupBuying;