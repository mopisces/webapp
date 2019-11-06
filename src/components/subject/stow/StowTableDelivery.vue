<template>
	<div>
		<button class="van-button van-button--primary van-button--small van-button--plain van-button--hairline van-hairline--surround"  @click="update(rowData,index)" v-if=" rowData.CarState == 0 ">
   			<span class="van-button__text">准备</span>
   		</button>
		<button class="van-button van-button--primary van-button--small van-button--plain van-button--hairline van-hairline--surround"  @click="update(rowData,index)" v-if="rowData.CarState == 1 ">
   			<span class="van-button__text">取消准备</span>
   		</button>
	</div>
</template>
<script>
	export default {
		props:['rowData','field','index'],
		data(){
			return {

			}
		},
		methods:{
			update( rowData,index ){
				console.log('update')
				console.log(rowData.CarState)
				console.log(index)
			},
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