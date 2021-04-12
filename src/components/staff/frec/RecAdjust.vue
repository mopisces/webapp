<template>
	<div>
		<template v-if="config.modifyAuth">
			<van-button plain hairline type="info" style="width:50%" @click="addData()">添加</van-button>
			<van-button plain hairline type="info" style="width:50%" @click="config.popup.filterShow = true">筛选</van-button>
		</template>
		<template v-else>
			<van-button plain hairline type="info" style="width:100%" @click="config.popup.filterShow = true">筛选</van-button>
		</template>
		<van-tabs v-model="filterForm.adjustType" @change="tabsChange">
			<van-tab title="收款" name="1"></van-tab>
			<van-tab title="调账" name="0"></van-tab>
		</van-tabs>
		<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.columns" :table-data="info.table.data" row-hover-color="#eee" row-click-color="#edf7ff" :height="config.table.height" :row-click="modifyClick">
		</v-table>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<cus-picker :cusName.sync="filterForm.cusName" ></cus-picker>
				<van-field label="业务员" v-model="filterForm.taskId" placeholder="精确查询" input-align="center"/>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker>
				<radio-cell :radioInfo.sync="filterForm.dateType" :radioColumns="config.radio.options" title="日期类型"></radio-cell>
				<radio-cell :radioInfo.sync="filterForm.payType" :radioColumns="pageConfig.payType" title="科目"></radio-cell>
				<van-switch-cell v-model="info.switch.checked" title="记住筛选条件(本次登录有效)"/>
			</div>
		</popup-filter>
		<van-dialog v-model:show="config.dialog.show" :showConfirmButton="false" :close-on-click-overlay="true" @close="cleanDialog()">
			<cus-picker :cusName.sync="formData.CusId" :showCHN="true"></cus-picker>
			<van-switch-cell v-model="formData.NeedInv" :active-value="1" :inactive-value="0" title="受否需要开票" v-show=" filterForm.adjustType == 0 "/>
			<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="formData.OpDate" :minDate="dialogTime.minDate" :maxDate="dialogTime.maxDate" label="操作日期"></new-time-picker>
			<frec-sell-pay :typeId.sync="formData.PayTypeId" :type="filterForm.adjustType" @payTypeConfirm="setAmount"></frec-sell-pay>
			<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="formData.IssueDate" :minDate="dialogTime.minDate" :maxDate="dialogTime.maxDate" label="生效日期"></new-time-picker>
			<van-field :label="config.dialog.label + '金额'" v-model="formData.Amount" placeholder="请输入金额" input-align="center" :error-message="config.dialog.amountCHN" @blur="amountToCHN"/>
			<van-field :label="config.dialog.label + '备注'" v-model="formData.Remark" autosize rows="1" maxlength="50" show-word-limit type="textarea" placeholder="请输入备注"/>
			<van-field label="收据编号" v-model="formData.ReceiptNo" placeholder="请输入收据编号" input-align="center"/>
			<van-button type="danger" style="width:45%;margin-left:2.5%;margin-bottom:2%" @click="config.dialog.delShow = true" v-if="config.dialog.type == 1">删除</van-button>
			<van-button type="info" style="width:45%;margin-left:2.5%;margin-bottom:2%" @click="cancelClick" v-else>取消</van-button>
			<van-button type="primary" :disabled="config.dialog.confirmBtn.submit" :loading="config.dialog.confirmBtn.submit" loading-text="提交" style="width:45%;margin-left:2.5%;margin-bottom:2%;" @click="confirmClick()">确认</van-button>
		</van-dialog>
		<van-dialog v-model:show="config.dialog.delShow" title="删除原因" :show-confirm-button="false" :close-on-click-overlay="true" @close="cleanDelDialog()">
			<van-field v-model="formData.delRemark" autosize rows="2" maxlength="50" show-word-limit type="textarea" placeholder="请输入删除原因" />
			<van-button type="info" style="width:45%;margin-left:2.5%;margin-bottom:2%" @click="config.dialog.delShow = false">取消</van-button>
			<van-button type="primary" :disabled="config.dialog.delBtn.submit" :loading="config.dialog.delBtn.submit" loading-text="删除" style="width:45%;margin-left:2.5%;margin-bottom:2%;" @click="delClick()">删除</van-button>
		</van-dialog>
	</div>
