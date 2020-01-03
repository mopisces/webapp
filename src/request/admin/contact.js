import { get, post } from '../request';
import { admin } from '../urlMap';

const contact={
	contactLists( curPage ){
		return post(admin.contact.lists,{ cur_page : curPage });
	},
	contactDel( id ){
		return post(admin.contact.del,{ del_id : id });
	},
	contactAdd( data ){
		let postData = {
			add_icon    : data.prefix + '-' + data.iconName,
			add_name    : data.name,
			add_content : data.content
		};
		return post(admin.contact.add,postData);
	},
	contactAddConfig(){
		return post(admin.contact.addConfig);
	},
	contactEditSave( data ){
		let postData = {
			edit_save_id      : data.id,
			edit_save_name    : data.name,
			edit_save_contact : data.contact,
			edit_save_icon    : data.prefix + '-' + data.iconName
		};
		return post(admin.contact.edit, postData);
	},
	contactEditConfig( contactId ){
		return post(admin.contact.editConfig,{ edit_id:contactId });
	},
};
export default contact;