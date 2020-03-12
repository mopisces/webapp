import { get, post } from '../request';
import { sg } from '../urlMap';

const monitor = {
	getSocketUrl(){
		return post(sg.monitor.getSocketUrl);
	}
};
export default monitor;