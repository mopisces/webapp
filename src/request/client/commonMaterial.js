import { get, post } from '../request';

const commonMaterial = {
	getMaterial( data ){
		let postData = {
			index_show_checked : data.showChecked == true ? '1' : '0',
			index_key_words    : data.keyWord,
			cur_page           : data.curPage
		};
		return post(window.jpdn_domain_client + 'commonMaterial', postData);
	},
	materialSave( data ){
		let postData = {
			board_select_name : data.selectName
		};
		return post(window.jpdn_domain_client + 'materialSave', postData);
	},
	getConfig(){
		return get(window.jpdn_domain_client + 'getMaterialConfig');
	}
};
export default commonMaterial;