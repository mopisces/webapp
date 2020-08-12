import { get, post } from '../request';

const select = {
	getConfig( data ){
		return get( window.jpdn_domain_sg + 'selectConfig' );
	},
	getBl( data ){
		let postData = {
			bl_config_index : data.selectItem
		};
		return post( window.jpdn_domain_sg + 'selectGetBl', postData );
	},
	getBlms( data ){
		let postData = {
			blms_active_type  : data.active,
			blms_config_index : data.index
		};
		return post( window.jpdn_domain_sg + 'selectBlms', postData );
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
		return post( window.jpdn_domain_sg + 'selectGetScdd', postData );
	},
	getWgddConfig(){
		return get( window.jpdn_domain_sg + 'selectGetWgddConfig' );
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
		return post( window.jpdn_domain_sg + 'selectGetWgdd', postData );
	}
};

export default select;