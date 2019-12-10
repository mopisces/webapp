import { erp } from '../urlMap';
import axios from 'axios';
import QS from 'qs';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
const connecterp = {
	/**
	 * [calBdQuotaInfo 订单试算]
	 * @param  {[object]} data 
	 * @return {[promise]}     
	 */
	calBdQuotaInfo( data ){
		let postData = {
			strFactoryId : data.factoryId,
			strCusId     : data.cusName,
			strBoardId   : data.texName
		};
		return axios.post(erp.calBdQuotaInfo,QS.stringify(postData));
	},
	/**
	 * [calBdPriceInfo 订单试算获取报价]
	 * @param  {[object]} data 
	 * @return {[promise]}     
	 */
	calBdPriceInfo( data ){
		let postData = data;
		return axios.post(erp.calBdPriceInfo,QS.stringify(postData));
	},
	/**
	 * [erpDelDNDetail 库存修改删除库]
	 * @param  {[object]} data 
	 * @return {[promise]}     
	 */
	erpDelDNDetail( data ){
		let postData = {
			iPListNo     : data.iPListNo,
			iDNId        : data.iDNId,
			strFactoryId : data.strFactoryId,
			strUserId    : data.strUserId
		};
		return axios.post(erp.delDNDetail,QS.stringify(postData));
	},
	/**
	 * [erpAddDNDetail 存修改修改]
	 * @param  {[object]} data  
	 * @return {[promise]}      
	 */
	erpAddDNDetail( data ){
		let postData = {
			iDNId        : data.iDNId,
            iPListNo     : data.iPListNo,
            iDeliQty     : data.iDeliQty,
            iFreeQty     : data.iFreeQty,
            iSchPNo      : 0,
            dDNPriceAdd  : 0.0,
            dOtherFee    : data.dOtherFee,
            strOrderId   : data.strOrderId,
            strCusId     : '',
            strStockArea : data.strStockArea,
            strDNRemark  : data.strDNRemark,
            strCusSubNo  : data.strCusSubNo,
            OrderType    : data.OrderType,
            bModify      : data.bModify,
            strFactoryId : data.strFactoryId,
            strUserId    : data.strUserId
		};
		return axios.post(erp.addDNDetail,QS.stringify(postData));
	},
	/**
	 * [preparePack 扫描装货准备]
	 * @param  {[object]} data 
	 * @return {[promise]}    
	 */
	preparePack( data ){
		let postData = {
			iPListNo     : data.pListNo,
			strFactoryId : data.strFactoryId,
			strUserId    : data.strUserId
		};
		return axios.post(erp.preparePack,QS.stringify(postData));
	},
	/**
	 * [unPreparePack 扫描装货取消准备]
	 * @param  {[object]} data 
	 * @return {[promise]}     
	 */
	unPreparePack( data ){
		let postData = {
			iPListNo     : data.pListNo,
			strFactoryId : data.strFactoryId,
			strUserId    : data.strUserId
		};
		return axios.post(erp.unPreparePack,QS.stringify(postData));
	},
	/**
	 * [erpModify 扫描装货修改]
	 * @param  {[object]} data 
	 * @return {[promise]}     
	 */
	erpModify( data ){
		let postData = {
			iOpType      : data.iOpType,
            ikey1        : data.ikey1,
            ikey2        : data.ikey2,
            ikey3        : data.ikey3,
            strOrderId   : data.strOrderId,
            strRemark    : data.strRemark,
            strStockArea : data.strStockArea,
            strFactoryId : data.strFactoryId,
            strUserId    : data.strUserId,
		};
		return axios.post(erp.mStockDetailR,QS.stringify(postData));
	},
	/**
	 * [directInStock 直接入库]
	 * @param  {[object]}   data [入库参数]
	 * @return {[promises]}      [axios返回]
	 */
	directInStock( data ){
		let postData = {
			iQty         : data.iQty,
			dInDate      : data.dInDate,
			strOrderId   : data.strOrderId,
			strRemark    : data.strRemark,
			strWorkGorup : data.strWorkGorup,
			strStockArea : data.strStockArea,
			strSchArea   : data.strSchArea,
			strFactoryId : data.strFactoryId,
			strUserId    : data.strUserId
		};
		return axios.post(erp.directInStock,QS.stringify(postData));
	}
};
export default connecterp;