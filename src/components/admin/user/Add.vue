<template>
	<div>
		<el-form :model="formData" :rules="rules" ref="addForm" label-position="left" label-width="150px">
			<el-form-item label="账号" prop="userName">
				<el-input v-model="formData.userName" style="width:300px;"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="userPass">
				<el-input v-model="formData.userPass" style="width:300px;"></el-input>
			</el-form-item>
		</el-form>
		<el-button type="primary" @click="addSaveValidate()">添加用户</el-button>
	</div>
</template>
<script>
	export default {
		
		data(){
			return {
				formData:{
					userName : '',
					userPass : '',
				},
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
			addSaveValidate(){
				this.$refs['addForm'].validate((valid)=>{
					if( valid ){
						this.addSave( this.formData );
					}else{
						return false;
					}
				});
			},
			addSave( data ){
				let self = this;
				this.$request.admin.user.addUser( data ).then(res=>{
					if( res.errorCode === '00000' ){
						self.$message({
							message: '添加成功',
							type: 'success'
						});
					}else{
						self.$message({
							message: '添加失败',
							type: 'warning'
						});
					}
				}).then(()=>{
					this.formData.userName = '';
					this.formData.userPass = '';
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