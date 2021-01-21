import axios from 'axios';

const table = {
	getTableConfig:async function(){
		/*return new Promise((resolve, reject) => {
			axios.get('/table.json').then(response=>{
				resolve(response.data);
			}).catch(error=>{
				reject(error.data);
			});
		});*/
		let personalized = await axios.get('/personalized.json');
		let common = await axios.get('/table.json');
		const table = Object.assign(common.data,personalized.data);
		return new Promise((resolve, reject)=>{
			resolve(table);
		});
	},
	mergeData( target, source ){
		
	}
};

export default table;