</template>
<script>
	import { Button, Field, Tab, Tabs, SwitchCell, Dialog, Toast } from 'vant';
	import { digitUppercase } from '@/util';
	import CusPicker from '@/components/subject/picker/CusPicker.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import RadioCell from '@/components/subject/RadioCell.vue';
	import FrecSellPay from '@/components/subject/staff/FrecSellPay.vue';
	import schema from 'async-validator';
	export default {
		components:{
			[Button.name]: Button,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[Dialog.Component.name]: Dialog.Component,
			[Toast.name]: Toast,

			CusPicker,
			PopupFilter,
			NewTimePicker,
			RadioCell,
			FrecSellPay
		},
		data(){
			return {
				config:{
					modifyAuth: false, //收款调账维护权限是否开启
					getConfig:true,
					dialog:{
						show:false,
						rowData:{},
						label:null,
						negative:false,  //金额是否可以为负数
						type:0,          //0添加 1删除或者修改
						amountCHN:'',    //人名币大写金额
						delBtn:{
							submit:false,
						},
						confirmBtn:{
							submit:false,
						},
						delShow:false
					},
					table:{
						columns:[
							{field: 'Cus', title: '客户', width: 140, titleAlign: 'center', columnAlign: 'center',isResize:true ,isFrozen: true},
							{field: 'Checked', title: '审核', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true ,formatter: (rowData,rowIndex,pagingIndex,field)=>{
								if( rowData.last == 1 ){
									return '';
								}
								return rowData.Checked === '1'  ? '<span class="van-icon van-icon-success" style="color:#1aad19;"></span>' : '<span class="van-icon van-icon-fail"></span>';
							}},
							{field: 'PayId', title: '单号', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'OpDate', title: '操作日期', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'IssueDate', title: '生效日期', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'Amount', title: '金额', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'Remark', title: '备注', width: 150, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'NeedInv', title: '需开票', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true, formatter:(rowData,rowIndex,pagingIndex,field)=>{
								if( rowData.last == 1 ){
									return '';
								}
								return rowData.NeedInv === '1' ? '<span class="van-icon van-icon-success" style="color:#1aad19;"></span>' : '<span class="van-icon van-icon-fail"></span>';
							}},
							{field: 'ShortName', title: '科目', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'Task', title: '业务员', width: 150, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'ReceiptNo', title: '收据编号', width: 150, titleAlign: 'center', columnAlign: 'center',isResize:true},
						],
						height : 0
					},
					popup:{
						filterShow:false,
						timePicker:{
							isFinishLoad:false
						}
					},
					radio:{
						options:[
							{ title:'操作日期', value:0},
							{ title:'生效日期', value:1},
						],
					}
				},
				info:{
					table:{
						data:[],
					},
					switch:{
						checked:false
					},
					cusPicker:{
						searchData:'',
						columns:[],
					}
				},
				filterForm:{
					cusName:'',
					taskId:'',
					adjustType:1,
					dateType:0,
					beginDate:'',
					endDate:'',
					payType:'全部'
				},
				pageConfig:{
					defaultDate:null,
					maxDate:'',
					minDate:'',
					payType:[],
				},
				dialogTime:{
					maxDate:null,
					minDate:null
				},
				formData:{
					rowIndex  : null,     //记录rowIndex
					CusId     : null,     //客户编号
					NeedInv   : 1,        //是否开票
					OpDate    : null,     //操作日期
					PayTypeId : null,     //收款或者调账方式
					IssueDate : null,     //生效日期
					Amount    : null,     //收款或者调账金额	
					Remark    : '',       //收款或者调账备注 
					ReceiptNo : '',       //收据编号
					FactoryId : null,     //修改或删除主键 厂商ID
					//IsSell    : null,     //修改或删除主键
					//IsPay     : null,     //修改或删除主键
					PayId     : null,     //修改或删除主键
					delRemark : '',       //删除原因必填
				},
				addRules:{
					CusId : [
						{ required : true, message : '请选择客户名称' }
					],
					OpDate : [
						{ required : true, message : '请选择操作日期' }
					],
					PayTypeId : [
						{ validator: (rule, value, callback, source, options)=>{
							let errors;
							if( !value ){
								errors = this.filterForm.adjustType == 0 ? '请选择调账方式' : '请选择收款方式'; 
							}
							callback(errors);
						} }
					],
					IssueDate : [
						{ required : true, message : '请选择生效日期' }
					],
					Amount : [
						{ validator: (rule, value, callback, source, options)=>{
							let errors;
							let name = this.filterForm.adjustType == 0 ? '调账' : '收款';
							if( !value ){
								errors = this.filterForm.adjustType == 0 ? '请输入' + name + '金额' : '请输入' + name + '金额';
							}
							if( !this.config.dialog.negative && this.filterForm.adjustType == 1 ){
								if( !/^[1-9][0-9]*([\.][0-9]{1,3})?$/.test(value) ){
									errors = '请输入正确的收款金额';
								}
							}else{
								if( !/^\-[1-9][0-9]*([\.][0-9]{1,3})?$/.test(value) && this.filterForm.adjustType == 1 ){
									errors = '请输入正确的收款金额且退款只能为负数';
								}
							}
							callback(errors); 
						} }
					],
					Remark : [
						{ validator: (rule, value, callback, source, options)=>{
							let errors;
							if( value ){
								if( value.replace(/[^\x00-\xff]/g,"01").length > 128 ){
									errors = '备注超过长度';
								}
							}
							callback(errors); 
						} }
					]

				},
				delBase:{
					FactoryId : [
						{ required : true, message : '该条记录不完整,请选择其他记录1' }
					],
					/*IsSell:[
						{ required : true, message : '该条记录不完整,请选择其他记录2' }
					],
					IsPay:[
						{ required : true, message : '该条记录不完整,请选择其他记录3' }
					],*/
					PayId:[
						{ required : true, message : '该条记录不完整,请选择其他记录4' }
					]
				},
				delRules:{
					delRemark : [
						{ validator: (rule, value, callback, source, options)=>{
							let errors;
							if( value ){
								if( value.replace(/[^\x00-\xff]/g,"01").length > 128 ){
									errors = '删除原因超过长度';
								}
							}else{
								errors = '请输入删除原因';
							}
							callback(errors); 
						} }
					]
				},
				addVal:{},
				delVal:{},
				modifyVal:{},
			}
		},
		methods:{
			recAdjustConfig( isReset = false ){
				let self = this;
				this.$request.staff.frec.recAdjustConfig().then(res=>{
					if( this.config.getConfig ){
						self.filterForm.beginDate = res.result.date.RecAdjustBeginDate;
						self.filterForm.beginDate = '2020-04-12';
						self.filterForm.endDate = res.result.date.RecAdjustEndDate;
					}
					self.pageConfig.maxDate = res.result.date.RecAdjustMaxDate;
					self.pageConfig.minDate = res.result.date.RecAdjustMinDate;
					self.dialogTime.maxDate = res.result.date.defaultMaxDate;
					self.dialogTime.minDate = res.result.date.defaultMinDate;
					self.pageConfig.defaultDate = res.result.date.defaultDate;
					self.formData.OpDate = self.pageConfig.defaultDate;
					self.formData.IssueDate = self.pageConfig.defaultDate;
					res.result.pay_type.forEach((item,index)=>{
						self.pageConfig.payType.push({title:item.ShortName,value:item.ShortName});
					});
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.timePicker.isFinishLoad = true;
					});
				}).then(()=>{
					if( isReset ){
						return ;
					}
					this.recAdjustMain( this.filterForm );
				});
			},
			recAdjustMain( filterForm ){
				let self = this;
				this.$request.staff.frec.recAdjustMain( filterForm ).then(res=>{
					self.info.table.data = res.result;
				});
			},
			tabsChange(name,title){
				this.config.dialog.label = this.filterForm.adjustType == 0 ? '调账' : '收款';
				//this.cleanDialog();
				this.recAdjustMain(this.filterForm);
			},
			cusPickerCancel(){
				this.config.popup.cusShow = false;
				this.filterForm.cusName = '';
			},
			cusPickerConfirm(data){
				this.config.popup.cusShow = false;
				this.filterForm.cusName = data.key;
			},
			filterClick(){
				this.config.popup.filterShow = false;
				this.recAdjustMain( this.filterForm );
			},
			resetClick(){
				this.filterForm = {
					cusName:'',
					taskId:'',
					adjustType:1,
					dateType:0,
					beginDate:'',
					endDate:'',
					payType:'全部'
				};
				this.info.switch.checked = false;
				this.config.getConfig = true;
				this.recAdjustConfig(true);
			},
			getTableConfig(){
				this.$request.common.table.getTableConfig().then(res=>{
					this.config.table.columns = res.recAdjust;
					this.config.table.columns.forEach((item)=>{
						if(item.field == 'Checked'){
							item['formatter'] = (rowData,rowIndex,pagingIndex,field)=>{
								if( rowData.last == 1 ){
									return '';
								}
								return rowData.Checked === '1'  ? '<span class="van-icon van-icon-success" style="color:#1aad19;"></span>' : '<span class="van-icon van-icon-fail"></span>';
							};
						}
						if(item.field == 'NeedInv'){
							item['formatter'] = (rowData,rowIndex,pagingIndex,field)=>{
								if( rowData.last == 1 ){
									return '';
								}
								return rowData.NeedInv === '1' ? '<span class="van-icon van-icon-success" style="color:#1aad19;"></span>' : '<span class="van-icon van-icon-fail"></span>';
							};
						}
					});
				});
			},
			addData(){
				this.config.dialog.type = 0;
				this.config.dialog.show = true;
			},
			modifyClick( rowIndex,rowData,column ){
				//最后一行不弹框
				if( this.info.table.data.length <= (rowIndex + 1) ){
					return false;
				}
				if( rowData.State == 0 ){
					Toast({
						message:'已删除记录无法修改或删除',
						duration:1000
					});
					return false;
				}
				if( rowData.Checked == 1 ){
					Toast({
						message:'已审核记录无法修改或删除',
						duration:1000
					});
					return false;
				}
				this.config.dialog.type = 1;

				this.formData.rowIndex  = rowIndex;
				this.formData.CusId     = rowData.CusId;
				this.formData.NeedInv   = Number(rowData.NeedInv);
				this.formData.OpDate    = rowData.OpDate;
				this.formData.PayTypeId = rowData.PayTypeId;
				this.formData.IssueDate = rowData.IssueDate;
				this.formData.Amount    = rowData.Amount;
				this.formData.Remark    = rowData.Remark;
				this.formData.ReceiptNo = rowData.ReceiptNo;
				//删除或者修改必须
				this.formData.FactoryId = rowData.FactoryId;
				this.formData.PayId     = rowData.PayId;
				this.amountToCHN();
				this.config.dialog.show = true;
			},
			cleanDialog(){
				Object.keys(this.formData).forEach(key=>{this.formData[key] = null});
				this.formData.OpDate    = this.pageConfig.defaultDate;
				this.formData.IssueDate = this.pageConfig.defaultDate;
				this.formData.Remark    = '';                  //备注为空，防止vant field组件统计字数报错
				this.formData.delRemark = '';
				this.formData.NeedInv   = 1;                   //是否需要开票,默认需要
				this.config.dialog.amountCHN         = '';     //大写提示为空
				this.config.dialog.delBtn.submit     = false;
				this.config.dialog.confirmBtn.submit = false;
				this.config.dialog.negative          = false;
			},
			setAmount(value){
				if( value.text.indexOf('退款') >= 0 ){
					this.config.dialog.negative = true;
				}
			},
			amountToCHN(){
				this.config.dialog.amountCHN = digitUppercase(this.formData.Amount);
			},
			//取消点击
			cancelClick(){
				this.config.dialog.show = false;
			},
			//提交点击
			confirmClick(){
				let postData = Object.assign({},this.formData,{type:this.filterForm.adjustType});
				if( this.config.dialog.type == 0 ){
					this.addVal.validate(postData).then(()=>{
						this.$request.staff.frec.frecDoInsert( postData ).then((res)=>{
							if( res.errorCode == '00000' ){
								Toast.success(res.result);
								this.config.dialog.show = false;
								this.recAdjustMain( this.filterForm );
							}
						});			
					}).catch(({ errors, fields })=>{
						Toast.fail(errors[0].message);
					});
				}
				if( this.config.dialog.type == 1 ){
					this.modifyVal.validate(postData).then(()=>{
						this.$request.staff.frec.frecDoModify( postData ).then((res)=>{
							if( res.errorCode == '00000' ){
								Toast.success(res.result);
								this.config.dialog.show = false;
								this.recAdjustMain( this.filterForm );
							}
						});
					}).catch(({ errors, fields })=>{
						Toast.fail(errors[0].message);
					});
				}
				
			},
			cleanDelDialog(){
				this.formData.delRemark = '';
			},
			//删除确认
			delClick(){
				let postData = Object.assign({},this.formData,{type:this.filterForm.adjustType});
				this.delVal.validate(postData).then(()=>{
					this.config.dialog.delBtn.submit = true;	
					this.$request.staff.frec.frecDoDel( postData ).then((res)=>{
						if( res.errorCode == '00000' ){
							this.config.dialog.delShow = false;
							this.config.dialog.show    = false;
							Toast.success(res.result);
							this.recAdjustMain( this.filterForm );
						}
						this.config.dialog.delBtn.submit = false;
					});	
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message);
				});
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','收款调账');
			if( sessionStorage.getItem('frec/recAdjust') !== null  ){
				let storageData = JSON.parse(sessionStorage.getItem('frec/recAdjust'));
				this.filterForm = storageData;
				this.config.getConfig = false;
				this.info.switch.checked = true;
			}
			if( sessionStorage.getItem('staff-auth-url') !== null){
				let auth = JSON.parse(sessionStorage.getItem('staff-auth-url'));
				if( auth.indexOf('收款调账维护') >= 0 ){
					this.config.modifyAuth = true;
				}
			}
			this.config.dialog.label = this.filterForm.adjustType == 0 ? '调账' : '收款';
			this.modifyVal = new schema( Object.assign({},this.delBase,this.addRules) );
			this.addVal    = new schema(this.addRules);
			this.delVal    = new schema( Object.assign({},this.delBase,this.delRules) );
		},
		mounted(){
			this.getTableConfig();
			this.recAdjustConfig();
			this.config.table.height = window.screen.height - 170;
		},
		destroyed(){
			if( this.info.switch.checked ){
				sessionStorage.setItem('frec/recAdjust',JSON.stringify(this.filterForm));
			}else{
				sessionStorage.removeItem('frec/recAdjust');
			}
		},
		computed:{
			
		},
		watch:{
			
		}
	}
</script>
<style>
	.van-search:{
		width:60%;
	}
</style>