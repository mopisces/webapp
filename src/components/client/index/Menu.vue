<template>
	<div clss="menu-container" :style="'min-height: '+ viewH/16 +'rem;background-color:#f1f1f1;'">
		<div class="page-color menu-header">
			<card :is-shadow="true">
				<div class="card-body-container">
					<div class="card-body-item card-body-item-100">
						<span>
							{{ userName }}
						</span>
					</div>
				</div>
				<div slot="actions" class="card-actions">
					<div class="card-actions-item" @click="getChangePass()">
						<van-icon color="#3c9cff" class-prefix="iconfont" name="iconfontmima" size="18"/>
						<span class="card-actions-item-text blue-color">更改密码</span>
					</div>
					<div class="card-actions-item" @click="qrClick">
						<van-icon color="#3c9cff" class-prefix="iconfont" name="erweima2" size="18"/>
						<span class="card-actions-item-text blue-color">登录二维码</span>
					</div>
					<div class="card-actions-item" @click="logout()">
						<van-icon color="#3c9cff" class-prefix="iconfont" name="logout" size="18"/>
						<span class="card-actions-item-text blue-color">退出登录</span>
					</div>
				</div>
			</card>
		</div>
		
		<van-grid square :gutter="10" :column-num="4">
			<van-grid-item 
				v-for="(item,index) in config.authGrid" 
				:key="index" 
				:text="item.text"
				:url="item.url"
			>
				<van-icon class-prefix="iconfont" size="28" :name="item.iconName" slot="icon" color="#1a991d"/>
			</van-grid-item>
		</van-grid>
		<van-popup v-model="config.popup.qrcode.show" :style="{ height: '45%', width: '85%'}" round>
			<div id="qrcode" class="qrcode"></div>
		</van-popup>
		<van-popup 
			v-model="config.popup.changePass.show" 
			:style="{ height : '15rem', width: '85%'}" 
			round 
			@closed="changePassClose"
		>
			<div style="padding: 0rem 0.75rem;">
				<van-field v-model="formData.account" label="账号" input-align="center"  readonly required/>
				<van-field v-model="formData.oldPass" label="原密码" input-align="center"  required />
				<van-field v-model="formData.newPass" label="新密码" input-align="center"  maxlength="6" required/>
				<van-field v-model="formData.confirmPass" label="确认新密码" input-align="center" maxlength="6" required/>
				<div style="text-align:center;padding-top:0.5rem;">
					<van-button type="primary" size="normal" style="width:45%;" @click="changeClick()">
						提交
					</van-button>
				</div>
			</div>
			
		</van-popup>
	</div>
