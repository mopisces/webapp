<template>
	<vant-popup v-model="selectShow" position="right" :style="{ height: '100%', width: '100%' }">
		<van-radio-group v-model="radio">
			<van-cell-group>
				<van-cell title="单选框 1" clickable @click="radio = '1'">
					<van-radio slot="right-icon" name="1" />
				</van-cell>
			</van-cell-group>
		</van-radio-group>
		<vant-button type="primary" size="normal" style="width:100%;" @click="confirmClick()"> 
			确定
		</vant-button>
	</vant-popup>
</template>
<script>
	import { Button, Cell, CellGroup, Popup } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Field.name]: Field,
		},
		props:['show'],
		data(){
			return {
				selectShow:this.show,
			}
		},
		methods:{
			confirmClick(){
				this.selectShow = false;
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
			show(newV,oldV){
				this.selectShow = newV;
			},
			selectShow(newV,oldV){
				this.$emit("update:show", newV);
			}
		}
	}
</script>