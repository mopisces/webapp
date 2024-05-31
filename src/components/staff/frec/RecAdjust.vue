<template>
	<div style="padding-top:0.1rem;">
		<drag-menu 
			defpositon="rt" 
			:pattern="{icon: 'plus'}"
			:content="menuOptions"
			@trigger="trigger"
		>
		</drag-menu>
		<!-- <template v-if="config.modifyAuth">
			<van-button plain hairline type="info" style="width:50%" @click="addData()">添加</van-button>
			<van-button plain hairline type="info" style="width:50%" @click="config.popup.filterShow = true">筛选</van-button>
		</template>
		<template v-else>
			<van-button plain hairline type="info" style="width:100%" @click="config.popup.filterShow = true">筛选</van-button>
		</template> -->
		<van-tabs v-model="filterForm.adjustType" @change="tabsChange">
			<van-tab title="收款" name="1"></van-tab>
			<van-tab title="调账" name="0"></van-tab>
		</van-tabs>
		<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.columns" :table-data="info.table.data" row-hover-color="#eee" row-click-color="#edf7ff" :height="config.table.height" :row-click="rowClick">
		</v-table>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<cus-picker :cusName.sync="filterForm.cusName" ></cus-picker>
				<van-field label="业务员" v-model="filterForm.taskId" placeholder="精确查询" input-align="center"/>
				
				<time-range-picker
					:beginDate.sync="filterForm.beginDate"
					:endDate.sync="filterForm.endDate"
					:maxDate.sync="pageConfig.maxDate"
					:minDate.sync="pageConfig.minDate"
				></time-range-picker>

				<uni-check-box
					label="日期"
					:localdata="config.radio.options"
					:radioData.sync="filterForm.dateType" 
					:map="{text: 'title', value: 'value'}"
				>
				</uni-check-box>
				<div class="cell-label">科目</div>
				<uni-check-box
					:localdata="pageConfig.payType"
					:radioData.sync="filterForm.payType" 
					:map="{text: 'shortName', value: 'shortName'}"
				>
				</uni-check-box>
				<van-switch-cell v-model="info.switch.checked" title="记住筛选条件(本次登录有效)"/>
			</div>
		</popup-filter>
		<van-dialog v-model:show="config.dialog.show" :showConfirmButton="false" :close-on-click-overlay="true" @close="addClose()">
			<cus-picker :cusName.sync="formData.CusId" :showCHN="true"></cus-picker>
			<van-switch-cell v-model="formData.NeedInv" :active-value="1" :inactive-value="0" title="受否需要开票" v-show=" filterForm.adjustType == 0 "/>
			<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="formData.OpDate" :minDate="dialogTime.minDate" :maxDate="dialogTime.maxDate" label="操作日期"></new-time-picker>
			<frec-sell-pay :typeId.sync="formData.PayTypeId" :type="filterForm.adjustType" @payTypeConfirm="setAmount"></frec-sell-pay>
			<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="formData.IssueDate" :minDate="dialogTime.minDate" :maxDate="dialogTime.maxDate" label="生效日期"></new-time-picker>
			<van-field :label="config.dialog.label + '金额'" v-model="formData.Amount" placeholder="请输入金额" input-align="center" :error-message="config.dialog.amountCHN" @blur="amountToCHN"/>
			<van-field :label="config.dialog.label + '备注'" v-model="formData.Remark" autosize rows="1" maxlength="50" show-word-limit type="textarea" placeholder="请输入备注"/>
			<van-field label="收据编号" v-model="formData.ReceiptNo" placeholder="请输入收据编号" input-align="center"/>
			<van-button type="primary" :disabled="config.dialog.confirmBtn.submit" :loading="config.dialog.confirmBtn.submit" loading-text="提交" style="width:80%;margin-left:10%;margin-bottom:2%;margin-top:2%;" round @click="confirmClick()">确认</van-button>
		</van-dialog>
		<van-dialog v-model:show="config.dialog.delShow" title="删除原因" :show-confirm-button="false" :close-on-click-overlay="true" @close="delClose()">
			<van-field v-model="formData.delRemark" autosize rows="2" maxlength="50" show-word-limit type="textarea" placeholder="请输入删除原因" />
			<van-button type="info" style="width:45%;margin-left:2.5%;margin-bottom:2%" @click="config.dialog.delShow = false" >取消</van-button>
			<van-button type="primary" :disabled="config.dialog.delBtn.submit" :loading="config.dialog.delBtn.submit" loading-text="删除" style="width:45%;margin-left:2.5%;margin-bottom:2%;" @click="delClick()">删除</van-button>
		</van-dialog>
		
		<van-dialog v-model:show="config.dialog.chooseShow" title="请选择操作" :showConfirmButton="false" :close-on-click-overlay="true" @close="cleanDialog()">
			<van-field label="单号" :value="formData.PayId" readonly />
			<template v-if="config.checkAuth">
				<van-button type="info" style="width:30%;margin-left:2.5%;margin-bottom:2%;margin-top:2%;" @click="doModify()" round>修改</van-button>
				<van-button type="danger" style="width:30%;margin-left:2.5%;margin-bottom:2%;margin-top:2%;" @click="config.dialog.delShow = true" round>删除</van-button>
				<van-button type="primary" style="width:30%;margin-left:2.5%;margin-bottom:2%;margin-top:2%;" @click="config.dialog.checkShow = true" round>审核</van-button>
			</template>
			<template v-else>
				<van-button type="info" style="width:45%;margin-left:2.5%;margin-bottom:2%;margin-top:2%;" @click="doModify()" round>修改</van-button>
				<van-button type="danger" style="width:45%;margin-left:2.5%;margin-bottom:2%;margin-top:2%;" @click="config.dialog.delShow = true" round>删除</van-button>
			</template>
		</van-dialog>
		<van-dialog v-model:show="config.dialog.checkShow" :show-confirm-button="false" :close-on-click-overlay="true" @close="checkClose()">
			<van-field label="客户名称" :value="formData.Cus" readonly />
			<van-field label="科目" :value="formData.ShortName" readonly />
			<van-switch-cell v-model="formData.NeedInv" disabled :active-value="1" :inactive-value="0" title="受否需要开票" v-show=" filterForm.adjustType == 0 "/>
			<van-field label="操作日期" :value="formData.OpDate" readonly />
			<van-field label="生效日期" :value="formData.IssueDate" readonly />
			<van-field :label="config.dialog.label + '金额'" :value="formData.Amount" readonly />
			<van-field :label="config.dialog.label + '备注'" :value="formData.Remark" readonly />
			<van-field label="收据编号" :value="formData.ReceiptNo" readonly />
			<van-field label="业务员" :value="formData.Task" readonly />
			<van-button type="primary" style="width:80%;margin-left:10%;margin-bottom:2%;margin-top:2%;" round @click="doCheck">{{ config.dialog.checkBtnName }}审核</van-button>
		</van-dialog>
	</div>
