<template>
	<div>
		<el-table :data="tableData" style="width: 100%">
			<el-table-column prop="Id" label="ID" width="180">
			</el-table-column>
		</el-table>
		<el-pagination background layout="prev, pager, next" :total="1000">
			
		</el-pagination>
	</div>
</template>
<script>
	export default {
		data(){
			return {
				filterForm : {
					orderType  : 1,
					orderState : 0,
					isFlag     : 0,
					curPage    : 1,
				},
				tableData:[]
			}
		},
		methods:{
			getList(){
				let self = this;
				this.$request.admin.board.getList( this.filterForm ).then(res=>{
					self.tableData = res.result;
				});
			}
		},
		created(){
			
		},
		mounted(){
			this.getList();
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