<template>
	<div  style="background-color:#f1f1f1;">
		<div style="width:100%;height:0.625rem;"></div>
		<div class="vant-row" style="height:3.125rem;">
			<div class="van-col van-col--8" style="line-height:1.875rem;text-align:center;">
				<div style="font-size:0.875rem;">
					<span style="color:rgb(26, 173, 25);">{{ userName }}</span>
				</div>
			</div>
			<div class="van-col van-col--8" style="text-align:center;">
				<van-button type="info"  plain hairline round @click="getChangePass()" size="small">
					<van-icon class-prefix="iconfont" size="16" name="iconfontmima"/>
					更改密码
				</van-button>
			</div>
			<div class="van-col van-col--8" style="text-align:center;">
				<van-button type="info" plain hairline round @click="qrClick" size="small">
					<van-icon class-prefix="iconfont" size="16" name="erweima2"/>
					登录二维码
				</van-button>
			</div>
		</div>
		<van-grid square :gutter="10" :column-num="3">
			<van-grid-item v-for="(item,index) in config.authGrid" :key="index" :url="item.url" :text="item.text">
				<van-icon class-prefix="iconfont" size="28" :name="item.iconName" slot="icon" :color="item.state"/>
			</van-grid-item>
		</van-grid>
		<van-popup v-model="config.popup.qrcode.show" position="top" :style="{ height : '100%', width: '100%'}">
			<div class="van-nav-bar van-nav-bar--fixed van-hairline--bottom" style="z-index: 1;">
				<div class="van-nav-bar__title van-ellipsis">
					当前账号登录二维码
				</div>
			</div>
			<div id="qrcode" class="qrcode"></div>
			<van-button type="primary" size="normal" style="position:fixed;bottom:0;width:100%;" @click="config.popup.qrcode.show = false">
				关闭
			</van-button>
		</van-popup>
		<van-popup v-model="config.popup.changePass.show" position="top" :style="{ height : '100%', width: '100%'}">
			<div class="van-nav-bar van-nav-bar--fixed van-hairline--bottom" style="z-index: 1;">
				<div class="van-nav-bar__title van-ellipsis">
					修改密码
				</div>
			</div>
			<div style="margin-top:2.875rem;"></div>
			<van-field v-model="formData.account" label="账号" input-align="center"  readonly />
			<van-field v-model="formData.oldPass" label="原密码" input-align="center"  type="password" required/>
			<van-field v-model="formData.newPass" label="新密码" input-align="center"  type="password" maxlength="6" required/>
			<van-field v-model="formData.confirmPass" label="确认新密码" input-align="center" type="password" maxlength="6" required/>
			<div style="text-align:center;">
				<van-button type="primary" size="normal" style="width:40%;" @click="changeClick()">
					提交
				</van-button>&nbsp;&nbsp;&nbsp;&nbsp;
				<van-button type="primary" size="danger" style="width:40%;" @click=" config.popup.changePass.show = false ">
					取消
				</van-button>
			</div>
		</van-popup>
	</div>
