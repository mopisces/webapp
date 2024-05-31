<template>
	<div>
		<van-field 
			:value="shortName" 
			:required="required"
			clickable 
			placeholder="请选择方式" 
			input-align="center" 
			:label="label" 
			readonly
			@click="popup.show = true" 
		>
			<van-icon name="arrow" slot="right-icon"/>
		</van-field>
		<van-popup 
			v-model="popup.show" 
			position="bottom" 
			get-container="body"
			@click-overlay="overlay()" 
		>
			<van-picker 
				ref="payTypeId"
				:show-toolbar="false" 
				:columns="indexList" 
				:default-index="defaultIndex" 
				cancel-button-text="清空" 
				title="请选择方式"
				@change="change"
			>
			</van-picker>
		</van-popup>
	</div>
</template>

<script>
	/*vant组件*/
	import { Icon, Popup, Picker, Field } from "vant"
	/*api接口*/
	import { fetchList } from "@/api/staff/customer.js"

	export default {
		name: "KarryPayType",
		components: {
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Picker.name]: Picker,
			[Field.name]: Field
		},
		props: {
			stateType: {
				type: Number,
				required: true,
				default: 0
			},
			payTypeId: {
				type: String,
				required: true,
				default: ''
			},
			required: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				popup: {
					show: false
				},
				indexList: [],
				defaultIndex: 0,
				shortName: null
			}
		},
		computed: {
			isPay: {
				get() {
					return this.$props.stateType
				},
				set( nVal ) {
					this.$emit("update:stateType", nVal)
				}
			},
			typeId: {
				get() {
					console.log(this.$props.payTypeId)
					return this.$props.payTypeId
				},
				set( nVal ) {
					this.$emit("update:payTypeId", nVal)
				}
			},
			label: {
				get() {
					return this.$props.stateType == 0?'调账方式':'收款方式'
				}
			},
		},
		watch: {
			'popup.show': {
				handler( nVal ) {
					if( nVal ) {
						setTimeout(()=> {
							this.$refs.payTypeId.setColumnIndex(0, this.defaultIndex)
						}, 200)
					}
				},
			}
		},
		async mounted() { 	
			await this.fetchData()
		},
		methods: {
			/*获取列表*/
			async fetchData() {
				this.indexList = this.$options.data().indexList
				const { result } = await fetchList({
					dataType: 14,
					stateType: this.isPay
				})
				result.forEach((item,idx)=> {
					this.indexList.push({
						text: item.text,
						key: item.typeId,
						effDay: item.effDay
					})
				})
				this.defaultIndex = this.indexList.findIndex(item=> item.key == this.typeId)
				if( this.defaultIndex >= 0 ) {
   					this.shortName = this.indexList[this.defaultIndex].text
				}
			},
			overlay() {
				this.popup.show = false
			},
			change(picker, value, index) {
				this.shortName = value.text
				this.defaultIndex = index
				this.$emit('update:payTypeId', value.key)
			}
		}
	}
</script>