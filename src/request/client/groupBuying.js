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
	},
	getSConfig( goodsId ){
		let postData = {
			is_taobao        : 0,
			booking_goods_id : goodsId			
		};
		return post(client.groupBuying.sConfig, postData);
	}
};
export default groupBuying;