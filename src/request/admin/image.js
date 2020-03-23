import { get, post } from '../request';
import { admin } from '../urlMap';


const image={
	getGroupImg(){
		return post( admin.image.getGroupImg );
	},
	defaultImgDel( data ){
		let postData = {
			default_pic_type : data.type,
			pic_name         : data.picName
		};
		return post( admin.image.defaultImgDel, postData );
	},
	showListImg( id ){
		return post( admin.image.showListImg, { group_list_id : id} );
	},
	delListImg( data ){
		let postData = {
			img_id   : data.id,
			pic_name : data.picName,
			pic_type : data.type
		};
		return post( admin.image.delListImg, postData );
	}
};

export default image;