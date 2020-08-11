import { get, post } from '../request';

const image={
	getGroupImg(){
		return post( window.jpdn_domain_admin + 'adminGetGroupImg' );
	},
	defaultImgDel( data ){
		let postData = {
			default_pic_type : data.type,
			pic_name         : data.picName
		};
		return post( window.jpdn_domain_admin + 'adminDefaultImgDel', postData );
	},
	showListImg( id ){
		return post( window.jpdn_domain_admin + 'adminShowListImg', { group_list_id : id} );
	},
	delListImg( data ){
		let postData = {
			img_id   : data.id,
			pic_name : data.picName,
			pic_type : data.type
		};
		return post( window.jpdn_domain_admin + 'admiListImgDel', postData );
	}
};

export default image;