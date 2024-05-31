<!-- 数据选择 -->
<template>
	<div class="unicheck-container">
		<div v-if="label" class="unicheck-title unicheck-label" :class="required?'karry-cell-required':''">{{label}}</div>
		<div class="uni-data-checklist">
			<template v-if="dataList.length == 0">
				<div class="uni-data-loading">
					暂无可选数据
				</div>
			</template>
			<template v-else>
				<template v-if="multiple">
					<van-checkbox-group 
						class="checklist-group" 
						v-model="radio"
						@change="change" 
					>
						<van-checkbox 
							class="checklist-box is--tag" 
							:class="item.selected?'is-checked':''"
							v-for="(item,index) in dataList" 
							:key="index"
							:name="item[map.value]"
							:disabled="!!item.disabled"
							icon-size="0"
						>
							<div slot="default" class="checklist-content">
								<span :class="item.selected?'is-checked-text':'checklist-text'">
									{{item[map.text]}}
								</span> 
							</div>
							<span slot="icon"></span>
						</van-checkbox>
					</van-checkbox-group>
				</template>
				<template v-else>
					<van-radio-group 
						class="checklist-group" 
						v-model="radio"
						@change="change" 
					>
						<van-radio 
							class="checklist-box is--tag" 
							:class="item.selected?'is-checked':''"
							v-for="(item,index) in dataList" 
							:key="index"
							:name="item[map.value]"
							icon-size="0"
						>
							<div slot="default" class="checklist-content">
								<span :class="item.selected?'is-checked-text':'checklist-text'">
									{{item[map.text]}}
								</span> 
							</div>
							<span slot="icon"></span>
						</van-radio>
					</van-radio-group>
				</template>
				
			</template>
		</div>
	</div>
</template>

<script>
	import { Checkbox, CheckboxGroup, RadioGroup, Radio } from "vant"

	export default {
		components:{
			[Checkbox.name]: Checkbox,
			[CheckboxGroup.name]: CheckboxGroup,
			[RadioGroup.name]: RadioGroup,
			[Radio.name]: Radio
		},
		props: {
			radioData: {
				type: [String, Number],
				default () {
					return ''
				}
			},
			localdata: {
				type: Array,
				default () {
					return []
				}
			},
			label: {
				type: String,
				default: ''
			},
			emptyText:{
				type: String,
				default: '暂无数据'
			},
			value: {
				type: [String, Number],
				default () {
					return ''
				}
			},
			map:{
				type: Object,
				default(){
					return {
						text:'text',
						value:'value'
					}
				}
			},
			multiple: {
				type: Boolean,
				default: false
			},
			min: {
				type: [Number, String],
				default: ''
			},
			max: {
				type: [Number, String],
				default: ''
			},
			required: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				dataList: [],
				range: [],
				contentText: {
					contentdown: '查看更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				}
			}
		},
		created() {
			if (this.localdata && this.localdata.length !== 0) {
				this.range = this.localdata
				this.dataList = this.getDataList(this.radio)
			} 
		},
		methods: {
			getDataList(value) {
				let dataList = JSON.parse(JSON.stringify(this.range))
				let list = []
				if(this.multiple) {
					if (!Array.isArray(value)) {
						value = []
					}
				}
				dataList.forEach((item, index) => {
					item.disabled = item.disable || false
					if( this.multiple ) {
						if (value.length > 0) {
							let have = value.find(val => val === item[this.map.value])
							item.selected = have !== undefined
						} else {
							item.selected = false
						}
					} else {
						item.selected = value === item[this.map.value]
					}
					list.push(item)
				})
				return this.setRange( list ) 
			},
			setRange(list) {
				let selectList = list.filter(item => item.selected)
				let min = Number(this.min) || 0
				let max = Number(this.max) || ''
				list.forEach((item, index) => {
					if (this.multiple) {
						if (selectList.length <= min) {
							let have = selectList.find(val => val[this.map.value] === item[this.map.value])
							if (have !== undefined) {
								item.disabled = true
							}
						}

						if (selectList.length >= max && max !== '') {
							let have = selectList.find(val => val[this.map.value] === item[this.map.value])
							if (have === undefined) {
								item.disabled = true
							}
						}
					}

					list[index] = item
				})
				return list
			},
			change( e ){
				let detail = {
					value: [],
					data: []
				}

				if( this.multiple ) {
					this.range.forEach(item => {
						if (e.includes(item[this.map.value] + '')) {
							detail.value.push(item[this.map.value])
							detail.data.push(item)
						}
					})
				} else {
					const range = this.range.find(item => (item[this.map.value] + '') === e)
					if (range) {
						detail = {
							value: range[this.map.value],
							data: range
						}
					}
				}
				

				this.$emit('input', detail.value);

				this.$emit('change', {
					detail
				})

				this.dataList = this.getDataList(e)
			},
		},
		computed:{
			radio: {
				get(){
					return this.$props.radioData
				},
				set( value ){
					this.$emit("update:radioData", value)
				}
			}
		},
		watch: {
			localdata: {
				handler(newVal) {
					this.range = newVal
					this.dataList = this.getDataList(this.radio)
				},
				deep: true
			},
			radioData(newVal) {
				this.dataList = this.getDataList(newVal)
			}
		}
	}
</script>

<style>
	.unicheck-container {
		display: flex;
		align-items: center;
		padding-left: 1rem;
		border-bottom: 0.0625rem solid #ebedf0;
		background-color: #fff;
	}
	
	.unicheck-label {
		flex: none;
		width: 3.75rem;
	}

	.unicheck-title {
		font-size: 0.875rem;
		color: #323233;
		line-height: 1.5rem;
	}

	.uni-data-checklist {
		position: relative;
		z-index: 0;
		flex: 1;
	}

	.checklist-group {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.checklist-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		position: relative;
		margin: 0.3125rem 0;
		margin-right: 1.5625rem;
	}

	.is--tag {
		margin-right: 0.625rem;
		padding: 0.3125rem 0.3125rem;
		border: 0.0625rem #DCDFE6 solid;
		border-radius: 0.1875rem;
		background-color: #f5f5f5;
	}

	.is-checked {
		background-color: #2979ff;
		border-color: #2979ff;
	}

	/* margin-left: 0.3125rem; */
	.is-checked-text {
		color: #fff;
		font-size: 0.875rem;
		line-height: 0.875rem;
	}

	.checklist-content {
		display: flex;
		flex: 1;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.checklist-text {
		font-size: 0.875rem;
		color: #666;
		line-height: 0.875rem;
	}
	
	.van-radio__label {
		margin: 0rem !important;
	}

	.uni-data-loading {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 2.25rem;
		padding-left: 0.625rem;
		color: #999;
	}

	.van-checkbox__label {
		margin-left: 0rem !important;
	}

	.unicheck-label--required::before {
		position: absolute;
	    left: 0.5rem;
	    color: #ee0a24;
	    font-size: 0.875rem;
	    content: '*';
	}
</style>