import axios from 'axios';

const table = {
	getTableConfig(){
		return new Promise((resolve, reject) => {
			axios.get('/table.json').then(response=>{
				resolve(response.data);
			}).catch(error=>{
				reject(error.data);
			});
		});
	}
};

export default table;