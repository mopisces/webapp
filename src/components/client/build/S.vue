<template>
	<div>
		 <van-field v-model="value" input-align="center" label="客订单号" placeholder="未填写则系统自动生成"/>
		 
	</div>
</template>
<script>
	import { Field } from 'vant';
	export default {
		components:{
			[Field.name]: Field,
		},
		data(){
			return {
				value:''
			}
		},
		methods:{

		},
		created(){
			this.$store.commit('client/setHeaderTitle','简单纸板下单');
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