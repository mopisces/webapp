import base from './base';
const admin = {
	login: {
		login   : `${base.admin}login`,
		refresh : `${base.admin}refresh`,
	},
	user : {
		lists : `${base.admin}adminLists`,
		del   : `${base.admin}adminDel`,
		add   : `${base.admin}adminAdd`,
		edit  : `${base.admin}adminEdit`,
	},
	contact : {
		lists      : `${base.admin}adminContactList`,
		del        : `${base.admin}adminContactDel`,
		add        : `${base.admin}adminContactAddMain`,
		addConfig  : `${base.admin}adminContactAddConfig`,
		edit       : `${base.admin}adminContactEditSave`,
		editConfig : `${base.admin}adminContactEditConfig`,
	},
	config : {
		getConfig  : `${base.admin}adminConfig`,
		saveConfig : `${base.admin}adminSaveConfig`,
	},
	board : {
		getList       : `${base.admin}adminBoardLists`,
		del           : `${base.admin}adminBoardDel`,
		changeFlag    : `${base.admin}adminBoardFlag`,
		saveDescr     : `${base.admin}adminBoardDescr`,
		boardIdSelect : `${base.admin}adminBoardCode`,
		editConfig    : `${base.admin}adminBoardEdit`,
		editSave      : `${base.admin}adminBoardEsave`,
		addConfig     : `${base.admin}adminBoardConfig`,
		addSave       : `${base.admin}adminBoardAdd`, 
		undel         : `${base.admin}adminBoardUndel`,
		delPic        : `${base.admin}adminBoardPicDel`,
	},
	box : {
		getConfig    : `${base.admin}adminBoxConfig`,
		getList      : `${base.admin}adminBoxLists`,
		addSave      : `${base.admin}adminBoxAdd`,
		quoAddConfig : `${base.admin}adminBoxQuoAddConfig`,
		quoAdd       : `${base.admin}adminBoxQuoAdd`,
		quoBoxList   : `${base.admin}adminBoxQuoList`,
		delQuoBox    : `${base.admin}adminBoxQuoDel`,
		editQuoBox   : `${base.admin}adminBoxQuoEdit`,
		saveQuoBox   : `${base.admin}adminBoxQuoSave`
	},
	image : {
		getGroupImg   : `${base.admin}adminGetGroupImg`,   //配置图片显示
		setDefaultImg : `${base.admin}adminSetDefaultImg`, //上传配置图片
		defaultImgAdd : `${base.admin}adminDefaultImgAdd`, //上传默认图片
		defaultImgDel : `${base.admin}adminDefaultImgDel`, //删除默认图片
		showListImg   : `${base.admin}adminShowListImg`,   //展示编辑图片
		addListImg    : `${base.admin}admiListImgAdd`,     //添加图片
		delListImg    : `${base.admin}admiListImgDel`,     //删除图片
		descrImg      : `${base.admin}addDescrImage`       //保存描述图片
	}
};
const staff = {
	calc : {
		getCalcConfig    : `${base.staff}getCalcConfig`,
		boardPicker      : `${base.staff}boardPicker`,
		boxPicker        : `${base.staff}boxPicker`,
		getTrimAndArea   : `${base.staff}getTrimAndArea`,
		getTonLenAndULen : `${base.staff}getTonLenAndULen`,
	},
	frec : {
		cusPicker       : `${base.staff}frecCusPicker`,
		cusContact      : `${base.staff}frecCusContact`,
		recAdjustConfig : `${base.staff}frecAdjustConfig`,
		recAdjustMain   : `${base.staff}frecAdjustMain`,
	},
	stock:{
		deliveryArea   : `${base.staff}deliveryArea`,
		mStockDetailR  : `${base.staff}mStockDetailR`,
		getStockDetail : `${base.staff}getStockDetail`,
	},
	paper:{
		staffPaperSafe  : `${base.staff}staffPaperSafe`,
		paperConfig     : `${base.staff}staffPaperConfig`,
		stockConfig     : `${base.staff}staffSStockConfig`,
		stockMain       : `${base.staff}staffSStock`,
		paperGetInInfo  : `${base.staff}staffPaperGetInInfo`,
		paperDoRStockIn : `${base.staff}staffPaperDoRStockIn`,
		paperGetOutInfo : `${base.staff}staffPaperGetOutInfo`,
		paperOutMain    : `${base.staff}staffPaperOutMain`,
		directInConfig  : `${base.staff}staffPaperDirectInConfig`,
		getLastSchArea  : `${base.staff}staffPaperGetLastSchArea`,
		getOrdSchArea   : `${base.staff}staffPaperGetOrdSchArea`,
		getOrdInInfo    : `${base.staff}staffPapergetOrdInInfo`,
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
		staffUserInfo     : `${base.staff}staffUserInfo`,
		getUserManageType : `${base.staff}staffUserManageType`,
		getWebUserClient  : `${base.staff}staffWebUserClient`,
		getWebUserStaff   : `${base.staff}staffWebUserStaff`,
		getCommonQrCode   : `${base.staff}staffGetCommonQrcode`,
		getAuthName       : `${base.staff}staffGetAuthName`,
		getCommonAuth     : `${base.staff}staffCommonAuth`,
		saveAuthName      : `${base.staff}staffSaveAuthUrl`,
		userGetQrcode     : `${base.staff}staffUserGetQrcode`,
		changePass        : `${base.staff}staffChangePwd`,
		menuName          : `${base.staff}getStaffUserName`,
	},
	wx:{
		scanWxConfig : `${base.staff}staffGetWxConfig`,
		portValuable : `${base.staff}staffPortValuable`,
	},
	login:{
		getSF       : `${base.staff}getSF`,
		isOpenGroup : `${base.staff}isOpenGroup`,
	}
};

