<template>
	<div>
		<el-tabs v-model="config.tab.active">
			<el-tab-pane label="厂商logo" name="logo">
				<table>
					<tbody>
						<tr>
							<td>厂商logo</td>
							<td>
								<el-upload 
									class="avatar-uploader" 
									:action="config.upload.action" 
									:headers="config.upload.header" 
									:data="config.upload.logo.data" 
									name="image" 
									:show-file-list="false" 
									:on-success="logoSuccess"
								>
									<img class="avatar" :src="imgUrl.logoUrl" v-if="imgUrl.logoUrl">
									<i class="el-icon-plus avatar-uploader-icon" v-else></i>
								</el-upload>
							</td>
						</tr>
					</tbody>
				</table>
			</el-tab-pane>
			<el-tab-pane label="团购首页轮播图" name="group-banner">
				<div class="group-banner-container">
					<el-upload
						:action="config.upload.groupBanner.action"
						:headers="config.upload.header"
						:data="config.upload.groupBanner.data"
						:on-preview="picPreview"
						:on-remove="bannerRemove"
						:file-list="imgUrl.bannerList"
						list-type="picture"
						name="image" 
						:on-success="bannerSuccess"
					>
						<el-button size="small" type="primary">点击上传</el-button>
						<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
					</el-upload>
				</div>
			</el-tab-pane>
		</el-tabs>

		<el-dialog :visible.sync="config.dialog.visible" width="38rem" top="5rem">
			<img width="560" height="560" :src="config.dialog.url" alt="">
		</el-dialog>
	</div>
</template>
<script>
	import { getStorage } from '@/util/storage';
	export default {
		data(){
			return {
				config:{
					tab:{
						active : 'logo'
					},
					upload:{
						action: null,
						header:{
							Authentication : getStorage('jpdn-admin-token',  'sessionStorage')
						},
						logo:{
							data:{
								default_img_type:'logo'
							}
						},
						groupBanner: {
							action: null,
							data:{
								addType: 10,
							}
						}
					},
					dialog:{
						visible : false,
						url : ''
					},
				},
				imgUrl:{
					logoUrl: '',
					bannerList: []
				}
			}
		},
		methods:{
			getFlagName(){
				this.imgUrl.bannerList = this.$options.data().imgUrl.bannerList
				let self = this;
				this.$request.admin.image.getGroupImg().then((res)=>{
					if( res.errorCode == '00000' ){
						self.imgUrl.logoUrl = res.result.FactoryLogo;
						if( res.result.GroupBanner.length > 0 ) {
							res.result.GroupBanner.forEach((item)=>{
								self.imgUrl.bannerList.push({
									name: item,
									url: item
								})
							})
						}
						self.config.upload.action = res.result.uploadAction
						self.config.upload.groupBanner.action = res.result.bannerAction
					}
				});
			},
			logoSuccess(response, file, fileList){
				if( response.errorCode == '00000' ){
					this.imgUrl.logoUrl = URL.createObjectURL(file.raw);
				}else{
					this.$message.warning(response.msg);
				}
			},
			bannerSuccess( response, file, fileList ) {
				if( response.errorCode == '00000' ){
					this.getFlagName()
					this.$message.success(response.msg);
				}else{
					this.$message.warning(response.msg);
				}
			},
			picPreview(file) {
				this.config.dialog.url = file.url
        		this.config.dialog.visible = true
			},
			bannerRemove(file, fileList) {
				this.$request.admin.image.delImg(file.name).then((res)=> {
					this.$message.success(res.msg);
				})
			},
		},
		created(){
			this.getFlagName();
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
<style>
	.avatar-uploader .el-upload {
		border: 0.0625rem dashed #d9d9d9;
		border-radius: 0.375rem;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}
	.avatar-uploader-icon {
		font-size: 1.75rem;
		color: #8c939d;
		width: 11.125rem;
		height: 11.125rem;
		line-height: 11.125rem;
		text-align: center;
	}
	.avatar {
		width: 11.125rem;
		height: 11.125rem;
		display: block;
	}

	.group-banner-container {
		width: 25rem;
	}

</style>