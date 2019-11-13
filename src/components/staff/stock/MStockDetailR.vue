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
		created(){
			this.$store.commit('staff/setHeaderTitle','库存修改');
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