const erp = {
	delDNDetail    : `${base.erp}WebCommon/DelDNDetail`,    //扫描装货详情
	addDNDetail    : `${base.erp}WebAddDNDetail`,           //扫描装货详情
	preparePack    : `${base.erp}WebCommon/PreparePack`,    //扫描装货列表(准备)
	unPreparePack  : `${base.erp}WebCommon/UnPreparePack`,  //扫描装货列表(取消准备)
	calBdQuotaInfo : `${base.erp}CalBdQuotaInfo`,           //订单试算
	calBdPriceInfo : `${base.erp}CalBdPriceInfo`,           //订单试算
	directInStock  : `${base.erp}WebCommon/DirectInStock`,  //直接入库
	mStockDetailR  : `${base.erp}WebCommon/MStockDetailR`,  //库存修改
};

const index = {
	index:{
		index      : `${base.index}login`,
		getToken   : `${base.index}getToken`,
	}
};

const client = {
	cred : {
		creditBalanceAmt       : `${base.client}creditBalanceAmt`,
		statementAccountConfig : `${base.client}statementAccountConfig`,
		statementAccount       : `${base.client}statementAccount`,
	},
	makeOffers : {
		makeOffersRule  : `${base.client}makeOffersRule`,
		makeOffersPrice : `${base.client}makeOffersPrice`,
	},
	ordersManage : {
		erpOrdersConfig    : `${base.client}erpOrdersConfig`,
		erpOrders          : `${base.client}erpOrders`,
		dailyOrdersConfig  : `${base.client}dailyOrdersConfig`,
		optionalDate       : `${base.client}optionalDate`,
		cusInfo            : `${base.client}cusInfo`,
		dailyOrders        : `${base.client}dailyOrders`, 
		commonOrders       : `${base.client}commonOrders`, 
		cancelCommon       : `${base.client}cancelCommon`, 

		wechatOrdersConfig : `${base.client}wxConfig`, 
		wechatOrders       : `${base.client}wechatOrders`,
		wechatBaseDetail   : `${base.client}wechatBaseDetail`,
		wechatGroupDetail  : `${base.client}wechatGroupDetail`,
		wechatDelete       : `${base.client}wechatDelete`,
		wechatSetCommon    : `${base.client}wechatCommon`,
		wechatCancel       : `${base.client}cancelCommon`,
	},
	commonMaterial : {
		getMaterial       : `${base.client}commonMaterial`, 
		getMaterialConfig : `${base.client}getMaterialConfig`, 
		materialSave      : `${base.client}materialSave`, 
	},
	orderBooking : {
		simplePaperBoardConfig : `${base.client}simpleConfig`, 
		simplePaperBoardSave   : `${base.client}simpleSave`, 

		boxOrderConfig         : `${base.client}boxConfig`,
		boxOrderSave           : `${base.client}boxSave`,

		boxPaperConfig         : `${base.client}boxPaperConfig`,
		boxPaperSave           : `${base.client}boxPaperSave`,
		getBoxFormula          : `${base.client}getBoxFormula`,
		getClackAdjust         : `${base.client}getClackAdjust`,

		getCalcArea            : `${base.client}getClacArea`,
		checkBuild             : `${base.client}checkBuildData`,
	},
	paymentAll : {
		paymentIndex : `${base.client}paymentIndex`, 
		payDetail    : `${base.client}payDetail`, 
		applyRefund  : `${base.client}applyForRefund`, 
		checkApply   : `${base.client}applyRefund`, 
		getOrderId   : `${base.client}gerOrderId`
	},
	index : {
		contactWay     : `${base.client}contactWay`, 
		register       : `${base.client}register`, 
		indexConfig    : `${base.client}getIndexConfig`, 
		clientPwd      : `${base.client}changePwd`, 
		authUrl        : `${base.client}getMenuUrl`,
		menuName       : `${base.client}getClientUserName`,
	},
	groupBuying : {
		faddishList    : `${base.client}faddishList`, 
		groupBuyDetail : `${base.client}groupBuyDetail`, 
		sConfig        : `${base.client}groupBoardPaperConfig`,
		getAreaCost    : `${base.client}getAreaCost`,
		getBoxCost     : `${base.client}getBoxCost`,
		sGroupBooking  : `${base.client}simpleGroupBooking`,
		cConfig        : `${base.client}boardBoxGroupConfig`,
		getBoxFormula  : `${base.client}getBoxFormula`,
		cGroupBooking  : `${base.client}boxGroupBooking`,
		tConfig        : `${base.client}taoBaoGroupConfig`,
		tGroupBooking  : `${base.client}taoBaoGroupBooking`,
		groupBuyList   : `${base.client}groupBuyList`,
		groupBuyFilter : `${base.client}groupBuyFilter`,
		flagName       : `${base.client}flagName`,

		bCheck         : `${base.client}groupBCheck`
	}
};

