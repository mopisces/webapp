import { get, post } from '../request';
import { client } from '../urlMap';

const makeOffers = {
	//报价规则
	makeOffersRule( data ){
		return post(client.makeOffers.makeOffersRule,{is_cus:data});
	},
	//报价价格
	makeOffersPrice(){
		return post(client.makeOffers.makeOffersPrice);
	}
};
export default makeOffers;