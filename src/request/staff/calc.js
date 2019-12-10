import { get, post } from '../request';
import { staff,erp } from '../urlMap';

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
	}
}
export default calc;