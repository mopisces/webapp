<template>
	<div>
		<van-dropdown-menu active-color="#1aad19">
			<van-dropdown-item v-model="formData.selectItem" :options="config.dropDownOption" />
		</van-dropdown-menu>
		<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff"  :height="config.table.height" even-bg-color="#fafafa">
		</v-table>
	</div>
</template>
<script>
	import { DropdownMenu, DropdownItem } from 'vant';
	//import { VTable, VPagination } from 'vue-easytable';
	export default {
		components:{
			[DropdownMenu.name]: DropdownMenu,
			[DropdownItem.name]: DropdownItem,

			/*[VTable.name]: VTable,
			[VPagination.name]: VPagination,*/
		},
		data(){
			return {
				config:{
					dropDownOption:[],
					table:{
						columns : [
							{field: 'sn', title: '序号', width:50 , titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'width', title: '门幅', width:50 ,titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'paperMaterial', title: '生产纸质', width:80 , titleAlign: 'center', columnAlign: 'center', isResize:true, formatter:(rowData)=>{
								if( rowData.paper_code ){
									return rowData.paper_code;
								}else{
									return rowData.paper;
								}
							}},
							{field: 'flute_type', title: '楞别', width:50 ,titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'total_len', title: '总长', width:50 ,titleAlign: 'center', columnAlign: 'center',isResize:true}
						],
						height  : 0
					}
				},
				formData:{
					selectItem : 0
				},
				tableData : []
			}
		},
		methods:{
			getConfig(){
				let self = this;
				this.$request.sg.select.getConfig().then(res=>{
					if( res.errorCode == '00000' ){
						res.result.forEach((item,index)=>{
							self.config.dropDownOption.push({text:item.DB_FLAG,value:index,isnew:item.isnew});
						});
					}
				}).then(()=>{
					this.getTableData();
				});
			},
			getTableData(){
				let self = this;
				this.$request.sg.select.getBl( this.formData ).then(res=>{
					if( res.errorCode == '00000' ){
						self.tableData = res.result;
					}
				});
			}
		},
		created(){
			this.$store.commit('sg/setHeaderTitle','备料');
			this.getConfig();
		},
		mounted(){
			this.config.table.height = window.screen.height - 126;
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			itemChange(){
				return this.formData.selectItem;
			}
		},
		watch:{
			itemChange( newV, oldV ){
				this.getTableData();
			}
		}
	}
</script>