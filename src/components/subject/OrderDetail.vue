<template>
	<div>
		<div v-if=" info.orderDNRe != null ">
			<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;">
	  			退货明细
			</div>
			<van-field v-model="info.orderDNRe.DNStr" label="单号" readonly input-align="center" />
			<van-field v-model="info.orderDNRe.IssueDate" label="生效日期" readonly input-align="center" />
			<van-field v-model="info.orderDNRe.OrderId" label="订单编号" readonly input-align="center" />
			<van-field v-model="info.orderDNRe.DeliQty" label="送货数" readonly input-align="center" />	
			<van-field v-model="info.orderDNRe.TSalesArea" label="销售面积(㎡)" readonly input-align="center" />
			<van-field v-model="info.orderDNRe.DeliAmt" label="送货金额(元)" readonly input-align="center"/>
			<van-field v-model="info.orderDNRe.Price" label="价格(元)" readonly input-align="center" />	
			<van-field v-model="info.orderDNRe.SquarePrice" label="平方价(元/㎡)" readonly input-align="center" />
			<van-field v-model="info.orderDNRe.ReturnCause" label="退货原因" readonly input-align="center" />
		</div>
		<div v-if=" info.orderDN != null ">
			<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;">
	  			送货明细
			</div>
			<van-field v-model="info.orderDN.DNStr" label="单号" readonly input-align="center" />
			<van-field v-model="info.orderDN.Signed" label="回签" readonly input-align="center" />
			<van-field v-model="info.orderDN.PackDate" label="装货日期" readonly input-align="center" />
			<van-field v-model="info.orderDN.DNDate" label="送货日期" readonly input-align="center" />
			<van-field v-model="info.orderDN.IssueDate" label="生效日期" readonly input-align="center" />
			<van-field v-model="info.orderDN.OrderId" label="订单编号" readonly input-align="center" />
			<van-field v-model="info.orderDN.DeliQty" label="送货数" readonly input-align="center" />
			<van-field v-model="info.orderDN.TSalesArea" label="销售面积(㎡)" readonly input-align="center" />
			<van-field v-model="info.orderDN.DeliAmt" label="送货金额(元)" readonly input-align="center" />
			<van-field v-model="info.orderDN.Price" label="价格(元)" readonly input-align="center" />
			<van-field v-model="info.orderDN.SquarePrice" label="平方价(元/㎡)" readonly input-align="center" />
			<van-field v-model="info.orderDN.DNRemark" label="送货备注" readonly input-align="center" />
			<van-field v-model="info.orderDN.CusSubNo" label="送货公司" readonly input-align="center" />
			<van-field v-model="info.orderDN.CusSubName" label="子公司简称" readonly input-align="center" />
			<van-field v-model="info.orderDN.SubDNAddress" label="送货地址" readonly input-align="center" />
			<van-field v-model="info.orderDN.SubContactPerson" label="联系人" readonly input-align="center" />
			<van-field v-model="info.orderDN.SubTelNo" label="联系电话" clickable error readonly input-align="center" @click="phoneClick(info.orderDN.SubTelNo)" />
			<van-field v-model="info.orderDN.CarNo" label="车牌号" readonly input-align="center" />
			<van-field v-model="info.orderDN.CarPName" label="司机名称" readonly input-align="center" />
			<van-field v-model="info.orderDN.Phone" label="电话" clickable error readonly input-align="center" @click="phoneClick(info.orderDN.Phone)"/>
		</div>
		<div v-if=" info.orderSch != null ">
			<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;">
				传单明细
			</div>
			<van-field v-model="info.orderSch.SState" label="工单状态" readonly input-align="center" />
			<van-field v-model="info.orderSch.SPaperWidth" label="门幅(mm)" readonly input-align="center" />
			<van-field v-model="info.orderSch.SQty" label="数量" readonly input-align="center" />
			<van-field v-model="info.orderSch.AddTime" label="添加时间" readonly input-align="center" />
		</div>
		<div v-if=" info.orderDetail != null ">
			<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;">
				订单详情
			</div>
			<van-field v-model="info.orderDetail.CusId" label="客户编号" readonly input-align="center" />
			<van-field v-model="info.orderDetail.CusShortName" label="客户简称" readonly input-align="center" />
			<van-field v-model="info.orderDetail.DNRemark" label="送货备注" readonly input-align="center" />
			<van-field v-model="info.orderDetail.strOrderId" label="订单编号" readonly input-align="center" />
			<van-field v-model="info.orderDetail.CusPoNo" label="客订单号" readonly input-align="center" />
			<van-field v-model="info.orderDetail.BoardId" label="订单材质" readonly input-align="center" />
			<van-field v-model="info.orderDetail.BoardName" label="材质名称" readonly input-align="center" />
			<van-field v-model="info.orderDetail.ScoreInfo" label="压线信息" readonly input-align="center" />
			<van-field v-model="info.orderDetail.ScoreType" label="压型" readonly input-align="center" />
			<van-field v-model="info.orderDetail.MatName" label="货品名称" readonly input-align="center" />
			<van-field v-model="info.orderDetail.BoxName" label="箱型" readonly input-align="center" />
			<van-field v-model="info.orderDetail.BoxL" label="箱长(mm)" readonly input-align="center" />
			<van-field v-model="info.orderDetail.BoxW" label="箱宽(mm)" readonly input-align="center" />
			<van-field v-model="info.orderDetail.BoxH" label="箱高(mm)" readonly input-align="center" />
			<van-field v-model="info.orderDetail.Length" label="板长(mm)" readonly input-align="center" />
			<van-field v-model="info.orderDetail.Width" label="板宽(mm)" readonly input-align="center" />
			<van-field v-model="info.orderDetail.ProFlow" label="工艺流程" readonly input-align="center" />
			<van-field v-model="info.orderDetail.OrdQty" label="订单数" readonly input-align="center" />
			<van-field v-model="info.orderDetail.SchQty" label="传单数" readonly input-align="center" />
			<van-field v-model="info.orderDetail.FinishedQty" label="完工数" readonly input-align="center" />
			<van-field v-model="info.orderDetail.DeliQty" label="送货数" readonly input-align="center" />
			<van-field v-model="info.orderDetail.ReturnQty" label="退货数" readonly input-align="center" />
			<van-field v-model="info.orderDetail.TSalesArea" label="销售面积(㎡)" readonly input-align="center" />
			<van-field v-model="info.orderDetail.Price" label="价格(元)" readonly input-align="center" />
			<van-field v-model="info.orderDetail.SquarePrice" label="平方价(元/㎡)" readonly input-align="center" />
			<van-field v-model="info.orderDetail.Amt" label="金额(元)" readonly input-align="center" />
		</div>
	</div>
