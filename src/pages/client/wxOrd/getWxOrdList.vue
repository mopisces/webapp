<!-- 微信订单 -->
<template>
	<div class="page-color" :style="'min-height: '+ viewH/16 +'rem;'">
		<van-sticky :offset-top="46">
			<van-tabs v-model="formData.ordState" @change="change">
				<van-tab title="未审核" name="1"></van-tab>
				<van-tab title="已审核" name="2"></van-tab>
				<van-tab title="已删除" name="3"></van-tab>
			</van-tabs>
		</van-sticky>
		<!-- 筛选按钮 -->
		<drag-menu 
			defpositon="rt" 
			:popMenu="false"
			:pattern="{icon: 'filter-o'}"
			value="筛选"
			@fabClick="menuClick"
		></drag-menu>
		<!-- 数据列表 -->
		<van-pull-refresh 
			v-model="config.pullRefresh.reloading" 
			@refresh="pullOnRefresh"
		>
			<van-list 
				v-model="config.list.loading" 
				:finished="config.list.finished" 
				finished-text="没有更多了" 
				:immediate-check="false"
				@load="onLoad"
			>
				<van-swipe-cell 
					v-for="(item,index) in config.indexList" 
					:key="index"
					:disabled="formData.ordState != 1 ? true:false"
				>
					<template 
						slot="right"  
						v-if="item.isDel == 0 && item.checked == 0 && (( item.isGroup == 0 && item.usePay == null  )  || ( item.usePay == 1 && item.refund == 1 ) || ( item.usePay == 1 && item.paid == 0 ) )"
						>
						<van-button 
							square 
							text="删除" 
							type="danger" 
							style="height:100%;" 
							@click="delClick(item.cusPoNo)"
						/>
					</template>
					<template 
						slot="left"
						v-if="item.isDel == 0 && item.checked == 0 && ((item.usePay == 1 && item.paid == 0 && item.isGroup == 0))"
					>
						<van-button 
							square 
							text="修改" 
							type="primary" 
							style="height:100%;" 
							@click="modifyClick(item)"
						/>
					</template>
					<card 
						:title="item.cusPoNo"
						:extra="item.title"
						:thumbnail="item.isGroup == 1 && item.payDeadlineTime?item.firstPic:''"
						:is-shadow="true"
					>
						<div class="card-body-container">
							<div class="card-body-item card-body-item-100">
								<div v-if=" item.usePay == 1 ">付款状态:
									<span 
										class="mg-left-20" 
										v-if="item.paid == 0 "
									>
										<span v-if="item.overTime == 1">超时</span>未付款
									</span>
									<span 
										class="mg-left-20 blue-color" 
										v-if="item.paid == 1 && item.apply == 0 && item.refund==0" 
									>
										已付款
									</span>
									<span 
										class="mg-left-20 red-color" 
										v-if="item.paid == 1 && item.checked == 0 && item.apply == 1 && item.refund == 0 ">
										申请退款中
									</span>
									<span class="mg-left-20 gray-color" v-if="((item.checked == 0 && item.apply == 1) || (item.checked == 1 && item.apply == 0)) && item.refund == 1 && item.paid == 1">
										已退款
									</span>
								</div>
							</div>

							<div class="card-body-item card-body-item-100">
								<div class="card-body-txt">订单标识</div>:
								<van-tag class="mg-left-20" type="primary">
									{{ transCType(item.cType) }}
								</van-tag>
								<van-tag 
								 	v-if=" item.isCard == 1 " 
								 	class="mg-left-20"  
								 	type="warning" 
								 >
									{{ item.cardFlag }}
								</van-tag>
							</div>


							<div v-if="item.isDel == 1" class="card-body-item card-body-item-100">
								<span>删除原因:
									<span class="mg-left-20 red-color" >{{ item.delRemark }}</span>
								</span>
							</div>
							<div v-if="item.cType === 's'||item.cType === 'c'" class="card-body-item card-body-item-100">
								<span>纸板规格:
									<span class="mg-left-20">{{ item.length }}×{{ item.width }}</span>
									<span class="mg-left-20">{{ item.boardId }}</span>
								</span>
							</div>
							<div v-if="item.cType === 'c'" class="card-body-item card-body-item-100">
								<span>纸箱规格:
									<span class="mg-left-20">{{ item.boxL }}×{{ item.boxW }}×{{ item.boxH }}</span>
								</span>
							</div>
							<div v-if="item.cType === 'c'" class="card-body-item card-body-item-100">
								<span>箱型信息:
									<span class="mg-left-20">{{ item.boxName }}</span>
								</span>
							</div>
							<div v-if="item.cType === 'x'" class="card-body-item card-body-item-100">
								<span>套件信息:
									<span class="mg-left-20" >{{ item.productId }}</span>
									<span class="mg-left-20" >{{ item.productName }}</span>
								</span>
							</div>
							<div v-if="item.cType === 't'" class="card-body-item card-body-item-100">
								<span>货品编号:
									<span class="mg-left-20" >{{ item.matNo }}</span>
								</span>
							</div>
							<div class="card-body-item card-body-item-100">
								<span>订单信息:
									<span class="mg-left-20">
										{{ item.ordQty }}
										<span v-if="item.cType === 's'">片</span>
										<span v-else>个</span>
									</span>
									<span 
										v-if="item.cType === 's' || item.cType === 'c'" 
										class="mg-left-20"
									>
										{{ item.area }}㎡
									</span>
								</span>
							</div>
							<div v-if="item.scoreInfo" class="card-body-item card-body-item-100">
								<span>压线信息:
									<span class="mg-left-20">{{ item.scoreInfo }}</span>
								</span>
							</div>
							<div class="card-body-item card-body-item-100">
								<span>送货地址:
									<span class="mg-left-20">{{ item.subDNAddress }}</span>
								</span>
							</div>
							<div class="card-body-item card-body-item-100">
								<div class="card-body-txt green-color">下单</div>|
								<div class="card-body-txt red-color">交货</div>:
								<span class="mg-left-20 green-color">{{ item.buildDate }}</span>
								<span class="mg-left-20 red-color">{{ item.deliveryDate }}</span>
							</div>
							<div 
								v-if="item.isGroup == 0 && config.webConfig.buildAddCalc == 1" 
								class="card-body-item card-body-item-100"
							>
								<div class="card-body-txt blue-color">价格</div>|
								<div class="card-body-txt yellow-color">金额</div>:
								<span class="mg-left-20 blue-color">{{ item.webCalPrice }}元/㎡</span>
								<span class="mg-left-20 yellow-color">{{ item.webCalAmt }}元</span>
							</div>
							<div v-if="item.isGroup == 1" class="card-body-item card-body-item-100">
								<div class="card-body-txt blue-color">价格</div>|
								<div class="card-body-txt yellow-color">金额</div>:
								<span class="mg-left-20 blue-color">{{ item.price }}元/㎡</span>
								<span class="mg-left-20 yellow-color">{{ item.cost }}元</span>
							</div>
						</div>
						<!-- 底部操作栏 -->
						<div slot="actions" class="card-actions">

							<div 
								v-if=" formData.ordState == 1 && item.usePay == 1 "
								class="card-actions-item" 
								@click="payDetailClick(item.cusPoNo)"
							>
								<van-icon color="#3c9cff" name="peer-pay" size="18"/>
								<span class="card-actions-item-text blue-color">支付信息</span>
							</div>
							<div 
								class="card-actions-item" 
								@click="wxDetailClick(item.cusPoNo)"
							>
								<van-icon color="#3c9cff" name="bars" size="18"/>
								<span class="card-actions-item-text blue-color">详情</span>
							</div>
							<div 
								v-if=" item.checked == 1 && item.isCard == 0  && item.cType !== 't' "
								class="card-actions-item" 
								@click="setCommon( item.cusPoNo )"
							>
								<van-icon color="#f9ae3d" name="star" size="18"/>
								<span class="card-actions-item-text yellow-color">设为常用</span>
							</div>
							<div 
								v-if=" item.checked == 1 && item.isCard == 1 && item.cType !== 't' "
								class="card-actions-item" 
								@click="cancelCommon( item.cusPoNo )"
							>
								<van-icon color="#f56c6c" name="star-o" size="18"/>
								<span class="card-actions-item-text red-color">取消常用</span>
							</div>
							<div 
								v-if=" item.checked == 1 && item.isCard == 1 "
								class="card-actions-item" 
								@click="buildOrder( item )"
							>
								<van-icon color="#3c9cff" class-prefix="iconfont" name="xiadan" size="18"/>
								<span class="card-actions-item-text blue-color">快速下单</span>
							</div>
						</div>
	
					</card>
				</van-swipe-cell>
			</van-list>
		</van-pull-refresh>
		<!-- 筛选弹窗 -->
		<popup-filter :filterShow.sync="config.filter.show" @resetClick="reset" @filterClick="filter">
			<div slot="filter-field-1">
				<uni-check-box
					label="订单类型"
					:localdata="config.radio.ordType"
					:radioData.sync="formData.ordType" 
					:map="{text: 'title', value: 'value'}"
				>
				</uni-check-box>
				<uni-check-box
					label="是否团购"
					:localdata="config.radio.groupType"
					:radioData.sync="formData.groupType" 
					:map="{text: 'title', value: 'value'}"
				>
				</uni-check-box>
				<uni-check-box
					label="日期"
					:localdata="config.radio.dateType"
					:radioData.sync="formData.dateType" 
					:map="{text: 'title', value: 'value'}"
				>
				</uni-check-box>
				<time-range-picker
					:beginDate.sync="formData.beginDate"
					:endDate.sync="formData.endDate"
					:maxDate.sync="formData.maxDate"
					:minDate.sync="formData.minDate"
				></time-range-picker>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
		<!-- 删除弹窗 -->
		<van-popup 
			v-model="config.del.show" 
			:style="{ width: '98%' }"
			round
			@closed="close"
		>
			<uni-check-box
				label="可选原因"
				:localdata="config.radio.delRemark"
				:radioData.sync="opForm.delRemark" 
				:map="{text: 'title', value: 'value'}"
			>
			</uni-check-box>
			<van-field 
				v-model="opForm.delRemark"
				rows="2"
				autosize
				label="删除原因"
				type="textarea"
				maxlength="50"
				placeholder="请选择或者输入删除原因"
				show-word-limit
			/>
			<div class="popup-box-foot-container">
				<van-button 
					:loading="config.del.loading" 
					type="warning" 
					loading-text="删除中..." 
					@click="doDel"
				>
					删除订单
				</van-button>
			</div>
			
		</van-popup>
		<!-- 设置常用弹窗 -->
		<van-popup 
			v-model="config.setCommon.show" 
			:style="{ width: '98%', backgroundColor: '#f1f1f1' }"
			round
			@closed="close"
		>
			<van-field 
				v-model="opForm.cardFlag"
				rows="2"
				autosize
				label="常用订单标识"
				type="textarea"
				maxlength="50"
				placeholder="请输入常用订单添加标识"
				show-word-limit
			/>
			<div class="popup-box-foot-container">
				<van-button 
					:loading="config.setCommon.loading" 
					type="primary" 
					loading-text="设置中..." 
					@click="doCommon"
				>
					设为常用
				</van-button>
			</div>
		</van-popup>
		<!-- 批量付款 -->
		<template v-if="showFloatNav">
			<karry-float-nav 
				:listData="config.floatNav.listData"
				:selectNum="config.floatNav.selectNum"
			/>
		</template>
		<!-- 详细信息 -->
		<wx-ord-detail 
			ref="wxOrdDetail"
			:detailShow.sync="config.detail.show"
		/>
	</div>
