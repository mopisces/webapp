<template>
	<div>
		<van-button plain hairline type="info" size="small" style="width:100%" @click="config.popup.filterShow = true">筛选</van-button>
		<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.columns" :table-data="table.data" row-hover-color="#eee" row-click-color="#edf7ff" >
		</v-table>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<van-field readonly clickable label="开始日期" v-model="filterForm.beginDate" placeholder="选择开始日期" input-align="center" @click="config.popup.timeShow.start = true"></van-field>
				<van-field readonly clickable label="结束日期" v-model="filterForm.endDate" placeholder="选择结束日期" input-align="center" @click="config.popup.timeShow.end = true"></van-field>
				<van-cell>
					<van-checkbox slot="icon" v-model="filterForm.showPack" shape="square">已准备</van-checkbox>
				</van-cell>
				<van-cell>
					<van-checkbox slot="icon" v-model="filterForm.showSign" shape="square">已回签</van-checkbox>
				</van-cell>
				<van-switch-cell v-model="config.switchCell.checked" title="记住筛选条件" />
			</div>
		</popup-filter>
		<time-picker :dateTimeShow.sync="config.popup.timeShow.start" :dateTime.sync="pageConfig.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" @onCancel="timePickerCancel" @onConfirm="timeBeginConfirm"></time-picker>
		<time-picker :dateTimeShow.sync="config.popup.timeShow.end" :dateTime.sync="pageConfig.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate"  @onCancel="timePickerCancel" @onConfirm="timeEndConfirm"></time-picker>
	</div>
</template>
<script>
	import { Button, Cell, Checkbox, Field, SwitchCell } from 'vant';
	import { VTable, VPagination } from 'vue-easytable';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import TimePicker from '@/components/subject/TimePicker.vue';
	import { dateTimeFormat } from '@/util/index';
	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[Checkbox.name]: Checkbox,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,

			[VTable.name]: VTable,
			[VPagination.name]: VPagination,

			PopupFilter,
			TimePicker
		},
		data(){
			return {
				checked:false,
				config:{
					getConfig : true,
					popup:{
						filterShow : false,
						timeShow:{
							start : false,
							end   : false
						}
					},
					table:{
						columns:[
							{field: 'CarState', title: '状态', width: 70, titleAlign: 'center', columnAlign: 'center',formatter:(rowData)=>{
								if( rowData.CarState == 0 ){
									return '<span style="color:red;font-weight: bold;">装货中</span>';
								}
								if( rowData.CarState == 1 ){
									return '<span style="color:blue;font-weight: bold;">已准备</span>';
								}
								if( rowData.CarState == 2 ){
									return '<span style="color:#1a991d;font-weight: bold;">已回签</span>';
								}
							},isResize:true,isFrozen: true},
							{field: 'OrderTypeName', title: '类型', width: 70, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'PListNo', title: '装货单号', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'CarNo', title: '车辆编号', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'CarPName', title: '司机', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'TVolume', title: '体积', width: 60, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'To5Area', title: '折5面积', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'CusNames', title: '拼车客户', width: 120, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'Remark', title: '备注', width: 150, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'custome-adv', title: '送货单',width: 100, titleAlign: 'center',columnAlign:'center',componentName:'stow-table-delivery',isResize:true},
							{field: 'custome-adv', title: '明细',width: 100, titleAlign: 'center',columnAlign:'center',componentName:'stow-table-detail',isResize:true},
							{field: 'custome-adv', title: '装货',width: 100, titleAlign: 'center',componentName:'stow-table-loading',columnAlign:'center',isResize:true}
						]
					},
					switchCell:{
						checked:false
					}
				},
				table:{
					data:[]
				},
				filterForm:{
					beginDate : '',
					endDate   : '',
					showPack  : false,
					showSign  : false
				},
				pageConfig:{
					beginDate : new Date(),
					endDate   : new Date(),
					maxDate   : new Date(),
					minDate   : new Date(),
				}
			}
		},
		methods:{
			switchChange( checked ){
				if( checked ){
					sessionStorage.setItem('stow/lists',JSON.stringify(this.filterForm));
				}else{
					sessionStorage.removeItem('stow/lists');
				}
			},
			resetClick(){
				this.config.getConfig = true;
				this.getConfig();
			},
			filterClick(){
				this.config.popup.filterShow = false;
				this.getTableData( this.filterForm );
			},
			timePickerCancel(){
				this.config.popup.timeShow.start = false;
				this.config.popup.timeShow.end   = false;
			},
			timeBeginConfirm( val ){
				this.filterForm.beginDate = dateTimeFormat( val.value,'yyyy-MM-dd' );
				this.pageConfig.beginDate = val.value;
				this.timePickerCancel();
			},
			timeEndConfirm( val ){
				this.filterForm.endDate = dateTimeFormat( val.value,'yyyy-MM-dd' );
				this.pageConfig.endDate = val.value;
				this.timePickerCancel();
			},
			getConfig( isResize = false ){
				let self = this;	
				this.$request.staff.stow.stowListConfig().then(res=>{
					if( self.config.getConfig ){
						self.filterForm.beginDate = res.result.StowBeginDate;
						self.filterForm.endDate   = res.result.StowEndDate;
						self.pageConfig.beginDate = new Date(res.result.StowBeginDate);
						self.pageConfig.endDate   = new Date(res.result.StowEndDate);
					}
					self.pageConfig.maxDate = new Date(res.result.StowMaxDate);
					self.pageConfig.minDate = new Date(res.result.StowMinDate);
				}).then(()=>{
					if( isResize ){
						return 
					}
					this.getTableData( this.filterForm );
				});
			},
			getTableData( data ){
				let self = this;
				this.$request.staff.stow.stowList( data ).then(res=>{
					self.table.data = res.result;
				});
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','扫描装货');
			if( sessionStorage.getItem('stow/lists') ){
				let storageData = JSON.parse(sessionStorage.getItem('stow/lists'));
				this.filterForm = storageData;
				this.pageConfig.beginDate = new Date(storageData.beginDate);
				this.pageConfig.endDate   = new Date(storageData.endDate);
				this.config.getConfig     = false;
				this.config.switchCell.checked = true;
			}
		},
		mounted(){
			this.getConfig();
		},
		destroyed(){
			if( this.config.switchCell.checked ){
				sessionStorage.setItem('stow/lists',JSON.stringify(this.filterForm));
			}else{
				sessionStorage.removeItem('stow/lists');
			}
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>

