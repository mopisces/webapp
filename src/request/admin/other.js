import { get, post } from '../request';
import { admin } from '../urlMap';

const other={
	showImg( id ){
		let postData = {
			img_id : id
		};
		return post(admin.other.showImg, postData)
	}
};

export default other;