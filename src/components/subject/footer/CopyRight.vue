<template>
	<div style="width:100%;text-align: center;padding-top:0.5rem;font-size:0.875rem;">
		<van-divider dashed>
			<a href="http://www.beian.miit.gov.cn"> 浙ICP备16024747号-1</a>
		</van-divider>
		<van-divider dashed>
			<a href="http://www.jpeng.com.cn/"> Copyright © {{ year }} 佳鹏电脑.All rights reserved. </a>
		</van-divider>
	</div>
</template>
<script>
	import { Divider } from 'vant';
	export default {
		components:{
			[Divider.name]: Divider,
		},
		data(){
			return {
				year:''
			}
		},
		methods:{
			getNowYear(){
				let dateYear = new Date();
				this.year = dateYear.getFullYear();
			}
		},
		created(){
			this.getNowYear();
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