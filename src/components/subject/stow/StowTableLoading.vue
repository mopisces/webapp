<template>
	<button class="van-button van-button--primary van-button--small van-button--plain van-button--hairline van-hairline--surround"  @click="load(rowData,index)">
		<span class="van-button__text">装货</span>
	</button>
</template>
<script>
	export default {
		props:['rowData','field','index'],
		data(){
			return {

			}
		},
		methods:{
			load(rowData,index){
				this.$router.push({
					path:'/staff/stow/detail',
					//name:'stow/detail',
					query:{
						isEdit:1,
						listNo:rowData.PListNo,
						orderType:rowData.OrderType
					}
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