import { get, post } from '../request';
import { staff,erp } from '../urlMap';
import axios from 'axios';

const calc = {
	getCalcConfig(){
		return post(staff.calc.getCalcConfig);
	},
	boardPicker( keyword ){
		return post(staff.calc.boardPicker,{board_keyword:keyword});
	},
	boxPicker( keyword ){
		return post(staff.calc.boxPicker,{box_keyword:keyword});
	},
	getTrimAndArea( cusName ){
		return post(staff.calc.getTrimAndArea,{trim_area_cus_id:cusName})
	},
	getTonLenAndULen( data ){
		let postData = {
			trim_area_cus_id : data.cusName,
			board_id         : data.texName
		};
		return post(staff.calc.getTonLenAndULen,postData);
	},
	calBdQuotaInfo( data ){
		let postData = {
			strFactoryId : data.factoryId,
			strCusId     : data.cusName,
			strBoardId   : data.texName
		};
		return post(erp.calBdQuotaInfo,postData);
	},
	calBdPriceInfo( data ){
		let postData = data;
		return post(erp.calBdPriceInfo,postData);
	}
}
export default calc;