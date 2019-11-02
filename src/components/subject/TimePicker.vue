<template>
	<van-popup v-model="show" position="bottom" @click-overlay="clickOverlay" :close-on-click-overlay="false">
		<van-datetime-picker v-model="pickerTime" :min-date="minDate" :max-date="maxDate" type="date" show-toolbar @cancel="onCancel" @confirm="onConfirm">
		</van-datetime-picker>
	</van-popup>
</template>
<script>
	import { Popup, DatetimePicker  } from 'vant';
	export default {
		components:{
			[Popup.name]: Popup,
			[DatetimePicker.name]: DatetimePicker,
		},
		props:['dateTimeShow','dateTime','minDate','maxDate'],
		data(){
			return {
				show:this.dateTimeShow,
				pickerTime:this.dateTime
			}
		},
		methods:{
			clickOverlay(){
				this.show = false;
			},
			onCancel(){
				this.$emit('onCancel');
			},
			onConfirm( value ){
				this.$emit('onConfirm',{value:value});
			}
		},
		mounted(){

		},
		created(){
			
		},
		computed:{
			
		},
		watch:{
			dateTimeShow(newV,oldV){
				this.show = newV;
			},
			show(newV,oldV){
				this.$emit("update:dateTimeShow", newV);
			},
			dateTime(newV,oldV){
				this.pickerTime = newV;
			},
			pickerTime(newV,oldV){
				this.$emit("update:dateTime", newV);
			},
		}
	}
</script>
