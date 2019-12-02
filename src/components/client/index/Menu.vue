<template>
	<div>
		<div style="margin-top:10px;"></div>
		<div class="vant-row">
			<div class="van-col van-col--6">
				<div class="van-tabbar-item" style="height:44px;">账号：{{ userName }}</div>
			</div>
			<div class="van-col van-col--8">
				<van-button type="info"  plain hairline round @click="getChangePass()">
					<van-icon class-prefix="iconfont" size="16" name="iconfontmima"/>
					更改密码
				</van-button>
			</div>
			<div class="van-col van-col--10">
				<van-button type="info" plain hairline round @click="qrClick">
					<van-icon class-prefix="iconfont" size="16" name="erweima2"/>
					登录二维码
				</van-button>
			</div>
		</div>
		<div style="width:100%;height:50px;"></div>
		<van-grid square :gutter="10" :column-num="3">
			<van-grid-item v-for="(item,index) in config.gridItem" :key="index" :url="item.url" :text="item.text">
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
			<div style="margin-top:46px;"></div>
			<van-field v-model="formData.account" label="账号" input-align="center"  readonly />
			<van-field v-model="formData.oldPass" label="原密码" input-align="center"  type="password" required/>
			<van-field v-model="formData.newPass" label="新密码" input-align="center"  type="password" maxlength="6" required/>
			<van-field v-model="formData.confirmPass" label="确认新密码" input-align="center" type="password" maxlength="6" required/>
			<div class="van-row van-row--flex van-row--justify-space-between" style="position:fixed;bottom:0;width:100%;">
				<div class="van-col van-col--10">
					<van-button type="primary" size="normal" style="width:100%;" @click="changeClick()">
						提交
					</van-button>
				</div>
				<div class="van-col van-col--10">
					<van-button type="primary" size="danger" style="width:100%;" @click=" config.popup.changePass.show = false ">
						取消
					</van-button>
				</div>
			</div>
			
			
		</van-popup>
	</div>
</template>
<script>
	import { Button, Cell, Icon, Popup, Field, Toast, Grid, GridItem } from 'vant';
	import QRCode from 'qrcodejs2';
	import schema from 'async-validator';
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
		state: #0bf147 -> 已完成, #eff30c -> 正在开发 , #0b27f1 -> 未开发 
		 */
		data(){	
			return {
				config:{
					gridItem:[
						{text:'简单纸板下单', iconName:'mobancaidan', url:'',state:'#0b27f1'},
						{text:'纸箱纸板下单', iconName:'zhixiang',    url:'',state:'#0b27f1'},
						{text:'纸箱下单',     iconName:'zhixiang1',   url:'',state:'#0b27f1'},
						{text:'微信订单',     iconName:'shouji',      url:'',state:'#0b27f1'},
						{text:'常用订单',     iconName:'dingdan1',    url:'',state:'#0b27f1'},
						{text:'常用材质',     iconName:'caizhi',      url:'',state:'#0b27f1'},
						{text:'ERP订单',      iconName:'erp',         url:'/client/order/getOrders',state:'#eff30c'},
						{text:'每日订单',     iconName:'meiri',       url:'',state:'#0b27f1'},
						{text:'对账单',       iconName:'duizhang',    url:'',state:'#0b27f1'},
						{text:'报价价格',     iconName:'jiagechaxun', url:'/client/quo/getQuoPriceByCus',state:'#0bf147'},
						{text:'报价规则',     iconName:'tichengguize',url:'/client/quo/getQuoRuleByCus',state:'#0bf147'},
						{text:'信用余额',     iconName:'xinyongyue',  url:'/client/cred/wGetCusAmt',state:'#0bf147'},
					],
					authGrid:[],
					domian:{
						wx80:'http://luodangfrp2.leaper.ltd',
						normal:'http://test.leaper.ltd:1104'
					},
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
			portValuable(){
				if( sessionStorage.getItem('app_domain') !== null ){
					let domainInfo = JSON.parse(sessionStorage.getItem('app_domain'));
					this.config.domian.wx80   = domainInfo.app_wx_domain;
					this.config.domian.normal = domainInfo.app_normal_domain;
				}
				let self = this;
				this.$request.staff.wx.portValuable().then(res=>{
					sessionStorage.setItem('app_domain',JSON.stringify(res.result));
					this.config.domian.wx80   = res.result.app_wx_domain;
					this.config.domian.normal = res.result.app_normal_domain;
				});
			},
			qrClick(){
				this.config.popup.qrcode.show = true;
				this.getQrcode();
			},
			getQrcode(){
				let self = this;
				this.$request.staff.user.getQrcode().then(res=>{
					self.loginUrl = 'http://test.leaper.ltd:1104/login/select?token=' + res.result;
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
				this.formData.account = sessionStorage.getItem('jpdn-login-username');
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
				this.$request.staff.user.changePass( data ).then(res=>{
					if( res.result.errorCode === '00000' ){
						Toast.success('密码更新成功');
						self.config.popup.changePass.show = false;
					}
				}).catch(()=>{
					Toast.fail('密码更新失败');
				});
			},
			authGrid( authName ){
				if( sessionStorage.getItem('auth-grid') ){
					this.config.authGrid =  JSON.parse(sessionStorage.getItem('auth-grid'));
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
				sessionStorage.setItem('auth-grid',JSON.stringify(this.config.authGrid) );
			},
			
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','菜单页面');
		},
		mounted(){
			this.userName = sessionStorage.getItem('jpdn-login-username');
			//this.portValuable();
			this.validator = new schema(this.rules);
			/*this.config.gridItem.forEach((item,index)=>{
				if( item.text == '原纸出库' || item.text == '原纸入库' || item.text == '直接入库' || item.text == '扫描装货' || item.text == '库存修改'){
					item.url = this.config.domian.wx80 + item.url;
				}else{
					item.url = this.config.domian.normal + item.url;
				}
			});*/
			//this.authGrid( JSON.parse(sessionStorage.getItem('auth-url') ) );
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
