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
				value:''
			}
		},
		methods:{

		},
		created(){
			this.$store.commit('client/setHeaderTitle','');
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