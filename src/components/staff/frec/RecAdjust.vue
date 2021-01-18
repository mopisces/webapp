<template>
	<div>
		<van-button plain hairline type="info" size="small" style="width:100%" @click="config.popup.filterShow = true">筛选</van-button>
		<van-tabs v-model="filterForm.adjustType" @change="tabsChange">
			<van-tab title="收款" name="1"></van-tab>
			<van-tab title="调账" name="0"></van-tab>
		</van-tabs>
		<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.columns" :table-data="info.table.data" row-hover-color="#eee" row-click-color="#edf7ff" :height="config.table.height" >
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
	</div>
</template>
<script>
	import { Button, Field, Tab, Tabs, SwitchCell } from 'vant';
	import CusPicker from '@/components/subject/picker/CusPicker.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import RadioCell from '@/components/subject/RadioCell.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,

			CusPicker,
			PopupFilter,
			NewTimePicker,
			RadioCell
		},
		data(){
			return {
				radio:'1',
				config:{
					getConfig:true,
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
					maxDate:'',
					minDate:'',
					payType:[],
				}
			}
		},
		methods:{
			recAdjustConfig( isReset = false ){
				let self = this;
				this.$request.staff.frec.recAdjustConfig().then(res=>{
					if( this.config.getConfig ){
						self.filterForm.beginDate = res.result.date.RecAdjustBeginDate;
						self.filterForm.endDate = res.result.date.RecAdjustEndDate;
					}
					self.pageConfig.maxDate = res.result.date.RecAdjustMaxDate;
					self.pageConfig.minDate = res.result.date.RecAdjustMinDate;
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
		},
		mounted(){
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
		watch:{
			
		}
	}
</script>
<style>
	.van-search:{
		width:60%;
	}
</style>