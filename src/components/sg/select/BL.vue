<template>
	<div>
		<van-dropdown-menu active-color="#1aad19">
			<van-dropdown-item v-model="formData.selectItem" :options="config.dropDownOption" />
		</van-dropdown-menu>
		<el-table :data="tableData" border stripe :height="config.table.height" v-if="config.table.height">
			<el-table-column  :label="item.title" :width="item.width" v-for="(item,index) in config.table.columns" :key="index">
				<template slot-scope="scope">
					<span  v-if="item.field == 'paperMaterial'">
						<span v-if=" scope.row.paper "> 
							{{ scope.row.paper }} 
						</span>
						<span v-if=" scope.row.paper_code "> 
							{{ scope.row.paper_code }} 
						</span>
					</span>
					<span v-else>
						{{ scope.row[item.field] }}
					</span>
				</template>
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
					dropDownOption:[],
					table:{
						columns : [
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
			},
			getTableConfig(){
				this.config.table.columns = [];
				this.$request.common.table.getTableConfig().then(res=>{
					this.config.table.columns = res.sgBL;
				});
			}
		},
		created(){
			this.$store.commit('sg/setHeaderTitle','备料');
			this.$store.commit('sg/setTabbar','bl');
			this.getConfig();
		},
		mounted(){
			this.config.table.height = window.screen.height - 160;
			this.getTableConfig();
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