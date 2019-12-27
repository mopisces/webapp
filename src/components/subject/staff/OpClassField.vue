<template>
	<div class="van-cell van-field">
		<div class="van-cell__title">
			<span>班次</span>
		</div>
		<div class="van-cell__value">
			<div class="van-field__body">
				<input placeholder="输入班次" class="van-field__control van-field__control--center" v-model="value" maxlength="2">
			</div>
		</div>
	</div>
	<!-- <van-field label="班次" v-model="value" placeholder="输入班次" input-align="center" :maxlength="2"></van-field> -->
</template>
<script>
	import { Field } from 'vant';
	export default {
		components:{
			[Field.name]: Field,
		},
		props:['opClass'],
		data(){
			return {
				value:this.opClass
			}
		},
		methods:{

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
			opClass(newV,oldV){
				this.value = newV.toUpperCase();
			},
			value(newV,oldV){
				this.$emit("update:opClass", newV.toUpperCase());
			}
		}
	}
</script>