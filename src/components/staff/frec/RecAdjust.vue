<template>
	<div>
		<div class="van-tabs van-tabs--card">
			<div class="van-tabs__wrap">
				<div class="van-tabs__nav van-tabs__nav--card">
					<div :class="config.tabs.payClass"  @click="tabsClick(0)">收款</div>
					<div :class="config.tabs.adjustClass" @click="tabsClick(1)">调账</div>
					<div class="van-tab" @click="filterClick()">筛选</div>
				</div>
			</div>
		</div>
		<v-table is-horizontal-resize is-horizontal-resize style="width:100%;" :columns="config.table.columns" :table-data="info.table.data" row-hover-color="#eee" row-click-color="#edf7ff" :height="500" >
		</v-table>
		<van-popup v-model="config.popup.filterShow" position="right" :style="{ height: '100%', width:'80%' }">
			<div class="van-nav-bar van-nav-bar--fixed van-hairline--bottom" style="z-index: 1;">
				<div class="van-nav-bar__title van-ellipsis">
					筛选条件
				</div>
			</div>
		</van-popup>
	</div>
</template>
<script>
	import { Popup   } from 'vant';
	import { VTable, VPagination } from 'vue-easytable';
	export default {
		components:{
			[Popup .name]: Popup,

			[VTable.name]: VTable,
			[VPagination.name]: VPagination,
		},
		data(){
			return {
				show:false,
				config:{
					table:{
						columns:[
							{field: 'Cus', title: '客户', width: 140, titleAlign: 'center', columnAlign: 'center',isResize:true ,isFrozen: true},
							{field: 'Checked', title: '审核', width: 140, titleAlign: 'center', columnAlign: 'center',isResize:true ,formatter: (rowData,rowIndex,pagingIndex,field)=>{
								return rowData.Checked === '1' ? '<span class="van-icon van-icon-success"></span>' : '<span class="van-icon van-icon-fail"></span>';
							}},
							{field: 'PayId', title: '单号', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'OpDate', title: '操作日期', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'IssueDate', title: '生效日期', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'Amount', title: '金额', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'Remark', title: '备注', width: 150, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'NeedInv', title: '需开票', width: 150, titleAlign: 'center', columnAlign: 'center',isResize:true, formatter:(rowData,rowIndex,pagingIndex,field)=>{
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
						filterShow:false
					}
				},
				info:{
					table:{
						data:[],
					}
				},
				filterForm:{
					adjustType : 1
				}
			}
		},
		methods:{
			filterClick(){
				this.recAdjustConfig();
				this.config.popup.filterShow = true;
			},
			recAdjustConfig(){
				this.$request.staff.frec.recAdjustConfig().then(res=>{
					console.log(res)
				});
			},
			recAdjustMain(){
				let self = this;
				
				this.$request.staff.frec.recAdjustMain( this.filterForm ).then(res=>{
					self.info.table.data = res.result;
				});
			},
			tabsClick(data){
				if( data === 1 ){
					this.config.tabs.active = 1;
					this.config.tabs.payClass = 'van-tab';
					this.config.tabs.adjustClass = 'van-tab van-tab--active';
					this.filterForm.adjustType = 0;
				}else{
					this.config.tabs.active = 0;
					this.config.tabs.adjustClass = 'van-tab';
					this.config.tabs.payClass = 'van-tab van-tab--active';
					this.filterForm.adjustType = 1;
				}
				this.recAdjustMain();
			}
		},
		mounted(){

		},
		created(){
			this.$store.commit('staff/setHeaderTitle','收款调账');
			this.recAdjustMain();
		}
	}
</script>