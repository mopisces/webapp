<!-- 外部用户微信订单详情 -->
<template>
	<van-popup 
		v-model="show" 
		:style="{ width: '98%', backgroundColor: '#f1f1f1', paddingBottom: '0.625rem' }"
		round
	>
		<van-card
			v-if="orderDetail.marketPrice"
		>
			<div slot="title">
				<span style="color: #e01835;" v-if=" orderDetail.boardId && !orderDetail.matNo ">{{ orderDetail.boardId }}</span>
				<span style="color: #e01835;" v-if=" !orderDetail.boardId && orderDetail.matNo ">{{ orderDetail.matNo }}</span>
				<span v-if=" orderDetail.title ">,{{ orderDetail.title }}</span>
			</div>
			<van-image :src="orderDetail.firstPic" slot="thumb" round width="90" height="90"/>
			<div slot="desc">
				下单价格：
				<span style="color: #e01835;">¥{{ orderDetail.price }}/
					<span v-if=" orderDetail.boardId && !orderDetail.matNo ">㎡</span>
					<span v-if=" !orderDetail.boardId && orderDetail.matNo ">个</span>
				</span>
				<span style="color: #999;text-decoration: line-through;">¥{{ orderDetail.marketPrice }}/
					<span v-if=" orderDetail.boardId && !orderDetail.matNo ">㎡</span>
					<span v-if=" !orderDetail.boardId && orderDetail.matNo ">个</span>
				</span><br/>
				下单金额：<span style="color: #e01835;">¥{{ orderDetail.cost }}</span><br/>
				节省金额：<span style="color: #e01835;">¥{{ orderDetail.saveCost }}</span>
			</div>
		</van-card>
		<web-card 
			:title="orderDetail.cusPoNo" 
			:subTitle="cTypeName(orderDetail.cType)"
			:extra="orderDetail.buildTime"
			:is-shadow="true"
		>
			<div class="card-body-container">
				<div 
					v-if="orderDetail.cType === 's' || orderDetail.cType === 'c'"
					class="card-body-item card-body-item-100"
				>
					<div class="card-body-txt">规格信息:</div>
					<span class="mg-left-20">{{ orderDetail.length }}×{{ orderDetail.width }}</span>
					<span class="mg-left-20">{{ orderDetail.boardId }}</span>
				</div>
				<div 
					v-if="orderDetail.cType === 'c'"
					class="card-body-item card-body-item-100"
				>
					<div class="card-body-txt">纸箱尺寸:</div>
					<span class="mg-left-20">{{ orderDetail.boxL }}×{{orderDetail.boxW}}×{{orderDetail.boxH}}</span>
				</div>
				<div 
					v-if="orderDetail.cType === 'c'"
					class="card-body-item card-body-item-100"
				>
					<div class="card-body-txt red-color">箱舌</div>|
					<div class="card-body-txt blue-color">封箱调整</div>:
					<span class="mg-left-20 red-color">{{ orderDetail.tonLen }}mm</span>
					<span class="mg-left-20 blue-color">{{ orderDetail.uLen }}mm</span>
				</div>
				<div 
					v-if="orderDetail.cType === 's'"
					class="card-body-item card-body-item-100"
				>
					<div class="card-body-txt">压线信息:</div>
					<span class="mg-left-20">{{ orderDetail.scoreInfo }}</span>
					<span class="mg-left-20">{{ orderDetail.buildScoreName }}</span>
				</div>
				<div 
					v-if=" orderDetail.cType === 'x' || orderDetail.cType === 't' "
					class="card-body-item card-body-item-100"
				>
					<span>PO号:
						<span class="mg-left-20">{{ orderDetail.poN }}</span>
					</span>
				</div>
				<div 
					v-if=" orderDetail.cType === 'x' "
					class="card-body-item card-body-item-100"
				>
					<span>套件名称:
						<span class="mg-left-20">{{ orderDetail.poNid }}</span>
					</span>
				</div>
				<div 
					v-if=" orderDetail.cType === 't' "
					class="card-body-item card-body-item-100"
				>
					<span>货品编号:
						<span class="mg-left-20">{{ orderDetail.matNo }}</span>
					</span>
				</div>
				<div class="card-body-item card-body-item-100">
					<span>订单信息:
						<span class="mg-left-20">
							{{ orderDetail.ordQty }}
							<span v-if="orderDetail.cType === 's'">片</span>
							<span v-else>个</span>
						</span>
						<span 
							v-if="orderDetail.cType === 's' || orderDetail.cType === 'c'" 
							class="mg-left-20"
						>
							{{ orderDetail.area }}㎡
						</span>
					</span>
				</div>
				<div 
					v-if="orderDetail.cType === 'c'"
					class="card-body-item card-body-item-100"
				>
					<div class="card-body-txt">纸张信息:</div>
					<span class="mg-left-20">{{ orderDetail.bdMultiple }}</span>
					<span class="mg-left-20">{{ orderDetail.bdQty }}</span>
				</div>
				<div class="card-body-item card-body-item-100">
					<span>送货地址:
						<span class="mg-left-20">{{ orderDetail.subDNAddress }}</span>
					</span>
				</div>
				<div class="card-body-item card-body-item-100">
					<span>送货备注:
						<span class="mg-left-20">{{ orderDetail.dnRemark }}</span>
					</span>
				</div>
				<div class="card-body-item card-body-item-100">
					<span>生产备注:
						<span class="mg-left-20">{{ orderDetail.proRemark }}</span>
					</span>
				</div>
				<div class="card-body-item card-body-item-100">
					<span>交货日期:
						<span class="mg-left-20">{{ orderDetail.deliveryDate }}</span>
					</span>
				</div>
			</div>
		</web-card>
	</van-popup>
