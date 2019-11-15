<template>
	<van-popup v-model="show" position="bottom" @click-overlay="clickOverlay" :close-on-click-overlay="false">
		<van-datetime-picker v-model="pickerTime" :min-date="new Date(minDate)" :max-date="new Date(maxDate)" type="date" show-toolbar @cancel="onCancel" @confirm="onConfirm">
		</van-datetime-picker>
	</van-popup>
</template>
<script>
	import { Popup, DatetimePicker  } from 'vant';
	import { dateTimeFormat } from '@/util/index';
	export default {
		components:{
			[Popup.name]: Popup,
			[DatetimePicker.name]: DatetimePicker,
		},
		props:['dateTimeShow','dateTime','minDate','maxDate'],
		data(){
			return {
				show : this.dateTimeShow,
				pickerTime : new Date(this.dateTime)
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
				console.log(value)
				let time = dateTimeFormat(value.value,'yyyy-MM-dd');
				this.$emit('onConfirm',{value:time});
			}
		},
		created(){

		},
		mounted(){

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
