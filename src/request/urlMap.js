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
	}
}
export { map, webappMap, adminUrl, staff};