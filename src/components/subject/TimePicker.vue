<template>
	<van-popup :value="dateTimeShow" position="bottom" @click-overlay="clickOverlay" :close-on-click-overlay="false">
		<van-datetime-picker :value="dateTime" :min-date="minDate" :max-date="maxDate" type="date" show-toolbar @cancel="onCancel" @confirm="onConfirm">
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
		props:{
			dateTimeShow:{
				type: Boolean,
				required: true,
				default: false
			},
			dateTime:{
				required: true,
				default: new Date()
			},
			minDate:{
				default: new Date()
			},
			maxDate:{
				default: new Date()
			}
		},
		data(){
			return {
				dateTimeResult:this.dateTime
			}
		},
		methods:{
			clickOverlay(){
				this.onCancel();
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

		}
	}
</script>