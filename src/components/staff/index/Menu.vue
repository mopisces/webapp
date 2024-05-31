<template>
	<div clss="menu-container" :style="'min-height: '+ viewH/16 +'rem;background-color:#f1f1f'">
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
			<van-grid-item v-for="(item,index) in config.authGrid" :key="index" :url="item.url" :text="item.text">
				<van-icon class-prefix="iconfont" size="35" :name="item.iconName" slot="icon" color="#1a991d"/>
			</van-grid-item>
		</van-grid>
		<van-popup 
			v-model="config.popup.qrcode.show" 
			:style="{ height : '45%', width: '85%'}"
			round
		>
			<div id="qrcode" class="qrcode"></div>
		</van-popup>
		<van-popup 
			v-model="config.popup.changePass.show" 
			:style="{ height : '15rem', width: '85%'}" 
			round
			@closed="changePassClose"
		>
			<div style="padding: 0rem 0.75rem;">
				<van-field v-model="formData.account" label="账号" input-align="center"  readonly />
				<van-field v-model="formData.oldPass" label="原密码" input-align="center"  type="password" required/>
				<van-field v-model="formData.newPass" label="新密码" input-align="center"  type="password" maxlength="6" required/>
				<van-field v-model="formData.confirmPass" label="确认新密码" input-align="center" type="password" maxlength="6" required/>
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
						{text:'客户查询',role:'客户查询',iconName:'kehu',url: '/staff/customer/customerInfo'},
						{text:'客户往来统计',role:'客户往来统计',iconName:'kehu',url: '/staff/frec/cusContact'},
						{text:'收款调账',role:'收款调账',iconName:'yewutiaozhang',url:'/staff/frec/recAdjust'},
						{text:'订单试算',role:'订单试算',iconName:'jisuanqi',url:'/staff/calc/index'},
						{text:'库区面积',role:'库区面积',iconName:'fangwumianji',url:'/staff/stock/deliveryArea'},
						{text:'库存修改',role:'库存修改',iconName:'iconfontzhizuobiaozhunbduan24',url:'/staff/stock/mStockDetailR'},
						{text:'扫描装货',role:'扫描装货',iconName:'zhuangche1',url:'/staff/stow/lists'},
						/*{text:'库存预计',role:'',iconName:'kucun1',url:'/staff/paper/getExpectStock'},*/
						{text:'安全库存',role:'安全库存',iconName:'anquanmenhu',url:'/staff/paper/paperSafe'},
						{text:'原纸库存',role:'原纸库存',iconName:'weishengzhi',url:'/staff/paper/getSStocks'},
						{text:'直接入库',role:'直接入库',iconName:'ruku2',url:'/staff/paper/directInStock'},
						{text:'原纸入库',role:'原纸入库',iconName:'ruku',url:'/staff/paper/doRStockIn'},
						{text:'原纸出库',role:'原纸出库',iconName:'ccgl-chukucaozuo-5',url:'/staff/paper/doStockOut'},
						{text:'原纸日用量',role:'原纸日用量',iconName:'rili1',url:'/staff/paper/dailyUsed'},
						{text:'原纸收货',role:'原纸收货',iconName:'che2',url:'/staff/paperbuy/wGetPOIn'},
						{text:'原纸采购',role:'原纸采购',iconName:'caigou',url:'/staff/paperbuy/wGetPOMain'},
						{text:'生产分析总计',role:'生产分析总计',iconName:'shengchan',url:'/staff/statis/getProInfo'},
						/*{text:'生产分析总计2',role:'生产分析总计',iconName:'shengchan',url:'/staff/statis/getProInfo2'},*/
						{text:'库存统计',role:'库存统计',iconName:'storage',url:'/staff/statis/getOrdStock'},
						{text:'传单统计',role:'传单统计',iconName:'chuandan',url:'/staff/statis/getSchSum'},
						{text:'退货统计',role:'退货统计',iconName:'tuihuo1',url:'/staff/statis/getOrdReturnSum'},
						{text:'订单统计',role:'订单统计',iconName:'dingdan2',url:'/staff/statis/getOrderSum'},
						{text:'订单统计2', role:'订单统计', iconName:'dingdan2',  url:'/staff/statis/getOrderSum2'},
						{text:'客户信用余额',role:'客户信用余额',iconName:'xinyongyue',url:'/staff/cred/wGetCusAmt'},
						{text:'客户每日订单',role:'客户每日订单',iconName:'meiri',url:'/staff/daily/wGetCusOrder'},
						{text:'ERP订单',role:'ERP订单',iconName:'erp',url:'/staff/erp/getOrders'},
						{text:'用户管理',role:'用户管理',iconName:'guanwangicon31334',url:'/staff/user/manage'},
						{text:'接单统计',role:'接单统计',iconName:'daquxindai',url:'/staff/statis/saleStatis'},
						{text:'客户每日送货',role:'客户每日送货',iconName:'chanpin',url:'/staff/delivery/daily'},
						{text:'报价查询',role:'报价查询',iconName:'tichengguize',url:'/staff/quo/customerQuo'},
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
						{  type:'string' , pattern:'^[0-9a-zA-Z]{1,6}$' , message: '原密码不符合规则' },
					],
					newPass : [
						{  require : true, message: '请填写新密码' },
						{  type:'string' , pattern: '^[0-9a-zA-Z]{1,6}$', message: '新密码不符合规则' }
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
				},
				authUrl:[], //后台权限
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
					self.loginUrl = window.jpdn_domain_wxRediect + 'group/staff/login?token=' + res.result;
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
				this.formData.account = getStorage('jpdn-staff-username');
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
					if( res.errorCode === '00000' ){
						Toast.success('密码更新成功');
						self.config.popup.changePass.show = false;
						self.$router.push('/group/staff/login');
					}else{
						Toast.fail('密码更新失败');
					}
				}).then(()=>{
					this.formData.oldPass     = '';
					this.formData.newPass     = '';
					this.formData.confirmPass = '';
				});
			},
			authGrid( authName ){
				for (var i = this.config.gridItem.length - 1; i >= 0; i--) {
					for (var j = authName.length - 1; j >= 0; j--) {
						if( authName[j] == this.config.gridItem[i].role ){
							this.config.authGrid.push(this.config.gridItem[i]);
							break;
						}
					}
				}

			},
			changePassClose() {
				this.formData = this.$options.data().formData
			},
			getMenuUserName(){
				let self = this;
				this.$request.staff.user.getMenuUserName().then(res=>{
					if( res.errorCode == '00000' ){
						self.userName = res.result.user_name + '(' + res.result.ERPId + ')';
					}
				});
			},
			getAuthName(){
				let self = this;
				this.$request.staff.user.getAuthName({ userName:getStorage('jpdn-staff-username') }).then(res=>{
					if( res.errorCode != '00000' ){
						return ;
					}
					self.authUrl = res.result.available;
					setStorage('staff-auth-url', res.result.available);
					self.$store.commit('staff/setNavList',null);
				}).then(()=>{
					this.$nextTick(()=>{
						this.authGrid( this.authUrl );
					});
				});
			},
			logout(){
				Dialog.confirm({
					message: '确认退出?'
				}).then(() => {
					removeStorage('jpdn-staff-token', 'sessionStorage');
					removeStorage('jpdn-staff-refresh', 'sessionStorage');
					removeStorage('staff-auth-url');
					setStorage('jpdn-staff-isLogin', 0, 'sessionStorage');
					this.$store.commit('staff/setIsLogin', 0);
					this.$router.push('/group/staff/login');
					this.$store.dispatch('user/logout')
				}).catch(()=>{
					Dialog.close()
				});
			},
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','菜单页面');
			this.getMenuUserName();
			this.authGrid( this.$store.getters['user/authMap'] );
			console.log(typeof(this.$store.getters['user/authMap']))
			//this.getAuthName();
		},
		mounted(){
			this.validator = new schema(this.rules);
		},
		computed:{
			...window.Vuex.mapGetters({
				viewH: 'page/viewH',
			})
		},
		watch:{

		}
	}
</script>
<style>
	@import '~@/assets/style/card.css';
	.menu-header {
		padding-top: 0.25rem;
		margin-bottom: 0.5rem;
	}

	.menu-container {
		display: flex;
		flex-direction: column;
		padding: 0.75rem;
	}

	.qrcode img{
		margin:50% auto;
		width:60%;
	}
</style>
