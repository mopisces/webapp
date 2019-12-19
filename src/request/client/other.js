import { get, post } from '../request';
import { client } from '../urlMap';
import axios from 'axios';

const other = {
	contactWay(){
		return get(client.index.contactWay);
	},
	getIndexConfig(){
		return get(client.index.indexConfig);
	}
};

export default other;