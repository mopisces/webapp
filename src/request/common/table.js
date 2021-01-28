import axios from 'axios';

const table = {
	getTableConfig:async function(){
		let personalized = await axios.get('/personalized.json');
		let common = await axios.get('/table.json');
		let table = {};
		let clientWidth = document.documentElement.clientWidth;
		for(var key in common.data){
			table[key] = common.data[key];
			if( personalized.data.hasOwnProperty(key) === true ){
				table[key]  = personalized.data[key];
			}
		}
		for(var idx in table ){
			table[idx].forEach((item,index)=>{
				table[idx][index].width = table[idx][index].width * clientWidth / 375;
			});
		}
		return new Promise((resolve, reject)=>{
			resolve(table);
		});
	}
};

export default table;