</template>
<script>
	import { Button, Cell, Icon, Popup, Field, Toast, Grid, GridItem } from 'vant';
	import QRCode from 'qrcodejs2';
	import schema from 'async-validator';
	import base from '@/request/base';
	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Field.name]: Field,
			[Toast.name]: Toast,
			[Grid.name]: Grid,
			[GridItem.name]: GridItem,
		},
		/*
		state: #1a991d -> 已完成, #eff30c -> 正在开发 , #0b27f1 -> 未开发 
		 */
		data(){	
			return {
				config:{
					gridItem:[
						{text:'信用余额',     iconName:'xinyongyue',  url:'/client/cred/wGetCusAmt',state:'#1a991d'},
						{text:'报价规则',     iconName:'tichengguize',url:'/client/quo/getQuoRuleByCus',state:'#1a991d'},
						{text:'报价价格',     iconName:'jiagechaxun', url:'/client/quo/getQuoPriceByCus',state:'#1a991d'},
						{text:'对账单',       iconName:'duizhang',    url:'/client/order/getCusFreeMB',state:'#1a991d'},
						{text:'每日订单',     iconName:'meiri',       url:'/client/order/getOrdersP',state:'#1a991d'},
						{text:'ERP订单',      iconName:'erp',         url:'/client/order/getOrders',state:'#1a991d'},
						{text:'常用材质',     iconName:'caizhi',      url:'/client/usedboard/lists',state:'#1a991d'},
						{text:'常用订单',     iconName:'dingdan1',    url:'/client/usedorder/lists',state:'#1a991d'},
						{text:'微信订单',     iconName:'shouji',      url:'/client/wxorder/lists',state:'#1a991d'},
						{text:'淘宝箱下单',     iconName:'zhixiang1',   url:'/client/build/x',state:'#1a991d'},
						{text:'纸箱下单', iconName:'zhixiang',    url:'/client/build/c',state:'#1a991d'},
						{text:'纸板下单', iconName:'mobancaidan', url:'/client/build/s',state:'#1a991d'},
					],
					authGrid:[],
					popup:{
						qrcode:{
							show:false
						},
						changePass:{
							show:false
						}
					}
				},
				userName:'',
				loginUrl:'',
				formData:{
					account     : '',
					oldPass     : '',
					newPass     : '',
					confirmPass : '',
				},
				validator:{},
				rules:{
					oldPass : [
						{  require : true, message: '请填写原密码' },
						{  type:'string' , regexp:'/^[0-9a-zA-Z]{2,12}$/' , message: '原密码不符合规则' },
					],
					newPass : [
						{  require : true, message: '请填写新密码' },
						{  type:'string' , regexp: '/^[0-9a-zA-Z]{6,12}$/', message: '新密码不符合规则' }
					],
					confirmPass : [
						{  require : true, message: '请填写确认密码' },
						{  confirmPass(rule, value, callback, source, options){
							let errors = [];
							if( value !== source.newPass ){
								errors.push(new Error('两次密码输入不一致'));
							}
							return errors;
						}}
					]
				}
			}
		},
		methods:{
			qrClick(){
				this.config.popup.qrcode.show = true;
				this.getQrcode();
			},
			getQrcode(){
				let self = this;
				this.$request.staff.user.getQrcode().then(res=>{
					self.loginUrl = base.wxRediect + '/group/client/login?token=' + res.result;
				}).then(()=>{
					document.getElementById('qrcode').innerHTML = '';
					new QRCode('qrcode',{
						text         : this.loginUrl,
				     	colorDark    : '#000000',
				      	colorLight   : '#ffffff',
				      	correctLevel : QRCode.CorrectLevel.H
					});
				});
			},
			getChangePass(){
				this.formData.account = sessionStorage.getItem('jpdn-client-username');
				this.config.popup.changePass.show = true ;
			},
			changeClick(){
				let self = this;
				this.validator.validate(this.formData).then(()=>{
					self.changePass( self.formData );
				}).then(()=>{
					Toast.fail(errors[0].message);
				});
			},
			changePass( data ){
				let self = this;
				this.$request.client.other.changePass( data ).then(res=>{
					if( res.errorCode === '00000' ){
						Toast.success('密码更新成功');
						self.config.popup.changePass.show = false;
					}else{
						Toast.fail('密码更新失败');
					}
				}),then(()=>{
					this.formData.oldPass     = '';
					this.formData.newPass     = '';
					this.formData.confirmPass = '';
				});
			},
			authGrid( authName ){
				if( sessionStorage.getItem('client-auth-grid') ){
					this.config.authGrid = JSON.parse(sessionStorage.getItem('client-auth-grid'));
					return ;
				}
				for (var i = this.config.gridItem.length - 1; i >= 0; i--) {
					for (var j = authName.length - 1; j >= 0; j--) {
						if( authName[j] == this.config.gridItem[i].text ){
							this.config.authGrid.push(this.config.gridItem[i]);
							break;
						}
					}
				}
				sessionStorage.setItem('client-auth-grid',JSON.stringify(this.config.authGrid) );
			},
			
		},
		created(){
			this.$store.commit('client/setHeaderTitle','菜单页面');
		},
		mounted(){
			this.userName = sessionStorage.getItem('jpdn-client-username');
			this.validator = new schema(this.rules);
			this.authGrid( JSON.parse(sessionStorage.getItem('client-auth-url')) );
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>
<style>
	.qrcode img{
		margin:50% auto;
		width:60%;
	}
</style>
