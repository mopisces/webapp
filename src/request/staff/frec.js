import { get, post } from '../request';

const frec = {
	cusPicker( keyword ){
		return post( window.jpdn_domain_staff + 'frecCusPicker', {cus_key_word:keyword} );
	},
	cusContact( data ){
		return post( window.jpdn_domain_staff + 'frecCusContact', {cus_id:data.cusName,task_id:data.taskId} );
	},
	recAdjustConfig(){
		return post( window.jpdn_domain_staff + 'frecAdjustConfig' );
	},
	recAdjustMain( result ){
		let postData = {
			cus_id : result.cusName,
			task_id: result.taskId,
			adjust_type : result.adjustType,
			date_type: result.dateType,
			frec_begin_date: result.beginDate,
			frec_end_date: result.endDate,
			pay_type: result.payType
		};
		return post( window.jpdn_domain_staff + 'frecAdjustMain', postData );
	},
	getFrecPayType( type ){
		return post( window.jpdn_domain_staff + 'frec/getPayType', { frec_pay_type: type } );
	},
	frecDoDel( data ){
		let postData = {
			frec_factory_id : data.FactoryId,
			frec_type       : data.type,
			frec_pay_id     : data.PayId,
			frec_del_remark : data.delRemark
		};
		return post( window.jpdn_domain_staff + 'frec/doDel', postData );
	},
	frecDoModify( data ){
		let postData = {
			frec_factory_id  : data.FactoryId,
			frec_pay_id      : data.PayId,
			frec_cus_id      : data.CusId,
			frec_op_date     : data.OpDate,
			frec_pay_type_id : data.PayTypeId,
			frec_issue_date  : data.IssueDate,
			frec_amount      : data.Amount,
			frec_remark      : data.Remark,
			frec_receipt_no  : data.ReceiptNo,
			frec_need_inv    : data.NeedInv,
			frec_type        : data.type,

		};
		return post( window.jpdn_domain_staff + 'frec/doModify', postData );
	},
	frecDoInsert( data ){
		let postData = {
			frec_factory_id  : data.FactoryId,
			frec_pay_id      : data.PayId,
			frec_cus_id      : data.CusId,
			frec_op_date     : data.OpDate,
			frec_pay_type_id : data.PayTypeId,
			frec_issue_date  : data.IssueDate,
			frec_amount      : data.Amount,
			frec_remark      : data.Remark,
			frec_receipt_no  : data.ReceiptNo,
			frec_need_inv    : data.NeedInv,
			frec_type        : data.type
		};
		return post( window.jpdn_domain_staff + 'frec/doInsert', postData );
	},
	frecDoCheck( data ){
		let postData = {
			frec_factory_id  : data.FactoryId,
			frec_pay_id      : data.PayId,
			frec_type        : data.type,
			frec_check_type  : data.Checked
		};
		return post( window.jpdn_domain_staff + 'frec/doCheck', postData );
	},
}
export default frec;