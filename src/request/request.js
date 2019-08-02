import httpServer from './http';
import QS from 'qs';
export function post(url,params = {}){
	return new Promise((resolve,reject)=>{
		httpServer.post(url,QS.stringify(params)).then(response=>{
			resolve(response.data);
		}).catch(error=>{
			reject(error.data);
		})
	})
};
export function get(url,params = {}){
	return new Promise((resolve,reject)=>{
		httpServer.get(url,{
			params:params
		}).then( response => {
			resolve(response.data);
		}).catch( error =>{
			reject(error.data);
		})
	})
};