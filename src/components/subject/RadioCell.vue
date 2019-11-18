<template>
	<van-radio-group v-model="value">
		<van-cell-group :title="title">
			<van-cell  v-for="(item,index) in radioColumns" :title="item.title" :key="index" clickable @click=" value = item.value ">
				<van-radio slot="right-icon" :name="item.value"  />
			</van-cell>
		</van-cell-group>
	</van-radio-group>
</template>
<script>
	import {  Cell, CellGroup, RadioGroup, Radio } from 'vant';
	export default {
		components:{
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[RadioGroup.name]: RadioGroup,
			[Radio.name]: Radio,
		},
		props:['radioInfo','radioColumns','title'],
		data(){
			return {
				value:this.radioInfo,
			}
		},
		methods:{
			
		},
		mounted(){
			
		},
		created(){
			
		},
		computed:{
			
		},
		watch:{
			radioInfo(newV,oldV){
				this.value = newV;
			},
			value(newV,oldV){
				this.$emit("update:radioInfo", newV);
			}
		}
	}
</script>