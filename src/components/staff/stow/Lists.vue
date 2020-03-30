<template>
	<div>
		<van-button plain hairline type="info" size="small" style="width:100%" @click="config.popup.filterShow = true">筛选</van-button>
		<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.columns" :table-data="table.data" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :height="config.table.height" even-bg-color="#fafafa">
		</v-table>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker>
				<van-cell>
					<van-checkbox slot="icon" v-model="filterForm.showPack" shape="square">已准备</van-checkbox>
				</van-cell>
				<van-cell>
					<van-checkbox slot="icon" v-model="filterForm.showSign" shape="square">已回签</van-checkbox>
				</van-cell>
				<van-switch-cell v-model="config.switchCell.checked" title="记住筛选条件" />
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button, Cell, Checkbox, Field, SwitchCell, Dialog, Toast } from 'vant';
	//import { VTable, VPagination } from 'vue-easytable';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[Checkbox.name]: Checkbox,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[Toast.name]: Toast,

			/*[VTable.name]: VTable,
			[VPagination.name]: VPagination,*/

			PopupFilter,
			NewTimePicker
		},
		data(){
			return {
				config:{
					getConfig : true,
					popup:{
						filterShow : false,
						timePicker:{
							isFinishLoad:false
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
							{field: 'stowDelivery', title: '送货单',width: 100, titleAlign: 'center',columnAlign:'center',componentName:'table-operate',isResize:true},
							{field: 'stowDetail', title: '明细',width: 100, titleAlign: 'center',columnAlign:'center',componentName:'table-operate',isResize:true},
							{field: 'stowLoading', title: '装货',width: 100, titleAlign: 'center',componentName:'table-operate',columnAlign:'center',isResize:true}
						],
						height : 0
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
					maxDate   : '',
					minDate   : ''
				}
			}
		},
		methods:{
			customCompFunc(params){
				let data = {
					pListNo      : params.rowData.PListNo,
					strFactoryId : params.userInfo.strFactoryId,
					strUserId    : params.userInfo.strUserId,
					index        : params.index
				};
				if( params.type === 'prepare' ){
					this.preparePack( data );
				}
				if( params.type === 'cancelPre' ){
					this.unPreparePack( data );
				}
			},
			preparePack( data ){
				let self = this;	
				this.$request.staff.connecterp.preparePack( data ).then(res=>{
					if( res.data.result[1] === false ){
						Dialog.alert({
							title   : '准备失败',
							message : res.data.result[0]
						}).then(() => {
							Dialog.close();
						});
					}else{
						self.table.data[data.index].CarState = 1;
						Toast.success('准备成功');
					}
				}).catch((err)=>{
					Toast.fail('准备失败');
				});
			},
			unPreparePack( data ){
				let self = this;	
				this.$request.staff.connecterp.unPreparePack( data ).then(res=>{
					if( res.data.result[1] === false ){
						Dialog.alert({
							title   : '取消准备失败',
							message : res.data.result[0]
						}).then(() => {
							Dialog.close();
						});
					}else{
						self.table.data[data.index].CarState = 0;
						Toast.success('取消准备成功');
					}
				}).catch((err)=>{
					Toast.fail('取消准备失败');
				});
			},
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
			getConfig( isResize = false ){
				let self = this;	
				this.$request.staff.stow.stowListConfig().then(res=>{
					if( self.config.getConfig ){
						self.filterForm.beginDate = res.result.StowBeginDate;
						self.filterForm.endDate   = res.result.StowEndDate;
					}
					self.pageConfig.maxDate = res.result.StowMaxDate;
					self.pageConfig.minDate = res.result.StowMinDate;
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.timePicker.isFinishLoad = true;
					});
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
				this.filterForm                = storageData;
				this.config.getConfig          = false;
				this.config.switchCell.checked = true;
			}
		},
		mounted(){
			this.getConfig();
			this.config.table.height = window.screen.height - 126;
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
<style>
	.v-table-title-class{
		color:#1a991d;
		font-size: 0.8125rem;
	}
</style>
