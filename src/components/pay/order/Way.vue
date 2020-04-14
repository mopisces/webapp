<template>
	<div>
		<div style="margin: 40px 0px 12px; padding: 25px 0px 15px; background-color: rgb(255, 255, 255); position: relative;">
			<div style="padding: 0px 10px; font-size: 14px; color: rgb(105, 105, 105); text-align: center; word-break: break-all;">
				{{ info.orderName }}
			</div>
			<div style="margin-top: 5px; font-size: 28px; color: rgb(26, 173, 25); text-align: center;">¥{{ info.total }}</div>
			<div style="margin-top: 10px; font-size: 15px; text-align: center;"  >
				<van-count-down :time="time" @finish="timeFinal()" v-if=" countDownShow ">
					<template v-slot="timeData">
						<span>有效剩余时间&nbsp;&nbsp;:&nbsp;&nbsp;</span>
						<span class="item">{{ timeData.minutes }}</span>分钟
						<span class="item">{{ timeData.seconds }}</span>秒
					</template>
				</van-count-down>
			</div>
			<div style="padding: 0 3px;font-size: 12px;color: #fff;background-color: #4b0;position: absolute;top: 0;right: 0;" v-if="info.isOneCent">1分钱支付</div>
		</div>
		<van-cell size="large" title="微信支付" is-link v-if="info.useWechat" @click="payClick( 'wechat' )">
			<van-icon  slot="icon" name="wechat" style="line-height: inherit;" size="40" color="#0bf147"/>
		</van-cell>
		<van-cell size="large" title="支付宝支付" is-link v-if="info.useAlipay" @click="payClick( 'alipay' )">
			<van-icon  slot="icon" name="alipay" style="line-height: inherit;" size="40" color="#1989FA"/>
		</van-cell>
		<van-popup v-model="wxQrCodeShow" position="top" :style="{ height : '100%', width: '100%'}">
			<div class="van-nav-bar van-nav-bar--fixed van-hairline--bottom" style="z-index: 1;">
				<div class="van-nav-bar__title van-ellipsis">
					请使用微信扫一扫
				</div>
			</div>
			<div id="qrcode" class="qrcode"></div>
			<p style="text-align:center">请扫码支付</p>
			<p style="text-align:center;font-size:1.5rem;">￥{{ info.total }}</p>
			<div style="text-align:center;">
				<van-button type="primary" size="normal" style="width:60%;" @click="checkPay() ">
					已完成支付
				</van-button>
			</div>
		</van-popup>
	</div>
