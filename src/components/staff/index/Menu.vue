<template>
	<div style="background-color:#f1f1f1;">
		<div style="width:100%;height:0.625rem;"></div>
		<div class="vant-row">
			<div class="van-col van-col--6">
				<div class="van-tabbar-item" style="height:2.75rem;">账号：{{ userName }}</div>
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
		<div style="width:100%;height:3.75rem;"></div>
		<van-grid square :gutter="10" :column-num="3">
			<van-grid-item v-for="(item,index) in config.authGrid" :key="index" :url="item.url" :text="item.text">
				<van-icon class-prefix="iconfont" size="35" :name="item.iconName" slot="icon" :color="item.state"/>
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
		state: #1a991d -> 已完成, #eff30c -> 正在开发 , #0b27f1 -> 未开发 
		 */
		data(){	
			return {
				config:{
					gridItem:[
						{text:'客户往来统计',iconName:'kehu',url: '/staff/frec/cusContact',state:'#1a991d'},
						{text:'收款调账',iconName:'yewutiaozhang',url:'/staff/frec/recAdjust',state:'#1a991d'},
						{text:'订单试算',iconName:'jisuanqi',url:'/staff/calc/index',state:'#1a991d'},
						{text:'库区面积',iconName:'fangwumianji',url:'/staff/stock/deliveryArea',state:'#1a991d'},
						{text:'库存修改',iconName:'iconfontzhizuobiaozhunbduan24',url:'/staff/stock/mStockDetailR',state:'#1a991d'},
						{text:'扫描装货',iconName:'zhuangche1',url:'/staff/stow/lists',state:'#1a991d'},
						{text:'安全库存',iconName:'anquanmenhu',url:'/staff/paper/paperSafe',state:'#1a991d'},
						{text:'原纸库存',iconName:'weishengzhi',url:'/staff/paper/getSStocks',state:'#1a991d'},
						{text:'直接入库',iconName:'ruku2',url:'/staff/paper/directInStock',state:'#1a991d'},
						{text:'原纸入库',iconName:'ruku',url:'/staff/paper/doRStockIn',state:'#1a991d'},
						{text:'原纸出库',iconName:'ccgl-chukucaozuo-5',url:'/staff/paper/doStockOut',state:'#1a991d'},
						{text:'原纸收货',iconName:'che2',url:'/staff/paperbuy/wGetPOIn',state:'#1a991d'},
						{text:'原纸采购',iconName:'caigou',url:'/staff/paperbuy/wGetPOMain',state:'#1a991d'},
						{text:'生产分析总计',iconName:'shengchan',url:'/staff/statis/getProInfo',state:'#1a991d'},
						{text:'库存统计',iconName:'storage',url:'/staff/statis/getOrdStock',state:'#1a991d'},
						{text:'传单统计',iconName:'chuandan',url:'/staff/statis/getSchSum',state:'#1a991d'},
						{text:'退货统计',iconName:'tuihuo1',url:'/staff/statis/getOrdReturnSum',state:'#1a991d'},
						{text:'订单统计',iconName:'dingdan2',url:'/staff/statis/getOrderSum',state:'#1a991d'},
						{text:'客户信用余额',iconName:'xinyongyue',url:'/staff/cred/wGetCusAmt',state:'#1a991d'},
						{text:'客户每日订单',iconName:'meiri',url:'/staff/daily/wGetCusOrder',state:'#1a991d'},
						{text:'ERP订单',iconName:'erp',url:'/staff/erp/getOrders',state:'#1a991d'},
						{text:'用户管理',iconName:'guanwangicon31334',url:'/staff/user/manage',state:'#1a991d'},
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
						{  type:'string' , pattern:'^[0-9a-zA-Z]{2,12}$' , message: '原密码不符合规则' },
					],
					newPass : [
						{  require : true, message: '请填写新密码' },
						{  type:'string' , pattern: '^[0-9a-zA-Z]{6,12}$', message: '新密码不符合规则' }
					],
					confirmPass : [
						{  require : true, message: '请填写确认密码' },
						{  validator: (rule, value, callback, source, options) => {
							let errors;
							if( value !== source.newPass ){
								errors = '两次密码输入不一致';
							}
							callback(errors);
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
					self.loginUrl = 'http://test.leaper.ltd:1104/group/login?token=' + res.result;
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
				}).catch(({ errors, fields })=>{
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
			this.portValuable();
			this.validator = new schema(this.rules);
			/*this.config.gridItem.forEach((item,index)=>{
				if( item.text == '原纸出库' || item.text == '原纸入库' || item.text == '直接入库' || item.text == '扫描装货' || item.text == '库存修改'){
					item.url = this.config.domian.wx80 + item.url;
				}else{
					item.url = this.config.domian.normal + item.url;
				}
			});*/
			this.authGrid( JSON.parse(sessionStorage.getItem('auth-url') ) );
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
