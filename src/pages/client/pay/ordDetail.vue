<template>
	<div>
		<van-card>
			<div slot="title">
				<span v-if=" cardInfo.boardId ">{{ cardInfo.boardId }}</span>
				<span v-else>{{ cardInfo.matNo }}</span>
				<span style="color:#000;" v-if="cardInfo.title">,{{ cardInfo.title }}</span>
			</div>
			<div slot="price">
				下单价格:￥{{ cardInfo.price }}
			</div>
			<div slot="origin-price" v-if=" pageInfo.isGroup == 1 ">
				￥{{ cardInfo.marketPrice }}
			</div>
			<div slot="desc">
				<span>下单金额:￥{{ cardInfo.cost }}</span><br/>
				<span v-if=" pageInfo.isGroup == 1 ">节省金额:￥{{ cardInfo.saveCost }}</span>
			</div>
			<div slot="footer">
				<van-button size="mini" @click="onClick()" v-if=" this.config.button.icon == 'shenqingdan' ">
					<van-icon class-prefix="iconfont" :name="config.button.icon" size="12"/>
					&nbsp;&nbsp;{{ config.button.text }}
				</van-button>
			</div>
			<van-image :src="cardInfo.pic" slot="thumb"/>
		</van-card>
		<van-steps direction="vertical" :active="config.steps.active">
			<van-step v-for="(item,index) in config.steps.options" :key=" 'step' + index ">
				<h3>{{ item.descr }}</h3>
				<p>{{ item.datetime }}</p>
			</van-step>
		</van-steps>
		<div style="text-align:center;">
			<van-button type="info" style="width:60%;" @click="onClick()"  v-if=" pageInfo.isDel == 0 && this.config.button.icon != 'shenqingdan'">
				<van-icon class-prefix="iconfont" :name="config.button.icon" size="16"/>
				&nbsp;&nbsp;{{ config.button.text }}
			</van-button>
			<van-button type="info" style="width:60%;" @click="goWxOrder()"  v-else>
				返回微信订单
			</van-button>
		</div>
	</div>
</template>
<script>
	import { Button, Icon, Image, Toast, Step, Steps, Card } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Image.name]: Image,
			[Toast.name]: Toast,
			[Step.name]: Step,
			[Steps.name]: Steps,
			[Card.name]: Card,
		},
		data(){
			return {
				config: {
					steps: {
						options: [],
						active: 0
					},
					button: {
						text: '',
						icon: '',
						type: '',
					}
				},
				cardInfo: {
					boardId: null,
					matNo: null,
					title: null,
					price: null,
					marketPrice: null,
					cost: null,
					saveCost: null,
					pic: null,
				},
				pageInfo: {
					orderId: '',
					isDel: false,
					checked: false,
					checkTime: '',
					paid: 0,
					paidTime: '',
					apply: 0,
					applyTime: '',
					applyReason: '',
					refund: 0,
					refundTime: '',
					payDeadTime: 0,
					isGroup: 0,
				}
			}
		},
		methods:{
			getPayDetail( orderId ){
				let self = this;
				this.$request.client.paymentAll.payDetail( orderId ).then(res=>{
					if( res.errorCode == '00000' ){
						self.cardInfo.boardId     = res.result.order.BoardId;
						self.cardInfo.matNo       = res.result.order.MatNo;
						self.cardInfo.title       = res.result.group.Title;
						self.cardInfo.price       = res.result.group.Price;
						self.cardInfo.marketPrice = res.result.group.MarketPrice;
						self.cardInfo.cost        = res.result.group.Cost;
						self.cardInfo.saveCost    = res.result.group.SaveCost;
						self.cardInfo.pic = res.result.group.FirstPic;
						self.config.steps.options = res.result.time_line;
						self.config.steps.active  = res.result.time_line.length - 1;

						self.pageInfo.orderId     = res.result.detail_order_id;
						self.pageInfo.isDel       = res.result.order.IsDel;
						self.pageInfo.checked     = res.result.order.Checked;
						self.pageInfo.checkTime   = res.result.order.CheckTime;
						self.pageInfo.isGroup     = res.result.order.IsGroup;
						//console.log(self.pageInfo.isGroup)
						self.pageInfo.paid        = res.result.pay.Paid;
						self.pageInfo.paidTime    = res.result.pay.PaidTime;
						self.pageInfo.apply       = res.result.pay.Apply;
						self.pageInfo.applyTime   = res.result.pay.ApplyTime;
						self.pageInfo.applyReason = res.result.pay.ApplyReason;
						self.pageInfo.refund      = res.result.pay.Refund;
						self.pageInfo.refundTime  = res.result.pay.RefundTime;
						self.pageInfo.payDeadTime = res.result.pay.PayDeadlineTime;
					}
				}).then(()=>{
					this.$nextTick(()=>{
						if( this.pageInfo.paid == 0 ){
							if( this.pageInfo.payDeadTime * 1000 < new Date().getTime() ){
								this.config.button.text = '付款已超时';
								this.config.button.icon = 'chaoshi3';
								this.config.button.type = 'payOverTime';
							}else{
								this.config.button.text = '付款';
								this.config.button.icon = 'fukuan';
								this.config.button.type = 'payOnTime';
							}
						}else if( this.pageInfo.paid == 1 && this.pageInfo.checked == 0 && this.pageInfo.apply == 0 ){
							this.config.button.text = '申请退款';
							this.config.button.icon = 'shenqingdan';
							this.config.button.type = 'apply';
						}else if( this.pageInfo.paid == 1 && this.pageInfo.checked == 0 && this.pageInfo.apply == 1 && this.pageInfo.refund == 0 ){
							this.config.button.text = '申请退款中';
							this.config.button.icon = 'shiliangzhinengduixiang';
							this.config.button.type = 'onRefund';
						}else if( this.pageInfo.paid == 1 && this.pageInfo.checked == 0 && this.pageInfo.refund == 1 ){
							this.config.button.text = '已退款';
							this.config.button.icon = 'tuikuan';
							this.config.button.type = 'refunded';
						}
					})
				});
			},
			onClick(){
				switch( this.config.button.type ) {
					case 'payOverTime':
						return Toast.fail('付款已超时');
					case 'payOnTime' : 
						return this.$router.push({ name : 'payWay' , params : { cusOrderId : this.pageInfo.orderId } });
					case 'apply' :
						return this.$router.push({ name : 'payApply' , params : { orderId : this.pageInfo.orderId, cost : this.cardInfo.cost, onApply:0 } });
					case 'onRefund' : 
						return this.$router.push({ name : 'payApply' , params : { orderId : this.pageInfo.orderId, cost : this.cardInfo.cost, onApply:1 } });
					case 'refunded' : 
						return this.$router.push({ name : 'payApply' , params : { orderId : this.pageInfo.orderId, cost : this.cardInfo.cost, onApply:1 } });
					default :
						return this.$router.push({ name : 'payWay' , params : { cusOrderId : this.pageInfo.orderId } });
				}
			},
			goWxOrder(){
				this.$router.push('/client/wxorder/lists');
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','订单支付信息');
			if( typeof(this.$route.params.orderId) == 'undefined' && typeof(this.$route.query.orderId) == 'undefined' ){
				this.$router.go(-1);	
				return ;
			}else{
				let orderId = '';
				let orderIdArr = [];
				if( this.$route.query.orderId ){
					orderIdArr = this.$route.query.orderId.split(',');
					orderId    = orderIdArr[0];
				}else{
					orderId = this.$route.params.orderId;
				}
				this.getPayDetail(orderId);
			}
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

		}
	}
</script>