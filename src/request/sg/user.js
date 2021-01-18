import { get, post } from '../request';
const user = {
	getList(){
		return post( window.jpdn_domain_sg + 'userList' );
	},
	doEdit(data){
		let postData = {
			id      : data.id,
			is_edit : data.edit,
			user    : data.user,
			pass    : data.pass,
		};
		return post( window.jpdn_domain_sg + 'userDoEdit', postData );
	},
	doStatus(data){
		return post( window.jpdn_domain_sg + 'userDoStatus', data );
	}
};

export default user;