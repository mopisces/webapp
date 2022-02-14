<template>
	<div>
		<van-field v-model="value" label="文本" placeholder="请输入用户名" />
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
				value:'123'
			}
		},
		methods:{
			getConfig(){
				this.$request.staff.paper.expectStockConfig().then(res=>{
					console.log(res)
				});
				this.value = '789'
				console.log(this.$options.data().value)
			},
			getData(){
				this.$request.staff.paper.expectStockData().then(res=>{
					console.log(res)
				});
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','库存预计');
		},
		mounted(){
			this.getConfig();
			this.getData()
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