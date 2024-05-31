<template>
	<div>
		<van-field clickable placeholder="请选择日期" input-align="center" :label="label" @click="show = true" v-model="dateTime" readonly>
			<van-icon slot="right-icon" name="arrow"/>
		</van-field>
		<van-popup v-model="show" position="bottom" @click-overlay="clickOverlay" :close-on-click-overlay="false" get-container="body">
			<van-datetime-picker v-model="pickerTime" :min-date="min" :max-date="max" type="date" show-toolbar @cancel="onCancel" @confirm="onConfirm">
			</van-datetime-picker>
		</van-popup>
	</div>
</template>
<script>
	import { Icon, Popup, DatetimePicker, Field } from 'vant';
	import { dateTimeFormat } from '@/util/index';
	export default {
		components:{
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[DatetimePicker.name]: DatetimePicker,
			[Field.name]: Field,
		},
		props: {
			dateTime: {
				type: String,
				default: ''
			},
			minDate: {
				type: String,
				default: ''
			},
			maxDate: {
				type: String,
				default: ''
			},
			label: {
				type: String,
				default: '日期'
			}
		},
		data(){
			return {
				show: false
			}
		},
		methods:{
			clickOverlay(){
				this.show = false;
			},
			onCancel(){
				this.clickOverlay()
			},
			onConfirm( value ){
				this.clickOverlay()
			}
		},
		created(){

		},
		mounted(){

		},
		computed:{
			pickerTime: {
				get() {
					return new Date(this.$props.dateTime)
				},
				set(nVal) {
					this.$emit("update:dateTime", dateTimeFormat(nVal,'yyyy-MM-dd'))
				}
			},
			max: {
				get() {
					return new Date(this.$props.maxDate)
				},
				set(nVal) {
					this.$emit("update:maxDate", dateTimeFormat(nVal,'yyyy-MM-dd'))
				}
			},
			min: {
				get() {
					return new Date(this.$props.minDate)
				},
				set(nVal) {
					this.$emit("update:minDate", dateTimeFormat(nVal,'yyyy-MM-dd'))
				}
			}
		},
		watch:{
		
		}
	}
</script>
