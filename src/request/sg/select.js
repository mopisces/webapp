import { get, post } from '../request';
import { sg } from '../urlMap';

const select = {
	getConfig( data ){
		return get(sg.select.getConfig);
	},
	getBl( data ){
		let postData = {
			bl_config_index : data.selectItem
		};
		return post(sg.select.getBl,postData);
	}
}
export default select;