</template>

<script>
	/*vant组件*/
	import { Button, Icon, Image, Popup, Field, Dialog, PullRefresh, SwipeCell, Toast, List, SwitchCell, Sticky, Tag, Tab, Tabs } from "vant"
	/*自定义筛选弹窗组件*/
	import PopupFilter from "@/components/subject/PopupFilter.vue"
	/*自定义卡片组件*/
	import Card from "@/components/subject/card/Card.vue"
	/*自定义拖动菜单组件*/
	import DragMenu from "@/components/subject/fab/DragMenu.vue"
	/*自定义单选组件*/
	import UniCheckBox from "@/components/subject/checkbox/UniCheckBox.vue"
	/*自定义日期区间组件*/
	import TimeRangePicker from "@/components/subject/time/TimeRangePicker.vue"
	/*自定义固定按钮*/
	import KarryFloatNav from "@/components/karry/floatNav/KarryFloatNav.vue"
	/*自定义详细信息组件*/
	import WxOrdDetail from "@/components/karry/wxOrdDetail/WxOrdDetail.vue"
	/*async validater*/
	import schema from "async-validator"
	/*自定义方法*/
	import { getStorage, setStorage, removeStorage } from "@/util/storage"
	import { cTypeChange } from '@/util/index'
	/*api接口*/
	import { getWebConfig } from "@/api/common/webConfig.js"
	import { fetchList, doOpData } from "@/api/client/customer.js"

	export default {
		components: {
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Image.name]: Image,
			[Popup.name]: Popup,
			[Field.name]: Field,
			[Dialog.Component.name]: Dialog.Component,
			[PullRefresh.name]: PullRefresh,
			[SwipeCell.name]: SwipeCell,
			[Toast.name]: Toast,
			[List.name]: List,
			[SwitchCell.name]: SwitchCell,
			[Sticky.name]: Sticky,
			[Tag.name]: Tag,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,

			PopupFilter,
			Card,
			DragMenu,
			UniCheckBox,
			TimeRangePicker,
			KarryFloatNav,
			WxOrdDetail
		},
		data() {
			return {
				/*配置*/
				config: {
					/*筛选弹窗*/
					filter: {
						show: false
					},
					/*删除弹窗*/
					del: {
						show: false,
						loading: false
					},
					/*设置常用弹窗*/
					setCommon: {
						show: false,
						loading: false
					},
					/*详细信息弹窗*/
					detail: {
						show: false,
						cusPoNo: null
					},
					/*下拉刷新*/
					pullRefresh: {
						reloading: false
					},
					/*上拉加载*/
					list: {
						loading: false,
						finished: false
					},
					switch: {
						checked: false
					},
					/*单选配置*/
					radio: {
						ordType: [
							{ title: '全部', value: 'all' },
							{ title: '简单纸板', value: 's' },
							{ title: '纸箱纸板', value: 'c' },
							{ title: '纸箱', value: 'x' },
							{ title: '淘宝箱', value: 't' },
						],
						groupType: [
							{ title: '全部', value: 2 },
							{ title: '是', value: 1 },
							{ title: '否', value: 0 },
						],
						dateType: [
							{ title: '下单日期', value: 0 },
							{ title: '交货日期', value: 2 }
						],
						delRemark: []
					},
					/*校验规则*/
					rules: {
						cusPoNo: [
							{ required: true, message: '请选择要删除的订单' }
						],
						delRemark: [
							{ required: true, message: '请选择或填写删除原因' }
						]
					},
					/*验证实例*/
					validator: {},
					/*列表数据*/
					indexList: [],
					/*webconfig表的配置*/
					webConfig: {
						buildAddCalc: 0,
					},
					/*批量付款*/
					floatNav: {
						show: false,
						listData: [],
						selectNum: 0,
					}
				},
				/*筛选条件*/
				formData: {
					/**
					 * 数据类型
					 * 15->微信订单列表
					 */
					dataType: 15,
					/**
					 * 订单分类
					 * 微信订单 1->未审核 2->已审核 3->已删除
					 */
					ordState: 1,
					/**
					 * 订单类型
					 * all->全部 s->简单纸板 c->纸箱纸板 x->纸箱 t->淘宝箱
					 */
					ordType: 'all',
					/**
					 * 团购状态
					 * 0->否 1->是 2->全部
					 */
					groupType: 2,
					/**
					 * 日期类型
					 * 0->下单日期 2->交货日期
					 */
					dateType: 0,
					//开始日期
					beginDate: null,
					//结束日期
					endDate: null,
					//最小日期
					minDate: null,
					//最大日期
					maxDate: null,
					/*分页信息*/
					pageNo: 1,
					pageSize: 6,
				},
				/*操作表单*/
				opForm: {
					/**
					 * 操作类型
					 * 1->删除微信订单 2->设置常用订单
					 */
					dataType: 1,
					/*客订单号*/
					cusPoNo: null,
					/*删除备注*/
					delRemark: '',
					/*常用订单标识*/
					cardFlag: '',
				},
			}
		},
		async created() {
			await this.$store.commit('client/setHeaderTitle', '微信订单')
			if( getStorage('client/wxOrders') ) {
				let storageData = JSON.parse(getStorage('client/wxOrders'))
				this.formData = Object.assign({}, this.$options.data().formData, storageData)
				this.config.switch.checked = true
				await this.getConfig( false )
			} else {
				await this.getConfig()
			}
		},
		mounted() {
			this.config.validator = new schema(this.config.rules)
			window.addEventListener('beforeunload', e => this.beforeunloadHandler())
		},
		destroyed() {
			this.beforeunloadHandler()
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler())
		},
		watch: {
			'formData.groupType': {
				handler( nVal, oVal ) {
					this.config.radio.ordType = this.$options.data().config.radio.ordType
					if( nVal == 0 ) {
						this.config.radio.ordType = [
							{ title: '全部', value: 'all' },
							{ title: '简单纸板', value: 's' },
							{ title: '纸箱纸板', value: 'c' },
							{ title: '纸箱' , value: 'x' },
						]
						if( this.formData.ordType == 't' ) this.formData.ordType = 'all'
					} 
					if( nVal == 1 ) {
						this.config.radio.ordType = [
							{ title: '全部', value: 'all' },
							{ title: '简单纸板', value: 's' },
							{ title: '纸箱纸板', value: 'c' },
							{ title: '淘宝箱', value: 't' },
						]
						if( this.formData.ordType == 'x' ) this.formData.ordType = 'all'
					}
				},
				deep: true
			}
		},
		computed: {
			...window.Vuex.mapGetters({
				viewH: 'page/viewH'
			}),
			showFloatNav() {
				return this.config.floatNav.show && this.formData.ordState == 1 && this.config.floatNav.selectNum>0
			}
		},
		methods: {
			/*筛选按钮*/
			menuClick() {
				this.config.filter.show = true
			},
			/*头部tab改变*/
			async change( name, title ) {
				await window.scrollTo(0, 0)
				this.formData.pageNo = 1
				await this.fetchData()
			},
			/*获取页面参数*/
			async getConfig( needDate=true ){
				this.config.radio.delRemark = this.$options.data().config.radio.delRemark
				const { result } = await getWebConfig({paramType: 'clientOM'})

				if( needDate ) {
					this.formData.beginDate = result.WeborderBeginDate
					this.formData.endDate = result.WeborderEndDate
					this.formData.minDate = result.WeborderMinDate
					this.formData.maxDate = result.WeborderMaxDate
				}
				if(result.UseWxPay == 1 || result.UseAliPay == 1 || result.UseYSBPay == 1 || result.UseCreditPay == 1) {
					this.config.floatNav.show = true
				}
				result.WeborderDefaultDelRemark.split(',').forEach((item,index)=>{
					this.config.radio.delRemark.push({title:item,value:item})
				})
				this.config.webConfig.buildAddCalc = result.BuildAddCalc
				await this.fetchData()
			},
			/*获取列表数据*/
			async fetchData() {
				this.formData.dataType = 15
				try {
					const { result } = await fetchList(this.formData)
					const { webappOrd, unPaid } = result
					if( this.formData.pageNo == 1 ) {
						this.config.indexList = webappOrd
					} else {
						webappOrd.forEach((item,index)=> {
							this.config.indexList.push(item)
						})
					}
					console.log(unPaid)
					this.config.floatNav.listData = unPaid
					console.log(this.config.floatNav.listData)
					this.config.floatNav.selectNum = this.config.floatNav.listData.length
					if( webappOrd.length < this.formData.pageSize ) this.config.list.finished = true
				} catch( err ) {
					this.config.list.finished = true
				} finally {
					this.config.list.loading = false
				}
			},
			/*下拉刷新*/
			async pullOnRefresh() {
				this.formData.pageNo = 1
				await this.fetchData()
				this.config.pullRefresh.reloading = false
			},
			/*上拉加载*/
			async onLoad() {
				this.formData.pageNo++
				await this.fetchData()
			},
			/*删除点击*/
			delClick( cusPoNo ) {
				this.opForm = this.$options.data().opForm
				this.opForm.dataType = 1
				this.opForm.cusPoNo = cusPoNo
				this.config.del.show = true
			},
			/*修改点击*/
			modifyClick( rowData ) {
				if( rowData.isGroup != 0 ){
					return 
				}
				//跳转支付下单
				if( rowData.usePay == 1 && rowData.cType == 's' ){
					this.$router.push({ name:'sBuildPay', params: { orderId: rowData.cusPoNo, buildType: 1 } })
				}
				if( rowData.usePay == 1 && rowData.cType == 'c' ){
					this.$router.push({ name:'cBuildPay', params: { orderId: rowData.cusPoNo, buildType: 1 } })
				}
				//跳转非支付下单
				if( rowData.usePay == 0 && rowData.cType == 's' ){
					this.$router.push({ name:'sBuild', params: { orderId: rowData.cusPoNo, buildType: 1 } })
				}
				if( rowData.usePay == 0 && rowData.cType == 'c' ){
					this.$router.push({ name:'cBuild', params: { orderId: rowData.cusPoNo, buildType: 1 } })
				}
				if( rowData.usePay == 0 && rowData.cType == 'x' ){
					this.$router.push({ name:'xBuild', params: { orderId: rowData.cusPoNo, buildType: 1 } })
				}
			},
			/*删除订单*/
			async doDel() {
				if( this.opForm.delRemark.length > 0 ) {
					this.config.del.loading = true
					const { result } = await doOpData(this.opForm) 
					Toast({
						type: 'success',
						message: '删除订单成功',
						duration: 2000,
						onClose: async ()=> {
							await this.pullOnRefresh()
							this.config.del.show = false
						}
					})
				} else {
					Toast({
						type: 'fail',
						message: '请选择或者填写删除原因',
						duration: 2000
					})
				}
			},
			/*删除或者设置常用弹窗关闭*/
			close() {
				this.opForm = this.$options.data().opForm
				this.config.del = this.$options.data().config.del
				this.config.setCommon = this.$options.data().config.setCommon
			},
			transCType( cType ) {
				return cTypeChange( cType )
			},
			/*支付信息*/
			payDetailClick( cusPoNo ) {
				this.$router.push({ name:'payDetail', params:{ orderId : cusPoNo } })
			},
			/*详细点击*/
			async wxDetailClick( cusPoNo ) {
				await this.$refs.wxOrdDetail.fetchData(cusPoNo)
				this.config.detail.show = true
			},
			/*设置常用点击*/
			setCommon( cusPoNo ) {
				this.opForm = this.$options.data().opForm
				this.opForm.dataType = 2
				this.opForm.cusPoNo = cusPoNo
				this.config.setCommon.show = true
			},
			/*设置常用订单*/
			async doCommon() {
				if( this.opForm.cardFlag.length > 0 ) {
					this.config.setCommon.loading = true
					const { result } = await doOpData(this.opForm) 
					Toast({
						type: 'success',
						message: '订单设置成功',
						duration: 2000,
						onClose: async ()=> {
							await this.pullOnRefresh()
							this.config.setCommon.show = false
						}
					})
				} else {
					Toast({
						type: 'fail',
						message: '请填写标识',
						duration: 2000
					})
				}
			},
			/*取消常用*/
			async cancelCommon(cusPoNo) {
				const { result } = await doOpData({
					/*数据类型 10->取消常用订单*/
					dataType: 10,
					cusPoNo: cusPoNo
				})
				Toast({
					type: 'success',
					message: '取消常用订单成功',
					duration: 2000,
					onClose: async ()=> {
						await this.pullOnRefresh()
					}
				})
			},
			/*快速下单点击*/
			buildOrder( rowData ) {
				switch( rowData.cType ){
					case 's':
						if( rowData.payDeadlineTime ){
							this.$router.push({
								name:'sBuildPay',
								params : {
									orderId : rowData.cusPoNo
								}
							});
						}else{
							this.$router.push({
								name:'sBuild',
								params: {
									orderId: rowData.cusPoNo
								}
							});
						}
						break;
					case 'c':
						if( rowData.payDeadlineTime ){
							this.$router.push({
								name:'cBuildPay',
								params: {
									orderId: rowData.cusPoNo
								}
							});
						}else{
							this.$router.push({
								name:'cBuild',
								params: {
									orderId: rowData.cusPoNo
								}
							});
						}
						break;
					case 'x':
						this.$router.push({
							name:'xBuild',
							params: {
								orderId: rowData.CusPoNo
							}
						});
						break;
					default :
						return false;
				}
			},
			/*重置按钮*/
			async reset() {
				this.formData = this.$options.data().formData
				this.config.filter.show = false
				this.config.switch.checked = false
				await this.getConfig()
			},
			/*筛选按钮*/
			async filter() {
				this.formData.pageNo = 1
				await this.fetchData()
			},
			beforeunloadHandler() {
				if( this.config.switch.checked ){
					setStorage('client/wxOrders', this.formData)
				}else{
					removeStorage('client/wxOrders')
				}
			},
		}
	}
</script>

<style type="text/css">
	@import '~@/assets/style/card.css';

	.popup-box-foot-container {
		display: flex;  
	    justify-content: center;  
	    align-items: center; 
	}
</style>