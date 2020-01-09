<template>
	<div>
		<el-tabs v-model="config.tabPane.activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="公共" name="common">
				
			</el-tab-pane>
			<el-tab-pane label="内部" name="client">内部</el-tab-pane>
			<el-tab-pane label="外部" name="staff">外部</el-tab-pane>
			<el-tab-pane label="下单" name="build">下单</el-tab-pane>
			<el-tab-pane label="团购" name="group">团购</el-tab-pane>
			<el-tab-pane label="微信支付" name="wechat">微信支付</el-tab-pane>
			<el-tab-pane label="支付宝支付" name="ali">支付宝支付</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
	export default {
		data(){
			return {
				config : {
					tabPane:{
						activeName : 'common'
					}
				},
				
			}
		},
		methods:{
			handleClick(){
				console.log(1);
			},
			getList(){
				let self = this;
				this.$request.admin.board.getList( this.filterForm ).then(res=>{
					self.tableData = res.result
				});
			}
		},
		created(){
			
		},
		mounted(){

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