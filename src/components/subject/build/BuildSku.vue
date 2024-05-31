<template>
	<van-popup 
		v-model="show" 
		round 
		position="bottom" 
		:style="{ height: '80%', backgroundColor: '#f1f1f1' }" 
		closeable
	>
		<div class="van-nav-bar van-hairline--bottom" style="z-index: 1;">
			<div class="van-nav-bar__left">
				<span class="van-nav-bar__text">下单信息</span>
			</div>
			<div class="van-nav-bar__title van-ellipsis"></div>
		</div>
		<div class="sku-container">
			
		
		<card 
			:title="orderInfo.cusOrderId" 
			:is-shadow="true"
		>
			<div class="card-body-container">
				<template v-if=" orderType == 's' || orderType == 'c' ">
					<div class="card-body-item card-body-item-100">
						<span>材质信息:
							<span class="mg-left-20">{{ orderInfo.materialType }}</span>
						</span>
					</div>
				</template>
				<!-- 简单纸板参数 -->
				<template  v-if=" orderType == 's' ">
					<div class="card-body-item card-body-item-100">
						<span>纸板规格:
							<span class="mg-left-20">{{ orderInfo.boardLength }}×{{ orderInfo.boardWidth }}</span>
						</span>
					</div>
					<template v-if=" orderInfo.isCalc == 1 ">
						<div class="card-body-item card-body-item-100">
							<span>压线压型:
								<span class="mg-left-20">{{ orderInfo.isEdge }}</span>
								<span class="mg-left-20">{{ orderInfo.lineBallInfo }}</span>
							</span>
						</div>
					</template>
					<template v-else>
						<div class="card-body-item card-body-item-100">
							<span>
								压型名称:
								<span class="mg-left-20">{{ orderInfo.lineBallInfo }}</span>
							</span>
						</div>
					</template>
					<div class="card-body-item card-body-item-100">
						<span>
							压线信息:
							<span class="mg-left-20">{{ orderInfo.lineBallFormula }}</span>
						</span>
					</div>
				</template>
				<!-- 纸箱纸板参数 -->
				<template v-if="orderType == 'c'">
					<div class="card-body-item card-body-item-100">
						<span>箱型信息:
							<span class="mg-left-20">{{ orderInfo.boxType }}</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>纸箱规格:
							<span class="mg-left-20">
								{{ orderInfo.boxLength }}×{{ orderInfo.boxWidth }}×{{ orderInfo.boxHeight }}
							</span>
						</span>
					</div>
					<div v-if="showTonLen" class="card-body-item card-body-item-100">
						<span>箱舌长度:
							<span class="mg-left-20">
								{{ orderInfo.tonLen }}
							</span>
						</span>
					</div>
					<div v-if="showULen" class="card-body-item card-body-item-100">
						<span>封箱调整:
							<span class="mg-left-20">
								{{ orderInfo.uLen }}
							</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>纸板规格:
							<span class="mg-left-20">
								{{ orderInfo.length }}×{{ orderInfo.width }}
							</span>
						</span>
					</div>
					<div v-if="isGroup" class="card-body-item card-body-item-100">
						<span>压线信息:
							<span class="mg-left-20">
								{{ orderInfo.scoreInfo }}
							</span>
						</span>
					</div>
					<!-- 订单试算 -->
					<template v-if="orderInfo.isCalc == 1">
						<div class="card-body-item card-body-item-100">
							<span>压线压型:
								<span class="mg-left-20">{{ orderInfo.isEdge }}</span>
								<span class="mg-left-20">{{ orderInfo.lineBallInfo }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>
								压线信息:
								<span class="mg-left-20">{{ orderInfo.lineBallFormula }}</span>
							</span>
						</div>
					</template>
					<template v-else>
						<div class="card-body-item card-body-item-100">
							<span>
								压型名称:
								<span class="mg-left-20">{{ orderInfo.lineBallInfo }}</span>
							</span>
						</div>
					</template>
					<div class="card-body-item card-body-item-100">
						<span>张数信息:
							<span class="mg-left-20">
								{{ orderInfo.bdMultiple }}
							</span>
						</span>
					</div>
				</template>
				<!-- 纸箱订单 -->
				<template v-if=" orderType == 'x' ">
					<div class="card-body-item card-body-item-100">
						<span>PO号:
							<span class="mg-left-20">
								{{ orderInfo.pON }}
							</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>套件:
							<span class="mg-left-20">
								{{ orderInfo.productId }}
							</span>
						</span>
					</div>
				</template>
				<div class="card-body-item card-body-item-100">
					<span>订单数量:
						<span class="mg-left-20">
							{{ orderType == 'c'? orderInfo.bdQty:orderInfo.orderQuantities }}
						</span>
					</span>
				</div>

				<template v-if=" orderType == 's' || orderType == 'c' ">
					<div class="card-body-item card-body-item-100">
						<span>面积信息:
							<span v-if="orderType == 'c' " class="mg-left-20 blue-color">
								单片{{ orderInfo.unitArea }}㎡
							</span>
							<span class="mg-left-20 green-color">
								合计{{ orderInfo.area }}㎡
							</span>
						</span>
					</div>
					<template v-if=" orderInfo.isCalc == 1 ">
						<div class="card-body-item card-body-item-100">
							<span>计价价格:
								<span class="mg-left-20">
									{{ orderInfo.dOrdPrice }} 元/㎡
								</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>合计金额:
								<span class="mg-left-20">
									{{ orderInfo.dAmt }}元
								</span>
							</span>
						</div>
					</template>
				</template>

				<!-- 公共参数 -->
				<div class="card-body-item card-body-item-100">
					<span>交货日期:
						<span class="mg-left-20">{{ orderInfo.date }}</span>
					</span>
				</div> 
				<div class="card-body-item card-body-item-100">
					<span>送货公司:
						<span class="mg-left-20">{{ orderInfo.address }}</span>
					</span>
				</div>
				<div class="card-body-item card-body-item-100">
					<span>送货备注:
						<span class="mg-left-20">{{ orderInfo.deliveryRemark }}</span>
					</span>
				</div>
				<div class="card-body-item card-body-item-100">
					<span>生产备注:
						<span class="mg-left-20">{{ orderInfo.productionRemark }}</span>
					</span>
				</div>
				<!-- 团购信息 -->
				<template v-if="isGroup">
					<div class="card-body-item card-body-item-100">
						<span>下单金额:
							<span class="mg-left-20">{{ orderInfo.cost }}元</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>节省金额:
							<span class="mg-left-20 green-color">{{ orderInfo.saveCost }}元</span>
						</span>
					</div>
				</template>
			</div>
		</card>

		</div>
		<!-- <van-field :value="orderInfo.cusOrderId" label="客订单号" readonly/>
		<template v-if=" isGroup == false && ( orderType == 's' ||  orderType == 'c' ) ">
			<van-field :value="orderInfo.materialType" label="材质" readonly/>
		</template>
		<template v-if=" orderType == 'c' ">
			<van-field :value="orderInfo.boxType" label="箱型" readonly/>
			<van-field :value="orderInfo.boxLength + 'x' +  orderInfo.boxWidth + 'x' + orderInfo.boxHeight" label="纸箱规格(mm)" readonly/>
			<van-field :value="orderInfo.tonLen" label="箱舌(mm)" readonly v-if="showTonLen"/>
			<van-field :value="orderInfo.uLen" label="封箱调整(mm)" readonly v-if="showULen"/>
			<van-field :value="orderInfo.length + 'x' + orderInfo.width" label="纸板规格(mm)" readonly/>
			<template v-if="orderInfo.isCalc == 1">
				<van-field :value="orderInfo.isEdge + '-' + orderInfo.lineBallInfo" label="压线压型" readonly/>
			</template>
			<template v-else>
				<van-field :value="orderInfo.lineBallInfo" label="压型名称" readonly/>
			</template>
			<template v-if=" orderInfo.isCalc == 1 ">
				<van-field :value="orderInfo.lineBallFormula" label="压线信息" readonly/>
			</template>
			<van-field :value="orderInfo.bdMultiple" label="张数" readonly/>
		</template>
		<template  v-if=" orderType == 's' ">
			<van-field :value="orderInfo.boardLength + 'x' + orderInfo.boardWidth" label="纸板规格(mm)" readonly/>
			<template v-if=" orderInfo.isCalc == 1 ">
				<van-field :value="orderInfo.isEdge + '-' + orderInfo.lineBallInfo" label="压线压型" readonly/>
			</template>
			<template v-else>
				<van-field :value="orderInfo.lineBallInfo" label="压型名称" readonly/>
			</template>
			<van-field :value="orderInfo.lineBallFormula" label="压线信息" readonly/>
		</template>
		<template v-if=" orderType == 'x' ">
			<van-field :value="orderInfo.pON" label="PO号" readonly/>
			<van-field :value="orderInfo.productId" label="套件" readonly/>
		</template>
		<template v-if=" orderType == 'c' ">
			<van-field :value="orderInfo.bdQty" label="订单数" readonly/>
		</template>
		<template v-else>
			<van-field :value="orderInfo.orderQuantities" label="订单数" readonly/>
		</template>
		
		<template v-if=" orderType == 's' || orderType == 'c' ">
			<template v-if="orderType == 'c' ">
				<van-field :value="orderInfo.unitArea" label="单片面积(㎡)" readonly/>
			</template>
			<van-field :value="orderInfo.area" label="下单面积(㎡)" readonly/>
			<template v-if=" orderInfo.isCalc == 1 ">
				<van-field :value="orderInfo.dOrdPrice" label="计价价格" readonly/>
				<van-field :value="orderInfo.dAmt" label="金额" readonly/>
			</template>
		</template>
		<van-field :value="orderInfo.address" label="送货公司" readonly/>
		<van-field :value="orderInfo.date" label="交货日期" readonly/>
		<van-field :value="orderInfo.deliveryRemark" label="送货备注" readonly/>
		<van-field :value="orderInfo.productionRemark" label="生产备注" readonly/>
		<template v-if="isGroup">
			<van-field :value="orderInfo.cost" label="下单金额" readonly/>
			<van-field :value="orderInfo.saveCost" label="节省金额" readonly/>
		</template>
		<div style="width:100%;height:42px;"></div> -->
		<van-button  type="primary" size="normal" style="width:100%;position:fixed;bottom:0;" @click="buildOrder()">确认下单</van-button>
	</van-popup>
</template>
<script>
	import { Button, Popup, Field } from 'vant';
	/*自定义卡片组件*/
	import Card from "@/components/subject/card/Card.vue"

	export default {
		components:{
			[Button.name]: Button,
			[Popup.name]: Popup,
			[Field.name]: Field,

			Card
		},
		props:{
			skuShow:{
				type: Boolean,
				required:true,
				default: false
			},
			orderInfo:{
				type: Object,
				required:true,
				default: {}
			},
			orderType:{
				required:true,
			},
			isGroup:{
				type: Boolean,
				required:true,
				default: false
			},
			showULen:{
				type: Boolean,
				default:true,
			},
			showTonLen:{
				type: Boolean,
				default:true
			}
		},
		data(){
			return {}
		},
		methods:{
			buildOrder(){
				this.$emit("saveOrder",this.orderInfo);
				this.show = false;
			}
		},
		created(){

		},
		mounted(){

		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			show: {
				get() {
					return this.$props.skuShow
				},
				set(nVal) {
					this.$emit("update:skuShow", nVal)
				}
			},
		},
		watch:{
			
		}
	}
</script>

<style type="text/css">
	@import '~@/assets/style/card.css';

	.sku-container {
		margin-bottom: 3.125rem;
	}
</style>