<template>
	<div class="range-time-container">
		<div class="range-time-label">{{ label }}</div>
		<div class="range-cell">
			<div
				class="range-date-input"
				@click="showPopup()"
			>
				{{ beginDate }}
			</div>
			<div>~</div>
			<div
				class="range-date-input"
				@click="showPopup('end')"
			>
				{{ endDate }}
			</div>
			<div class="range-time-right">
				<van-icon name="arrow" size="1rem" />
			</div>
		</div>
		<van-popup 
			v-model="picker.start.show" 
			position="bottom" 
			:close-on-click-overlay="false" 
			get-container="body"
			@click-overlay="clickOverlay" 
		>
			<van-datetime-picker 
				ref="startDate"
				v-model="sDate" 
				:min-date="min" 
				:max-date="max" 
				type="date" 
				show-toolbar 
				title="开始时间"
				@cancel="onCancel" 
				@confirm="onConfirm"
			>
			</van-datetime-picker>
		</van-popup>
		<van-popup 
			v-model="picker.end.show" 
			position="bottom" 
			:close-on-click-overlay="false" 
			get-container="body"
			@click-overlay="clickOverlay" 
		>
			<van-datetime-picker 
				v-model="eDate" 
				:min-date="min" 
				:max-date="max" 
				type="date" 
				show-toolbar 
				title="结束时间"
				@cancel="onCancel" 
				@confirm="onConfirm"
			>
			</van-datetime-picker>
		</van-popup>
	</div>
</template>
<script>
	import { Icon, Popup, DatetimePicker } from 'vant'
	import { dateTimeFormat } from '@/util/index'

	export default {
		components:{
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[DatetimePicker.name]: DatetimePicker,
		},
		props: {
			label: {
				type: String,
				default: '日期范围'
			},
			beginDate: {
				type: String,
				default: '',
			},
			endDate: {
				type: String,
				default: '',
			},
			maxDate: {
				type: String,
				default: '',
			},
			minDate: {
				type: String,
				default: '',
			}
		},
		data() {
			return {
				picker: {
					start: {
						show: false,
						date: null,
					},
					end: {
						show: false,
						date: null,
					}
				}
			}
		},

		methods: {
			showPopup( type = 'start' ) {
				if( type == 'start' ) {
					this.picker.start.show = true
					this.picker.end.show = false
				} else {
					this.picker.start.show = false
					this.picker.end.show = true
				}
			},
			onConfirm(value) {
				if( this.picker.start.show ){
					this.$emit("update:beginDate", dateTimeFormat(value,'yyyy-MM-dd'))
				} else {
					this.$emit("update:endDate", dateTimeFormat(value,'yyyy-MM-dd'))
				}
				this.clickOverlay()
			},
			onCancel() {
				this.clickOverlay()
			},
			clickOverlay(){
				this.picker = this.$options.data().picker
			},
		},
		computed:{
			sDate: {
				get(){
					return new Date(this.$props.beginDate)
				},
				set( value ){
					//this.$emit("update:beginDate", dateTimeFormat(value,'yyyy-MM-dd'))
				}
			},
			eDate: {
				get(){
					return new Date(this.$props.endDate)
				},
				set( value ){
					//this.$emit("update:endDate", dateTimeFormat(value,'yyyy-MM-dd'))
				}
			},
			max: {
				get(){
					return new Date(this.$props.maxDate)
				},
				set( value ){
					this.$emit("update:maxDate", value)
				}
			},
			min: {
				get(){
					return new Date(this.$props.minDate)
				},
				set( value ){
					this.$emit("update:minDate", value)
				}
			}
		}
	}
</script>
<style type="text/css">
	.range-time-container {
		border: 0.0625rem solid #ebedf0;
		background: #fff;
	}

	.range-time-label {
		line-height: 1rem;
		font-size: 0.875rem;
		text-align: left;
		padding: 0.25rem 0rem 0.25rem 1rem;
	}

	.range-cell {
		display: flex;
		align-items: center;
		padding: 0.5rem 1rem;
		line-height: 1.3125rem;
	}

	.range-date-input {
		width: 6rem;
		flex: 1;
		text-align: center;
		border-bottom: 0.0625rem solid #ebedf0;
	}

	.range-time-right {
		margin-right: -0.5rem;
		line-height: inherit;
	}
</style>