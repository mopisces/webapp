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
		getOrdStock:`${base.staff}getOrdStock`,
		statisDetail:`${base.staff}statisDetail`,	
	},
	erp:{
		ordersDetail:`${base.staff}staffOrdersDetail`,
		erpConfig:`${base.staff}staffErpConfig`,
		erpOrders:`${base.staff}staffErp`,
	}
}
export { map, webappMap, adminUrl, staff};