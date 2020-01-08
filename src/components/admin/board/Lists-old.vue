<template>
	<div>
		<van-button plain hairline type="info" style="width:100%" size="small"  @click="config.popup.filterShow = true">筛选</van-button>

		<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;"  :columns="config.table.columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" :height="config.table.height" even-bg-color="#fafafa"></v-table>
		<el-button type="primary">主要按钮</el-button>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<radio-cell :radioInfo.sync="filterForm.orderType" :radioColumns="config.radio.orderType.options" title="排序"></radio-cell>
				<radio-cell :radioInfo.sync="filterForm.orderState" :radioColumns="config.radio.orderState.options" title="团购状态"></radio-cell>
				<radio-cell :radioInfo.sync="filterForm.isFlag" :radioColumns="config.radio.isFlag.options" title="爆款"></radio-cell>
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button, Popup } from 'vant';
	import { VTable, VPagination } from 'vue-easytable';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import RadioCell from '@/components/subject/RadioCell.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Popup.name]: Popup,

			[VTable.name]: VTable,
			[VPagination.name]: VPagination,

			PopupFilter,
			RadioCell
		},
		data(){
			return {
				config:{
					table:{
						columns : [
							{field: 'Id', title: 'Id', width: 10, titleAlign: 'center', columnAlign: 'center',isResize:true ,isFrozen: true},
							{field: 'BoardId', title: '材质,标题', width: 150, titleAlign: 'center', columnAlign: 'center',isResize:true ,isFrozen: true,formatter: (rowData,rowIndex,pagingIndex,field)=>{
								let str = '<span style="color:#e01835;">' + rowData.BoardId + '</span>';
								if( rowData.Title ){
									str += '<span>,' + rowData.Title + '</span>';
								}
								return str;
							}},
							{field: 'Id', title: 'Id', width: 10, titleAlign: 'center', columnAlign: 'center',isResize:true },
							{field: 'Price', title: '价格(元/㎡)', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true ,formatter:(rowData)=>{
								let str = '<span style="color: #e01835;">' + rowData.Price + '</span>&nbsp;&nbsp;&nbsp;&nbsp;';
								str += '<span style="text-decoration: line-through;">' + rowData.MarketPrice + '</span>';
								return str;
							}},
							{field: 'BeginTime', title: '团购时间开始时间', width: 350, titleAlign: 'center', columnAlign: 'center',isResize:true ,formatter:( rowData )=>{
								let str = rowData.BeginTime + '&nbsp;&nbsp;&nbsp;&nbsp;' + rowData.EndTime;
								if( rowData.State == 'ing' ){
									str += '<span class="flag" style="color: #e01835;border-color: #e01835;">正在抢购</span>'; 
								}else if( rowData.State == 'tobe' ){
									str += '<span class="flag" style="color: #ffa500;border-color: #ffa500;">即将开抢</span>';
								}else if( rowData.State == 'ed' ){
									str += '<span class="flag" style="color: #778899;border-color: #778899;">已结束</span>';
								}
								return str;
							}},
						],
						height : 0
					},
					popup : {
						filterShow : false
					},
					radio : {
						orderType : {
							options : [
								{ title : '升序', value : 1 },
								{ title : '降序', value : 2 }
							]
						},
						orderState : {
							options : [
								{ title : '全部', value : 0 },
								{ title : '正在抢购', value : 1 },
								{ title : '即将开抢', value : 2 },
								{ title : '已结束', value : 3 },
							]
						},
						isFlag : {
							options : [
								{ title : '全部', value : 0 },
								{ title : '是', value : 1 },
								{ title : '否', value : 2 },
							]
						}
					}
				},
				filterForm : {
					orderType  : 1,
					orderState : 0,
					isFlag     : 0
				},
				tableData : [],
			}
		},
		methods:{
			resetClick(){
				this.filterForm = {
					orderType  : 1,
					orderState : 0,
					isFlag     : 0
				};
			},
			filterClick(){

			},
			getConfig(){

			},
			getList(){
				let self = this;
				this.$request.admin.board.getList( this.filterForm ).then(res=>{
					self.tableData = res.result
				});
			}
		},
		created(){
			this.$store.commit('admin/setHeaderTitle','纸板列表');
			this.getList();
		},
		mounted(){
			this.config.table.height  = window.screen.height - 126;
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
<style>
	.flag {
		padding: 0 5px;
		font-size: 14px;
		border:1px solid #EF784B;
		border-radius: 50%;
		transform:rotate(-30deg);
		display:inline-block;
	}
</style>