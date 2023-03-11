import { get, post } from '../request';

const login = {
	getSF(){
		return get( window.jpdn_domain_staff + 'getSF' );
		/*return get( 'staff','getSF' );*/
	},
	isOpenGroup(){
		return get( window.jpdn_domain_staff + 'isOpenGroup' );
		/*return get( 'staff' , 'isOpenGroup' );*/
	},
	fetchConfig(){
		return post( window.jpdn_domain_staff + 'config/fetchConfig' );
	}
};

export default login;