const pay = {
	alipay        : `${base.pay}alipay`,
	wxpay         : `${base.pay}wxpay`,
	wxPayForJsapi : `${base.pay}wxPayForJsapi`,
	wxPayJwt      : `${base.pay}wxPayJwt`,
}

const sg = {
	alter : {
		getConfig   : `${base.sg}alterConfig`,
		getValue    : `${base.sg}alertGetValue`,
		changeVal   : `${base.sg}alertChangeValue`,
		getRecord   : `${base.sg}alertGetRecord`,
		clearRecord : `${base.sg}alertClearRecord`,
	},
	select : {
		getConfig     : `${base.sg}selectConfig`,
		getBl         : `${base.sg}selectGetBl`,
		getBlms       : `${base.sg}selectBlms`,
		getScdd       : `${base.sg}selectGetScdd`,
		getWgddConfig : `${base.sg}selectGetWgddConfig`,
		getWgdd       : `${base.sg}selectGetWgdd`, 
	},
	monitor : {
		getSocketUrl : `${base.sg}socketUrl`
	},
	login : {
		login : `${base.sg}login`
	}
};
const wechat = {
	login : {
		checkUserInfo : `${base.wechat}checkUserInfo`,
		bindAccount   : `${base.wechat}bindAccount`,
		wxStaffLogin  : `${base.wechat}wxStaffLogin`,
		wxMulitLogin  : `${base.wechat}wxMulitLogin`,
	},
	config : {
		serverInfo  : `${base.wechat}wxConfig`,
		getBindInfo : `${base.wechat}wxBindInfo`,
	}
};
export { admin, staff, erp, index, client, pay, sg, wechat };