</template>
<script>
	import { Button, Field, Tab, Tabs, SwitchCell, Dialog, Toast } from 'vant';
	import { digitUppercase } from '@/util';
	import CusPicker from '@/components/subject/picker/CusPicker.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import RadioCell from '@/components/subject/RadioCell.vue';
	import FrecSellPay from '@/components/subject/staff/FrecSellPay.vue';
	import schema from 'async-validator';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';

	import UniCheckBox from '@/components/subject/checkbox/UniCheckBox.vue'
	import TimeRangePicker from '@/components/subject/time/TimeRangePicker.vue'
	/*自定义拖动组件*/
	import DragMenu from "@/components/subject/fab/DragMenu.vue"
	/*api接口*/
	import { getWebConfig } from '@/api/common/webConfig.js'

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
			RadioCell,
			FrecSellPay,
			NewTimePicker,

			UniCheckBox,
			TimeRangePicker,
			DragMenu
		},
		data(){
			return {
				config:{
					modifyAuth: false, //收款调账维护权限是否开启
					checkAuth:false,    //收款调账审核权限是否开启
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
						delShow:false,
						checkShow:false,
						chooseShow:false,
						checkBtnName:'确认'
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
					Cus       : null,     //客户名称
					Task      : null,     //业务员
					ShortName : null,     //单号
					Checked   : 0,        //是否审核
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
			/*菜单点击*/
			async trigger({index, item}) {
				if( index == 1 ) {
					this.addData()
				} else {
					this.config.popup.filterShow = true
				}
			},
			async recAdjustConfig( isReset = false ){
				const { result } = await getWebConfig({paramType: 'staffFrec'})
				if( this.config.getConfig ){
					this.filterForm.beginDate = result.RecAdjustBeginDate
					this.filterForm.endDate = result.RecAdjustEndDate
				}
				this.pageConfig.maxDate = result.RecAdjustMaxDate
				this.pageConfig.minDate = result.RecAdjustMinDate
				this.dialogTime.maxDate = result.defaultMaxDate
				this.dialogTime.minDate = result.defaultMinDate
				this.pageConfig.defaultDate = result.defaultDate
				this.formData.OpDate = this.pageConfig.defaultDate
				this.formData.IssueDate = this.pageConfig.defaultDate
				this.pageConfig.payType = result.payType
				/*result.payType.forEach((item,index)=>{
					this.pageConfig.payType.push({title:item.shortName,value:item.shortName});
				})*/
				if( isReset ) return 
				this.recAdjustMain( this.filterForm )	
			},
			recAdjustMain( filterForm ){
				let self = this;
				this.$request.staff.frec.recAdjustMain( filterForm ).then(res=>{
					self.info.table.data = res.result;
				});
			},
			tabsChange(name,title){
				this.config.dialog.label = this.filterForm.adjustType == 0 ? '调账' : '收款';
				this.cleanDialog();
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
			rowClick( rowIndex,rowData,column ){
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
				this.formData.rowIndex  = rowIndex;
				this.formData.Checked   = rowData.Checked;
				this.formData.Cus       = rowData.Cus;
				this.formData.Task      = rowData.Task;
				this.formData.ShortName = rowData.ShortName;
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
				if( this.config.checkAuth ){
					if( rowData.Checked == 1 ){
						this.config.dialog.checkBtnName = '取消';
						this.config.dialog.checkShow = true;
					}
					if( rowData.Checked == 0 ){
						this.config.dialog.checkBtnName = '确认';
						this.config.dialog.chooseShow = true;
					}
				}else{
					if( rowData.Checked == 1 ){
						Toast({
							message:'已审核记录无法修改或删除',
							duration:1000
						});
						return false;
					}
					this.config.dialog.chooseShow = true;
				}
			},
			doModify(){
				this.config.dialog.type = 1;
				this.amountToCHN();
				this.config.dialog.show = true;
			},
			cleanDialog(){
				//console.log(123)
				Object.keys(this.formData).forEach(key=>{this.formData[key] = null});
				this.formData.Checked   = 0;
				//this.formData.Cus       = null;
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
			//审核dialog取消点击
			checkClose(){
				if( this.formData.Checked == 1 ){
					this.cleanDialog();
				}
			},
			//添加时关闭
			addClose(){
				if( this.config.dialog.type == 0 ){
					this.cleanDialog();
				}
			},
			delClose(){
				this.formData.delRemark = '';
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
								this.config.dialog.chooseShow = false;
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
								this.config.dialog.chooseShow = false;
								this.recAdjustMain( this.filterForm );
							}
						});
					}).catch(({ errors, fields })=>{
						Toast.fail(errors[0].message);
					});
				}
				
			},
			//删除确认
			delClick(){
				let postData = Object.assign({},this.formData,{type:this.filterForm.adjustType});
				this.delVal.validate(postData).then(()=>{
					this.config.dialog.delBtn.submit = true;	
					this.$request.staff.frec.frecDoDel( postData ).then((res)=>{
						if( res.errorCode == '00000' ){
							this.config.dialog.delShow = false;
							//this.config.dialog.show    = false;
							this.config.dialog.chooseShow = false;
							Toast.success(res.result);
							this.recAdjustMain( this.filterForm );
						}
						this.config.dialog.delBtn.submit = false;
					});	
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message);
				});
			},
			//点击审核
			doCheck(){
				let postData = Object.assign({},this.formData,{type:this.filterForm.adjustType});
				let check = new schema(this.delBase);
				check.validate(postData).then(()=>{
					this.$request.staff.frec.frecDoCheck( postData ).then((res)=>{
						if( res.errorCode == '00000' ){
							this.config.dialog.checkShow = false;
							this.config.dialog.chooseShow = false;
							Toast.success(res.result);
							this.recAdjustMain( this.filterForm );
						}
					});
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message);
				});
			},
			beforeunloadHandler(){
				if( this.info.switch.checked ){
					setStorage('frec/recAdjust',this.filterForm);
				}else{
					removeStorage('frec/recAdjust');
				}
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','收款调账');
			if( getStorage('frec/recAdjust') !== null  ){
				let storageData = JSON.parse(getStorage('frec/recAdjust'));
				this.filterForm = storageData;
				this.config.getConfig = false;
				this.info.switch.checked = true;
			}
			this.config.modifyAuth = this.authMap.includes('收款调账维护')
			this.config.checkAuth = this.authMap.includes('收款调账审核')
			this.config.dialog.label = this.filterForm.adjustType == 0 ? '调账' : '收款';
			this.modifyVal = new schema( Object.assign({},this.delBase,this.addRules) );
			this.addVal    = new schema(this.addRules);
			this.delVal    = new schema( Object.assign({},this.delBase,this.delRules) );
		},
		mounted(){
			this.getTableConfig();
			this.recAdjustConfig();
			this.config.table.height = window.screen.height - 190;
			window.addEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		destroyed(){
			this.beforeunloadHandler();
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		computed:{
			...window.Vuex.mapGetters({
				authMap: 'user/authMap'
			}),
			menuOptions() {
				if( this.authMap.includes('收款调账维护') ) {
					return [
						{
							text: '筛选',
							iconPath: 'filter-o',
							active: false
						},
						{
							text: '添加',
							iconPath: 'plus',
							active: false
						}
					]
				} else {
					return [
						{
							text: '筛选',
							iconPath: 'filter-o',
							active: false
						}
					]
				}
			}
		},
		watch:{
			
		}
	}
</script>
<style>
	.cell-label {
		line-height: 1rem;
		font-size: 0.875rem;
		text-align: left;
		padding: 0.25rem 0rem 0.25rem 1rem;
	}

	.van-search {
		width:60%;
	}
</style>