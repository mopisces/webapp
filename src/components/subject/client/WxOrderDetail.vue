<template>
	<van-popup v-model="show" position="bottom" :style="{ height: '100%', backgroundColor: '#f1f1f1' }">
		<van-sticky>
			<div class="van-nav-bar van-hairline--bottom" style="z-index: 1;">
				<div class="van-nav-bar__left">
					<span class="van-nav-bar__text">订单详情</span>
				</div>
				<div class="van-nav-bar__title van-ellipsis"></div>
				<div class="van-nav-bar__right" @click=" show = false ">
					<i class="van-icon van-icon-cross" style="font-size: 16px;"><!----></i>
				</div>
			</div>
		</van-sticky>
		<template v-if=" isGroup ">
			<van-card>
				<div slot="title">
					<span style="color: #e01835;" v-if=" groupInfo.boardId && !groupInfo.matNo ">{{ groupInfo.boardId }}</span>
					<span style="color: #e01835;" v-if=" !groupInfo.boardId && groupInfo.matNo ">{{ groupInfo.matNo }}</span>
					<span v-if=" groupInfo.title ">,{{ groupInfo.title }}</span>
				</div>
				<van-image :src="groupInfo.pic" slot="thumb" round width="90" height="90"/>
				<div slot="desc">
					下单价格：
					<span style="color: #e01835;">¥{{ groupInfo.price }}/
						<span v-if=" groupInfo.boardId && !groupInfo.matNo ">㎡</span>
						<span v-if=" !groupInfo.boardId && groupInfo.matNo ">个</span>
					</span>
					<span style="color: #999;text-decoration: line-through;">¥{{ groupInfo.marketPrice }}/
						<span v-if=" groupInfo.boardId && !groupInfo.matNo ">㎡</span>
						<span v-if=" !groupInfo.boardId && groupInfo.matNo ">个</span>
					</span><br/>
					下单金额：<span style="color: #e01835;">¥{{ groupInfo.cost }}</span><br/>
					节省金额：<span style="color: #e01835;">¥{{ groupInfo.saveCost }}</span>
				</div>
			</van-card>
		</template>
		<web-card 
			:title="orderDetail.CusPoNo" 
			:subTitle="cTypeName(orderDetail.CType)"
			:extra="orderDetail.BuildTime"
			:is-shadow="true"
		>
			<div class="card-body-container">
				<div 
					v-if="orderDetail.CType === 's' || orderDetail.CType === 'c'"
					class="card-body-item card-body-item-100"
				>
					<div class="card-body-txt">规格信息:</div>
					<span class="mg-left-20">{{ orderDetail.Length }}×{{ orderDetail.Width }}</span>
					<span class="mg-left-20">{{ orderDetail.BoardId }}</span>
				</div>
				<div 
					v-if="orderDetail.CType === 'c'"
					class="card-body-item card-body-item-100"
				>
					<div class="card-body-txt">纸箱尺寸:</div>
					<span class="mg-left-20">{{ orderDetail.BoxL }}×{{orderDetail.BoxW}}×{{orderDetail.BoxH}}</span>
				</div>
				<div 
					v-if="orderDetail.CType === 'c'"
					class="card-body-item card-body-item-100"
				>
					<div class="card-body-txt red-color">箱舌</div>|
					<div class="card-body-txt blue-color">封箱调整</div>:
					<span class="mg-left-20 red-color">{{ orderDetail.TonLen }}mm</span>
					<span class="mg-left-20 blue-color">{{ orderDetail.ULen }}mm</span>
				</div>
				<div 
					v-if="orderDetail.CType === 's'"
					class="card-body-item card-body-item-100"
				>
					<div class="card-body-txt">压线信息:</div>
					<span class="mg-left-20">{{ orderDetail.ScoreInfo }}</span>
					<span class="mg-left-20">{{ orderDetail.BuildScoreName }}</span>
				</div>
				<div 
					v-if=" orderDetail.CType === 'x' || orderDetail.CType === 't' "
					class="card-body-item card-body-item-100"
				>
					<span>PO号:
						<span class="mg-left-20">{{ orderDetail.PON }}</span>
					</span>
				</div>
				<div 
					v-if=" orderDetail.CType === 'x' "
					class="card-body-item card-body-item-100"
				>
					<span>套件名称:
						<span class="mg-left-20">{{ orderDetail.ProductId }}</span>
					</span>
				</div>
				<div 
					v-if=" orderDetail.CType === 't' "
					class="card-body-item card-body-item-100"
				>
					<span>货品编号:
						<span class="mg-left-20">{{ orderDetail.MatNo }}</span>
					</span>
				</div>
				<div class="card-body-item card-body-item-100">
					<span>订单信息:
						<span class="mg-left-20">
							{{ orderDetail.OrdQty }}
							<span v-if="orderDetail.CType === 's'">片</span>
							<span v-else>个</span>
						</span>
						<span 
							v-if="orderDetail.CType === 's' || orderDetail.CType === 'c'" 
							class="mg-left-20"
						>
							{{ orderDetail.Area }}㎡
						</span>
					</span>
				</div>
				<div 
					v-if="orderDetail.CType === 'c'"
					class="card-body-item card-body-item-100"
				>
					<div class="card-body-txt">纸张信息:</div>
					<span class="mg-left-20">{{ orderDetail.BdMultiple }}</span>
					<span class="mg-left-20">{{ orderDetail.BdQty }}</span>
				</div>
				<div class="card-body-item card-body-item-100">
					<span>送货地址:
						<span class="mg-left-20">{{ orderDetail.SubDNAddress }}</span>
					</span>
				</div>
				<div class="card-body-item card-body-item-100">
					<span>送货备注:
						<span class="mg-left-20">{{ orderDetail.DNRemark }}</span>
					</span>
				</div>
				<div class="card-body-item card-body-item-100">
					<span>生产备注:
						<span class="mg-left-20">{{ orderDetail.ProRemark }}</span>
					</span>
				</div>
				<div class="card-body-item card-body-item-100">
					<span>交货日期:
						<span class="mg-left-20">{{ orderDetail.DeliveryDate }}</span>
					</span>
				</div>
			</div>
		</web-card>
		<!-- <template>
			<van-field label="订单类型" readonly input-align="right">
				<div slot="input">
					{{ cTypeName(orderDetail.CType) }}
				</div>
			</van-field>
			<van-field v-model="orderDetail.CusPoNo" label="客订单号" readonly input-align="right"></van-field>
			<van-field v-model="orderDetail.BoardId" label="材质" readonly input-align="right" v-if="orderDetail.CType === 's' || orderDetail.CType === 'c'"></van-field>
			<van-field v-model="orderDetail.BoxName" label="箱型" readonly input-align="right" v-if="orderDetail.CType === 'c'"></van-field>
			<template v-if=" orderDetail.CType === 'c' ">
				<van-field v-model="orderDetail.BoxL" label="箱长(mm)" readonly input-align="right"></van-field>
				<van-field v-model="orderDetail.BoxW" label="箱宽(mm)" readonly input-align="right"></van-field>
				<van-field v-model="orderDetail.BoxH" label="箱高(mm)" readonly input-align="right"></van-field>
				<van-field v-model="orderDetail.TonLen" label="箱舌(mm)" readonly input-align="right"></van-field>
				<van-field v-model="orderDetail.ULen" label="封箱调整(mm)" readonly input-align="right"></van-field>
			</template>
			<template v-if=" orderDetail.CType === 's' || orderDetail.CType === 'c' ">
				<van-field v-model="orderDetail.Length" label="板长(mm)" readonly input-align="right"></van-field>
				<van-field v-model="orderDetail.Width" label="板宽(mm)" readonly input-align="right"></van-field>
			</template>
			<template v-if=" orderDetail.CType === 's' ">
				<van-field v-model="orderDetail.BuildScoreName" label="压线名称" readonly input-align="right"></van-field>
				<van-field v-model="orderDetail.ScoreInfo" label="压线信息" readonly input-align="right"></van-field>
			</template>
			<van-field v-model="orderDetail.PON" label="PO号" readonly input-align="right" v-if=" orderDetail.CType === 'x' || orderDetail.CType === 't' "></van-field>
			<van-field v-model="orderDetail.ProductId" label="套件" readonly input-align="right" v-if=" orderDetail.CType === 'x' "></van-field>
			<van-field v-model="orderDetail.MatNo" label="货品编号" readonly input-align="right"  v-if=" orderDetail.CType === 't' "></van-field>
			<van-field v-model="orderDetail.OrdQty" label="订单数" readonly input-align="right"></van-field>
			<template v-if=" orderDetail.CType === 'c' ">
				<van-field v-model="orderDetail.BdMultiple" label="张数" readonly input-align="right"></van-field>
				<van-field v-model="orderDetail.BdQty" label="纸板数" readonly input-align="right"></van-field>
			</template>
			<van-field v-model="orderDetail.Area" label="下单面积(㎡)" readonly input-align="right" v-if=" orderDetail.CType === 's' || orderDetail.CType === 'c'" ></van-field>
			<van-field v-model="orderDetail.SubDNAddress" label="送货地址" readonly input-align="right" type="textarea" :autosize="true"></van-field>
			<van-field v-model="orderDetail.DeliveryDate" label="交货日期" readonly input-align="right"></van-field>
			<van-field v-model="orderDetail.DNRemark" label="送货备注" readonly input-align="right"></van-field>
			<van-field v-model="orderDetail.ProRemark" label="生产备注" readonly input-align="right"></van-field>
			<van-field v-model="orderDetail.BuildTime" label="下单时间" readonly input-align="right"></van-field>
		</template> -->
	</van-popup>
