<template>
	<div></div>
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
			this.$store.commit('staff/setHeaderTitle','');
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