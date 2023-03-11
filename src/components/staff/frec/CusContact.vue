<template>
	<div>
		<van-button plain hairline type="info" size="small" style="width:100%;height:40px;" @click="config.popup.filterShow = true">筛选</van-button>
		<popup-filter :filterShow.sync="config.popup.filterShow"  @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<cus-picker :cusName.sync="filterForm.cusName" ></cus-picker>
				<van-field label="业务员" v-model="filterForm.taskId" placeholder="精确查询" input-align="center"/>
				<van-switch-cell v-model="pageConfig.switchChecked" title="记住筛选条件(本次登录有效)"/>
			</div>
		</popup-filter>
   		<template>
   			<div class="container">
   				<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;"  :columns="config.table.columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" :height="config.table.height" even-bg-color="#fafafa"  @on-custom-comp="customCompFunc"></v-table>
   			</div>
   		</template>
   		<van-dialog v-model:show="config.dialog.showAdjust" :show-confirm-button="false" :close-on-click-overlay="true" @close="checkClose()">
   			<van-field label="客户名称" :value="formData.Cus" input-align="center" readonly style="line-height:36px;"/>
   			<van-field label="预警金额" v-model="formData.PreAmt" placeholder="请输入预警金额" input-align="center"  style="line-height:36px;" />
   			<van-field label="终止金额" v-model="formData.MinAmtCond" placeholder="请输入终止金额" input-align="center"  style="line-height:36px;" />
   			<van-button type="primary" :loading="config.dialog.confirmBtn.submit" loading-text="提交" style="width:80%;margin-left:10%;margin-bottom:2%;margin-top:2%;" round @click="updateClick()">修改</van-button>
   		</van-dialog>
	</div>
</template>
<script>
	import { Button, Field, SwitchCell, Dialog, Toast } from 'vant';
	import CusPicker from '@/components/subject/picker/CusPicker.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';
	import schema from 'async-validator';
	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[Dialog.Component.name]: Dialog.Component,
			[Toast.name]: Toast,

			CusPicker,
			PopupFilter,
		},
		data(){
			return {
				config:{
					popup:{
						filterShow:false,
					},
					table:{
						columns: [
							/*{field: 'Cus', title: '客户', width: 140, titleAlign: 'center', columnAlign: 'center',isResize:true ,isFrozen: true},
							{field: 'Task', title: '业务员', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'LastMBDate', title: '上次结算时间', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'LastAmt', title: '上期余额', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'ConfAmtT', title: '确收金额', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'ConfArea', title: '确收面积', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'AdjustAmt', title: '调整金额', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'CusPayAmt', title: '本期收款', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'OrdNeedAmt', title: '订单未送', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'CurAmt', title: '当前欠款', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'PreAmt', title: '预警金额', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'MinAmtCond', title: '终止金额', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'LeftMinAmtCond', title: '终止金额剩余', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'CurNeedPay', title: '当前需付总额', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},*/
						],
		                height : 0
					},
					dialog:{
						showAdjust:false,
						confirmBtn:{
							submit:false
						}
					}
				},
				tableData: [],
				filterForm:{
					cusName:'',
					taskId:'',
				},
				pageConfig:{
					switchChecked:false,
				},
				formData:{
					Cus:null,
					CusId:null,
					OldMinAmtCond:null,
					OldPreAmt:null,
					MinAmtCond:null,
					PreAmt:null,
				},
				updateRules:{
					MinAmtCond:[
						{ required : true, message : '请输入终止金额' }
					],
					PreAmt:[
						{ required : true, message : '请输入预警金额' }
					]
				},
				validator:null
			}
		},
		methods:{
			cusContact( data ){
				let self = this;
				//this.config.table.columns = this.$options.data().config.table.columns;
				this.formData =  this.$options.data().formData;
				this.$request.staff.frec.cusContact( data ).then(res=>{
					let columnNum = self.config.table.columns.length;
					if(res.have_adjust == 1 && self.config.table.columns[columnNum-1].field != 'adjustCusContact' ){
						self.config.table.columns.splice(columnNum,0,{field: 'adjustCusContact', title: '调整信用额度', width: 100, titleAlign: 'center', componentName:'table-operate', columnAlign: 'center',isResize:true});
					}
					self.tableData = res.result;
				});
			},
			resetClick(){
				this.filterForm.cusName = '';
				this.filterForm.taskId = '';
				this.$refs.cusPicker.cusPickerClean();
				this.pageConfig.switchChecked = false;
			},
			filterClick(){
				this.config.popup.filterShow = false;
				this.cusContact( this.filterForm );
			},
			beforeunloadHandler(){
				if( this.pageConfig.switchChecked ){
					setStorage('frec/cusContact',this.filterForm);
				}else{
					removeStorage('frec/cusContact');
				}
			},
			customCompFunc( params ){
				this.formData = params.rowData
				this.config.dialog.showAdjust = true
			},
			checkClose(){
				this.formData = this.$options.data().formData
			},
			updateClick(){
				this.validator.validate( this.formData ).then(()=>{
					this.config.dialog.confirmBtn.submit = true
					this.$request.staff.frec.updateCusContact( this.formData ).then(res=>{
						if( res.errorCode == '00000' ){
							Toast.success(res.result);
							this.config.dialog.showAdjust = false
							this.cusContact(this.filterForm);
						}
					})
					this.config.dialog.confirmBtn.submit = false
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message);
				});
			},
			getTableConfig(){
				this.$request.common.table.getTableConfig().then(res=>{
					this.config.table.columns = res.staffCusContact;
				}).then(()=>{
					this.cusContact(this.filterForm);
				});
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','客户来往统计');
			if( getStorage('frec/cusContact') !== null  ){
				this.filterForm = JSON.parse(getStorage('frec/cusContact'));
				this.pageConfig.switchChecked = true;
			}
		},
		mounted(){
			this.validator = new schema(this.updateRules);
			//this.cusContact( this.filterForm );
			this.getTableConfig();
			this.config.table.height  = window.screen.height - 136;
			window.addEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		destroyed(){
			this.beforeunloadHandler();
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		watch:{
			
		}
	}
</script>
