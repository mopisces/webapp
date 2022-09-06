<template>
	<div>
		<el-tabs v-model="config.tab.active">
			<el-tab-pane label="厂商logo" name="logo">
				<table>
					<tbody>
						<tr>
							<td>厂商logo</td>
							<td>
								<el-upload class="avatar-uploader" :action="config.upload.action" :headers="config.upload.header" :data="config.upload.logo.data" name="image" :show-file-list="false" :on-success="logoSuccess">
									<img class="avatar" :src="imgUrl.logoUrl" v-if="imgUrl.logoUrl">
									<i class="el-icon-plus avatar-uploader-icon" v-else></i>
								</el-upload>
							</td>
						</tr>
					</tbody>
				</table>
			</el-tab-pane>
			<el-tab-pane label="首页图片" name="index">
				<table>
					<tbody>
						<tr>
							<td>纸板团购</td>
							<td>
								<el-upload class="avatar-uploader" :action="config.upload.action" :headers="config.upload.header" :data="config.upload.board.data" name="image" :show-file-list="false" :on-success="boardSuccess">
									<img class="avatar" :src="imgUrl.boardUrl" v-if="imgUrl.boardUrl">
									<i class="el-icon-plus avatar-uploader-icon" v-else></i>
								</el-upload>
							</td>
						</tr>
						<tr>
							<td>纸板团购{{ config.flagName.board }}</td>
							<td>
								<el-upload class="avatar-uploader" :action="config.upload.action" :headers="config.upload.header" :data="config.upload.boardFlag.data" name="image" :show-file-list="false" :on-success="boardFlagSuccess">
									<img class="avatar" :src="imgUrl.boardFlagUrl" v-if="imgUrl.boardFlagUrl">
									<i class="el-icon-plus avatar-uploader-icon" v-else></i>
								</el-upload>
							</td>
						</tr>
						<tr>
							<td>淘宝箱团购</td>
							<td>
								<el-upload class="avatar-uploader" :action="config.upload.action" :headers="config.upload.header" :data="config.upload.box.data" name="image" :show-file-list="false" :on-success="boxSuccess">
									<img class="avatar" :src="imgUrl.boxUrl" v-if="imgUrl.boxUrl">
									<i class="el-icon-plus avatar-uploader-icon" v-else></i>
								</el-upload>
							</td>
						</tr>
						<tr>
							<td>淘宝箱团购{{ config.flagName.box }}</td>
							<td>
								<el-upload class="avatar-uploader" :action="config.upload.action" :headers="config.upload.header" :data="config.upload.boxFlag.data" name="image" :show-file-list="false" :on-success="boxFlagSuccess">
									<img class="avatar" :src="imgUrl.boxFlagUrl" v-if="imgUrl.boxFlagUrl">
									<i class="el-icon-plus avatar-uploader-icon" v-else></i>
								</el-upload>
							</td>
						</tr>
					</tbody>
				</table>
			</el-tab-pane>
		</el-tabs>
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
						action:window.jpdn_domain_admin + 'adminSetDefaultImg',
						header:{
							Authentication : getStorage('jpdn-admin-token',  'sessionStorage')
						},
						logo:{
							data:{
								default_img_type:'logo'
							}
						},
						board:{
							data:{
								default_img_type:'board'
							}
						},
						boardFlag:{
							data:{
								default_img_type:'boardflag'
							}
						},
						box:{
							data:{
								default_img_type:'box'
							}
						},
						boxFlag:{
							data:{
								default_img_type:'boxflag'
							}
						}
					},
					dialog:{
						visible : false,
						url : ''
					},
					flagName:{
						board:'',
						box  :''
					}
				},
				imgUrl:{
					logoUrl      : '',
					boardUrl     : '',
					boardFlagUrl : '',
					boxUrl       : '',
					boxFlagUrl   : '',
				}
			}
		},
		methods:{
			onPreview(file){
				this.config.dialog.url     = file.url;
				this.config.dialog.visible = true;
			},
			getFlagName(){
				let self = this;
				this.$request.admin.image.getGroupImg().then((res)=>{
					if( res.errorCode == '00000' ){
						self.config.flagName.board = res.result.BoardFlag;
						self.config.flagName.box   = res.result.BoxFlag;
						self.imgUrl.logoUrl        = window.jpdn_domain_imgDomain + res.result.FactoryLogo;
						self.imgUrl.boardUrl       = window.jpdn_domain_imgDomain + res.result.BoardGroupPic;
						self.imgUrl.boardFlagUrl   = window.jpdn_domain_imgDomain + res.result.FlagBoardGroupPic;
						self.imgUrl.boxUrl         = window.jpdn_domain_imgDomain + res.result.BoxGroupPic;
						self.imgUrl.boxFlagUrl     = window.jpdn_domain_imgDomain + res.result.FlagBoxGroupPic;
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
			boardSuccess(response, file, fileList){
				if( response.errorCode == '00000' ){
					this.imgUrl.boardUrl = URL.createObjectURL(file.raw);
				}else{
					this.$message.warning(response.msg);
				}
			},
			boardFlagSuccess(response, file, fileList){
				if( response.errorCode == '00000' ){
					this.imgUrl.boardFlagUrl = URL.createObjectURL(file.raw);
				}else{
					this.$message.warning(response.msg);
				}
			},
			boxSuccess(response, file, fileList){
				if( response.errorCode == '00000' ){
					this.imgUrl.boxUrl = URL.createObjectURL(file.raw);
				}else{
					this.$message.warning(response.msg);
				}
			},
			boxFlagSuccess(response, file, fileList){
				if( response.errorCode == '00000' ){
					this.imgUrl.boxFlagUrl = URL.createObjectURL(file.raw);
				}else{
					this.$message.warning(response.msg);
				}
			}
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
</style>