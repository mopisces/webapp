import { get, post } from '../request';
import { admin } from '../urlMap';

const user={
	getUserList( curPage ){
		let postData = {
			cur_page : curPage
		};
		return post(admin.user.lists, postData);
	},
	addUser( data ){
		let postData = {
			add_admin_name : data.userName,
			add_admin_pass : data.userPass
		};
		return post(admin.user.add, postData);
	},
	delUser( userName ){
		let postData = {
			del_admin_name : userName,
		};
		return post(admin.user.del, postData);
	},
	editUser( data ){
		let postData = {
			edit_admin_name : data.userName,
			edit_admin_pass : data.userPass
		};
		return post(admin.user.edit, postData);
	},
	addUser( data ){
		let postData = {
			add_admin_name : data.userName,
			add_admin_pass : data.userPass
		};
		return post(admin.user.add, postData);
	}
};
export default user;
