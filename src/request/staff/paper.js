import { get, post } from '../request';
import { staff } from '../urlMap';
import axios from 'axios';

const paper = {
	staffPaperSafe( data ){
		let postData = {
			safe_paper_state: data.safePaperState,
			safe_paper_type: data.safePaperType,
			safe_paper_code: data.safePaperCode,
			safe_paper_width: data.safePaperWidth,
			safe_paper_name: data.safePaperName,
			safe_s_remark: data.safeSRemark,
		};
		return post(staff.paper.staffPaperSafe,postData);
	},
	paperWxConfig(){
		return post(staff.paper.paperWxConfig);
	},
	stockConfig(){
		return post(staff.paper.stockConfig);
	},
	stockMain( data ){
		let postData = {
			search_paper_data:'1050',
			search_paper_type:1
		};
		return post(staff.paper.stockMain,postData);
	}
}
export default paper;