</template>
<script>
	import { Button, Image, Popup, Field, Sticky, Card } from 'vant';
	import WebCard from '@/components/subject/card/Card.vue';
	import { cTypeChange } from '@/util/index';
	export default {
		components:{
			[Button.name]: Button,
			[Image.name]: Image,
			[Popup.name]: Popup,
			[Field.name]: Field,
			[Sticky.name]: Sticky,
			[Card.name]: Card,

			WebCard
		},
		props:['detailShow','cusOrderId'],
		data(){
			return {
				show        : this.detailShow,
				orderDetail : {
					CType: null,

				},
				groupInfo   : {
					boardId     : '',
					matNo       : '',
					productId   : '',
					title       : '',
					price       : '',
					marketPrice : '',
					cost        : '',
					saveCost    : '',
				},
				isGroup     : false
			}
		},
		methods:{
			cTypeName( cType ){
				return cTypeChange( cType );
			},
			wechatBaseDetail( cusOrderId ){
				let self = this;
				this.$request.client.ordersManage.wechatBaseDetail( cusOrderId ).then(res=>{
					if( res.errorCode == '00000' ){
						self.orderDetail = res.result;
					}
				}).then(()=>{
					if( this.orderDetail.IsGroup == '1' ){
						this.wechatGroupDetail( cusOrderId );
					}
				});
			},
			wechatGroupDetail( cusOrderId ){
				let self = this;
				this.$request.client.ordersManage.wechatGroupDetail( cusOrderId ).then(res=>{
					if( res.errorCode == '00000' ){
						self.groupInfo['pic']      = res.result.FirstPic
						self.isGroup               = true;
						self.groupInfo.boardId     = res.result.BoardId;
						self.groupInfo.matNo       = res.result.MatNo;
						self.groupInfo.productId   = res.result.WebProductId;
						self.groupInfo.title       = res.result.Title;
						self.groupInfo.price       = res.result.Price;
						self.groupInfo.marketPrice = res.result.MarketPrice;
						self.groupInfo.cost        = res.result.Cost;
						self.groupInfo.saveCost    = res.result.SaveCost;
					}
				});
			}
		},
		created(){
			
		},
		mounted(){
			this.wechatBaseDetail( this.cusOrderId );
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			
		},
		watch:{
			detailShow( newV,oldV ){
				this.show = newV;
			},
			show(newV,oldV){
				this.$emit("update:detailShow", newV);
			},
			cusOrderId( newV,oldV ){
				this.detailAll( newV );
			}
		}
	}
</script>
<style type="text/css">
	@import '~@/assets/style/card.css';
</style>