<template>
	<div>
		<van-field v-model="sFlutes" clickable @click="popupShow = true" placeholder="选择机台" input-align="center" label="机台" readonly>
			<van-icon name="arrow" slot="right-icon"/>
		</van-field>
		<van-popup v-model="popupShow" position="bottom" @click-overlay=" popupShow = false " get-container="body">
			<van-picker show-toolbar :columns="columns" :default-index="defaultIndex" @cancel="valueClean()" @confirm="valueConfirm" cancel-button-text="清空">
			</van-picker>
		</van-popup>
	</div>
</template>
<script>
	import { Icon , Popup, Field, Picker } from 'vant';
	export default {
		components:{
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Field.name]: Field,
			[Picker.name]: Picker,
		},
		props:['sFlute'],
		data(){
			return {
				popupShow:false,
				columns : [
					{ text:1,    value:1 },
					{ text:2,    value:2 },
					{ text:3,    value:3 },
					{ text:4,    value:4 },
					{ text:5,    value:5 },
					{ text:6,    value:6 },
					{ text:7,    value:7 },
					{ text:8,    value:8 },
					{ text:9,    value:9 },
				],
				defaultIndex : -1,
				sFlutes : this.sFlute
			}
		},
		methods:{
			valueClean(){
				this.defaultIndex = -1;
				this.sFlutes      = '';
				this.popupShow    = false;
			},
			valueConfirm( value, index ){
				this.defaultIndex = index;
				this.sFlutes      = value.value;
				this.popupShow    = false;
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
			sFlute(newV,oldV){
				this.sFlutes = newV;
			},
			sFlutes(newV,oldV){
				this.$emit("update:sFlute", newV);
			}
		}
	}
</script>