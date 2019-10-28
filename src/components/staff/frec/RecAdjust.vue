<template>
	<div>
		<div class="van-tabs van-tabs--card">
			<div class="van-tabs__wrap">
				<div class="van-tabs__nav van-tabs__nav--card">
					<div :class="config.tabs.payClass"  @click="tabsClick(1)">收款</div>
					<div :class="config.tabs.adjustClass" @click="tabsClick(0)">调账</div>
					<div class="van-tab" @click="filterShow()">筛选</div>
				</div>
			</div>
		</div>
		<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.columns" :table-data="info.table.data" row-hover-color="#eee" row-click-color="#edf7ff" :height="500" >
		</v-table>
		<popup-filter :filterShow="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick" @filterOverlayClick="filterOverlayClick" >
			<van-field readonly clickable label="客户名称" v-model="filterForm.cusName" placeholder="选择客户名称" input-align="center" @click="config.popup.cusShow = true" slot="filter-field-1"></van-field>
			<van-field label="业务员" v-model="filterForm.taskId" placeholder="精确查询" input-align="center" slot="filter-field-2"/>
			<van-field readonly clickable label="开始日期" v-model="filterForm.beginDate" placeholder="选择开始日期" input-align="center" @click="config.popup.timeShow.start = true" slot="filter-field-3"></van-field>
			<van-field readonly clickable label="结束日期" v-model="filterForm.endDate" placeholder="选择结束日期" input-align="center" @click="config.popup.timeShow.end = true" slot="filter-field-4"></van-field>
			<van-radio-group v-model="filterForm.dateType" slot="filter-field-5">
				<van-cell-group title="日期类型">
					<van-cell title="操作日期" clickable @click="filterForm.dateType = '0'">
						<van-radio slot="right-icon" name="0" />
					</van-cell>
					<van-cell title="生效日期" clickable @click="filterForm.dateType = '1'">
						<van-radio slot="right-icon" name="1" />
					</van-cell>
				</van-cell-group>
			</van-radio-group>
			<van-radio-group v-model="filterForm.payType" slot="filter-field-6">
				<van-cell-group title="科目">
					<van-cell :title="item.ShortName" clickable @click="filterForm.payType = item.ShortName" v-for="(item,index) in pageConfig.payType" :key="index">
						<van-radio slot="right-icon" :name="item.ShortName" />
					</van-cell>
				</van-cell-group>
			</van-radio-group>
			<van-switch-cell v-model="info.switch.checked" title="记住筛选条件(本次登录有效)"  slot="filter-field-7" @change="filterRemClick"/>
		</popup-filter>
		<cus-picker :show="config.popup.cusShow" :searchData="info.cusPicker.searchData" :index="info.cusPicker.defaultIndex" @cusPickerCancel="cusPickerCancel"  @cusPickerConfirm="cusPickerConfirm" @cusPickerInput="cusPickerInput"></cus-picker>
		<time-picker :dateTimeShow="config.popup.timeShow.start" :dateTime="pageConfig.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" @clickOverlay="timePickerOverlay" @onCancel="timePickerCancel" @onConfirm="timeBeginConfirm"></time-picker>
		<time-picker :dateTimeShow="config.popup.timeShow.end" :dateTime="pageConfig.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" @clickOverlay="timePickerOverlay" @onCancel="timePickerCancel" @onConfirm="timeEndConfirm"></time-picker>
	</div>
