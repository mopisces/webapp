<template>
	<div>
		<van-dropdown-menu>
			<van-dropdown-item v-model="formData.index" :options="config.dropDown.indexOption" />
			<van-dropdown-item v-model="formData.active" :options="config.dropDown.activeOption" />
		</van-dropdown-menu>
		<!-- <v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff"  :height="config.table.height" even-bg-color="#fafafa">
		</v-table> -->
		<el-table :data="tableData" stripe :height="config.table.height" v-if="config.table.height">
			<el-table-column prop="糊机备纸" label="糊机备纸" width="130"></el-table-column>
			<el-table-column prop="SF1芯纸" label="SF1芯纸" width="130"></el-table-column>
			<el-table-column prop="SF1面纸" label="SF1面纸" width="130"></el-table-column>
			<el-table-column prop="SF2芯纸" label="SF2芯纸" width="130"></el-table-column>
			<el-table-column prop="SF2面纸" label="SF2面纸" width="130"></el-table-column>
			<el-table-column prop="SF3芯纸" label="SF3芯纸" width="130"></el-table-column>
			<el-table-column prop="SF3面纸" label="SF3面纸" width="130"></el-table-column>
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
					dropDown:{
						indexOption  : [],
						activeOption : [
							{
								text  : '按长度',
								value : 0
							},
							{
								text  : '按重量',
								value : 1
							}
						]
					},
					table:{
						columns:[
							{field: '糊机备纸', title: '糊机备纸', width:130 , titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'SF1芯纸', title: 'SF1芯纸', width:130 , titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'SF1面纸', title: 'SF1面纸', width:130 , titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'SF2芯纸', title: 'SF2芯纸', width:130 , titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'SF2面纸', title: 'SF2面纸', width:130 , titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'SF3芯纸', title: 'SF3芯纸', width:130 , titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'SF3面纸', title: 'SF3面纸', width:130 , titleAlign: 'center', columnAlign: 'center',isResize:true},
						],
						height : 0
					},
					isnew : false
				},
				formData:{
					index  : 0,
					active : 0,
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
							self.config.dropDown.indexOption.push({text:item.DB_FLAG,value:index,isnew:item.isnew});
						});
						self.config.isnew = self.config.dropDown.indexOption[0].isnew == 0 ? false : true;
					}
				}).then(()=>{
					this.getTableData();
					this.$nextTick(()=>{
						if( this.config.isnew ){
							this.config.dropDown.activeOption = [
								{
									text  : '按长度',
									value : 0
								},
								{
									text  : '按重量',
									value : 1
								}
							];
						}else{
							this.config.dropDown.activeOption = [
								{
									text  : '按长度',
									value : 0
								}
							];
						}
					});
				});
			},
			getTableData(){
				this.tableData = [];
				let self = this;
				this.$request.sg.select.getBlms( this.formData ).then(res=>{
					if( res.errorCode == '00000' ){
						self.tableData = res.result;
					}
				});
			}
		},
		created(){
			this.$store.commit('sg/setHeaderTitle','备料查看');
			this.$store.commit('sg/setTabbar','blms');
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
			indexChange(){
				return this.formData.index;
			},
			activeChange(){
				return this.formData.active;
			}
		},
		watch:{
			indexChange( newV, oldV ){
				this.config.isnew = this.config.dropDown.indexOption[newV].isnew == 0 ? false : true;
				if( this.config.isnew ){
					this.config.dropDown.activeOption = [
						{
							text  : '按长度',
							value : 0
						},
						{
							text  : '按重量',
							value : 1
						}
					];
				}else{
					this.config.dropDown.activeOption = [
						{
							text  : '按长度',
							value : 0
						}
					];
				}
				this.formData.active = 0;
				this.getTableData();
			},
			activeChange( newV, oldV ){
				this.getTableData();
			}
		}
	}
</script>