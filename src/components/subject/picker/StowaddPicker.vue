<template>
	<div>
		<van-field v-model="type" clickable @click="popupShow = true" placeholder="选择类型" input-align="center" label="类型" readonly>
			<van-icon name="arrow" slot="right-icon"/>
		</van-field>
		<van-popup v-model="popupShow" position="bottom" @click-overlay="pickerOverlay()" get-container="body">
			<van-picker show-toolbar :columns="columns" :default-index="defaultIndex" @cancel="pickerClean()" @confirm="pickerConfirm" cancel-button-text="清空">
			</van-picker>
		</van-popup>
	</div>
</template>
<script>
	import { Icon, Popup, Picker, Field } from 'vant';
	export default {
		components:{
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Picker.name]: Picker,
			[Field.name]: Field,
		},
		props:['buildType'],
		data(){
			return {
				type:this.buildType,
				popupShow:false,
				columns:[ 
					{ value: 'b', text: '纸板' },
					{ value: 'x', text: '纸箱' },
					{ value: 'a', text: '混合' }
				],
				defaultIndex:0,
			}
		},
		methods:{
			pickerConfirm( value, index ){
				this.defaultIndex = index;
				this.type = value.value;
				this.pickerOverlay();
			},
			pickerOverlay(){
				this.popupShow = false;
			},
			pickerClean(){
				this.defaultIndex = 0;
				this.type = this.columns[ this.defaultIndex ].value;
				this.pickerOverlay();
			},
		},
		mounted(){
			
		},
		created(){

		},
		computed:{

		},
		watch:{
			buildType(newV,oldV){
				this.type = newV;
			},
			type(newV,oldV){
				this.$emit("update:buildType", newV);
			}
		}
	}
</script>
<style>
	.vant-search:{
		width:40%;
	}
</style>
