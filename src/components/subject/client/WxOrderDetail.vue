<template>
	<van-popup v-model="show" position="bottom" :style="{ height: '100%' }">
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
		<template v-if="config.isBase">
			<van-field v-model="orderDetail.CTypeName" label="订单类型" readonly input-align="right"></van-field>
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
				<van-field v-model="orderDetail.ScoreName" label="压线名称" readonly input-align="right"></van-field>
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
			<van-field v-model="orderDetail.SubDNAddress" label="送货地址" readonly input-align="right"></van-field>
			<van-field v-model="orderDetail.DeliveryDate" label="交货日期" readonly input-align="right"></van-field>
			<van-field v-model="orderDetail.DNRemark" label="送货备注" readonly input-align="right"></van-field>
			<van-field v-model="orderDetail.ProRemark" label="生产备注" readonly input-align="right"></van-field>
			<van-field v-model="orderDetail.BuildTime" label="下单时间" readonly input-align="right"></van-field>
		</template>
	</van-popup>
</template>
<script>
	import { Button, Popup, Field, Sticky } from 'vant';
	import { cTypeChange } from '@/util/index';
	export default {
		components:{
			[Button.name]: Button,
			[Popup.name]: Popup,
			[Field.name]: Field,
			[Sticky.name]: Sticky,
		},
		props:['detailShow','cusOrderId'],
		data(){
			return {
				config : {
					isBase : true
				},
				show        : this.detailShow,
				orderDetail : {},
			}
		},
		methods:{
			detailAll( cusOrderId ){
				let self = this;
				this.$request.client.ordersManage.detailAll( cusOrderId ).then((acct, perms)=>{
					if( acct[0].result != null ){
						self.orderDetail   = acct[0].result;
						self.config.isBase = true;
					}else if( acct[0].result != null ){

					}
				});
			}
		},
		created(){
			
		},
		mounted(){
			this.detailAll( this.cusOrderId );
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