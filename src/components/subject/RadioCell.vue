<template>
	<van-radio-group v-model="value">
		<van-cell-group :title="title">
			<van-cell  v-for="(item,index) in radioColumns" :title="item.title" :key="index" clickable>
				<van-radio slot="right-icon" :name="item.value"  @click="click(item.value,index)"/>
			</van-cell>
		</van-cell-group>
	</van-radio-group>
</template>
<script>
	import { RadioGroup, Radio, Cell, CellGroup } from 'vant';
	export default {
		components:{
			[RadioGroup.name]: RadioGroup,
			[Radio.name]: Radio,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
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
				value:this.radioInfo
			}
		},
		methods:{
			click( val, index ){
				this.$emit('radioClick',{val:val,index:index});
			}
		},
		mounted(){

		},
		created(){
			
		},
		computed:{
			
		},
		watch:{
			
		}
	}
</script>