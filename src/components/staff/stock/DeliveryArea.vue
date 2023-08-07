<template>
	<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :height="config.table.height" :columns="config.table.columns" :table-data="table.data" row-hover-color="#eee" row-click-color="#edf7ff">
	</v-table>
</template>
<script>
	export default {
		data(){
			return {
				config:{
					table:{
						columns:[
							{field: 'SAreaCode', title: '库区', width: 60, titleAlign: 'center', columnAlign: 'center',isResize:true,isFrozen:true},
							{field: 'MaxSArea', title: '库区面积', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'CurSArea', title: '已用面积', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'LeftArea', title: '剩余面积', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
						],
						height : 0
					}
				},
				table:{
					data:[]
				}
			}
		},
		methods:{
			getTableData(){
				this.$request.staff.stock.deliveryArea().then(res=>{
					this.table.data = res.result;
				});
			},
			getTableConfig(){
				this.$request.common.table.getTableConfig().then(res=>{
					this.config.table.columns = res.deliveryArea;
				});
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','库区面积');
		},
		mounted(){
			this.getTableConfig();
			this.getTableData();
			this.config.table.height = window.screen.height - 96;
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>