<!-- 外部用户菜单 -->
<template>
	<div class="page-color" :style="'min-height: '+ viewH/16 +'rem;'">
		<!-- 头部信息 -->
		<div class="menu-header">
			<card :is-shadow="true">
				<div class="card-body-container">
					<div class="card-body-item card-body-item-100">
						<span>
							{{ userInfo.ChiName+'('+userInfo.ERPId+')' }}
						</span>
					</div>
				</div>
				<div slot="actions" class="card-actions">
					<div class="card-actions-item" @click="setPwd()">
						<van-icon color="#3c9cff" class-prefix="iconfont" name="iconfontmima" size="18"/>
						<span class="card-actions-item-text blue-color">更改密码</span>
					</div>
					<div class="card-actions-item" @click="qrClick()">
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
		
		<div style="margin-top: 1rem;">
			<van-grid square :gutter="10" :column-num="4">
				<van-grid-item 
					v-for="(item,index) in config.mockList.indexList" 
					:key="index" 
					:text="item.text"
					:url="item.url"
				>
					<van-icon class-prefix="iconfont" size="28" :name="item.iconName" slot="icon" color="#1a991d"/>
				</van-grid-item>
			</van-grid>
		</div>

		<!-- <div class="menu-grid"> -->
			<!-- 客户管理 -->
			<!-- <div 
				class="user-menu-box mg-top-20"
				v-if="config.mockList.buildOrdItem.length > 0"
			>
				<div class="user-menu-box-header">
					<div class="box-header-title">下单管理</div>
					<div class="box-header-sub"></div>
				</div>
				<div class="user-menu-order-list user-menu-flex-wrap">
					<div class="user-menu-item-25" 
						v-for="(item,idx) in config.mockList.buildOrdItem" 
						:key="idx"
						@click="openPage(item)"
					>
						<div class="karry-icon-box">
							<van-icon 
								class="karry-paper-icon" 
								color="#1a991d" 
								class-prefix="iconfont" 
								:name="item.iconName" 
								size="1.5rem"
							/>
						</div>
						<div class="karry-order-text">
							{{ item.text }}
						</div>
					</div>
				</div>
			</div> -->


			<!-- 订单管理 -->
			<!-- <div 
				class="user-menu-box mg-top-20"
				v-if="config.mockList.ordManageItem.length > 0"
			>
				<div class="user-menu-box-header">
					<div class="box-header-title">订单管理</div>
					<div class="box-header-sub"></div>
				</div>
				<div class="user-menu-order-list user-menu-flex-wrap">
					<div class="user-menu-item-25" 
						v-for="(item,idx) in config.mockList.ordManageItem" 
						:key="idx"
						@click="openPage(item)"
					>
						<div class="karry-icon-box">
							<van-icon 
								class="karry-paper-icon" 
								color="#1a991d" 
								class-prefix="iconfont" 
								:name="item.iconName" 
								size="1.5rem"
							/>
						</div>
						<div class="karry-order-text">
							{{ item.text }}
						</div>
					</div>
				</div>
			</div> -->

			<!-- 我的工具 -->
			<!-- <div 
				class="user-menu-box mg-top-20"
				v-if="config.mockList.toolItem.length > 0"
			>
				<div class="user-menu-box-header">
					<div class="box-header-title">我的工具</div>
					<div class="box-header-sub"></div>
				</div>
				<div class="user-menu-order-list user-menu-flex-wrap">
					<div class="user-menu-item-25" 
						v-for="(item,idx) in config.mockList.toolItem" 
						:key="idx"
						@click="openPage(item)"
					>
						<div class="karry-icon-box">
							<van-icon 
								class="karry-paper-icon" 
								color="#1a991d" 
								class-prefix="iconfont" 
								:name="item.iconName" 
								size="1.5rem"
							/>
						</div>
						<div class="karry-order-text">
							{{ item.text }}
						</div>
					</div>
				</div>
			</div> -->

		<!-- </div> -->
	
		<!-- 二维码弹出层 -->
		<van-popup 
			v-model="config.popup.qrcode.show" 
			:style="{ height : '10rem', width: '10rem'}"
			round
		>
			<div id="qrcode" class="qrcode"></div>
		</van-popup>
		<!-- 修改密码弹窗 -->
		<van-popup 
			v-model="config.popup.changePwd.show" 
			:style="{ height : '15rem', width: '85%'}" 
			round
			@closed="pwdClose"
		>
			<div class="change-pwd-container">

				<van-field 
					v-model="formData.account" 
					label="账号" 
					input-align="center"  
					readonly 
				/>
				<van-field 
					v-model="formData.oldPass" 
					label="原密码" 
					input-align="center"  
					type="password" 
					required
				/>
				<van-field 
					v-model="formData.newPass" 
					label="新密码" 
					input-align="center"  
					type="password" 
					maxlength="6" 
					required
				/>
				<van-field 
					v-model="formData.confirmPass" 
					label="确认新密码" 
					input-align="center" 
					type="password" 
					maxlength="6" 
					required
				/>
				<div class="change-pwd-btn">
					<van-button type="primary" size="normal" @click="changeClick()">
						修改 
					</van-button>
				</div>
			</div>
		</van-popup>
	</div>
