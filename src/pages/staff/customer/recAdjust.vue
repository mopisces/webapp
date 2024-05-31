<!-- 收款调账 -->
<template>
	<div class="page-color" :style="'min-height: '+ viewH/16 +'rem;'">
		<!-- tab头部标签 -->
		<van-sticky :offset-top="46">
			<van-tabs v-model="formData.stateType" @change="change">
				<van-tab title="收款" name="1"></van-tab>
				<van-tab title="调账" name="0"></van-tab>
			</van-tabs>
		</van-sticky>
		<!-- 菜单 -->
		<drag-menu 
			defpositon="rt" 
			:pattern="{icon: 'plus'}"
			:content="config.menu.content"
			@trigger="trigger"
		>
		</drag-menu>
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
				<card 
					:title="item.cusName" 
					:subTitle="item.payId"
					:extra="item.taskName"
					:is-shadow="true"
					v-for="(item,index) in config.indexList" 
					:key="index"
				>
					<div class="card-body-container">
						<div class="card-body-item card-body-item-50">
							<div class="card-body-txt">审核状态:</div>
							<div class="mg-left-20">
								<van-icon 
									class-prefix="iconfont" 
									:color="item.checked == 1 ? '#5ac725':'#f56c6c'" 
									:name="item.checked == 1 ? 'gou':'guanbi'" 
									:size="item.checked == 1 ? 16 : 12"
								/>
							</div>
						</div>
						<div class="card-body-item card-body-item-50">
							<div class="card-body-txt">需开票:</div>
							<div class="mg-left-20">
								<van-icon 
									class-prefix="iconfont" 
									:color="item.needInv == 1 ? '#5ac725':'#f56c6c'" 
									:name="item.needInv == 1 ? 'gou':'guanbi'" 
									:size="item.needInv == 1 ? 16 : 12"
								/>
							</div>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>科目信息:
								<span class="mg-left-20">{{ item.shortName }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<div class="card-body-txt blue-color">操作</div>|
							<div class="card-body-txt green-color">生效</div>:
							<span class="mg-left-20 blue-color">{{ item.opDate }}</span>
							<span class="mg-left-20 green-color">{{ item.issueDate }}</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>合计金额:
								<span class="mg-left-20">{{ item.amount }}元</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>备注信息:
								<span class="mg-left-20">{{ item.remark }}</span>
							</span>
						</div>
						<div v-if="item.receiptNo" class="card-body-item card-body-item-100">
							<span>收据编号:
								<span class="mg-left-20">{{ item.receiptNo }}</span>
							</span>
						</div>
					</div>

					<div slot="actions" class="card-actions">
						<div v-if="item.checked == 0" class="card-actions-item" @click="modifyClick(item)">
							<van-icon color="#3c9cff" class-prefix="iconfont" name="xiugai" size="18"/>
							<span class="card-actions-item-text blue-color">修改</span>
						</div>
						<div v-if="item.checked == 0" class="card-actions-item" @click="delClick(item,index)">
							<van-icon color="#f56c6c" class-prefix="iconfont" name="shanchu" size="18"/>
							<span class="card-actions-item-text red-color">删除</span>
						</div>
						<div 
							v-if="authMap.includes('收款调账审核')" 
							class="card-actions-item" 
							@click="doCheck(item, index)"
						>
							<van-icon 
								class-prefix="iconfont" 
								:color="item.checked==1?'#f9ae3d':'#5ac725'" 
								:name="item.checked==1?'shanchu':'gou'" 
								size="18"
							/>
							<span :class="['card-actions-item-text', item.checked==1? 'yellow-color':'green-color']">
								{{ item.checked == 1 ? '取消':'确认' }}审核
							</span>
						</div>
					</div>
				</card>
			</van-list>
		</van-pull-refresh>
		<!-- 删除弹窗 -->
		<van-popup 
			v-model="config.popup.del.show" 
			:style="{ width: '95%',  backgroundColor: '#f1f1f1' }"
			:round="true"
		>
			<div class="popup-container">
				<div class="popup-title">
					删除原因
				</div>
				<van-field 
					v-model="delData.delRemark"
					required 
					autosize 
					rows="2"
					maxlength="50" 
					show-word-limit 
					type="textarea" 
					placeholder="请输入删除原因" 
				/>
				<div class="popup-btn">
					<van-button type="danger" @click="doDel">
						删除
					</van-button>
				</div>
			</div>
		</van-popup>
		<!-- 新增|删除弹窗 -->
		<van-popup
			v-model="config.popup.op.show" 
			:style="{ width: '95%',  backgroundColor: '#f1f1f1' }"
			:round="true"
			@close="opClose()"
		>
			<div class="popup-container">
				<div class="popup-title">
					{{ rowData.updateType == 3 ? '修改':'新增' }}
				</div>
				<cus-picker :cusName.sync="rowData.cusId" :showCHN="true"></cus-picker>
				<van-switch-cell 
					v-show=" formData.stateType == 0 "
					v-model="rowData.needInv" 
					:active-value="1" 
					:inactive-value="0" 
					title="需要开票" 
				/>
				<karry-date-picker 
					label="操作日期"
					:required="true"
					:minDate.sync="config.opDate.minDate"
					:maxDate.sync="config.opDate.maxDate"
					:dateTime.sync="rowData.opDate"
				/>
				<karry-pay-type 
					v-if="config.popup.op.show"
					:required="true"
					:stateType.sync="formData.stateType"
					:payTypeId.sync="rowData.payTypeId"
				/>
				<karry-date-picker 
					label="生效日期"
					:required="true"
					:minDate.sync="config.opDate.minDate"
					:maxDate.sync="config.opDate.maxDate"
					:dateTime.sync="rowData.issueDate"
				/>
				<van-field 
					required 
					:label="formData.stateType == 0?'调账金额':'收款金额'" 
					v-model="rowData.amount" 
					placeholder="请输入金额" 
					input-align="center" 
					:error-message="callDigitUppercase()" 
				/>
				<van-field 
					:label="formData.stateType == 0?'调账备注':'收款备注'" 
					v-model="rowData.remark" 
					autosize 
					rows="1" 
					maxlength="50" 
					show-word-limit 
					type="textarea" 
					placeholder="请输入备注"
				/>
				<van-field 
					label="收据编号" 
					v-model="rowData.receiptNo" 
					placeholder="请输入收据编号" 
					input-align="center"
				/>
				<div class="popup-btn">
					<van-button type="primary" @click="doOpCheck">
						{{ rowData.updateType == 3 ? '修改':'新增' }}
					</van-button>
				</div>
			</div>
		</van-popup>
		<!-- 筛选弹窗 -->
		<popup-filter 
			:filterShow.sync="config.filter.show" 
			@resetClick="reset" 
			@filterClick="filter"
		>
			<div slot="filter-field-1">
				<cus-picker :cusName.sync="formData.cusId"></cus-picker>
				<van-field 
					label="业务员" 
					v-model="formData.task" 
					placeholder="精确查询" 
					input-align="center"
				/>
				<time-range-picker
					:beginDate.sync="formData.beginDate"
					:endDate.sync="formData.endDate"
					:maxDate.sync="formData.maxDate"
					:minDate.sync="formData.minDate"
				></time-range-picker>
				<uni-check-box
					label="日期"
					:localdata="config.radio.dateType"
					:radioData.sync="formData.dateType" 
					:map="{text: 'title', value: 'value'}"
				>
				</uni-check-box>
				<div class="cell-label">科目</div>
				<uni-check-box
					:localdata="config.radio.payType"
					:radioData.sync="formData.payType" 
					:map="{text: 'shortName', value: 'shortName'}"
				>
				</uni-check-box>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)"/>
			</div>
		</popup-filter>
	</div>