</template>
<script>
	import { Field, RadioGroup, Radio, Cell, CellGroup, SwitchCell } from 'vant';
	import { dateTimeFormat } from '@/util/index';
	import CusPicker from '@/components/subject/CusPicker.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import TimePicker from '@/components/subject/TimePicker.vue';
	import { VTable, VPagination } from 'vue-easytable';
	export default {
		components:{
			[Field.name]: Field,
			[RadioGroup.name]: RadioGroup,
			[Radio.name]: Radio,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[SwitchCell.name]: SwitchCell,

			[VTable.name]: VTable,
			[VPagination.name]: VPagination,

			CusPicker,
			PopupFilter,
			TimePicker
		},
		data(){
			return {
				radio:'1',
				config:{
					table:{
						columns:[
							{field: 'Cus', title: '客户', width: 140, titleAlign: 'center', columnAlign: 'center',isResize:true ,isFrozen: true},
							{field: 'Checked', title: '审核', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true ,formatter: (rowData,rowIndex,pagingIndex,field)=>{
								return rowData.Checked === '1' ? '<span class="van-icon van-icon-success"></span>' : '<span class="van-icon van-icon-fail"></span>';
							}},
							{field: 'PayId', title: '单号', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'OpDate', title: '操作日期', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'IssueDate', title: '生效日期', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'Amount', title: '金额', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'Remark', title: '备注', width: 150, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'NeedInv', title: '需开票', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true, formatter:(rowData,rowIndex,pagingIndex,field)=>{
								return rowData.NeedInv === '1' ? '<span class="van-icon van-icon-success"></span>' : '<span class="van-icon van-icon-fail"></span>';
							}},
							{field: 'ShortName', title: '科目', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'Task', title: '业务员', width: 150, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'ReceiptNo', title: '收据编号', width: 150, titleAlign: 'center', columnAlign: 'center',isResize:true},
						]
					},
					tabs:{
						active:0,
						payClass:'van-tab van-tab--active',
						adjustClass:'van-tab',
					},
					popup:{
						filterShow:false,
						cusShow:false,
						timeShow:{
							start:false,
							end :false
						}
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
						defaultIndex:-1,
						searchData:'',
						columns:[],
					}
				},
				filterForm:{
					cusName:'',
					taskId:'',
					adjustType:1,
					dateType:'0',
					beginDate:'',
					endDate:'',
					payType:'全部'
				},
				pageConfig:{
					maxDate:'',
					minDate:'',
					beginDate:new Date(),
					endDate:new Date(),
					payType:[],
					defaultIndex:-1,

				}
			}
		},
		methods:{
			filterShow(){
				this.config.popup.filterShow = true;
			},
			recAdjustConfig(){
				let self = this;
				this.$request.staff.frec.recAdjustConfig().then(res=>{
					self.filterForm.beginDate = res.result.date.RecAdjustBeginDate;
					self.filterForm.endDate = res.result.date.RecAdjustEndDate;

					self.pageConfig.beginDate = new Date(res.result.date.RecAdjustBeginDate);
					self.pageConfig.endDate = new Date(res.result.date.RecAdjustEndDate);

					self.pageConfig.maxDate = new Date(res.result.date.RecAdjustMaxDate);
					self.pageConfig.minDate = new Date(res.result.date.RecAdjustMinDate);
					self.pageConfig.payType = res.result.pay_type;
				}).then(()=>{
					sessionStorage.setItem('frec/recAdjust---filterInit',JSON.stringify(this.filterForm));
				}).then(()=>{
					this.recAdjustMain( this.filterForm );
				});
			},
			recAdjustMain( filterForm ){
				let self = this;
				this.$request.staff.frec.recAdjustMain( filterForm ).then(res=>{
					self.info.table.data = res.result;
				});
			},
			tabsClick(data){
				if( data === 1 ){
					this.config.tabs.active = 0;
					this.config.tabs.adjustClass = 'van-tab';
					this.config.tabs.payClass = 'van-tab van-tab--active';
					this.filterForm.adjustType = 1;
				}else{
					this.config.tabs.active = 1;
					this.config.tabs.payClass = 'van-tab';
					this.config.tabs.adjustClass = 'van-tab van-tab--active';
					this.filterForm.adjustType = 0;
				}
				this.recAdjustMain(this.filterForm);
			},
			fieldClick(){
				this.config.popup.cusShow = true;
			},
			cusPickerCancel(){
				this.config.popup.cusShow = false;
				this.filterForm.cusName = '';
			},
			cusPickerConfirm(data){
				this.config.popup.cusShow = false;
				this.filterForm.cusName = data.key;
			},
			cusPickerInput(value){
				this.filterForm.searchData = value;
			},
			filterRemClick( checked ){
				this.removeItem();
				if( checked === false ){
					this.info.switch.checked = false;
				}else{
					this.info.switch.checked = true;
					sessionStorage.setItem('frec/recAdjust',JSON.stringify(this.filterForm));
					sessionStorage.setItem('frec/recAdjust---pageConfig',JSON.stringify(this.pageConfig));
				}
			},
			filterClick(){
				this.config.popup.filterShow = false;
				this.recAdjustMain( this.filterForm );
			},
			filterOverlayClick(){
				this.config.popup.filterShow = false;
			},
			resetClick(){
				this.filterForm = Object.assign(this.filterForm,JSON.parse(sessionStorage.getItem('frec/recAdjust---filterInit')));
				this.removeItem();
			},
			timePickerOverlay(){
				this.timePickerCancel();
			},
			timePickerCancel(){
				this.config.popup.timeShow.start = false;
				this.config.popup.timeShow.end = false;
			},
			timeBeginConfirm( value ){
				this.filterForm.beginDate = dateTimeFormat( value.value,'yyyy-MM-dd' );
				this.pageConfig.beginDate = value.value;
				this.timePickerCancel();
			},
			timeEndConfirm( value ){
				this.filterForm.endDate = dateTimeFormat( value.value,'yyyy-MM-dd' );
				this.pageConfig.endDate = value.value;
				this.timePickerCancel();
			},
			getPageName(){
				return 'frec/recAdjust';
			},
			removeItem(){
				sessionStorage.removeItem('frec/recAdjust');
				sessionStorage.removeItem('frec/recAdjust---pageConfig');
			}
		},
		mounted(){
			this.recAdjustConfig();
			this.removeItem();
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','收款调账');
			if( sessionStorage.getItem('frec/recAdjust') !== null  ){
				this.filterForm = JSON.parse(sessionStorage.getItem('frec/recAdjust'));
			}
			if( sessionStorage.getItem('frec/recAdjust---pageConfig') !== null  ){
				this.pageConfig = JSON.parse(sessionStorage.getItem('frec/recAdjust---pageConfig'));
			}
		},
		watch:{
			filterForm:{
				handler( val, oldVal ){
					this.info.switch.checked = false;
				},
				deep:true
			}
			
		}
	}
</script>
<style>
	.van-search:{
		width:60%;
	}
</style>