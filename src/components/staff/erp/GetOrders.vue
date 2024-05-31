<template>
	<div class="page-color" style="padding-bottom:3.125rem;">
		<van-sticky :offset-top="46">
			<van-tabs v-model="filterForm.erpState">
				<van-tab title="全部"></van-tab>
				<van-tab title="未审核"></van-tab>
				<van-tab title="已审核"></van-tab>
				<van-tab title="已传单"></van-tab>
				<van-tab title="已入库"></van-tab>
				<van-tab title="已送货"></van-tab>
				<van-tab title="有退货"></van-tab>
			</van-tabs>
		</van-sticky>
		<drag-menu 
			defpositon="rt" 
			:popMenu="false"
			:pattern="{icon: 'filter-o'}"
			value="筛选"
			@fabClick="menuClick"
		>
		</drag-menu>
		<van-pull-refresh v-model="config.list.pullRefresh.reloading" @refresh="pullOnRefresh">
			<van-list v-model="config.list.pushLoading.loading" :finished="config.list.pushLoading.finished"  finished-text="没有更多了" @load="onLoad" :offset="100">
				<card 
					:title="item.strOrderId" 
					:extra="item.CusPoNo"
					:is-shadow="true"
					v-for="(item,index) in info.panelList" 
					:key="index"
				>
					<div class="card-body-container">
						<div class="card-body-item card-body-item-100">
							<span>客户信息:
								<span class="mg-left-20">{{ item.CusShortName }}({{ item.CusId}})</span>
							</span>
						</div>
						<div 
							v-if="item.MatName"
							class="card-body-item card-body-item-100"
						>
							<span>货品名称:
								<span class="mg-left-20">{{ item.MatName }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<div class="card-body-txt">规格信息</div>:
							<span class="mg-left-20">{{ item.GuiGe }}</span>
							<span class="mg-left-20">{{ item.BoardId }}</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>压线信息:
								<span class="mg-left-20">{{ item.ScoreInfo }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<div class="card-body-txt blue-color">订单</div>|
							<div class="card-body-txt yellow-color">送货</div>|
							<div class="card-body-txt red-color">退货</div>:
							<span class="mg-left-20 blue-color">{{ item.OrdQty }}</span>
							<span class="mg-left-20 yellow-color">{{ item.DeliQty }}</span>
							<span class="mg-left-20 red-color">{{ item.ReturnQty }}</span>
						</div>
					</div>
					<div slot="actions" class="card-actions">
						<div class="card-actions-item" @click="detailShowClick(item.strOrderId)">
							<van-icon color="#3c9cff" class-prefix="iconfont" name="caidan" size="18"/>
							<span class="card-actions-item-text blue-color">详情</span>
						</div>
					</div>
				</card>
			</van-list>
		</van-pull-refresh>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<van-field label="订单编号" v-model="filterForm.orderId" placeholder="精确查询" input-align="center"  type="number" maxlength="10"></van-field>
				<van-field label="板长" v-model="filterForm.boardLength" placeholder="精确查询" input-align="center"  type="number" maxlength="10"></van-field>
				<van-field label="板宽" v-model="filterForm.boardWidth" placeholder="精确查询" input-align="center"  type="number" maxlength="10"></van-field>
				<van-field label="箱长" v-model="filterForm.boxLength" placeholder="精确查询" input-align="center"  type="number" maxlength="10"></van-field>
				<van-field label="箱宽" v-model="filterForm.boxWidth" placeholder="精确查询" input-align="center"  type="number" maxlength="10"></van-field>
				<van-field label="箱高" v-model="filterForm.boxHeight" placeholder="精确查询" input-align="center"  type="number" maxlength="10"></van-field>
				<van-field label="订单数" v-model="filterForm.orderQuantity" placeholder="精确查询" input-align="center" type="number" maxlength="10"></van-field>
				<cus-picker ref="cusPicker" :cusName.sync="filterForm.cusName" ></cus-picker>
				<uni-check-box
					label="日期"
					:localdata="config.radio.radioColumns"
					:radioData.sync="filterForm.dateType" 
					:map="{text: 'title', value: 'value'}"
				>
				</uni-check-box>
				<time-range-picker
					:beginDate.sync="filterForm.beginDate"
					:endDate.sync="filterForm.endDate"
					:maxDate.sync="pageConfig.maxDate"
					:minDate.sync="pageConfig.minDate"
				></time-range-picker>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
		<order-detail :orderType="detailData.orderType" :orderId="detailData.orderId" :detailShow.sync="config.popup.detailShow" @detailClose="detailClose"></order-detail>
	</div>
</template>
<script>
	import { Button, Icon, Field, PullRefresh, List, SwitchCell, Sticky, Tab, Tabs } from 'vant';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import CusPicker from '@/components/subject/picker/CusPicker.vue';
	import RadioCell from '@/components/subject/RadioCell.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import OrderDetail from '@/components/subject/OrderDetail.vue';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';

	import Card from '@/components/subject/card/Card.vue'
	import UniCheckBox from '@/components/subject/checkbox/UniCheckBox.vue'
	import TimeRangePicker from '@/components/subject/time/TimeRangePicker.vue'
	import DragMenu from '@/components/subject/fab/DragMenu.vue'
	/*api接口*/
	import { getWebConfig } from '@/api/common/webConfig.js'

	export default {
		components:{
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Field.name]: Field,
			[PullRefresh.name]: PullRefresh,
			[List.name]: List,
			[SwitchCell.name]: SwitchCell,
			[Sticky.name]: Sticky,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			
			PopupFilter,
			CusPicker,
			RadioCell,
			NewTimePicker,
			OrderDetail,

			Card,
			UniCheckBox,
			TimeRangePicker,
			DragMenu
		},
		data(){
			return {
				pageConfig:{
					beginDate : '',
					minDate   : '',
					maxDate   : '',
					endDate   : ''
				},
				cusPicker:{
					searchData : '',
				},
				config:{
					getConfig : true,
					popup:{
						filterShow : false,
						timePicker:{
							isFinishLoad:false
						},
						detailShow : false,
					},
					list:{
						pullRefresh:{
							reloading : false,
							isInit    : true
						},
						pushLoading:{
							finished : false,
							loading  : false
						}
					},
					radio:{
						radioColumns:[
							{title:'订单日期',value:'1'},
							{title:'交货日期',value:'2'}
						],
					},
					switch:{
						checked : false
					}
				},
				info:{
					panelList : [],
				},
				filterForm:{
					orderId       : '',
					boardLength   : '',
					boardWidth    : '',
					boxLength     : '',
					boxWidth      : '',
					boxHeight     : '',
					orderQuantity : '',
					cusName       : '',
					dateType      : '1',
					beginDate     : '',
					endDate       : '',
					curPage       : 0,
					erpState      : 0
				},
				detailData:{
					orderId    : '',
					orderType  : '',
					strOrderId : ''
				}
			}
		},
		methods:{
			menuClick(){
				this.config.popup.filterShow = true
			},
			pullOnRefresh(){
				this.filterForm.curPage = 0;
				this.info.panelList     = [];
				this.config.list.pullRefresh.reloading = false;
				this.config.list.pushLoading.finished  = false;
				this.config.list.pushLoading.loading   = true;;
				this.onLoad();
			},
			onLoad(){
				if( this.config.list.pullRefresh.isInit ){
					this.filterForm.curPage = 1;
					this.getConfig();
					this.config.list.pullRefresh.isInit = false;
				}else{
					this.filterForm.curPage++;
					this.getErpOrders( this.filterForm );
				}
			},
			resetClick(){
				this.filterForm = {
					orderId       : '',
					boardLength   : '',
					boardWidth    : '',
					boxLength     : '',
					boxWidth      : '',
					boxHeight     : '',
					orderQuantity : '',
					cusName       : '',
					dateType      : '1',
					curPage       : 0,
					erpState      : this.filterForm.erpState,
					beginDate     : '',
					endDate       : ''
				};
				this.$refs.cusPicker.cusPickerClean();
				removeStorage('erp/getOrders');
				this.config.getConfig = true;
				this.config.switch.checked = false;
				this.getConfig( true );
			},
			filterClick(){
				this.info.panelList = [];
				this.pullOnRefresh();
				this.config.popup.filterShow = false;
			},
			async getConfig( isReset = false ){
				const { result } = await getWebConfig({paramType: 'staffErp'})
				if( this.config.getConfig ){
					this.filterForm.beginDate = result.Wap1GetOrdersBeginDate
					this.filterForm.endDate = result.Wap1GetOrdersEndDate
				}
				this.pageConfig.maxDate = result.Wap1GetOrdersMaxDate
				this.pageConfig.minDate = result.Wap1GetOrdersMinDate
				if( isReset ) return 
				await this.getErpOrders( this.filterForm )
			},
			getErpOrders( data ){
				let self = this;
				this.$request.staff.erp.erpOrders( data ).then(res=>{
					if( res.result == null || res.result.length < 6 ){
						self.config.list.pushLoading.finished = true;
					}
					self.config.list.pushLoading.loading = false;
					if( res.result != null ){
						res.result.forEach((item,index)=>{
							self.info.panelList.push(item);
						});
					}
				});
			},
			detailShowClick( strOrderId ){
				this.detailData.orderId      = strOrderId.substring(1);
				this.detailData.orderType    = strOrderId[0];
				this.detailData.strOrderId   = strOrderId;
				this.config.popup.detailShow = true;
			},
			detailClose(){
				this.config.popup.detailShow = false;
			},
			beforeunloadHandler(){
				if( this.config.switch.checked ){
					setStorage('erp/getOrders',this.filterForm);
				}else{
					removeStorage('erp/getOrders');
				}
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','ERP订单');
			if( getStorage('erp/getOrders') !== null ){
				let storageData = JSON.parse(getStorage('erp/getOrders'));
				this.filterForm = storageData;
				this.config.getConfig      = false;
				this.config.switch.checked = true;
			}
		},
		mounted(){
			window.addEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		updated(){
			
		},
		beforeDestory(){
			
		},
		destroyed(){
			this.beforeunloadHandler();
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		computed:{
			orderState(){
				return this.filterForm.erpState;
			}
		},
		watch:{
			orderState( newV,oldV ){
				this.info.panelList = [];
				this.pullOnRefresh();
			}
		}
	}
</script>
<style type="text/css">
	@import '~@/assets/style/card.css';
</style>