</template>

<script>
	/*vant组件*/
	import { Button, Icon, Popup, Field, PullRefresh, List, SwitchCell, Sticky, Tab, Tabs, Dialog, Toast } from "vant"
	/*自定义客户筛选组件*/
	import PopupFilter from "@/components/subject/PopupFilter.vue"
	/*自定义单选组件*/
	import UniCheckBox from "@/components/subject/checkbox/UniCheckBox.vue"
	/*自定义日期区间组件*/
	import TimeRangePicker from "@/components/subject/time/TimeRangePicker.vue"
	/*自定义客户选择组件*/
	import CusPicker from "@/components/subject/picker/CusPicker.vue"
	/*自定义卡片组件*/
	import Card from "@/components/subject/card/Card.vue"
	/*自定义拖动菜单组件*/
	import DragMenu from "@/components/subject/fab/DragMenu.vue"
	/*自定义科目选择*/
	import KarryPayType from "@/components/karry/payType/KarryPayType.vue"
	/*自定义单日期选择*/
	import KarryDatePicker from "@/components/karry/datePicker/KarryDatePicker.vue"
	/*自定义方法*/
	import { getStorage, setStorage, removeStorage } from "@/util/storage"
	import { digitUppercase } from "@/util"
	/*async validator验证库*/
	import schema from "async-validator"
	/*api接口*/
	import { getWebConfig } from "@/api/common/webConfig.js"
	import { fetchList, doUpdate } from "@/api/staff/customer.js"
	export default {
		components: {
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Field.name]: Field,
			[PullRefresh.name]: PullRefresh,
			[List.name]: List,
			[SwitchCell.name]: SwitchCell,
			[Sticky.name]: Sticky,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			[Dialog.Component.name]: Dialog.Component,
			[Toast.name]: Toast,

			PopupFilter,
			UniCheckBox,
			TimeRangePicker,
			CusPicker,
			Card,
			DragMenu,
			KarryPayType,
			KarryDatePicker
		},
		data() {
			return {
				/*配置*/
				config: {
					/*筛选弹窗*/
					filter: {
						show: false
					},
					/*菜单配置*/
					menu: {
						content: [
							{
								text: '筛选',
								iconPath: 'filter-o',
								active: false
							},
							{
								text: '合计',
								iconPath: 'bill-o',
								active: false
							}
						]
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
					/*弹出层配置*/
					popup: {
						op: {
							show: false
						},
						del: {
							show: false
						},
					},
					switch: {
						checked: false
					},
					/*单选配置*/
					radio: {
						dateType: [
							{ title: '操作日期', value: 5 },
							{ title: '生效日期', value: 4 },
						],
						payType: []
					},
					/*操作表单日期*/
					opDate: {
						/*操作默认日期*/
						defaultDate: null,
						/*操作最大日期*/
						maxDate: null,
						/*操作最小日期*/
						minDate: null
					},
					/*模拟数据*/
					indexList: [],
					total: 0,
				},
				/*筛选条件*/
				formData: {
					//数据类型 13->收款调账模块
					dataType: 13,
					//0->收款 1->调账
					stateType: 0,
					/*日期类型 4->生效日期 5->操作日期*/
					dateType: 5,
					/*客户*/
					payType: '全部',
					//客户
					cusId: null,
					//业务员
					task: null,
					//开始日期
					beginDate: null,
					//结束日期
					endDate: null,
					//最小日期
					minDate: null,
					//最大日期
					maxDate: null,
					/*分页必须*/
					pageSize: 6,
					pageNo: 1,
				},
				/*修改|新增|审核表单*/
				rowData: {
					/**
					 * 更新类型
					 * 3->收款调账修改
					 * 4->收款调账新增
					 */
					updateType: 3,	
					//客户
					cusId: null,
					//操作日期
					opDate: null,
					//生效日期
					issueDate: null,
					//科目ID
					payTypeId: null,
					//金额
					amount: null,
					//备注(组件计数需要字符串)
					remark: '',
					//收据编号
					receiptNo: null,
					//是否需要发票
					needInv: null,
					//审核状态
					checked: null,
					//单号
					payId: null,
				},
				/*删除表单*/
				delData: {
					/**
					 * 更新类型
					 * 2->收款调账删除
					 */
					updateType: 2,
					/*厂商ID*/
					factoryId: null,
					//0->收款 1->调账
					stateType: null,
					//单号
					payId: null,
					/*删除原因*/
					delRemark: '',
					//记录index
					index: null,
				},
			}
		},
		computed: {
			...window.Vuex.mapGetters({
				viewH: 'page/viewH',
				authMap: 'user/authMap'
			}),
		},
		async created() {
			this.$store.commit('staff/setHeaderTitle', '收款调账')
			if( getStorage('frec/recAdjust') !== null ) {
				let storageData = JSON.parse(getStorage('frec/recAdjust'))
				this.formData = Object.assign({}, this.$options.data().formData, storageData)
				this.config.switch.checked = true
				await this.getConfig(false)
			} else {
				await this.getConfig()
			}
		},
		async mounted() {
			window.addEventListener('beforeunload', e => this.beforeunloadHandler())
			if( this.authMap.includes('收款调账维护') ) {
				await this.config.menu.content.push({
					text: '添加',
					iconPath: 'add-o',
					active: false
				})
			}
		},
		destroyed() {
			this.beforeunloadHandler()
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler())
		},
		methods: {
			/*菜单点击*/
			trigger({index, item}) {
				//筛选
				if( index == 0 ) {
					this.config.filter.show = true
				}
				//合计
				if( index == 1 ) {
					Toast({
						message: '合计金额:' + this.config.total	+ '元	',	
						duration: 4000				
					})
				} 
				//添加
				if( index == 2 ) {
					this.rowData.updateType = 4
					this.config.popup.op.show = true
				}
			},
			/*头部tabs改变*/
			async change(name, title) {
				await window.scrollTo(0, 0)
				this.config.indexList = this.$options.data().config.indexList
				this.formData.pageNo = 1
				await this.fetchData()
			},
			/*获取页面参数*/
			async getConfig( needDate = true ){
				const { result } = await getWebConfig({ paramType: 'staffFrec' })
				if( needDate ) {
					this.formData.beginDate = result.RecAdjustBeginDate
					this.formData.endDate = result.RecAdjustEndDate
					this.formData.maxDate = result.RecAdjustMaxDate
					this.formData.minDate = result.RecAdjustMinDate
				}
				this.config.opDate.defaultDate = result.defaultDate
				this.config.opDate.minDate = result.defaultMinDate
				this.config.opDate.maxDate = result.defaultMaxDate
				this.config.radio.payType = result.payType
				await this.fetchData()
			},
			/*获取列表数据*/
			async fetchData() {
				try {
					const { result } = await fetchList(this.formData)
					this.config.total = result.total
					result.list.forEach((item,index)=>{
						this.config.indexList.push(item)
					})
					if( result.list.length < this.formData.pageSize ) {
						this.config.list.finished = true
					} else {
						this.config.list.finished = false
					}
				} catch(err) {
					this.config.list.finished = true
				} finally {
					this.config.list.loading = false
				}
			},
			/*下拉刷新*/
			async pullOnRefresh() {
				this.config.indexList = this.$options.data().config.indexList
				this.config.total = this.$options.data().config.total
				this.formData.pageNo = 1
				await this.fetchData()
				this.config.pullRefresh.reloading = false
			},
			/*下拉加载*/
			async onLoad() {
				await this.formData.pageNo++
				await this.fetchData()
			},
			/*审核*/
			async doCheck( rowData, index ) {
				const { result } = await doUpdate({
					updateType: 5,
					factoryId: rowData.factoryId,
					stateType: this.formData.stateType,
					payId: rowData.payId,
					checked: rowData.checked
				})
				Toast({
					type: 'success',
					message: '数据更新成功',
					duration: 3000,
					onClose: ()=> {
						this.$set(this.config.indexList[index], 'checked', rowData.checked==0?1:0)
					}
				})
			},
			/*删除点击*/
			delClick(item, index) {
				this.delData = this.$options.data().delData
				this.delData.factoryId = item.factoryId
				this.delData.stateType = this.formData.stateType
				this.delData.payId = item.payId
				this.delData.index = index
				this.config.popup.del.show = true
			},
			/*删除*/
			async doDel() {
				if( this.delData.delRemark == 0 ) {
					Toast({
						type: 'fail',
						message: '请输入删除原因',
						duration: 3000,
					})
					return false
				}
				const { result } = await doUpdate(this.delData)
				Toast({
					type: 'success',
					message: '删除成功',
					duration: 3000,
					onClose: ()=> {
						this.config.indexList.splice(this.delData.index, 1)
						this.config.popup.del.show = false
					}
				})
			},
			/*修改点击*/
			modifyClick( item ) {
				this.rowData = Object.assign(
					{}, 
					this.rowData, 
					{ 
						opDate: this.config.opDate.defaultDate, 
						issueDate: this.config.opDate.issueDate
					}, 
					item
				)
				this.rowData.updateType = 3
				this.config.popup.op.show = true
			},
			/*修改|新增弹窗关闭*/
			opClose() {
				this.rowData = this.$options.data().rowData
			},
			/*新增或者修改*/
			doOpCheck() {

			},
			/*数字转中文大写*/
			callDigitUppercase() {
				return digitUppercase(this.rowData.amount)
			},
			/*重置按钮*/
			async reset() {
				this.config.indexList = this.$options.data().config.indexList
				this.config.total = this.$options.data().config.total
				this.formData = this.$options.data().formData
				this.config.switch.checked = false
				this.config.filter.show = false
				await this.getConfig()
			},
			/*筛选按钮*/
			async filter() {
				this.config.indexList = this.$options.data().config.indexList
				this.formData.pageNo = 1
				await this.fetchData()
			},
			beforeunloadHandler() {
				if( this.config.switch.checked ){
					setStorage('frec/recAdjust', this.formData)
				}else{
					removeStorage('frec/recAdjust')
				}
			}
		}
	}
</script>

<style type="text/css">
	@import '~@/assets/style/card.css';

	.cell-label {
		line-height: 1rem;
		font-size: 0.875rem;
		text-align: left;
		padding: 0.25rem 0rem 0.25rem 1rem;
	}

	.popup-container {
		padding: 0.25rem;
	}

	.popup-title {
		font-size: 1.25rem;
		line-height: 2rem;
		font-weight: 600;
		text-align: center;
	}

	.popup-btn {
		display: flex;
		justify-content: center;  
  		align-items: center;
  		margin-top: 0.5rem;  
	}
</style>