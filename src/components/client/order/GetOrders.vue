<template>
	<div class="page-color">
		<van-sticky :offset-top="46">
			<van-button plain hairline type="info" size="small" style="width:100%" @click="config.popup.filterShow = true">筛选</van-button>
			<van-tabs v-model="filterForm.orderType">
				<van-tab title="全部"   name="7"></van-tab>
				<van-tab title="未审核" name="1"></van-tab>
				<van-tab title="已审核" name="2"></van-tab>
				<van-tab title="已传单" name="3"></van-tab>
				<van-tab title="已入库" name="4"></van-tab>
				<van-tab title="已送货" name="5"></van-tab>
				<van-tab title="有退货" name="6"></van-tab>
			</van-tabs>
		</van-sticky>
		<van-pull-refresh v-model="config.list.pullRefresh.reloading" @refresh="pullOnRefresh">
			<van-list v-model="config.list.pushLoading.loading" :finished="config.list.pushLoading.finished"  finished-text="没有更多了" @load="onLoad" :offset="100">
				<card 
					:title="item.strOrderId" 
					:extra="item.CusPoNo"
					:is-shadow="true"
					v-for="(item,index) in listData" 
					:key="index"
				>
					<div class="card-body-container">
						<div v-if="item.MatName" class="card-body-item card-body-item-100">
							<span>货品名称:
								<span class="mg-left-20">{{ item.MatName }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>材质信息:
								<span class="mg-left-20">{{ item.BoardId }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<div class="card-body-txt">规格信息:</div>
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
							<div class="card-body-txt green-color">送货</div>|
							<div class="card-body-txt red-color">退货</div>:
							<span class="mg-left-20 blue-color">{{ item.OrdQty }}</span>
							<span class="mg-left-20 green-color">{{ item.DeliQty }}</span>
							<span class="mg-left-20 red-color">{{ item.ReturnQty }}</span>
						</div>
					</div>
					<div slot="actions" class="card-actions">
						<div class="card-actions-item" @click="detailShowClick(item.strOrderId)">
							<van-icon color="#3c9cff" name="bars" size="18"/>
							<span class="card-actions-item-text blue-color">详情</span>
						</div>
					</div>
				</card>
				<!-- <van-panel v-for="(item,index) in listData" :key="index" style="font-size:0.8125rem;background-color:#f5f7fa;margin:0 0.5rem 0.1rem 0.5rem;">
					<div slot="default" style="padding:0.5rem;">
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--20">货品名称:{{ item.MatName }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--20">订单编号:{{ item.strOrderId }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--10">客订单号:{{ item.CusPoNo }}</div>
							<div class="van-col van-col--10">材质:{{ item.BoardId }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--20">规格:{{ item.GuiGe }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--20">压线:{{ item.ScoreInfo }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--6">订单数:{{ item.OrdQty }}</div>
							<div class="van-col van-col--6">送货数:{{ item.DeliQty }}</div>
							<div class="van-col van-col--8">退货数:{{ item.ReturnQty }}</div>
						</div>
						<div slot="footer" style="text-align: right;">
							<van-button size="mini" type="info" @click="detailShowClick(item.strOrderId)">详情</van-button>
						</div>
					</div>
				</van-panel> -->
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
				<!-- <radio-cell :radioInfo.sync="filterForm.dateType" :radioColumns="config.radio.dateColumns" title="日期类型"></radio-cell> -->
				<uni-check-box
					label="日期"
					:localdata="config.radio.dateColumns"
					:radioData.sync="filterForm.dateType" 
					:map="{text: 'title', value: 'value'}"
				>
				</uni-check-box>
				<!-- <new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker> -->
				<time-range-picker
					:beginDate.sync="filterForm.beginDate"
					:endDate.sync="filterForm.endDate"
					:maxDate.sync="pageConfig.maxDate"
					:minDate.sync="pageConfig.minDate"
				></time-range-picker>
				<!-- <radio-cell :radioInfo.sync="filterForm.isWx" :radioColumns="config.radio.wxColumns" title="是否微信下单"></radio-cell> -->
				<uni-check-box
					label="微信下单"
					:localdata="config.radio.wxColumns"
					:radioData.sync="filterForm.isWx" 
					:map="{text: 'title', value: 'value'}"
				>
				</uni-check-box>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
		<order-detail :orderType="detailData.orderType" :orderId="detailData.orderId" :detailShow.sync="config.popup.detailShow" @detailClose="detailClose"></order-detail>
	</div>
</template>
<script>
	import { Button, Icon, Field, PullRefresh, List, SwitchCell,  Sticky, Tab, Tabs } from 'vant';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	//import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import RadioCell from '@/components/subject/RadioCell.vue';
	import OrderDetail from '@/components/subject/OrderDetail.vue';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';

	import Card from '@/components/subject/card/Card.vue'
	import UniCheckBox from '@/components/subject/checkbox/UniCheckBox.vue'
	import TimeRangePicker from '@/components/subject/time/TimeRangePicker.vue'
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
			//NewTimePicker,
			RadioCell,
			OrderDetail,

			Card,
			UniCheckBox,
			TimeRangePicker
		},
		data(){
			return {
				config:{
					getConfig:true,
					list:{
						pullRefresh : {
							reloading : false,
							isInit    : true
						},
						pushLoading : {
							loading  : false,
							finished : false
						}
					},
					popup : {
						timePicker : {
							isFinishLoad : false
						},
						filterShow : false,
						detailShow : false
					},
					switch:{
						checked : false
					},
					radio:{
						dateColumns : [
							{ title:'订单日期', value:'1' },
							{ title:'交货日期', value:'2' }
						],
						wxColumns :[
							{ title:'全部', value:'2' },
							{ title:'是',   value:'1' },
							{ title:'否',   value:'0' },
						]
					}
				},
				listData:[],
				filterForm:{
					beginDate     : '',
					endDate       : '',
					orderType     : '7',
					orderId       : '',
					boardLength   : '',
					boardWidth    : '',
					boxLength     : '',
					boxWidth      : '',
					boxHeight     : '',
					orderQuantity : '',
					dateType      : '1',
					isWx          : '2',
					curPage       : 0
				},
				pageConfig:{
					maxDate : '',
					minDate : '',
				},
				detailData:{
					orderId    : '',
					orderType  : '',
				}
			}
		},
		methods:{
			pullOnRefresh(){
				this.listData           = [];
				this.filterForm.curPage = 0;
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
			detailShowClick( strOrderId ){
				this.detailData.orderId      = strOrderId.substring(1);
				this.detailData.orderType    = strOrderId[0];
				this.detailData.strOrderId   = strOrderId;
				this.config.popup.detailShow = true;
			},
			async getConfig( isReset = false ){
				const { result } = await getWebConfig({paramType: 'clientOM'})
				if( this.config.getConfig ){
					this.filterForm.beginDate = result.Wap0GetOrdersBeginDate
					this.filterForm.endDate = result.Wap0GetOrdersEndDate
				}
				this.pageConfig.maxDate = result.Wap0GetOrdersMaxDate
				this.pageConfig.minDate =result.Wap0GetOrdersMinDate
				if( isReset ) return 
				await this.getErpOrders( this.filterForm )
			},
			getErpOrders( data ){
				let self = this;
				this.$request.client.ordersManage.erpOrders( data ).then(res=>{
					if( res.result == null || res.result.length < 6 ){
						self.config.list.pushLoading.finished = true;
					}
					self.config.list.pushLoading.loading = false;
					if( res.result ){
						res.result.forEach((item,index)=>{
							self.listData.push(item);
						});
					}
					
				});
			},
			resetClick(){
				this.filterForm = {
					beginDate     : '',
					endDate       : '',
					orderType     : this.filterForm.orderType,
					orderId       : '',
					boardLength   : '',
					boardWidth    : '',
					boxLength     : '',
					boxWidth      : '',
					boxHeight     : '',
					orderQuantity : '',
					dateType      : '1',
					isWx          : '2',
					curPage       : 0
				};
				removeStorage('client-erp/getOrders');
				this.config.switch.checked = false;
				this.config.getConfig      = true;
				this.getConfig( true );
			},
			filterClick(){
				this.listData = [];
				this.pullOnRefresh();
				this.config.popup.filterShow = false;
			},
			detailClose(){
				this.config.popup.detailShow = false;
			},
			beforeunloadHandler(){
				if( this.config.switch.checked ){
					setStorage('client-erp/getOrders',this.filterForm);
				}else{
					removeStorage('client-erp/getOrders');
				}
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','ERP订单');
			if( getStorage('client-erp/getOrders') !== null ){
				let storageData = JSON.parse(getStorage('client-erp/getOrders'));
				this.filterForm            = storageData;
				this.config.switch.checked = true;
				this.config.getConfig      = false;
			}
		},
		mounted(){
			window.addEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		updated(){
			
		},
		destroyed(){
			this.beforeunloadHandler();
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		computed:{
			orderTypeChange(){
				return this.filterForm.orderType;
			}
		},
		watch:{
			orderTypeChange( newV,oldV ){
				this.listData = [];
				this.pullOnRefresh();
			}
		}
	}
</script>
<style type="text/css">
	@import '~@/assets/style/card.css';
</style>