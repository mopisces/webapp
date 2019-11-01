<template>
	<van-radio-group v-model="value" v-if="show">
		<van-cell-group :title="title">
			<van-cell  v-for="(item,index) in radioColumns" :title="item.title" :key="index" clickable>
				<van-radio slot="right-icon" :name="item.value"  @click="click(item.value,index)"/>
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
		props:{
			radioInfo:{
				required:true,
			},
			radioColumns:{
				required:true,
			},
			title:{
				required:true,
			}	
		},
		data(){
			return {
				value:0,
				show:true
			}
		},
		methods:{
			click( val, index ){
				this.$emit('radioClick',{val:val,index:index});
			}
		},
		mounted(){
			this.value = this.radioInfo;
		},
		created(){
			
		},
		computed:{
			
		},
		watch:{
			radioInfo(newV,oldV){
				this.value = newV;
			}
		}
	}
</script>