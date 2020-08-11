import { get, post } from '../request';

const calc = {
	getCalcConfig(){
		return post( window.jpdn_domain_staff + 'getCalcConfig' );
	},
	boardPicker( keyword ){
		return post( window.jpdn_domain_staff + 'boardPicker', { board_keyword:keyword } );
	},
	boxPicker( keyword ){
		return post( window.jpdn_domain_staff + 'boxPicker', { box_keyword:keyword } );
	},
	getTrimAndArea( cusName ){
		return post( window.jpdn_domain_staff + 'getTrimAndArea', { trim_area_cus_id:cusName })
	},
	getTonLenAndULen( data ){
		let postData = {
			trim_area_cus_id : data.cusName,
			board_id         : data.texName
		};
		return post( window.jpdn_domain_staff + 'getTonLenAndULen', postData );
	}
};

export default calc;