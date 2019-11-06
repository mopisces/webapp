<template>
	<div>
		<button class="van-button van-button--primary van-button--mini van-button--plain van-button--hairline van-hairline--surround"  @click="modifyData(rowData,index)">
   			<span class="van-button__text">修改</span>
   		</button>
		<button class="van-button van-button--primary van-button--mini van-button--plain van-button--hairline van-hairline--surround"  @click="deleteData(rowData,index)">
   			<span class="van-button__text">删除</span>
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
			modifyData(rowData,index){
				let params = {type:'edit',index:this.index,rowData:this.rowData};
				this.$emit('on-custom-comp',params);
			},
			deleteData(rowData,index){
				let params = {type:'detele',index:this.index,rowData:this.rowData};
				this.$emit('on-custom-comp',params);
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