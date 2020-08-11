import { get, post } from '../request';

const user={
	getUserList( curPage ){
		let postData = {
			cur_page : curPage
		};
		return post( window.jpdn_domain_admin + 'adminLists', postData);
	},
	addUser( data ){
		let postData = {
			add_admin_name : data.userName,
			add_admin_pass : data.userPass
		};
		return post( window.jpdn_domain_admin + 'adminAdd', postData);
	},
	delUser( userName ){
		let postData = {
			del_admin_name : userName,
		};
		return post( window.jpdn_domain_admin + 'adminDel', postData);
	},
	editUser( data ){
		let postData = {
			edit_admin_name : data.userName,
			edit_admin_pass : data.userPass
		};
		return post( window.jpdn_domain_admin + 'adminEdit', postData);
	}
};

export default user;
