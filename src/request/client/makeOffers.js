import { get, post } from '../request';

const makeOffers = {
	//报价规则
	makeOffersRule( data ){
		return post(window.jpdn_domain_client + 'makeOffersRule',{is_cus:data});
	},
	//报价价格
	makeOffersPrice(){
		return post(window.jpdn_domain_client + 'makeOffersPrice');
	}
};
export default makeOffers;