<template>
	<div class="van-cell van-cell--clickable van-cell--center van-cell--borderless van-contact-card van-contact-card--add" @click="addClick()">
		<i class="van-icon van-icon-add-square van-cell__left-icon"><!----></i>
		<div class="van-cell__value van-cell__value--alone van-contact-card__value">
			{{ text }}
		</div>
		<i class="van-icon van-icon-arrow van-cell__right-icon"><!----></i>
	</div>
</template>
<script>
	export default {
		props:['text'],
		data(){
			return {
				value:''
			}
		},
		methods:{
			addClick(){
				this.$emit('addClick');
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