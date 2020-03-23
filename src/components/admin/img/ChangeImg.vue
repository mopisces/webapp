<template>
	<div>
		<el-upload :action="config.upload.action" list-type="picture-card" :headers="config.upload.header" :data="config.upload.data" :on-preview="onPreview" :on-remove="onRemove" :on-success="onSuccess" :file-list="pic" name="image">
			<i class="el-icon-plus"></i>
		</el-upload>
		<el-dialog :visible.sync="config.dialog.visible">
			<img :src="config.imgSrc" width="100%">
		</el-dialog>
		<el-button type="primary" @click="goBack()">返回</el-button>
	</div>
</template>
<script>
	import { admin } from '@/request/urlMap';
	import base from '@/request/base';
	export default {
		data(){
			return {
				config:{
					upload:{
						action:admin.image.addListImg,
						header:{
							Authentication : sessionStorage.getItem('jpdn-admin-token')
						},
						data:{
							img_id : ''
						}
					},
					dialog:{
						visible:false
					},
					imgSrc:''
				},
				formData:{
					id      : '',
					type    : '',
					picName : ''
				},
				pic:[]
			}
		},
		methods:{
			showImg(){
				let self = this;
				this.pic = [];
				this.$request.admin.image.showListImg( this.formData.id ).then(res=>{
					if( res.errorCode == '00000' ){
						res.result.forEach((item,index)=>{
							self.pic.push( {name:item,url:base.imgDomain + item});
						});
					}
				});
			},
			onPreview(file){
				this.config.imgSrc  = file.url;
				this.config.dialog.visible = true;
			},
			onRemove(file, fileList){
				this.formData.picName = file.name
				let self = this;
				this.$request.admin.image.delListImg( this.formData ).then((res)=>{
					if( res.errorCode == '00000' ){
						self.$message.success('删除成功！');
					}else{
						self.$message.success('删除失败！');
					}
				}).then(()=>{
					this.showImg();
				});
			},
			goBack(){
				this.$router.go(-1);
			},
			onSuccess(response, file, fileList){
				if( response.errorCode == '00000' ){
					file.name = response.result;
					this.$message.success('上传成功');
				}else{
					this.$message.warning(response.msg);
					this.showImg();
				}
			}
		},
		created(){
			if( this.$route.params.listId == '' || typeof(this.$route.params.listId) == 'undefined' ){
				this.$alert('请先选择需要修改的记录', '提示', {
					confirmButtonText : '返回',
					callback: action => {
						this.$router.go(-1);
					}
				});
				return ;
			}
			this.formData.id   = this.$route.params.listId;
			this.formData.type = this.$route.params.listType;
			this.config.upload.data.img_id = this.$route.params.listId;
			this.showImg();
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