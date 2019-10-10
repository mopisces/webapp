import { get, post } from '../request';
import { staff } from '../urlMap';
import axios from 'axios';

const calc = {
	boardPicker( keyword ){
		return post(staff.calc.boardPicker,{board_keyword:keyword});
	},
	boxPicker( keyword ){
		return post(staff.calc.boxPicker,{box_keyword:keyword});
	},
	calBdQuotaInfo( data ){
		return post(staff.calc.calBdQuotaInfo,{strFactoryId:'DH',strCusId:data,strBoardId:data});
	}
}
export default calc;