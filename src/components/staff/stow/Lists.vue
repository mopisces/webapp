<template>
	<div>
		<van-button plain hairline type="info" size="small" style="width:100%" @click="config.popup.filterShow = true">筛选</van-button>
		<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.columns" :table-data="table.data" row-hover-color="#eee" row-click-color="#edf7ff" >
		</v-table>	
	</div>
</template>
<script>
	import { Button } from 'vant';
	import { VTable, VPagination } from 'vue-easytable';
	export default {
		components:{
			[Button.name]: Button,

			[VTable.name]: VTable,
			[VPagination.name]: VPagination,
		},
		data(){
			return {
				config:{
					popup:{
						filterShow:false
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
					}
				},
				table:{
					data:[]
				}
			}
		},
		methods:{
			threeFn( row ){
				console.log(row)
			},
			getConfig(){
				this.$request.staff.stow.stowListConfig().then(res=>{
					console.log(res)
				});
			},
			getTableData(){
				let self = this;
				this.$request.staff.stow.stowList().then(res=>{
					self.table.data = res.result;
				});
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','扫描装货');
			this.getTableData();
		},
		mounted(){

		},
		destroyed(){

		},
		computed:{
			
		},
		watch:{

		}
	}
</script>

