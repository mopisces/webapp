<!-- 批量付款 -->
<template>
	<div>
		<div @click="config.popup.show = true">
			<div class="cap-floating-nav-item">
				<van-icon class-prefix="iconfont" size="32" name="fukuan" class="floating-nav-icon" color="#fff"/>
			</div>
			<div class="cap-floating-nav-span">
				<span class="floating-nav-text">批量付款</span>
			</div>
		</div>
		<van-popup 
			v-model="config.popup.show" 
			get-container="body" 
			position="top" 
			:style="{ height: '100%' }"
			closeable
			@close="close"
		>
			<van-checkbox-group 
				ref="payList" 
				v-model="checkedList" 
				class="card-goods"
				@change="change"
			>
				<van-checkbox
					class="card-goods-item"
					v-for="(item,index) in listData"
					:key="index"
					:name="item.cusPoNo"
					shape="square"
					:disabled="item.overTime==1"
				>
					<van-card
						:title="item.boardId || item.matNo"
						:desc="item.title"
						:price="item.cost"
					>
						<template slot="thumb">
							<van-image
								width="90"
								height="90"
								fit="cover"
								:src="item.firstPic"
								radius="15"
							/>
						</template>
						<template v-if="item.overTime == 1" slot="tag">
							<van-tag mark>超时未支付</van-tag>
						</template>
						<template slot="tags">
							<span>
								订单号
								<span style="margin-left:0.25rem;">{{ item.cusPoNo }}</span>
							</span>
						</template>
					</van-card>
				</van-checkbox>
			</van-checkbox-group>
			<van-submit-bar 
				:price="totalPrice*100" 
				button-text="批量付款" 
				style="padding:0 0 0 1rem;"
				@submit="onSubmit" 
			>
				<van-checkbox 
					v-model="config.checkBox.selectAll" 
					:disabled="config.checkBox.disabled" 
					@click="checkAll()"
				>
					全选
				</van-checkbox>
			</van-submit-bar>
		</van-popup>
	</div>
</template>

<script>
	/*vant组件*/
	import { Button, Cell, CellGroup, Icon, Image, Popup, Checkbox, CheckboxGroup, Card, Toast, Tag, NavBar, SubmitBar } from "vant"
	export default {
		name: "KarryFloatNav",
		components: {
			[Button.name]: Button,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Icon.name]: Icon,
			[Image.name]: Image,
			[Popup.name]: Popup,
			[Checkbox.name]: Checkbox,
			[CheckboxGroup.name]: CheckboxGroup,
			[Card.name]: Card,
			[Toast.name]: Toast,
			[Tag.name]: Tag,
			[NavBar.name]: NavBar,
			[SubmitBar.name]: SubmitBar,
		},
		props: {
			listData: {
				type: Array,
				required: true,
				default: []
			},
			/*可选最大值*/
			selectNum: {
				type: Number,
				required: true,
				default: 0
			},
		},
		data() {
			return {
				/*配置*/
				config: {
					/*弹窗*/
					popup: {
						show: false
					},
					/*单选按钮*/
					checkBox: {
						selectAll: false,
						disabled: false
					}
				},
				checkedList: []
			}
		},
		mounted() {
			//console.log(this.listData)
		},
		computed: {
			totalPrice() {
				return this.listData.reduce((total, item) => {
					if(this.checkedList.indexOf(item.cusPoNo) !== -1) {
						const itemAmt = parseFloat(item.cost)
						return parseFloat((total + itemAmt).toFixed(3))
					} else {
						return total
					}
				}, 0)
			},
			optionalNum: {
				get() {
					if( this.$props.selectNum == 0 ) {
						this.config.checkBox.disabled = true
					}
					return this.$props.selectNum
				},
				set( nVal ) {
					this.$emit("update:selectNum", nVal)
				}
			},
		},
		methods: {
			change( names ) {
				if( this.selectNum > 0 ) {
					if( this.checkedList.length == this.selectNum ) {
						this.config.checkBox.selectAll = true
					} else {
						this.config.checkBox.selectAll = false
					}
				}
			},
			/*全选或者全不选*/
			checkAll() {
				this.checkedList = this.$options.data().checkedList
				if( !this.config.checkBox.selectAll ) {
					for (let item of this.listData) {
						if( !item.isover ) this.checkedList.push(item.cusPoNo)
					}
				}
			},
			/*订单提交*/
			onSubmit() {
				if( this.checkedList.length == 0 ) {
					Toast.fail('请选择要付款的订单') 
				} else {
					this.$router.push({ 
						name: 'payWay' , 
						params: { 
							cusOrderId: this.checkedList
						}
					})
				}
			},
			close() {
				this.checkedList = []
			}
		},
	}
</script>

<style>
	.cap-floating-nav-item {
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		background-color: #708090;
		background-position: 50%;
	    background-size: cover;
	    box-shadow: 0 0.125rem 0.5rem 0 rgba(0, 0, 0, 0.16);
	    cursor: pointer;
	    margin: 0;
	    padding: 0;
	    border: 0;
	    font: inherit;
	    font-size: 100%;
	    vertical-align: baseline;
	    display: block;
	    position: fixed;
	    bottom:5rem;
	    left:0.625rem;
	    text-align: center;
	}
	.floating-nav-icon{
		position: relative;
		top: 10%;
	}
	.floating-nav-text{
		color:#fff;
	}
	.cap-floating-nav-span {
		width: 3.2rem;
		height: 1rem;
		border-radius: 25%;
		background-color: #708090;
		background-position: 50%;
	    background-size: cover;
	    box-shadow: 0 0.125rem 0.5rem 0 rgba(0, 0, 0, 0.16);
	    cursor: pointer;
	    margin: 0;
	    padding: 0;
	    border: 0;
	    font: inherit;
	    font-size: 0.75rem;
	    vertical-align: baseline;
	    display: block;
	    position: fixed;
	    bottom:4rem;
	    left:0.625rem;
	    text-align: center;
	}
	.floating-item {
		font-size: 1rem;
		line-height: 1rem;
	}

	.card-goods {
		padding: 2.1875rem 0 3.125rem 0;
		background-color: #fff;
	}

	.card-goods-item {
		margin: 0.625rem 0;
		position: relative;
		background-color: #fafafa;
	}

	.van-checkbox__label {
		width: 100% !important;
		height: auto !important; 
		padding: 0 0.625rem 0 0.9375rem !important;
		box-sizing: border-box !important;
    }

    .van-checkbox__icon {
		top: 50% !important;
		left: 0.625rem !important;
		z-index: 1 !important;
		position: absolute !important;
		margin-top: -0.625rem !important;
    }

    .van-card__price {
		color: #f44 !important;
    }
</style>