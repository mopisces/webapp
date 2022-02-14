<template>
	<van-popup v-model="show" round position="bottom" :style="{ height: '80%' }" closeable>
		<div class="van-nav-bar van-hairline--bottom" style="z-index: 1;">
			<div class="van-nav-bar__left">
				<span class="van-nav-bar__text">下单信息</span>
			</div>
			<div class="van-nav-bar__title van-ellipsis"></div>
		</div>
		<van-field :value="orderInfo.cusOrderId" label="客订单号" readonly/>
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
			<van-field :value="orderInfo.bdMultiple" label="张数" readonly/>
		</template>
		<template  v-if=" orderType == 's' ">
			<van-field :value="orderInfo.boardLength + 'x' + orderInfo.boardWidth" label="纸板规格(mm)" readonly/>
			<!-- <van-field :value="orderInfo.boardLength" label="板长" readonly/>
			<van-field :value="orderInfo.boardWidth" label="板宽" readonly/> -->
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
		<div style="width:100%;height:42px;"></div>
		<van-button  type="primary" size="normal" style="width:100%;position:fixed;bottom:0;" @click="buildOrder()">确认下单</van-button>
	</van-popup>
</template>
<script>
	import { Button, Popup, Field } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[Popup.name]: Popup,
			[Field.name]: Field,
		},
		//props:['skuShow','orderInfo','orderType','isGroup'],
		props:{
			skuShow:{
				required:true,
			},
			orderInfo:{
				required:true,
			},
			orderType:{
				required:true,
			},
			isGroup:{
				required:true,
			},
			showULen:{
				default:true
			},
			showTonLen:{
				default:true
			}
		},
		data(){
			return {
				show:this.skuShow
			}
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
			
		},
		watch:{
			skuShow(newV,oldV){
				this.show = newV;
			},
			show(newV,oldV){
				this.$emit("update:skuShow", newV);
			}
		}
	}
</script>