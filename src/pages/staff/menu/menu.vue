<!-- 菜单界面 -->
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
				<van-grid-item v-for="(item,index) in config.mockList.indexList" :key="index" :url="item.url" :text="item.text">
					<van-icon class-prefix="iconfont" size="35" :name="item.iconName" slot="icon" color="#1a991d"/>
				</van-grid-item>
			</van-grid>
		</div>
		<!-- <div class="menu-grid">
			
			<div 
				class="user-menu-box mg-top-20"
				v-if="config.mockList.customerItem.length > 0"
			>
				<div class="user-menu-box-header">
					<div class="box-header-title">客户管理</div>
					<div class="box-header-sub"></div>
				</div>
				<div class="user-menu-order-list user-menu-flex-wrap">
					<div class="user-menu-item-25" 
						v-for="(item,idx) in config.mockList.customerItem" 
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
			</div>
			
			<div 
				class="user-menu-box mg-top-20"
				v-if="config.mockList.statisItem.length > 0"
			>
				<div class="user-menu-box-header">
					<div class="box-header-title">统计管理</div>
					<div class="box-header-sub"></div>
				</div>
				<div class="user-menu-order-list user-menu-flex-wrap">
					<div class="user-menu-item-25" 
						v-for="(item,idx) in config.mockList.statisItem" 
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
			</div>
			
			<div 
				class="user-menu-box mg-top-20"
				v-if="config.mockList.paperItem.length > 0"
			>
				<div class="user-menu-box-header">
					<div class="box-header-title">原纸管理</div>
					<div class="box-header-sub"></div>
				</div>
				<div class="user-menu-order-list user-menu-flex-wrap">
					<div class="user-menu-item-25" 
						v-for="(item,idx) in config.mockList.paperItem" 
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
			</div>
		
			
			<div 
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
			</div>
		</div> -->
	
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
	import { fetchList, doUpdate } from "@/api/staff/tool.js"

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
				// 配置信息
				config: {
					/*{text:'库存预计',role:'',iconName:'kucun1',url:'/staff/paper/getExpectStock'},*/
					/*{text:'生产分析总计2',role:'生产分析总计',iconName:'shengchan',url:'/staff/statis/getProInfo2'},*/
					customerItem: [
						{text:'客户查询',role:'客户查询',iconName:'kehudingdan',url: '/staff/customer/customerInfo'},
						{text:'客户每日送货',role:'客户每日送货',iconName:'chanpin',url:'/staff/delivery/daily'},
						{text:'客户信用余额',role:'客户信用余额',iconName:'xinyongyue',url:'/staff/cred/wGetCusAmt'},
						{text:'客户每日订单',role:'客户每日订单',iconName:'meiri',url:'/staff/daily/wGetCusOrder'},
						{text:'客户往来统计',role:'客户往来统计',iconName:'kehu',url: '/staff/frec/cusContact'},
						{text:'报价查询',role:'报价查询',iconName:'tichengguize',url:'/staff/quo/customerQuo'},
						{text:'收款调账',role:'收款调账',iconName:'yewutiaozhang',url:'/staff/frec/recAdjust'},
						{text:'用户管理',role:'用户管理',iconName:'guanwangicon31334',url:'/staff/user/manage'},
					],
					statisItem: [
						{text:'库存统计',role:'库存统计',iconName:'storage',url:'/staff/statis/getOrdStock'},
						{text:'传单统计',role:'传单统计',iconName:'chuandan',url:'/staff/statis/getSchSum'},
						{text:'退货统计',role:'退货统计',iconName:'tuihuo1',url:'/staff/statis/getOrdReturnSum'},
						{text:'订单统计',role:'订单统计',iconName:'dingdan2',url:'/staff/statis/getOrderSum'},
						{text:'订单统计2', role:'订单统计', iconName:'dingdan2',  url:'/staff/statis/getOrderSum2'},
						{text:'接单统计',role:'接单统计',iconName:'daquxindai',url:'/staff/statis/saleStatis'},
						{text:'生产分析总计',role:'生产分析总计',iconName:'shengchan',url:'/staff/statis/getProInfo'},
					],
					paperItem: [
						{text:'库区面积',role:'库区面积',iconName:'fangwumianji',url:'/staff/stock/deliveryArea'},
						{text:'原纸日用量',role:'原纸日用量',iconName:'rili1',url:'/staff/paper/dailyUsed'},
						{text:'安全库存',role:'安全库存',iconName:'anquanmenhu',url:'/staff/paper/paperSafe'},
						{text:'原纸库存',role:'原纸库存',iconName:'weishengzhi',url:'/staff/paper/getSStocks'},
						{text:'原纸收货',role:'原纸收货',iconName:'che2',url:'/staff/paperbuy/wGetPOIn'},
						{text:'原纸采购',role:'原纸采购',iconName:'caigou',url:'/staff/paperbuy/wGetPOMain'},
					],
					toolItem: [
						{text:'ERP订单',role:'ERP订单',iconName:'erp',url:'/staff/erp/getOrders'},
						{text:'直接入库',role:'直接入库',iconName:'ruku2',url:'/staff/paper/directInStock'},
						{text:'原纸入库',role:'原纸入库',iconName:'ruku',url:'/staff/paper/doRStockIn'},
						{text:'原纸出库',role:'原纸出库',iconName:'ccgl-chukucaozuo-5',url:'/staff/paper/doStockOut'},
						{text:'订单试算',role:'订单试算',iconName:'jisuanqi',url:'/staff/calc/index'},
						{text:'库存修改',role:'库存修改',iconName:'iconfontzhizuobiaozhunbduan24',url:'/staff/stock/mStockDetailR'},
						{text:'扫描装货',role:'扫描装货',iconName:'zhuangche1',url:'/staff/stow/lists'},
					],
					/*重置密码验证规则*/
					rules: {
						oldPass: [
							{  require: true, message: '请填写原密码' },
							{  type:'string' , pattern: '^[0-9a-zA-Z]{1,6}$', message: '原密码不符合规则' },
						],
						newPass: [
							{  require: true, message: '请填写新密码' },
							{  type: 'string', pattern: '^[0-9a-zA-Z]{1,6}$', message: '新密码不符合规则' }
						],
						confirmPass: [
							{  require: true, message: '请填写确认密码' },
							{  validator: (rule, value, callback, source, options) => {
								let errors
								if( value !== source.newPass ){
									errors = '两次密码输入不一致'
								}
								callback(errors)
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
						customerItem: [],
						statisItem: [],
						paperItem: [],
						toolItem: [],
						indexList: [],
					}
				},
				/*修改密码*/
				formData: {
					updateType: 1,
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
				userInfo: 'user/userInfo'
			})
		},
		async created() {
			this.$store.commit('staff/setHeaderTitle', '菜单页面')
			await this.getAuthGrid( this.$store.getters['user/authMap'] )
		},
		mounted() {
			this.validator = new schema(this.config.rules)
		},
		methods: {
			/*根据权限设置菜单*/
			getAuthGrid( authName ) {
				this.config.mockList = this.$options.data().config.mockList
				this.config.mockList.customerItem = this.config.customerItem.filter(item=> authName.includes(item.role) )
				this.config.mockList.statisItem = this.config.statisItem.filter(item=> authName.includes(item.role) )
				this.config.mockList.paperItem = this.config.paperItem.filter(item=> authName.includes(item.role) )
				this.config.mockList.toolItem = this.config.toolItem.filter(item=> authName.includes(item.role) )
				if(this.config.mockList.customerItem.length > 0) {
					this.config.mockList.customerItem.forEach((customerItem,idx)=> {
						this.config.mockList.indexList.push(customerItem)
					})
				}
				if(this.config.mockList.statisItem.length > 0) {
					this.config.mockList.statisItem.forEach((statisItem,idx)=> {
						this.config.mockList.indexList.push(statisItem)
					})
				}
				if(this.config.mockList.paperItem.length > 0) {
					this.config.mockList.paperItem.forEach((paperItem,idx)=> {
						this.config.mockList.indexList.push(paperItem)
					})
				}
				if(this.config.mockList.toolItem.length > 0) {
					this.config.mockList.toolItem.forEach((toolItem,idx)=> {
						this.config.mockList.indexList.push(toolItem)
					})
				}
			},
			/*菜单点击*/
			openPage(item) {
				this.$router.push(item.url)
			},
			/*点击二维码*/
			async qrClick() {
				this.config.popup.qrcode.show = true
				const { result } = await fetchList({dataType: 2})
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
			/*修改密码弹窗关闭*/
			pwdClose() {
				this.formData = this.$options.data().formData
			},
			/*密码弹窗确认*/
			changeClick(){
				this.validator.validate(this.formData).then(()=>{
					this.changePass()
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message)
				})
			},
			/*密码修改*/
			async changePass() {
				const { result, msg } = await doUpdate(this.formData)
				this.config.popup.changePwd.show = false
				Toast({
					type: 'success',
					message: msg,
					duration: 2000,
					onClose: ()=> {
						this.$router.replace('/group/staff/login')
					}
				})
			},
			/*退出登录*/
			logout() {
				Dialog.confirm({
					message: '确认退出?'
				}).then(()=> {
					removeStorage('jpdn-staff-token', 'sessionStorage')
					removeStorage('jpdn-staff-refresh', 'sessionStorage')
					removeStorage('staff-auth-url')
					setStorage('jpdn-staff-isLogin', 0, 'sessionStorage')
					this.$store.commit('staff/setIsLogin', 0)
					this.$store.dispatch('user/logout')
					this.$router.replace('/group/staff/login')
				}).catch(()=>{
					Dialog.close()
				})
			},
		},
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