</template>

<script>
	/*vant组件*/
	import { Button, Icon, Popup, Field, Dialog, Toast, Grid, GridItem } from "vant"
	/*自定义卡片组件*/
	import Card from "@/components/subject/card/Card.vue"
	/*二维码绘制库*/
	import QRCode from "qrcodejs2"
	/*async validator验证库*/
	import schema from "async-validator"
	/*自定义方法*/
	import { getStorage, setStorage, removeStorage } from "@/util/storage"
	/*api接口*/
	import { doOpData, fetchList } from "@/api/client/customer.js"
	export default {
		components: {
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Field.name]: Field,
			[Toast.name]: Toast,
			[Grid.name]: Grid,
			[GridItem.name]: GridItem,

			Card
		},
		data() {
			return {
				/*配置信息*/
				config: {
					buildOrdItem: [
						{text:'简单纸板下单', role:'纸板支付下单', iconName:'jiage1', url:'/client/buildpay/s', name:'sBuildPay'},
						{text:'纸箱纸板下单', role:'纸板支付下单', iconName:'jiage1', url:'/client/buildpay/c', name:'cBuildPay'},
						{text:'简单纸板下单', role:'纸板下单', iconName:'mobancaidan', url:'/client/build/s'},
						{text:'纸箱纸板下单', role:'纸板下单', iconName:'zhixiang', url:'/client/build/c'},
						{text:'纸箱下单', role:'纸箱下单', iconName:'zhixiang1', url:'/client/build/x'},
					],
					ordManageItem: [
						{text:'常用订单', role:'纸板下单', iconName:'dingdan1', url:'/client/usedorder/lists'},
						{text:'微信订单', role:'微信订单', iconName:'shouji', url:'/client/wxorder/lists'},
						{text:'订单统计', role:'订单统计', iconName:'dingdan2', url:'/client/statis/amountStatis'},
						{text:'ERP订单', role:'ERP订单', iconName:'erp', url:'/client/order/getOrders'},
						{text:'每日订单', role:'每日订单', iconName:'meiri', url:'/client/order/getOrdersP'},
						{text:'每日送货', role:'每日送货', iconName:'chanpin', url:'/client/delivery/daily'},
					],
					toolItem: [
						{text:'信用余额明细', role:'客户信用余额明细', iconName:'mianfeibaojia', url:'/client/statement/balStatement'},
						{text:'开票信息', role:'开票信息', iconName:'iconddsh', url:'/client/bill/billCenter'},
						{text:'信用余额明细2', role:'客户信用余额明细', iconName:'yewutiaozhang2', url:'/client/cred/wGetCusDetail'},
						{text:'信用余额', role:'信用余额', iconName:'xinyongyue', url:'/client/cred/wGetCusAmt'},
						{text:'报价规则', role:'报价查询', iconName:'tichengguize',url:'/client/quo/getQuoRuleByCus'},
						{text:'报价价格', role:'报价查询', iconName:'jiagechaxun', url:'/client/quo/getQuoPriceByCus'},
						{text:'对账单', role:'对账单', iconName:'duizhang', url:'/client/order/getCusFreeMB'},
						{text:'常用材质', role:'纸板下单', iconName:'caizhi', url:'/client/usedboard/lists'},
						{text:'往来统计', role:'往来统计', iconName:'kehu', url:'/client/frec/statisContact'},
					],
					/*重置密码验证规则*/
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
					/*弹出层配置*/
					popup: {
						qrcode: {
							show: false
						},
						changePwd: {
							show: false
						},
					},
					/*菜单表格*/
					mockList: {
						buildOrdItem: [],
						ordManageItem: [],
						toolItem: [],
						indexList: []
					},
				},
				/*修改密码*/
				formData: {
					dataType: 12,
					account: null,
					oldPass: null,
					newPass: null,
					confirmPass: null,
				},
				/*验证对象*/
				validator: {},
			}
		},
		computed:{
			...window.Vuex.mapGetters({
				viewH: 'page/viewH',
				userInfo: 'user/userInfo',
				accessToken: "user/accessToken"
			})
		},
		async created() {
			this.$store.commit('client/setHeaderTitle', '菜单页面')
			await this.getAuthGrid( this.$store.getters['user/authMap'] )
		},
		mounted() {
			if( !this.accessToken ) {
				this.$router.replace('/group/client/login')
			}
			this.validator = new schema(this.config.rules)
		},
		methods: {
			/*根据权限设置菜单*/
			getAuthGrid( authName ) {
				this.config.mockList = this.$options.data().config.mockList
				this.config.mockList.buildOrdItem = this.config.buildOrdItem.filter(item=> authName.includes(item.role) )
				this.config.mockList.ordManageItem = this.config.ordManageItem.filter(item=> authName.includes(item.role) )
				this.config.mockList.toolItem = this.config.toolItem.filter(item=> authName.includes(item.role) )
				if( this.config.mockList.buildOrdItem.length > 0 ) {
					this.config.mockList.buildOrdItem.forEach((buildOrdItem, idx)=> {
						this.config.mockList.indexList.push(buildOrdItem)
					})
				}
				if( this.config.mockList.ordManageItem.length > 0 ) {
					this.config.mockList.ordManageItem.forEach((ordManageItem, idx)=> {
						this.config.mockList.indexList.push(ordManageItem)
					})
				}
				if( this.config.mockList.toolItem.length > 0 ) {
					this.config.mockList.toolItem.forEach((toolItem, idx)=> {
						this.config.mockList.indexList.push(toolItem)
					})
				}
			},
			/*菜单点击*/
			openPage(item) {
				this.$router.push(item.url)
			},
			/*修改密码点击*/
			setPwd() {
				this.formData.account = this.userInfo.UserName
				Toast({
					type: 'fail',
					message: '修改密码后需要重新登录',
					duration: 3000,
					onClose: ()=> {
						this.config.popup.changePwd.show = true
					}
				})
			},
			/*修改密码*/
			async changeClick() {
				const { result, msg } = await doOpData(this.formData)
				this.config.popup.changePwd.show = false
				Toast({
					type: 'success',
					message: msg,
					duration: 2000,
					onClose: ()=> {
						this.$router.replace('/group/client/login')
					}
				})
			},
			/*修改密码弹窗关闭*/
			pwdClose() {
				this.formData = this.$options.data().formData
			},
			/*点击二维码*/
			async qrClick() {
				this.config.popup.qrcode.show = true
				const { result } = await fetchList({dataType: 24})
				document.getElementById('qrcode').innerHTML = null
				setTimeout(()=>{
					new QRCode('qrcode', {
						text: result,
				     	colorDark: '#000000',
				      	colorLight: '#ffffff',
				      	correctLevel: QRCode.CorrectLevel.H
					})
				}, 200)

			},
			/*退出登录*/
			logout() {
				Dialog.confirm({
					message: '确认退出?'
				}).then(()=> {
					removeStorage('jpdn-client-token', 'sessionStorage')
					removeStorage('jpdn-client-refresh', 'sessionStorage')
					removeStorage('client-auth-url')
					setStorage('jpdn-client-isLogin', 0, 'sessionStorage')
					this.$store.commit('client/setIsLogin', 0)
					this.$store.dispatch('user/logout')
					this.$router.replace('/group/client/login')
				}).catch(()=>{
					Dialog.close()
				})
			},
		}
	}
