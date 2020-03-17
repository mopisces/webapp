import { get, post } from '../request';
import { sg } from '../urlMap';

const alter = {
	getValue( data ){
		let postData = {
			alter_config_index : data.configIndex
		};
		return post(sg.alter.getValue,postData);
	},
	changeVal( data ){
		let postData = {
			change_config_index : data.configIndex,
			change_id           : data.id,
			change_value        : data.sliderValue
		};
		return post(sg.alter.changeVal,postData);
	},
	getRecord( data ){
		let postData = {
			alter_config_index : data.configIndex
		};
		return post(sg.alter.getRecord,postData);
	},
	clearRecord( data ){
		let postData = {
			alter_config_index : data.configIndex
		};
		return post(sg.alter.clearRecord,postData);
	}
}
export default alter;