</template>

<script>
	/*vant组件*/
	import { Button, Image, Popup, Field, Sticky, Card } from "vant"
	/*自定义card组件*/
	import WebCard from "@/components/subject/card/Card.vue"
	/*自定义方法*/
	import { cTypeChange } from "@/util/index"
	/*api接口*/
	import { fetchList } from "@/api/client/customer.js"

	export default {
		name: "WxOrderDetail",
		components: {
			[Button.name]: Button,
			[Image.name]: Image,
			[Popup.name]: Popup,
			[Field.name]: Field,
			[Sticky.name]: Sticky,
			[Card.name]: Card,

			WebCard
		},
		props: {
			detailShow: {
				type: Boolean,
				default: false
			},
		},
		computed: {
			show: {
				get() {
					return this.$props.detailShow
				},
				set(nVal) {
					this.$emit("update:detailShow", nVal)
				}
			},
			ordNo: {
				get() {
					return this.$props.cusPoNo
				},
				set( nVal ) {
					this.$emit("update:ordNo", nVal)
				}
			}
		},
		data() {
			return {
				orderDetail: {
					boardId: null,
					title: null,
					price: null,
					marketPrice: null,
					cost: null,
					saveCost: null,
					firstPic: null,

					cusPoNo: null,
					cType: null,
					buildTime: null,
					length: null,
					width: null,
					boxL: null,
					boxW: null,
					boxH: null,
					tonLen: null,
					uLen: null,
					scoreInfo: null,
					buildScoreName: null,
					poN: null,
					poNid: null,
					matNo: null,
					ordQty: null,
					area: null,
					bdMultiple: null,
					bdQty: null,
					subDNAddress: null,
					dnRemark: null,
					proRemark: null,
					deliveryDate: null
				},
			}
		},
		methods: {
			/*获取数据*/
			async fetchData(cusPoNo) {
				this.orderDetail = this.$options.data().orderDetail
				const { result } = await fetchList({
					dataType: 16,
					cusPoNo: cusPoNo
				})
				this.orderDetail = result
			},
			cTypeName( cType ){
				return cTypeChange( cType );
			}
		},
	}
</script>

<style type="text/css">
	@import '~@/assets/style/card.css';
</style>