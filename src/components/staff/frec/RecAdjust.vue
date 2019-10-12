<template>
	<div>
		<van-tabs v-model="active" sticky>
			<van-tab title="收款">
				<v-table ref="" is-horizontal-resize is-horizontal-resize style="width:100%;" :columns="config.table.columns" :table-data="info.table.data" row-hover-color="#eee" row-click-color="#edf7ff" :height="500">
				</v-table>
			</van-tab>
			<van-tab title="调账">
				<v-table ref="" is-horizontal-resize is-horizontal-resize style="width:100%;" :columns="config.table.columns" :table-data="info.table.data" row-hover-color="#eee" row-click-color="#edf7ff" :height="500">
				</v-table>
			</van-tab>
		</van-tabs>
	</div>
</template>
<script>
	import { Tab, Tabs, Icon  } from 'vant';
	import { VTable, VPagination } from 'vue-easytable';
	export default {
		components:{
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			[Icon.name]: Icon,

			[VTable.name]: VTable,
			[VPagination.name]: VPagination,
		},
		data(){
			return {
				active:1,
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
					}
				},
				info:{
					table:{
						data:[],
					}
				},
				filterForm:{

				}
			}
		},
		methods:{
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