</script>

<style>
	@import '~@/assets/style/card.css';
	.menu-header {
		padding-top: 0.25rem;
	}

	.menu-grid {
		padding: 0.25rem 0.25rem 0 0.25rem;
		margin-bottom: 0.875rem;
	}

	.user-menu-box {
		width: 100%;
		background: #fff;
		box-shadow: 0 0.09375rem 0.625rem rgba(183, 183, 183, 0.1);
		border-radius: 0.3125rem;
		overflow: hidden;
	}

	.mg-top-20 {
		margin-top: 0.625rem;
	}

	.mg-bottom-20 {
		margin-bottom: 0.625rem;
	}

	.user-menu-box-header {
		height: 1.9375rem;
		padding: 0.625rem 0.9375rem 0.3125rem 0.625rem;
		display: flex;
		flex-direction: row;
		box-sizing: border-box;
		font-size: 0.9375rem;
		color: #303133;
		align-items: center;
		border-bottom: 0.0625rem #f1f1f1 solid;
	}

	.box-header-title {
		flex:1;
		font-weight: 600;
		color: #333;
	}

	.box-header-sub {
		flex:1;
		text-align: right;
		font-size: 0.9375rem;
	}

	.user-menu-order-list {
		width: 100%;
		height: 6.5625rem;
		padding: 0 0.9375rem;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.user-menu-flex-wrap {
		flex-wrap: wrap;
		height: auto;
		padding-bottom: 0.9375rem;
		justify-content: flex-start;
	}

	.user-menu-item-25 {
		width: 25%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding-top: 0.9375rem;
	}

	.karry-icon-box{
		position: relative;
	}

	.karry-paper-icon{
		width: 1.5rem;
		height: 1.5rem;
		display: block;
	}

	.karry-order-text{
		font-size: 0.8125rem;
		font-weight: 400;
		color: #666;
		padding-top: 0.625rem;
	}

	.qrcode {
		padding: 0.5rem;
	}

	img{
		width: 9rem;
		height: 9rem;
	}

	.change-pwd-container {
		margin: 0.5rem;
	}

	.change-pwd-btn {
		margin-top: 0.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>