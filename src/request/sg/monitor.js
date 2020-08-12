import { get, post } from '../request';

const monitor = {
	getSocketUrl(){
		return post( window.jpdn_domain_sg + 'socketUrl' );
	}
};
export default monitor;