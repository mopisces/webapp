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
		getCalcConfig  : `${base.staff}getCalcConfig`,
		boardPicker    : `${base.staff}boardPicker`,
		boxPicker      : `${base.staff}boxPicker`,
		getTrimAndArea : `${base.staff}getTrimAndArea`,

	},
	frec : {
		cusPicker       : `${base.staff}frecCusPicker`,
		cusContact      : `${base.staff}frecCusContact`,
		recAdjustConfig : `${base.staff}frecAdjustConfig`,
		recAdjustMain   : `${base.staff}frecAdjustMain`,
	},
	stock:{
		deliveryArea : `${base.staff}deliveryArea`,
	},
	paper:{
		staffPaperSafe : `${base.staff}staffPaperSafe`,
		paperConfig    : `${base.staff}staffPaperConfig`,
		stockConfig    : `${base.staff}staffSStockConfig`,
		stockMain      : `${base.staff}staffSStock`,
		paperGetInInfo : `${base.staff}staffPaperGetInInfo`,
	},
	paperbuy:{
		paperInConfig  : `${base.staff}staffPaperInConfig`,
		paperInDetail  : `${base.staff}staffPaperInDetail`,
		paperInMain    : `${base.staff}staffPaperInMain`,
		paperBuyConfig : `${base.staff}staffPaperBuyConfig`,
		paperBuy       : `${base.staff}staffPaperBuy`,
		paperDetail    : `${base.staff}staffPaperDetail`,
	},
	cred:{
		wGetCusAmt   : `${base.staff}wGetCusAmt`,
		cusAmtDetail : `${base.staff}cusAmtDetail`,
	},
	stow:{
		stowListConfig : `${base.staff}stowListConfig`,
		stowList       : `${base.staff}stowList`,
		detailConfig   : `${base.staff}stowDetailConfig`,
		getPDNDetail   : `${base.staff}getPDNDetail`,
		getOrdPackInfo : `${base.staff}getOrdPackInfo`,
		getStockArea   : `${base.staff}getStockArea`,
	},
	statis:{
		getProInfo            : `${base.staff}getProInfo`,
		getProInfoConfig      : `${base.staff}getProInfoConfig`,
		getOrdStockConfig     : `${base.staff}getOrdStockConfig`,
		getOrdStock           : `${base.staff}getOrdStock`,
		statisDetail          : `${base.staff}statisDetail`,
		getOrderSumConfig     : `${base.staff}getOrderSumConfig`,
		getOrderSum           : `${base.staff}getOrderSum`,
		getOrdReturnSumConfig : `${base.staff}getOrdReturnConfig`,
		getOrdReturnSum       : `${base.staff}getOrdReturnSum`,
		getSchSumConfig       : `${base.staff}getSchSumConfig`,
		getSchSum             : `${base.staff}getSchSum`,
	},
	erp:{
		ordersDetail : `${base.staff}staffOrdersDetail`,
		erpConfig    : `${base.staff}staffErpConfig`,
		erpOrders    : `${base.staff}staffErp`,
	},
	daily:{
		staffDaily     : `${base.staff}staffDaily`,
		dailyConfig    : `${base.staff}staffDailyConfig`,
		getCusDateInfo : `${base.staff}staffGetCusInfo`,
		dailyDetail    : `${base.staff}staffDailyDetail`,
		countOrder     : `${base.staff}staffCountOrder`,
		getDailyUser   : `${base.staff}staffDailyUser`,
	},
	user:{
		staffUserInfo    : `${base.staff}staffUserInfo`,
		getWebUserClient : `${base.staff}staffWebUserClient`,
		getWebUserStaff  : `${base.staff}staffWebUserStaff`,
		getCommonQrCode  : `${base.staff}staffGetCommonQrcode`,
		getAuthName      : `${base.staff}staffGetAuthName`,
		saveAuthName     : `${base.staff}staffSaveAuthUrl`,
	},
	wx:{
		scanWxConfig : `${base.staff}staffGetWxConfig`,
		portValuable : `${base.staff}staffPortValuable`,
	}
};

const erp = {
	delDNDetail    : `${base.erp}WebCommon/DelDNDetail`,    //扫描装货详情
	addDNDetail    : `${base.erp}WebCommon/WebAddDNDetail`, //扫描装货详情
	calBdQuotaInfo : `${base.erp}CalBdQuotaInfo`,           //订单试算
	CalBdPriceInfo : `${base.erp}CalBdPriceInfo`,           //订单试算
};
export { map, webappMap, adminUrl, staff, erp};