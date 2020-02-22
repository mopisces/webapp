<template>
	<div>
		<div style="width:100%;height:1rem;position:fixed;bottom:55%;text-align:center;">
			<van-uploader v-model="fileList" multiple :max-count="1"/>
		</div>
	</div>
</template>
<script>
	import { Button, Uploader } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[Uploader.name]: Uploader,
		},
		data(){
			return {
				fileList:[
					{ url: 'https://img.yzcdn.cn/vant/leaf.jpg' , isImage: true},
				]
			}
		},
		methods:{

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