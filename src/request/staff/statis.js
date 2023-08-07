import { get, post } from '../request';

const statis = {
	getProInfo2( data ){
		let postData = {
			info_begin_date : data.beginDate,
			info_end_date   : data.endDate,
			return_date_type : data.dateType,
		}
		return post( window.jpdn_domain_staff + 'statis/getProInfo2', postData );
	},
	getProInfo( data ){
		let postData = {
			info_begin_date : data.beginDate,
			info_end_date   : data.endDate
		}
		return post( window.jpdn_domain_staff + 'getProInfo', postData );
	},
	getProInfoConfig(){
		return post( window.jpdn_domain_staff + 'getProInfoConfig' );
	},
	getOrdStockConfig(){
		return post( window.jpdn_domain_staff + 'getOrdStockConfig' );
	},
	getOrdStock( data ){
		let postData = {
			stock_statis_state : data.statisState,
			stock_date_type    : data.dateType,
			stock_begin_date   : data.beginDate,
			stock_end_date     : data.endDate,
			stock_remain_day   : data.remainDay,
			stock_diff_day     : data.diffDay,
			stock_cust_name    : data.cusName
		}
		return post( window.jpdn_domain_staff + 'getOrdStock', postData );
	},
	statisDetail( data ){
		let postData = {
			detail_begin_date  : data.beginDate,
			detail_end_date    : data.endDate,
			detail_date_type   : data.dateType,
			detail_cur_page    : data.curPage,
			detail_s_type      : data.sType,
			detail_remain_day  : data.remainDay,
			detail_diff_day    : data.diffDay
		}
		if( data.limitFactor ){
			switch( data.limitFactor ){
				case 'flutes' :
					postData.detail_limit_factor = 1;
					postData.detail_limit_value = data.limitValue;
					break;
				case 'cusId' :
					postData.detail_limit_factor = 2;
					postData.detail_limit_value = data.limitValue;
					break;
				case 'taskId' :
					postData.detail_limit_factor = 3;
					postData.detail_limit_value = data.limitValue;
					break;
				case 'returnCause' :
					postData.detail_limit_factor = 4;
					postData.detail_limit_value = data.limitValue;
					break;
				default : 
					postData.detail_limit_factor = 0;
					postData.detail_limit_value = '';
			}
			
		}
		return post( window.jpdn_domain_staff + 'statisDetail', postData );
	},
	getOrderSumConfig(){
		return post( window.jpdn_domain_staff + 'getOrderSumConfig' );
	},
	getOrderSum( data ){
		let postData = {
			order_begin_date  : data.beginDate,
			order_end_date    : data.endDate,
			order_statis_type : data.statisState,
			order_date_type   : data.dateType
		};
		return post( window.jpdn_domain_staff + 'getOrderSum', postData );
	},
	getOrdReturnSumConfig(){
		return post( window.jpdn_domain_staff + 'getOrdReturnConfig' );
	},
	getOrdReturnSum( data ){
		let postData={
			return_begin_date   : data.beginDate,
			return_end_date     : data.endDate,
			return_statis_state : data.statisState,
			return_date_type    : data.dateType,   
		};
		return post( window.jpdn_domain_staff + 'getOrdReturnSum', postData );
	},
	getSchSumConfig(){
		return post( window.jpdn_domain_staff + 'getSchSumConfig' );
	},
	getSchSum( data ){
		let postData = {
			sch_begin_date  : data.beginDate,
			sch_end_date    : data.endDate,
			sch_date_type   : 'ProDate',
			sch_s_state     : data.sState,
			sch_statis_type : data.statisType,
		};
		return post( window.jpdn_domain_staff + 'getSchSum', postData );
	},
	getSaleStatisConfig(){
		return post( window.jpdn_domain_staff + 'saleSConfig' );
	},
	getSaleStatisData( data ){
		let postData = {
			hide_begin_date: data.beginDate,
			hide_end_date: data.endDate
		};
		return post( window.jpdn_domain_staff + 'saleStatis', postData);
	},
	//订单统计2
	getStatisAmonutConfig(){
		return post( window.jpdn_domain_staff + 'statis/getStatisAmountDataConfig');
	},
	getStatisAmountData(data){
		let postData = {
			daily_order_amount_begin_date: data.dailyBeginDate,
			daily_order_amount_end_date: data.dailyEndDate,
			delivery_amount_begin_date: data.deliveryBeginDate,
			delivery_amount_end_date: data.deliveryEndDate
		};
		return post( window.jpdn_domain_staff + 'statis/getStatisAmountData', postData);
	}

};

export default statis;