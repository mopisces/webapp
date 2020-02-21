<template>
	<div>
		<el-table :data="tableData" style="width: 100%" :row-class-name="tableRowClassName">
			<el-table-column prop="Icon" label="联系方式名称" :formatter="formatter"></el-table-column>
			<el-table-column prop="Name" label="名称"></el-table-column>
			<el-table-column prop="Content" label="内容"></el-table-column>
			<el-table-column label="操作">
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
		<el-dialog title="修改联系方式" :visible.sync="config.dialogFormVisible">
			<el-form :model="formData" ref="editForm" label-position="left" label-width="150px" :rules="rules">
				<el-form-item label="联系方式" prop="iconName">
					<el-select v-model="formData.iconName" placeholder="请选择" filterable>
						<el-option v-for="(item,index) in config.iconOptions" :key="index" :label="item.label" :value="item.icon"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="名称" prop="name">
					<el-input v-model="formData.name" style="width:300px;"></el-input>
				</el-form-item>
				<el-form-item label="内容" prop="content">
					<el-input v-model="formData.content" style="width:300px;"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="config.dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="editSaveValidate()">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import { changeIcon } from '@/util/index';
	export default {
		data(){
			return {
				config:{
					total : 0,
					dialogFormVisible : false,
					iconOptions : []
				},
				filterForm:{
					curPage : 1,
				},
				formData : {
					id       : '',
					iconName : '',
					name     : '',
					content  : '',
				},
				tableData:[],
				rules:{
					iconName : [
						{ required: true, message: '请选择联系方式', trigger: 'change' }
					],
					name : [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					],
					content : [
						{ required: true, message: '请输入内容', trigger: 'blur' }
					]
				}
			}
		},
		methods:{
			getIconLists(){
				let self = this;
				this.$request.admin.contact.contactAddConfig().then((res)=>{
					res.result.forEach((item,index)=>{
						self.config.iconOptions.push({icon:item,label:changeIcon(item)});
					});
				});
			},
			contactLists(){
				let self = this;
				this.$request.admin.contact.contactLists( this.filterForm.curPage ).then(res=>{
					self.config.total = res.result.count;
					self.tableData    = res.result.data;
				});
			},
			tableRowClassName({row, rowIndex}){
				if ( rowIndex%2 == 0 ) {
					return 'even-row';
				}else{
					return 'odd-row';
				}
			},
			formatter(row, column){
				return changeIcon(row.Icon);
			},
			pageChange( curPage ){
				this.tableData          = [];
				this.filterForm.curPage = curPage;
			},
			edit( rowData ){
				this.formData.id       = rowData.Id;
				this.formData.iconName = rowData.Icon;
				this.formData.name     = rowData.Name;
				this.formData.content  = rowData.Content;
				this.config.dialogFormVisible = true;
			},
			editSaveValidate(){
				this.$refs['editForm'].validate((valid)=>{
					if( valid ){
						this.editSave( this.formData );
					}else{
						return false;
					}
				});
			},
			editSave(){
				this.config.dialogFormVisible = false;
				let self = this;
				this.$request.admin.contact.contactEditSave( this.formData ).then((res)=>{
					if( res.errorCode == '00000' ){	
						self.$message({
							message: '修改成功',
							type: 'success'
						});
						self.contactLists();
					}else{
						self.$message({
							message: '修改失败',
							type: 'warning'
						});
					}
				}).then(()=>{
					this.formData.id       = '';
					this.formData.iconName = '',
					this.formData.name     = '';
					this.formData.content  = '';
				});
			},
			del( scope ){
				let self = this;
				this.$request.admin.contact.contactDel( scope.row.Id ).then(res=>{
					if( res.errorCode == '00000' ){	
						self.$message({
							message: '删除成功',
							type: 'success'
						});
						self.contactLists();
					}else{
						self.$message({
							message: '删除失败',
							type: 'warning'
						});
					}
				});
			},
		},
		created(){
			
		},
		mounted(){
			this.contactLists();
			this.getIconLists();
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