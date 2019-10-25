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
		mounted(){

		},
		created(){
			this.$store.commit('staff/setHeaderTitle','');
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>