import httpServer from './http';
import QS from 'qs';
//import { getDomain } from './domain';
export /*async*/ function post(url,params = {}){
	/*if( !window.domainInit ) await getDomain();*/
	return new Promise((resolve,reject)=>{
		httpServer.post(url,QS.stringify(params)).then(response=>{
			resolve(response.data);
		}).catch(error=>{
			reject(error.data);
		})
	})
};
export /*async*/ function get(/*type,*/url,params = {}){
	/*if( !window.domainInit ) await getDomain();
	if( type == 'staff' ) url = window.jpdn_domain_staff + url;
	console.log(url)*/
	
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