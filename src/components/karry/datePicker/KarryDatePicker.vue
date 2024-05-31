<!-- 单个日期组件 -->
<template>
	<div>
		<van-field 
			:required="required"
			v-model="dateTime" 
			clickable 
			placeholder="请选择日期" 
			input-align="center" 
			:label="label" 
			readonly
			@click="show = true" 
		>
			<van-icon slot="right-icon" name="arrow"/>
		</van-field>
		<van-popup 
			v-model="show" 
			position="bottom" 
			:close-on-click-overlay="false" 
			get-container="body"
			@click-overlay="show=false" 
		>
			<van-datetime-picker 
				v-model="pickerTime" 
				:min-date="min" 
				:max-date="max" 
				:show-toolbar="false"
				type="date" 
				@cancel="show=false" 
				@confirm="show=false"
			>
			</van-datetime-picker>
		</van-popup>
	</div>
</template>

<script>
	/*vant组件*/
	import { Icon, Popup, DatetimePicker, Field } from "vant"
	/*自定义方法*/
	import { dateTimeFormat } from "@/util/index"
	export default {
		name: "KarryDatePicker",
		components: {
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[DatetimePicker.name]: DatetimePicker,
			[Field.name]: Field,
		},
		props: {
			label: {
				type: String,
				default: "日期"
			},
			minDate: {
				type: String,
				default: ""
			},
			maxDate: {
				type: String,
				default: ""
			},
			dateTime: {
				type: String,
				default: ""
			},
			required: {
				type: Boolean,
				default: false
			}

		},
		data() {
			return {
				show: false,
			}
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
	}
</script>