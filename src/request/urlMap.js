import base from './base';
const map = {
	
};
const webappMap = {

};
const adminUrl = {
	login: `${base.admin}login`
};
const staff = {
	calc : {
		boardPicker : `${base.staff}boardPicker`,
		boxPicker : `${base.staff}boxPicker`,
		calBdQuotaInfo : `${base.delphi}CalBdQuotaInfo`,
	},
	frec : {
		cusPicker: `${base.staff}frecCusPicker`,
		cusContact: `${base.staff}frecCusContact`,
		recAdjustConfig: `${base.staff}frecAdjustConfig`,
		recAdjustMain: `${base.staff}frecAdjustMain`,
	},
	stock:{
		deliveryArea : `${base.staff}deliveryArea`,
	},
	paper:{
		staffPaperSafe:`${base.staff}staffPaperSafe`,
		paperWxConfig:`${base.staff}staffPaperWxConfig`,
		stockConfig:`${base.staff}staffSStockConfig`,
		stockMain:`${base.staff}staffSStock`,
	},
	paperbuy:{
		paperInConfig:`${base.staff}staffPaperInConfig`,
		paperInDetail:`${base.staff}staffPaperInDetail`,
		paperInMain:`${base.staff}staffPaperInMain`,
	},
	cred:{
		wGetCusAmt: `${base.staff}wGetCusAmt`,
		cusAmtDetail:`${base.staff}cusAmtDetail`,
	},
	stow:{
		stowListConfig:`${base.staff}stowListConfig`,
		stowList:`${base.staff}stowList`,
	},
	statis:{
		getProInfo:`${base.staff}getProInfo`,
		getProInfoConfig:`${base.staff}getProInfoConfig`,
		getOrdStockConfig:`${base.staff}getOrdStockConfig`,
		getOrdStock:`${base.staff}getOrdStock`,
		statisDetail:`${base.staff}statisDetail`,
		getOrderSumConfig:`${base.staff}getOrderSumConfig`,
		getOrderSum:`${base.staff}getOrderSum`,
		getOrdReturnSumConfig:`${base.staff}getOrdReturnConfig`,
		getOrdReturnSum:`${base.staff}getOrdReturnSum`,
		getSchSumConfig:`${base.staff}getSchSumConfig`,
		getSchSum:`${base.staff}getSchSum`,
	},
	erp:{
		ordersDetail:`${base.staff}staffOrdersDetail`,
		erpConfig:`${base.staff}staffErpConfig`,
		erpOrders:`${base.staff}staffErp`,
	},
	daily:{
		staffDaily:`${base.staff}staffDaily`,
		dailyConfig:`${base.staff}staffDailyConfig`,
		getCusDateInfo:`${base.staff}staffGetCusInfo`,
		dailyDetail:`${base.staff}staffDailyDetail`,
		countOrder:`${base.staff}staffCountOrder`,
		getDailyUser:`${base.staff}staffDailyUser`,
	}
}
export { map, webappMap, adminUrl, staff};