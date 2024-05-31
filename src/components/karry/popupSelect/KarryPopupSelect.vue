<!-- 弹出单选 -->
<template>
	<div>
		<van-field 
			v-model="value" 
			input-align="center" 
			clickable 
			readonly 
			:label="label" 
			:placeholder="placeholder" 
			:required="required"
			@click="config.popup.show=true"
		>
			<van-icon slot="right-icon" name="arrow"/>
		</van-field>

		<van-popup 
			v-model="config.popup.show" 
			:style="{ maxHeight: '75%', width: '95%' }" 
			round
		>
			<van-radio-group v-model="radioData">
				<van-cell-group>
					<van-cell 
						clickable 
						v-for="(item,index) in dataList" 
						:key="index"
						@click="cellClick(item)" 
					>
						<div class="popup-select-title-container" slot="title">
							<div>{{ item[map.value] }}</div>
							<div class="popup-select-tag" v-if="type == 'bId' ">
								<van-tag mark v-if="radioData!=item[map.value]">常用材质</van-tag>
								<van-tag mark type="success" v-else>常用材质</van-tag>
							</div>
						</div>
						<div slot="label">
							<div v-if="item.text">
								<span v-if="type == 'cusAddr'">
									送货地址:
								</span>
								<span v-if="type == 'boxType'">
									箱型名称:
								</span>
								<span v-if="type == 'productName'">
									套件名称:
								</span>
								<span v-if="type == 'bId'">
									材质名称:
								</span>
								{{ item[map.text] }}
							</div>
						</div>
						<van-radio slot="right-icon" :name="item[map.value]" />
					</van-cell>
				</van-cell-group>
			</van-radio-group>
		</van-popup>
	</div>
</template>

<script>
	/*vant组件*/
	import { Button, Cell, CellGroup, Icon, Popup, Field, RadioGroup, Radio, Tag } from "vant"

	export default {
		name: "KarryPopupSelect",
		components: {
			[Button.name]: Button,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Field.name]: Field,
			[RadioGroup.name]: RadioGroup,
			[Radio.name]: Radio,
			[Tag.name]: Tag,
		},
		props: {
			label: {
				type: String,
				default: "单选"
			},
			placeholder: {
				type: String,
				default: "请选择"
			},
			value: {
				type: [String, Number],
				default () {
					return ""
				}
			},
			type: {
				type: String,
				default: "cusInfo"
			},
			map: {
				type: Object,
				default(){
					return {
						text:'text',
						value:'value'
					}
				}
			},
			localdata: {
				type: Array,
				default () {
					return []
				}
			},
			required: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				/*配置*/
				config: {
					popup: {
						show: false
					}
				},
				dataList: [],
			}
		},
		created() {
			if (this.localdata && this.localdata.length !== 0) {
				this.dataList = JSON.parse(JSON.stringify(this.localdata))
			} 
		},
		computed: {
			radioData: {
				get(){
					return this.$props.value
				},
				set( val ){
					this.$emit("update:value", val)
				}
			}
		},
		watch: {
			localdata: {
				handler( nVal ) {
					this.dataList = JSON.parse(JSON.stringify(nVal))
				},
				deep: true
			},
		},
		methods: {
			cellClick(rowData) {
				this.radioData = rowData[this.map.value]
				this.config.popup.show = false
			}
		},
	}
</script>

<style>
	.popup-select-title-container {
		display: flex;
		flex-direction: row;
	}

	.popup-select-tag {
		margin-left: 1rem;
	}
</style>