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
		deliveryArea : `${base.staff}deliveryArea`,
	}
}
export { map, webappMap, adminUrl, staff};