</template>
<script>
	import { Button, Cell, Icon, Popup, Dialog, Toast, CountDown } from 'vant';
	import NewPopup from '@/components/subject/NewPopup.vue';
	import QRCode from 'qrcodejs2';
	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Toast.name]: Toast,
			[CountDown.name]: CountDown,

			NewPopup
		},
		data(){
			return {
				config:{
					isWx:false
				},
				info : {
					isOneCent  : false,
					useAlipay  : false,
					useWechat  : false,
					orderName  : '',
					total      : 0,
					deadTime   : 0,
					inTime     : true,
					cusOrderId : '',
				},
				time:0,
				countDownShow : false,
				wxQrCodeShow  : false,
				qrCodeUrl     : ''
			}
		},
		methods:{
			paymentIndex( cusOrderId ){
				let self = this;
				this.$request.client.paymentAll.paymentIndex( cusOrderId ).then(res=>{
					self.info.isOneCent = res.result.one_cent == '1' ? true : false;
					self.info.useWechat = res.result.pay_available.UseWxPay == '1' ? true : false;
					self.info.useAlipay = res.result.pay_available.UseAliPay == '1' ? true : false;
					self.info.orderName = res.result.order_name;
					self.info.total     = res.result.total;
					self.info.deadTime  = res.result.dead_time * 1000;
				}).then(()=>{
					this.$nextTick(()=>{
						let now = new Date();
						this.time = this.info.deadTime - now.getTime();
						this.countDownShow = true;
					});
				});
			},
			payClick( type ){
				if( !this.info.inTime ){
					Dialog.alert({
						message: '已超出有效时间!'
					}).then(()=>{
						Dialog.close();
					});
					return ;
				}
				if( type == 'wechat' ){
					if( !this.config.isWx ){
						//非微信浏览器
						this.wxQrCodeShow = true;
						let data = {
							tradeType  : 1,
							cusOrderId : this.info.cusOrderId
						};
						this.wxpayMakeQrCode( data );
					}else{
						//微信浏览器
						let data = {
							tradeType  : 0,
							cusOrderId : this.info.cusOrderId
						};
						this.wxpay( data );
					}
				}
				if( type == 'alipay' ){
					this.alipay( this.info );
				}
			},
			timeFinal(){
				this.info.inTime = false;
				Dialog.alert({
					message: '已超出有效时间!'
				}).then(()=>{
					Dialog.close();
				});
				this.$router.push('/client/wxorder/lists')
			},
			alipay( data ){
				if( data.cusOrderId == '' || data.total <= 0 ){
					Toast.fail('参数不正确');
					return ;
				}
				let self = this;
				this.$request.payAll.payAll.alipay( data ).then(res=>{
					if( res.errorCode == '00000' ){
						self.$router.push({
							path:'/client/alipay/index',
							query:{
								goto:res.result
							}
						});
					}
				});
			},
			wxpay( data ){
				if( data.cusOrderId == '' || data.tradeType != 0 ){
					Toast.fail('参数不正确');
					return ;
				}
				let self = this;
				this.$request.payAll.payAll.wechatPay( data ).then(res=>{
					if( res.errorCode == '00000' ){
						let url = 'http://' + res.result.server_info.Frp80PortDomain + '/common/getOpenId?token=' + res.result.token + '&oriDomain=' + res.result.server_info.OriDomain + '&oriPort=' + res.result.server_info.OriPort + '&backstagePort=' + res.result.server_info.BackstagePort;
						window.location.href = url;
						//window.location.href = res.result;
					}
				});
			},
			wxpayMakeQrCode( data ){
				if( data.cusOrderId == '' || data.tradeType != 1 ){
					Toast.fail('参数不正确');
					return ;
				}
				let self = this;
				this.$request.payAll.payAll.wechatPay( data ).then(res=>{
					if( res.errorCode == '00000' ){
						self.qrCodeUrl = res.result;
					}
				}).then(()=>{
					document.getElementById('qrcode').innerHTML = '';
					new QRCode('qrcode',{
						text         : this.qrCodeUrl,
				     	colorDark    : '#000000',
				      	colorLight   : '#ffffff',
				      	correctLevel : QRCode.CorrectLevel.H
					});
				})
			},
			checkPay(){
				this.wxQrCodeShow = false;
				if( this.info.cusOrderId.indexOf(',') == -1 ){
					this.$router.push({ name : 'payDetail' , params : { orderId : this.info.cusOrderId } }); 
				}else{
					this.$router.push('/client/wxorder/lists');
				}
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','支付方式');
			if( typeof(this.$route.params.cusOrderId) == 'undefined' ){
				this.info.cusOrderId = '';
				this.$router.go(-1);	
				return ;
			}else{
				if( Array.isArray(this.$route.params.cusOrderId) ){
					this.info.cusOrderId = this.$route.params.cusOrderId.join(',');
				}else{
					this.info.cusOrderId = this.$route.params.cusOrderId;
				}
			}
		},
		mounted(){
			if( this.info.cusOrderId != '' ){
				this.paymentIndex( this.info.cusOrderId );
			}
			if( window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' ){
				this.config.isWx = true;
			}
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
<style>
	.item {
		display: inline-block;
		width: 2rem;
		margin-right: 5px;
		color: #fff;
		font-size: 1rem;
		text-align: center;
		background-color: rgb(105, 105, 105);
	}
	#qrcode img {
        margin: 6.25rem auto 1rem auto;
        width: 10rem;
    }
</style>