import { get, post } from '../request';

const alter = {
	getValue( data ){
		let postData = {
			alter_config_index : data.configIndex
		};
		return post( window.jpdn_domain_sg + 'alertGetValue', postData );
	},
	changeVal( data ){
		let postData = {
			change_config_index : data.configIndex,
			change_id           : data.id,
			change_value        : data.sliderValue
		};
		return post( window.jpdn_domain_sg + 'alertChangeValue', postData );
	},
	getRecord( data ){
		let postData = {
			alter_config_index : data.configIndex
		};
		return post( window.jpdn_domain_sg + 'alertGetRecord', postData );
	},
	clearRecord( data ){
		let postData = {
			alter_config_index : data.configIndex
		};
		return post( window.jpdn_domain_sg + 'alertClearRecord', postData );
	}
};

export default alter;