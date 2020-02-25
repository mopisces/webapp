<template>
	<div>
		<el-tabs v-model="config.tab.active" @tab-click="handleClick">
			<el-tab-pane label="厂商logo" name="logo">
				<el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" >
					<i class="el-icon-plus"></i>
				</el-upload>
			</el-tab-pane>
			<el-tab-pane label="首页图片" name="index">
				
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
	export default {
		data(){
			return {
				config:{
					tab:{
						active : 'logo'
					}
				},
				dialogImageUrl: '',
				dialogVisible: false
			}
		},
		methods:{
			handleClick(){

			},
			handleRemove(file, fileList){
				console.log(file, fileList);
			},
			handlePictureCardPreview(file){
				console.log(file.url);
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
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