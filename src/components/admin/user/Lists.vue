<template>
	<div>
		<el-table :data="tableData" style="width: 100%" :row-class-name="tableRowClassName">
			<el-table-column prop="UserName" label="账号"></el-table-column>
			<el-table-column prop="PassWord" label="密码"></el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-tooltip class="item" effect="dark" content="修改密码" placement="top">
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
		<el-dialog title="密码修改" :visible.sync="config.dialogFormVisible">
			<el-form :model="formData" ref="editForm" label-position="left" label-width="150px" :rules="rules">
				<el-form-item label="账号" prop="userName">
					<el-input v-model="formData.userName" style="width:300px;" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="userPass">
					<el-input v-model="formData.userPass" style="width:300px;"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="config.dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="editSave()">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	export default {
		data(){
			return {
				config:{
					total : 0,
					dialogFormVisible : false
				},
				filterForm : {
					curPage : 1
				},
				formData  : {
					userName  : '',
					userPass  : ''
				},
				tableData : [],
				rules : {
					userName : [
						{ required:true, message:'请输入账号', trigger:'blur' }
					],
					userPass : [
						{ required:true, message:'请输入密码', trigger:'blur' }
					]
				}
			}
		},
		methods:{
			tableRowClassName({row, rowIndex}){
				if ( rowIndex%2 == 0 ) {
					return 'even-row';
				}else{
					return 'odd-row';
				}
			},
			getUserList(){
				let self = this;
				this.$request.admin.user.getUserList( this.filterForm.curPage ).then(res=>{
					self.config.total = res.result.count;
					self.tableData    = res.result.data;
				});
			},
			pageChange( curPage ){
				this.tableData          = [];
				this.filterForm.curPage = curPage;
			},
			del( scope ){
				let self = this;
				this.$request.admin.user.delUser( scope.row.UserName ).then(res=>{
					if( res.errorCode == '00000' ){	
						self.$message({
							message: '删除成功',
							type: 'success'
						});
					}else{
						self.$message({
							message: '删除失败',
							type: 'warning'
						});
					}
				}).then(()=>{
					this.getUserList();
				});
			},
			edit( rowData ){
				this.formData.userName = rowData.UserName;
				this.formData.userPass = rowData.PassWord;
				this.config.dialogFormVisible = true;
			},
			editSave(){
				this.config.dialogFormVisible = false;
				let self = this;
				this.$request.admin.user.editUser( this.formData ).then(res=>{
					if( res.errorCode == '00000' ){	
						self.$message({
							message: '修改成功',
							type: 'success'
						});
					}else{
						self.$message({
							message: '修改失败',
							type: 'warning'
						});
					}
				}).then(()=>{
					this.getUserList();
					this.formData.userName = '';
					this.formData.userPass = '';
				});
			}
		},
		created(){
			
		},
		mounted(){
			this.getUserList();
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
					this.getUserList();
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