</template>
<script>
	import { Button, Col, Row, Cell, Icon, Popup, Field, Dialog, Toast, Grid, GridItem } from 'vant';
	import { urlWhiteList, clearLogin } from '@/util'
	import QRCode from 'qrcodejs2';
	import schema from 'async-validator';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';
	/*自定义卡片组件*/
	import Card from "@/components/subject/card/Card.vue"

	export default {
		components:{
			[Button.name]: Button,
			[Col.name]: Col,
			[Row.name]: Row,
			[Cell.name]: Cell,
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Field.name]: Field,
			[Toast.name]: Toast,
			[Grid.name]: Grid,
			[GridItem.name]: GridItem,

			Card
		},
		/*
		state: #1a991d -> 已完成, #eff30c -> 正在开发 , #0b27f1 -> 未开发 
		 */
		data(){	
			return {
				config:{
					gridItem:[
						{text:'客户信用余额明细', role:'客户信用余额明细', iconName:'mianfeibaojia',  url:'/client/statement/balStatement'},
						{text:'订单统计', role:'订单统计', iconName:'dingdan2',  url:'/client/statis/amountStatis'},
						{text:'开票信息', role:'开票信息', iconName:'iconddsh',  url:'/client/bill/billCenter'},
						{text:'客户信用余额明细2', role:'客户信用余额明细', iconName:'yewutiaozhang2',  url:'/client/cred/wGetCusDetail'},
						{text:'信用余额', role:'信用余额', iconName:'xinyongyue',  url:'/client/cred/wGetCusAmt'},
						{text:'报价规则', role:'报价查询', iconName:'tichengguize',url:'/client/quo/getQuoRuleByCus'},
						{text:'报价价格', role:'报价查询', iconName:'jiagechaxun', url:'/client/quo/getQuoPriceByCus'},
						{text:'对账单',   role:'对账单', iconName:'duizhang',    url:'/client/order/getCusFreeMB'},
						{text:'每日订单', role:'每日订单', iconName:'meiri',       url:'/client/order/getOrdersP'},
						{text:'每日送货', role:'每日送货', iconName:'chanpin',       url:'/client/delivery/daily'},
						{text:'ERP订单', role:'ERP订单', iconName:'erp',         url:'/client/order/getOrders'},
						{text:'常用材质', role:'纸板下单', iconName:'caizhi',      url:'/client/usedboard/lists'},
						{text:'常用订单', role:'纸板下单', iconName:'dingdan1',    url:'/client/usedorder/lists'},
						{text:'微信订单', role:'微信订单', iconName:'shouji',      url:'/client/wxorder/lists'},
						{text:'纸箱下单', role:'纸箱下单', iconName:'zhixiang1',   url:'/client/build/x'},
						{text:'纸箱纸板下单', role:'纸板下单', iconName:'zhixiang', url:'/client/build/c'},
						{text:'简单纸板下单', role:'纸板下单', iconName:'mobancaidan', url:'/client/build/s'},
						{text:'纸箱纸板下单', role:'纸板支付下单', iconName:'jiage1',    url:'/client/buildpay/c', name:'cBuildPay'},
						{text:'简单纸板下单', role:'纸板支付下单', iconName:'jiage1', url:'/client/buildpay/s', name:'sBuildPay'},
						{text:'往来统计', role:'往来统计', iconName:'kehu', url:'/client/frec/statisContact'},
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
						{  type:'string' , regexp:'/^[0-9a-zA-Z]{1,6}$/' , message: '原密码不符合规则' },
					],
					newPass : [
						{  require : true, message: '请填写新密码' },
						{  type:'string' , regexp: '/^[0-9a-zA-Z]{1,6}$/', message: '新密码不符合规则' }
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
				},
				authUrl: [], //后台权限
			}
		},
		methods:{
			qrClick(){
				this.config.popup.qrcode.show = true
				this.getQrcode()
			},
			getQrcode(){
				let self = this;
				this.$request.staff.user.getQrcode().then(res=>{
					self.loginUrl = window.jpdn_domain_wxRediect + 'group/client/login?token=' + res.result
				}).then(()=>{
					document.getElementById('qrcode').innerHTML = ''
					new QRCode('qrcode',{
						text: this.loginUrl,
				     	colorDark: '#000000',
				      	colorLight: '#ffffff',
				      	correctLevel: QRCode.CorrectLevel.H
					});
				});
			},
			getChangePass(){
				this.formData.account = getStorage('jpdn-client-username');
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
				this.$request.client.other.changePass( data ).then(res=>{
					if( res.errorCode === '00000' ){
						Toast.success('密码更新成功')
						this.config.popup.changePass.show = false
						this.$router.push('/group/client/login')
					}else{
						Toast.fail('密码更新失败')
					}
				}),then(()=>{
					this.formData.oldPass= ''
					this.formData.newPass= ''
					this.formData.confirmPass = ''
				});
			},
			authGrid( authName ){
				for (var i = this.config.gridItem.length - 1; i >= 0; i--) {
					for (var j = authName.length - 1; j >= 0; j--) {
						if( authName[j] == this.config.gridItem[i].role || this.config.gridItem[i].role == '基础权限'){
							this.config.authGrid.push(this.config.gridItem[i]);
							break;
						}
					}
				}
			},
			changePassClose() {
				this.formData = this.$options.data().formData
			},
			getAuthMap(){
				let self = this;
				this.$request.staff.user.getAuthName( {UserName:getStorage('jpdn-client-username')} ).then(res=>{
					if( res.errorCode != '00000' ){
						return ;
					}
					self.authUrl = res.result.available;
					setStorage('client-auth-url',res.result.available);
					self.$store.commit('client/setNavList',null);
				}).then(()=>{
					this.$nextTick(()=>{
						this.authGrid( this.authUrl );
					})
				});
			},
			getMenuUserName(){
				let self = this;
				this.$request.client.other.getMenuUserName().then(res=>{
					if( res.errorCode == '00000' ){
						self.userName = res.result.short_name + '(' + res.result.ERPId + ')';
					}
				});
			},
			/*外部用户退出登录*/
			logout() {
				Dialog.confirm({
					message: '确认退出?'
				}).then(() => {
					clearLogin()
					this.$router.push('/group/client/login')
					this.$store.commit('client/setTabbarActive', 'clogin')
					this.$store.dispatch('user/logout')
				}).catch(()=>{
					Dialog.close()
				})
			},
		},
		async created(){
			this.$store.commit('client/setHeaderTitle','菜单页面');
			this.$store.commit('client/setTabbarActive','menu');
			await this.getAuthMap();
			await this.getMenuUserName();
		},
		mounted(){
			this.validator = new schema(this.rules)
		},
		computed:{
			...window.Vuex.mapGetters({
				viewH: 'page/viewH',
			})
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>
<style>
	@import '~@/assets/style/card.css';

	.qrcode img{
		margin: 15% auto;
		width: 60%;
	}
	.menu-container {
		display: flex;
		flex-direction: column;
		padding: 0.75rem;
	}

	.menu-header {
		padding-top: 0.25rem;
		margin-bottom: 0.5rem;
	}
	
</style>
