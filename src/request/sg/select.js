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
	},
	getBlms( data ){
		let postData = {
			blms_active_type  : data.active,
			blms_config_index : data.index
		};
		return post(sg.select.getBlms,postData);
	},
	getScdd( data ){
		let postData = {
			scdd_sn           : data.sn,
			scdd_order_number : data.orderNumber,
			scdd_company_name : data.companyName,
			scdd_paper_code   : data.paperCode,
			scdd_flute_type   : data.fluteType,
			scdd_width        : data.width,
			scdd_config_index : data.activeItem,
			cur_page          : data.curPage
		};
		return post(sg.select.getScdd,postData);
	},
	getWgddConfig(){
		return get(sg.select.getWgddConfig);
	},
	getWgdd( data ){
		let postData = {
			wgdd_sn           : data.sn,
			wgdd_order_number : data.orderNumber,
			wgdd_company_name : data.companyName,
			wgdd_paper_code   : data.paperCode,
			wgdd_flute_type   : data.fluteType,
			wgdd_width        : data.width,
			wgdd_begin_time   : data.beginDate,
			wgdd_end_time     : data.endDate,
			wgdd_config_index : data.activeItem,
			cur_page          : data.curPage,
		};
		return post(sg.select.getWgdd, postData);
	}
}
export default select;