<template>
	<button class="van-button van-button--primary van-button--small van-button--plain van-button--hairline van-hairline--surround"  @click="detail(rowData,index)">
		<span class="van-button__text">明细</span>
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
			detail(rowData,index){
				this.$router.push({
					path:'/staff/stow/detail',
					query:{
						isEdit:0,
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