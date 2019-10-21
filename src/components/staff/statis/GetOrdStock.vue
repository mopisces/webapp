<template>
	<div>
		
	</div>
</template>
<script>
	import { Button } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
		},
		data(){
			return {

			}
		},
		methods:{

		},
		mounted(){

		},
		created(){
			this.$store.commit('staff/setHeaderTitle','库存统计');
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>