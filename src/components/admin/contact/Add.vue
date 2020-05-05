<template>
	<div>
		<el-form :model="formData" ref="addForm" label-position="left" label-width="150px" :rules="rules">
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
		<el-button type="primary" @click="addSaveValidate()">添加联系方式</el-button>
	</div>
</template>
<script>
	import { changeIcon } from '@/util/index';
	export default {
		data(){
			return {
				config:{
					iconOptions : []
				},
				formData:{
					iconName : '',
					name     : '',
					content  : '',
				},
				rules : {
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
			addSaveValidate(){
				this.$refs['addForm'].validate((valid)=>{
					if( valid ){
						this.addSave( this.formData );
					}else{
						return false;
					}
				});
			},
			addSave(){
				let self = this;
				this.$request.admin.contact.contactAdd( this.formData ).then((res)=>{
					if( res.errorCode == '00000' ){	
						self.$message({
							duration: 1500,
							message: '添加成功',
							type: 'success',
							onClose:function(){
								self.$router.push('/admin/contact/lists');
							}
						});
					}else{
						self.$message({
							duration: 1500,
							message: '添加失败',
							type: 'warning'
						});
					}
				}).then(()=>{
					Object.keys( this.formData ).forEach((item,index)=>{
						this.formData[item] = '';
					});
				});
			}
		},
		created(){
			
		},
		mounted(){
			this.getIconLists();
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