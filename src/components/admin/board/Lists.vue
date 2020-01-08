<template>
	<div>
	</div>
</template>
<script>
	export default {
		data(){
			return {
				activeIndex2:'2'
			}
		},
		methods:{
			
		},
		created(){
			this.$store.commit('admin/setHeaderTitle','纸板列表');
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