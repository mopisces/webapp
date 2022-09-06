let storage = 'localStorage';

export function getStorage( storageName, type="localStorage" )
{
	if ('localStorage' === type) {
		return localStorage.getItem(storageName);
	}else if('sessionStorage' === type){
		return sessionStorage.getItem(storageName);
	}else {
		return localStorage.getItem(storageName);
	}
}

export function setStorage( storageName, storageData, type="localStorage" )
{
	let param = (typeof storageData=='string')&&storageData.constructor==String ? storageData : JSON.stringify(storageData);
	if ( 'localStorage' === type ) {
		return localStorage.setItem(storageName, param);
	}else if( 'sessionStorage' === type ){
		return sessionStorage.setItem(storageName, param);
	}else{
		return localStorage.setItem(storageName, param);
	}
}

export function removeStorage( storageName = null, type="localStorage" )
{
	if ('localStorage' === type) {
		return storageName != null ? localStorage.removeItem( storageName ) : localStorage.clear();
	}else if( 'sessionStorage' === type ){
		return storageName != null ? sessionStorage.removeItem( storageName ) : sessionStorage.clear();
	}else{
		return storageName != null ? localStorage.removeItem( storageName ) : localStorage.clear();
	}
}