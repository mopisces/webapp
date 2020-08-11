import { get, post } from '../request';

const login = {
	getSF(){
		return get( window.jpdn_domain_staff + 'getSF' );
	},
	isOpenGroup(){
		return get( window.jpdn_domain_staff + 'isOpenGroup' );
	}
};

export default login;