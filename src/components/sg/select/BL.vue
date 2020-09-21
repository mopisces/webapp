<template>
	<div>
		<van-dropdown-menu active-color="#1aad19">
			<van-dropdown-item v-model="formData.selectItem" :options="config.dropDownOption" />
		</van-dropdown-menu>
		<!-- <v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff"  :height="config.table.height" even-bg-color="#fafafa">
		</v-table> -->
		<el-table :data="tableData" stripe :height="config.table.height" v-if="config.table.height">
			<el-table-column prop="sn" label="序号" width="50" fixed></el-table-column>
			<el-table-column prop="width" label="门幅" width="100" ></el-table-column>
			<el-table-column prop="paper_code" label="生产纸质" width="100"></el-table-column>
			<el-table-column prop="flute_type" label="楞别" width="50" ></el-table-column>
			<el-table-column prop="total_len" label="总长" width="100" ></el-table-column>
		</el-table>
	</div>
</template>
<script>
	import { DropdownMenu, DropdownItem } from 'vant';
	export default {
		components:{
			[DropdownMenu.name]: DropdownMenu,
			[DropdownItem.name]: DropdownItem,
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
			this.$store.commit('sg/setTabbar','bl');
			this.getConfig();
		},
		mounted(){
			this.config.table.height = window.screen.height - 150;
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