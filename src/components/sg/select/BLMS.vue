<template>
	<div>
		<van-dropdown-menu>
			<van-dropdown-item v-model="formData.index" :options="config.dropDown.indexOption" />
			<van-dropdown-item v-model="formData.active" :options="config.dropDown.activeOption" />
		</van-dropdown-menu>
		<el-table :data="tableData" border stripe :height="config.table.height" v-if="config.table.height">
			<el-table-column :prop="item.field" :label="item.title" :width="item.width" v-for="(item,index) in config.table.columns" :key="index">
			</el-table-column>
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
						columns:[],
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
						if( res.weight == 0 ){
							self.config.dropDown.activeOption = [
								{
									text  : '按长度',
									value : 0
								}
							];
						}else{
							self.config.dropDown.activeOption = [
								{
									text  : '按长度',
									value : 0
								},
								{
									text  : '按重量',
									value : 1
								}
							];
						}
					}
				}).then(()=>{
					this.getTableData();
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
			},
			getTableConfig(){
				this.$request.common.table.getTableConfig().then(res=>{
					this.config.table.columns = res.sgBLMS;
				});
			}
		},
		created(){
			this.$store.commit('sg/setHeaderTitle','备料查看');
			this.$store.commit('sg/setTabbar','blms');
			this.getConfig();
		},
		mounted(){
			this.getTableConfig();
			this.config.table.height = window.screen.height - 96;
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