import { get, post } from '../request';
import { adminUrl } from '../urlMap';
import axios from 'axios';
const login={
	login(){
		return get(adminUrl.login,{a:'ssss',b:'ddddd'});
	},
	check(){
		return get('http://localhost:8001/public/v1/webappCustomer/check',{jwt:localStorage.getItem("jwt")});
	},
	getAllProductInfo(){
		let allCusApi = {
			sxhr: get('http://localhost:8001/public/v1/webappCustomer/sxhr'),
			asd: get('http://localhost:8001/public/v1/webappCustomer/asd'),
			szgh: get('http://localhost:8001/public/v1/webappCustomer/szgh'),
		};
		let proInfo = {};
		axios.all([allCusApi.sxhr,allCusApi.asd,allCusApi.szgh]).then(axios.spread((sxhr, asd, szgh)=>{
			proInfo.sxhr = sxhr;
			proInfo.asd = asd;
			proInfo.szgh = szgh;
		}));
		return proInfo;
	}
};
export default login;