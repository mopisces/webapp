<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="6">
				<el-button type="primary" @click="adjustQuoBox()">批量修改</el-button>
			</el-col>
		</el-row>
		<el-table :data="tableData" style="width: 100%" :row-class-name="tableRowClassName">
			<el-table-column prop="Id" label="ID" width="100"></el-table-column>
			<el-table-column prop="BoardId" label="材质编号" width="150"></el-table-column>
			<el-table-column label="团购时间" width="200">
				<template slot-scope="scope">
					<div style=" position:relative; ">
						{{ scope.row.BeginTime }}
						<br/>
						{{ scope.row.EndTime }}
						<span class="flag" style="color: #e01835;border-color: #e01835;" v-if=" scope.row.State === 'ing' ">正在抢购</span>
	                    <span class="flag" style="color: #ffa500;border-color: #ffa500;" v-else-if=" scope.row.State === 'tobe' ">即将开抢</span>
	                    <span class="flag" style="color: #778899;border-color: #778899;" v-else-if=" scope.row.State === 'ed' ">已结束</span>
                    </div>
				</template>
			</el-table-column>
			<el-table-column label="下单范围(㎡)" width="150">
				<template slot-scope="scope">
					{{ scope.row.BuildMin }}&nbsp;~&nbsp;{{ scope.row.BuildMax }}
				</template>
			</el-table-column>
			<el-table-column label="单客户限量(㎡)" width="150">
				<template slot-scope="scope">
					{{ scope.row.CusMax }}
				</template>
			</el-table-column>
			<el-table-column prop="Total" label="总客户限量(㎡)" width="180"></el-table-column>
			<el-table-column label="添加时间" width="180">
				<template slot-scope="scope">
					{{ scope.row.AddTime }}
				</template>
			</el-table-column>
			<el-table-column label="操作" width="180">
				<template slot-scope="scope">
					<el-tooltip class="item" effect="dark" content="修改" placement="top">
						<i class="el-icon-document icon-size" style="color: #9370db;" @click="edit( scope.row )"></i>
					</el-tooltip>
					<el-popconfirm title="确定删除吗？" @onConfirm="del(scope)">
						<i class="el-icon-delete icon-size" style="color: red;" slot="reference"></i>
					</el-popconfirm>
				</template>
			</el-table-column>
		</el-table>
		<div class="footer">
			<el-pagination background layout="prev, pager, next" :total="config.total"  @current-change="pageChange">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	import { Field } from 'vant';
	export default {
		components:{
			[Field.name]: Field,
		},
		data(){
			return {
				config:{
					total :0
				},
				filterForm:{
					curPage   : 1,
					orderType : 1
				},
				tableData:[]
			}
		},
		methods:{
			getQuoList(){
				let self = this;
				this.$request.admin.box.quoBoxList(this.filterForm).then(res=>{
					if( res.errorCode == '00000' ){
						self.config.total = res.result.total;
						self.tableData = res.result.list;
					}
				});
			},
			tableRowClassName({row, rowIndex}){
				if ( rowIndex%2 == 0 ) {
					return 'even-row';
				}else{
					return 'odd-row';
				}
			},
			del( scope ){
				let self = this;
				this.$request.admin.box.delQuoBox( scope.row ).then(res=>{
					if( res.errorCode == '00000' ){
						self.$message({
							message: '删除成功',
							type: 'success'
						});
						if( self.tableData.length > 1 ){
							self.tableData.splice(scope.$index,1);
						}else{
							self.filterForm.curPage--;
						}
					}else{
						self.$message({
							message: '删除失败',
							type: 'warning'
						});
					}
				});
			},
			pageChange( curPage ){
				this.tableData          = [];
				this.filterForm.curPage = curPage;
			},
			edit( rowData ){
				this.$router.push({ 
					name : 'quoBoxEdit', 
					params:{ 
						id : rowData.Id,
					} 
				});
			},
			adjustQuoBox(){
				let self = this;
				this.$request.admin.box.adjustQuoBox().then(res=>{
					if( res.errorCode == '00000' ){
						self.$message({
							message: '批量修改成功',
							type: 'success'
						});
					}else{
						self.$message({
							message: '批量修改失败',
							type: 'fail'
						});
					}
				});
			}
		},
		created(){
			this.getQuoList();
		},
		mounted(){

		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			curPageChange(){
				return this.filterForm.curPage;
			}
		},
		watch:{
			curPageChange( newV,oldV ){
				if( newV > 0 ){
					this.getQuoList();
				}else{
					this.filterForm.curPage = 1;
				}
			}
		}
	}
</script>
<style>
	.footer {
		text-align:center;
		margin-top:3.125rem;
	}
	.flag {
		padding: 0 5px;
		font-size: 0.8rem;
		border:1px solid #EF784B;
		border-radius: 50%;
		transform:rotate(-30deg);
		display:inline-block;
		position: absolute;
		top: 20%;
		right: 50%;
	}
	.icon-size {
		font-size: 1.2rem;
	}
	.el-table .even-row {
		background: #f0f0f0;
	}
	.el-table .odd-row {
		background: #fff;
	}
</style>