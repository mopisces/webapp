import { get, post } from '../request';
import { client } from '../urlMap';
import axios from 'axios';
const commonMaterial = {
	getMaterial( data ){
		let postData = {
			index_show_checked : data.showChecked,
			cur_page           : data.curPage
		};
		return post(client.commonMaterial.getMaterial, postData);
	},
	materialSave( data ){
		let postData = {

		};
		return post(client.commonMaterial.materialSave, postData);
	},
	getConfig(){
		return get(client.commonMaterial.getMaterialConfig);
	}
};
export default commonMaterial;