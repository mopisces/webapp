<template>
	<div id="app">
    	<router-view />
  	</div>
</template>
<script>
	window.onload = function(){
		document.addEventListener('touchstart',function(event){
			if( event.touches.length > 1 ){
				event.preventDefault();
			}
		});
		document.addEventListener('gesturestart',function(event){
			event.preventDefault();
		});
	}

	export default {
		data() {
			return {}
		},
		async mounted() {
			const sysInfo = {
				screenWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
				screenHeight: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
			}
			await this.$store.dispatch('page/setPageInfo', sysInfo)
			//await this.$store.dispatch('user/logout')
		}
	}
</script>
<style>
	@import '~@/assets/style/index.css';
</style>
