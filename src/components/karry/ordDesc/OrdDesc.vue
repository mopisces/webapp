<!-- 订单详情组件 -->
<template>
	<van-popup v-model="show" :style="{ width: '100%',height:'100%' }" position="top">
		<van-sticky>
			<div class="van-nav-bar van-hairline--bottom" style="z-index: 1;">
				<div class="van-nav-bar__left">
					<span class="van-nav-bar__text">订单详情</span>
				</div>
				<div class="van-nav-bar__title van-ellipsis"></div>
				<div class="van-nav-bar__right" @click="closeClick">
					<i class="van-icon van-icon-cross" style="font-size: 16px;"><!----></i>
				</div>
			</div>
		</van-sticky>
		<van-collapse 
			v-model="config.collapse.active" 
			accordion
		>
			<van-collapse-item 
				v-if=" info.orderDNRe != null" 
				title="退货明细" 
				name="1"
			>
				<card 
					:title="info.orderDNRe.dnStr" 
					:extra="info.orderDNRe.orderId"
					:subTitle="info.orderDNRe.issueDate"
					:is-shadow="true"
				>
					<div class="card-body-container">
						<div class="card-body-item card-body-item-100">
							<span>送货数量:
								<span class="mg-left-20">{{ info.orderDNRe.deliQty }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>销售面积:
								<span class="mg-left-20">{{ info.orderDNRe.tSalesArea }}㎡</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>送货金额:
								<span class="mg-left-20">{{ info.orderDNRe.deliAmt }}元</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<div class="card-body-txt green-color">价格</div>|
							<div class="card-body-txt blue-color">平方价:</div>
							<span class="mg-left-20 green-color">{{ info.orderDNRe.price }}元</span>
							<span class="mg-left-20 blue-color">{{ info.orderDNRe.squarePrice }}元/㎡</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>退货原因:
								<span class="mg-left-20 red-color">{{ info.orderDNRe.returnCause }}</span>
							</span>
						</div>
					</div>
				</card>
			</van-collapse-item>
			<van-collapse-item 
				v-if="info.orderDN != null" 
				title="送货明细" 
				name="2"
			>
				<card 
					:title="info.orderDN.dnStr" 
					:extra="info.orderDN.orderId"
					:subTitle="info.orderDN.dnDate"
					:is-shadow="true"
				>
					<div class="card-body-container">
						<div class="card-body-item card-body-item-100">
							<div class="card-body-txt">回签状态:</div>
							<div v-if="info.orderDN.signed==1" class="mg-left-20">
								<van-icon color="#5ac725" class-prefix="iconfont" name="gou" size="16"/>
							</div>
							<div v-else class="mg-left-20">
								<van-icon color="#f56c6c" class-prefix="iconfont" name="guanbi" size="12"/>
							</div>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>装货日期:
								<span class="mg-left-20">{{ info.orderDN.packDate }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>生效日期:
								<span class="mg-left-20">{{ info.orderDN.issueDate }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>送货数量:
								<span class="mg-left-20">{{ info.orderDN.deliQty }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>销售面积:
								<span class="mg-left-20">{{ info.orderDN.tSalesArea }}㎡</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>送货金额:
								<span class="mg-left-20">{{ info.orderDN.deliAmt }}元</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<div class="card-body-txt green-color">价格</div>|
							<div class="card-body-txt blue-color">平方价:</div>
							<span class="mg-left-20 green-color">{{ info.orderDN.price }}元</span>
							<span class="mg-left-20 blue-color">{{ info.orderDN.squarePrice }}元/㎡</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>送货公司:
								<span class="mg-left-20">
									{{ info.orderDN.cusSubName }}({{ info.orderDN.cusSubNo }})
								</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>送货地址:
								<span class="mg-left-20">{{ info.orderDN.subDNAddress }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>送货备注:
								<span class="mg-left-20">{{ info.orderDN.dnRemark }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>客户联系:
								<span class="mg-left-20">{{ info.orderDN.subContactPerson }}</span>
								<span 
									class="mg-left-20" 
									@click="phoneClick(info.orderDN.subTelNo)"
								>
									{{ info.orderDN.subTelNo }}
								</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>司机信息:
								<span class="mg-left-20">{{ info.orderDN.carPName }}</span>
								<span class="mg-left-20">{{ info.orderDN.carNo }}</span>
								<span 
									class="mg-left-20" 
									@click="phoneClick(info.orderDN.Phone)"
								>
									{{ info.orderDN.Phone }}
								</span>
							</span>
						</div>
					</div>
				</card>
			</van-collapse-item>
			<van-collapse-item 
				v-if=" info.orderSch != null "
				title="传单明细" 
				name="3"
			>
				<card 
					title="传单明细" 
					:subTitle="info.orderSch.addTime"
					:is-shadow="true"
				>
					<div class="card-body-container">
						<div class="card-body-item card-body-item-100">
							<span>工单状态:
								<span class="mg-left-20">{{ info.orderSch.SState }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>门幅信息:
								<span class="mg-left-20">{{ info.orderSch.sPaperWidth }}mm</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>传单数量:
								<span class="mg-left-20">{{ info.orderSch.sQty }}</span>
							</span>
						</div>
					</div>
				</card>
			</van-collapse-item>
			<van-collapse-item 
				v-if=" info.orderDetail != null "
				title="订单详情" 
				name="4"
			>
				<card 
					:title="info.orderDetail.strOrderId" 
					:extra="info.orderDetail.cusPoNo"
					:is-shadow="true"
				>
					<div class="card-body-container">
						<div class="card-body-item card-body-item-100">
							<span>客户信息:
								<span class="mg-left-20">
									{{ info.orderDetail.cusShortName }}({{ info.orderDetail.cusId }})
								</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<div class="card-body-txt">材质信息:</div>
							<span class="mg-left-20">{{ info.orderDetail.boardId }}</span>
							<span class="mg-left-20">{{ info.orderDetail.boardName }}</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<div class="card-body-txt">压线信息:</div>
							<span class="mg-left-20">{{ info.orderDetail.scoreInfo }}</span>
							<span class="mg-left-20">{{ info.orderDetail.scoreType }}</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>送货备注:
								<span class="mg-left-20">
									{{ info.orderDetail.dnRemark }}
								</span>
							</span>
						</div>
						<div 
							v-if="info.orderDetail.matName"
							class="card-body-item card-body-item-100"
						>
							<span>货品名称:
								<span class="mg-left-20">
									{{ info.orderDetail.matName }}
								</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>箱型信息:
								<span class="mg-left-20">
									{{ info.orderDetail.boxName }}
								</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>纸箱尺寸:
								<span class="mg-left-20">
									{{ info.orderDetail.boxL }}×{{info.orderDetail.boxW}}×{{ info.orderDetail.boxH }}
								</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>纸板尺寸:
								<span class="mg-left-20">
									{{ info.orderDetail.length }}×{{info.orderDetail.width}}
								</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>工艺流程:
								<span class="mg-left-20">
									{{ info.orderDetail.proFlow }}
								</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<div class="card-body-txt blue-color">订单</div>|
							<div class="card-body-txt green-color">送货</div>|
							<div 
								v-if="info.orderDetail.returnQty>0" 
								class="card-body-txt red-color"
							>退货</div>:
							<span class="mg-left-20 blue-color">{{ info.orderDetail.ordQty }}</span>
							<span class="mg-left-20 green-color">{{ info.orderDetail.deliQty }}</span>
							<span 
								v-if="info.orderDetail.returnQty>0" 
								class="mg-left-20 red-color"
							>{{ info.orderDetail.returnQty }}</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<div class="card-body-txt blue-color">传单</div>|
							<div class="card-body-txt green-color">完工</div>:
							<span class="mg-left-20 blue-color">{{ info.orderDetail.schQty }}</span>
							<span class="mg-left-20 green-color">{{ info.orderDetail.finishedQty }}</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>销售面积:
								<span class="mg-left-20">{{ info.orderDetail.tSalesArea }}㎡</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<div class="card-body-txt green-color">价格</div>|
							<div class="card-body-txt blue-color">平方价:</div>
							<span class="mg-left-20 green-color">{{ info.orderDetail.price }}元</span>
							<span class="mg-left-20 blue-color">{{ info.orderDetail.squarePrice }}元/㎡</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>合计金额:
								<span class="mg-left-20">{{ info.orderDetail.amt }}元</span>
							</span>
						</div>
					</div>
				</card>
			</van-collapse-item>
		</van-collapse>
	</van-popup>
</template>
<script>
	/*vant组件*/
	import { Icon, Popup, Collapse, CollapseItem, Sticky  } from "vant"
	/*自定义卡片组件*/
	import Card from "@/components/subject/card/Card.vue"
	/*api接口*/
	import { getOrderDetail } from "@/api/common/orderDetail"
	export default {
		components:{
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Collapse.name]: Collapse,
			[CollapseItem.name]: CollapseItem,
			[Sticky.name]: Sticky,

			Card
		},
		props: {
			cusOrderId: {
				type: String,
				default: ''
			},
			detailShow: {
				type: Boolean,
				default: false
			}
		},
		data(){
			return {
				config: {
					collapse: {
						active: '4'
					}
				},
				info:{
					/*退货明细*/
					orderDNRe: null,
					/*送货明细*/
					orderDN: null,
					/*传单明细*/
					orderSch: null,
					/*订单明细*/
					orderDetail: null
				},
				formData: {
					orderId: null,
					orderType: null
				}
			}
		},
		methods:{
			async getDetail( data ){
				this.info = this.$options.data().info
				this.config = this.$options.data().config
				const { result } = await getOrderDetail(this.formData)
				this.info = result
			},
			phoneClick( tel ){
				window.location.tel = 'tel://' + tel;
			},
			closeClick(){
				this.show = false
			}
		},
		mounted(){
			
		},
		created(){

		},
		computed:{
			cusOrder: {
				get() {
					return this.$props.cusOrderId
				}
			},
			show: {
				get() {
					return this.$props.detailShow
				},
				set(nVal) {
					this.$emit("update:detailShow", nVal)
				}
			}
		},
		watch:{
			async cusOrder( nVal, oVal ){
				this.formData.orderId = nVal.substring(1)
				this.formData.orderType = nVal[0]
				await this.getDetail()
			}
		}
	}
</script>
<style type="text/css">
	@import '~@/assets/style/card.css';

	.van-collapse-item__content {
		background-color: #f1f1f1 !important;
		padding: 0.2rem 0rem 0.2rem 0rem !important;
	}
</style>
