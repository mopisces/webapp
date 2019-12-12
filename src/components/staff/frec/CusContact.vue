<template>
	<div>
		<van-button plain hairline type="info" size="small" style="width:100%" @click="config.popup.filterShow = true">筛选</van-button>
		<popup-filter :filterShow.sync="config.popup.filterShow"  @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<cus-picker :cusName.sync="filterForm.cusName" ></cus-picker>
				<van-field label="业务员" v-model="filterForm.taskId" placeholder="精确查询" input-align="center"/>
				<van-switch-cell v-model="pageConfig.switchChecked" title="记住筛选条件(本次登录有效)"/>
			</div>
		</popup-filter>
   		<template>
   			<div class="container">
   				<v-table  is-horizontal-resize :is-vertical-resize="true" style="width:100%;"  :columns="config.table.columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" :height="config.table.height"></v-table>
   			</div>
   		</template>

	</div>
</template>
<script>
	import { Button, Field, SwitchCell } from 'vant';
	import { VTable, VPagination } from 'vue-easytable';
	import CusPicker from '@/components/subject/picker/CusPicker.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			
			[VTable.name]: VTable,
			[VPagination.name]: VPagination,

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
		                    {field: 'Cus', title: '客户', width: 140, titleAlign: 'center', columnAlign: 'center',titleCellClassName: 'header-color',isResize:true ,isFrozen: true},
		                    {field: 'Task', title: '业务员', width: 100, titleAlign: 'center', columnAlign: 'center',titleCellClassName: 'header-color',isResize:true},
		                    {field: 'LastMBDate', title: '上次结算时间', width: 100, titleAlign: 'center', columnAlign: 'center',titleCellClassName: 'header-color',isResize:true},
		                    {field: 'LastAmt', title: '上期余额', width: 100, titleAlign: 'center', columnAlign: 'center',titleCellClassName: 'header-color',isResize:true},
		                    {field: 'ConfAmtT', title: '确收金额', width: 100, titleAlign: 'center', columnAlign: 'center',titleCellClassName: 'header-color',isResize:true},
		                    {field: 'AdjustAmt', title: '调整金额', width: 100, titleAlign: 'center', columnAlign: 'center',titleCellClassName: 'header-color',isResize:true},
		                    {field: 'CusPayAmt', title: '本期收款', width: 100, titleAlign: 'center', columnAlign: 'center',titleCellClassName: 'header-color',isResize:true},
		                    {field: 'OrdNeedAmt', title: '订单未送', width: 100, titleAlign: 'center', columnAlign: 'center',titleCellClassName: 'header-color',isResize:true},
		                    {field: 'CurAmt', title: '当前欠款', width: 100, titleAlign: 'center', columnAlign: 'center',titleCellClassName: 'header-color',isResize:true},
		                    {field: 'PreAmt', title: '预警金额', width: 100, titleAlign: 'center', columnAlign: 'center',titleCellClassName: 'header-color',isResize:true},
		                    {field: 'MinAmtCond', title: '终止金额', width: 100, titleAlign: 'center', columnAlign: 'center',titleCellClassName: 'header-color',isResize:true},
		                    {field: 'LeftMinAmtCond', title: '终止金额剩余', width: 100, titleAlign: 'center', columnAlign: 'center',titleCellClassName: 'header-color',isResize:true},
		                    {field: 'CurNeedPay', title: '当前需付总额', width: 100, titleAlign: 'center', columnAlign: 'center',titleCellClassName: 'header-color',isResize:true}
		                ],
		                height : 0
					},
				},
				tableData: [],
				filterForm:{
					cusName:'',
					taskId:'',
				},
				pageConfig:{
					switchChecked:false,
				}
			}
		},
		methods:{
			cusContact( data ){
				let self = this;
				this.$request.staff.frec.cusContact( data ).then(res=>{
					self.tableData = res.result
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
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','客户来往统计');
			if( sessionStorage.getItem('frec/cusContact') !== null  ){
				this.filterForm = JSON.parse(sessionStorage.getItem('frec/cusContact'));
				this.pageConfig.switchChecked = true;
			}
		},
		mounted(){
			this.cusContact( this.filterForm );
			this.config.table.height  = window.screen.height - 126;
		},
		destroyed(){
			if( this.pageConfig.switchChecked ){
				sessionStorage.setItem('frec/cusContact',JSON.stringify(this.filterForm));
			}else{
				sessionStorage.removeItem('frec/cusContact');
			}
		},
		watch:{
			
		}
	}
</script>
<style>
	.header-color{
        color:#0bf147;
	}
</style>