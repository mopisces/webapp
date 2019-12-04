import { get, post } from '../request';
import { client } from '../urlMap';
import axios from 'axios';
const commonMaterial = {
	getMaterial( data ){
		let postData = {
			index_show_checked : data.showChecked == true ? '1' : '0',
			index_key_words    : data.keyWord,
			cur_page           : data.curPage
		};
		return post(client.commonMaterial.getMaterial, postData);
	},
	materialSave( data ){
		let postData = {
			board_select_name : data.selectName
		};
		return post(client.commonMaterial.materialSave, postData);
	},
	getConfig(){
		return get(client.commonMaterial.getMaterialConfig);
	}
};
export default commonMaterial;