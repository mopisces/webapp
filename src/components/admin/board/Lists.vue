<template>
	<div>
		<van-button plain hairline type="info" style="width:100%" size="small"  @click="config.popup.filterShow = true">筛选</van-button>

		<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;"  :columns="config.table.columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" :height="config.table.height" even-bg-color="#fafafa"></v-table>

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