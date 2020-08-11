import { get, post } from '../request';

const contact={
	contactLists( curPage ){
		return post( window.jpdn_domain_admin + 'adminContactList', { cur_page : curPage });
	},
	contactDel( id ){
		return post( window.jpdn_domain_admin + 'adminContactDel', { del_id : id });
	},
	contactAdd( data ){
		let postData = {
			add_icon    : data.iconName,
			add_name    : data.name,
			add_content : data.content
		};
		return post( window.jpdn_domain_admin + 'adminContactAddMain', postData);
	},
	contactAddConfig(){
		return post( window.jpdn_domain_admin + 'adminContactAddConfig');
	},
	contactEditSave( data ){
		let postData = {
			edit_save_id      : data.id,
			edit_save_name    : data.name,
			edit_save_contact : data.contact,
			edit_save_icon    : data.iconName
		};
		return post( window.jpdn_domain_admin + 'adminContactEditSave', postData);
	},
	contactEditConfig( contactId ){
		return post( window.jpdn_domain_admin + 'adminContactEditConfig', { edit_id:contactId });
	},
};
export default contact;