<template>
	<div>
		<el-upload :action="upload.action" :headers="upload.header" :data="upload.data" name="image" :on-preview="onPreview" :on-remove="onRemove" list-type="picture-card" :file-list="fileList" :on-success="onSuccess">
			<i class="el-icon-plus"></i>
		</el-upload>
		<el-dialog :visible.sync="dialog.visible">
			<img width="100%" :src="dialog.imgUrl">
		</el-dialog>
	</div>
</template>
<script>
	import { admin } from '@/request/urlMap.js';
	export default {
		data(){
			return {
				upload:{
					header:{
						Authentication : sessionStorage.getItem('jpdn-admin-token')
					},
					action:admin.image.defaultImgAdd,
					data:{
						default_pic_type:'board'
					}
				},
				fileList:[],
				dialog:{
					visible:false,
					imgUrl:''
				}
			}
		},
		methods:{
			onSuccess(response, file, fileList){
				if( response.errorCode == '00000' ){
					file.name = response.result;
					this.$message.success('上传成功');
				}else{
					this.$message.warning(response.msg);
					this.getDefalutPic();
				}
			},
			onPreview(file){
				this.dialog.imgUrl  = file.url;
				this.dialog.visible = true;
			},
			onRemove(file, fileList){
				let postData = {
					type : 'board',
					picName : file.name
				};
				let self = this;
				this.$request.admin.image.defaultImgDel( postData ).then((res)=>{
					if( res.errorCode == '00000' ){
						self.$message.success('删除成功！');
					}else{
						self.$message.success('删除失败！');
					}
				}).then(()=>{
					this.getDefalutPic();
				});
			},
			getDefalutPic(){
				this.fileList = [];
				let self = this;
				this.$request.admin.config.getConfig().then((res)=>{
					let arr = res.result.BoardDefaultPic.split(",");
					arr.forEach((item,index)=>{
						self.fileList.push({name:item,url:this.$store.state.common.imgUrl + item})
					})
				});
			}
		},
		created(){
			this.getDefalutPic();
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