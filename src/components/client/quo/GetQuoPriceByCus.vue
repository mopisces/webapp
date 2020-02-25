<template>
	<div>
		<van-search placeholder="请输入材质编号" v-model="filterValue" @input="filterData()"/>
		<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.columns" :table-data="tableData.filter" row-hover-color="#eee" row-click-color="#edf7ff" :height="config.table.height" >
		</v-table>
	</div>
</template>
<script>
	import { Search } from 'vant';
	import { VTable, VPagination } from 'vue-easytable';
	export default {
		components:{
			[Search.name]: Search,

			VTable,
			VPagination
		},
		data(){
			return {
				config:{
					table:{
						columns:[
							{field: 'BoardId', title: '材质编号', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'BoardName', title: '材质名称', width: 120, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'UnitPrice', title: '平方价', width: 120, titleAlign: 'center', columnAlign: 'center',isResize:true},
						],
						height : 0
					}
				},
				filterValue : '',
				tableData   : {
					original : [],
					filter   : []
				}
			}
		},
		methods:{
			makeOffersPrice(){
				let self = this;
				this.$request.client.makeOffers.makeOffersPrice().then(res=>{
					self.tableData.original = res.result;
				}).then(()=>{
					this.$nextTick(()=>{
						this.filterData();
					});
				});
			},
			filterData(){
				if( this.filterValue != '' ){
					this.tableData.filter = [];
					for (var i = 0; i < this.tableData.original.length; i++) {
						if( this.tableData.original[i].BoardId.indexOf(this.filterValue) !== -1 ){
							this.tableData.filter.push(this.tableData.original[i]);
						}
					}
				}else{
					this.tableData.filter = this.tableData.original;
				}
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','报价价格');
		},
		mounted(){
			this.makeOffersPrice();
			this.config.table.height  = window.screen.height - 150;
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>