</template>
<script>
	import { Field, Popup, NavBar, Icon } from 'vant';
	export default {
		components:{
			[Field.name]: Field,
			[Popup.name]: Popup,
			[NavBar.name]: NavBar,
			[Icon.name]: Icon,
		},
		props:['orderId','orderType'],
		data(){
			return {
				info:{
					orderDNRe:null,
					orderDN:null,
					orderSch:null,
					orderDetail:null
				}
			}
		},
		methods:{
			getDetail( data ){
				let self = this;
				this.$request.staff.erp.ordersDetail( data ).then(res=>{
					if( res.result.get_order_DNRe !== null ){
						self.info.orderDNRe = res.result.get_order_DNRe;
					}
					if( res.result.get_order_DN !== null ){
						self.info.orderDN = res.result.get_order_DN;
					}
					if( res.result.get_order_sch !== null ){
						self.info.orderSch = res.result.get_order_sch;
					}
					if( res.result.get_order_detail !== null ){
						self.info.orderDetail = res.result.get_order_detail;
					}
				});
			},
			phoneClick( tel ){
				window.location.tel = 'tel://' + tel;
			}
		},
		mounted(){
			this.getDetail({orderId:this.orderId,orderType:this.orderType});
		},
		created(){

		},
		computed:{
			strId(){
				return this.orderType + this.orderId;
			}
		},
		watch:{
			strId( newVal, oldVal ){
				this.orderId = newVal.substring(1);
				this.orderType = newVal[0];
				this.getDetail({orderId:this.orderId,orderType:this.orderType});
			}
		}
	}
</script>