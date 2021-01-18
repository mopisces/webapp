<template>
	<div>
		<van-sticky :offset-top="46">
			<van-button plain hairline type="info" size="small" style="width:100%" @click="config.popup.filterShow = true">筛选</van-button>
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
		<van-pull-refresh v-model="config.list.pullRefresh.reloading" @refresh="pullOnRefresh">
			<van-list v-model="config.list.pushLoading.loading" :finished="config.list.pushLoading.finished"  finished-text="没有更多了" @load="onLoad" :offset="100">
				<van-panel v-for="(item,index) in info.panelList" :key="index" style="font-size:0.8125rem;background-color:#f5f7fa;margin:0 0.5rem 0.1rem 0.5rem;">
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
							<div class="van-col van-col--10">客户:{{ item.CusId}}</div>
							<div class="van-col van-col--10">客户简称:{{ item.CusShortName }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--20">规格:{{ item.GuiGe }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--20">压线:{{ item.ScoreInfo }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--7">订单数:{{ item.OrdQty }}</div>
							<div class="van-col van-col--6">送货数:{{ item.DeliQty }}</div>
							<div class="van-col van-col--7">退货数:{{ item.ReturnQty }}</div>
						</div>
					</div>
					<div slot="footer" style="text-align: right;">
						<van-button size="mini" type="info" @click="detailShowClick(item.strOrderId)">详情</van-button>
					</div>
				</van-panel>
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
				<cus-picker :cusName.sync="filterForm.cusName" ></cus-picker>
				<radio-cell :radioInfo.sync="filterForm.dateType" :radioColumns="config.radio.radioColumns" title="日期类型"></radio-cell>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
		<order-detail :orderType="detailData.orderType" :orderId="detailData.orderId" :detailShow.sync="config.popup.detailShow" @detailClose="detailClose"></order-detail>
	</div>
</template>
<script>
	import { Button, Field, PullRefresh, List, SwitchCell, Panel, Sticky, Tab, Tabs } from 'vant';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import CusPicker from '@/components/subject/picker/CusPicker.vue';
	import RadioCell from '@/components/subject/RadioCell.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import OrderDetail from '@/components/subject/OrderDetail.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,
			[PullRefresh.name]: PullRefresh,
			[List.name]: List,
			[SwitchCell.name]: SwitchCell,
			[Panel.name]: Panel,
			[Sticky.name]: Sticky,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			
			PopupFilter,
			CusPicker,
			RadioCell,
			NewTimePicker,
			OrderDetail
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
				sessionStorage.removeItem('erp/getOrders');
				this.config.getConfig = true;
				this.config.switch.checked = false;
				this.getConfig( true );
			},
			filterClick(){
				this.info.panelList = [];
				this.pullOnRefresh();
				this.config.popup.filterShow = false;
			},
			getConfig( isReset = false ){
				let self = this;
				this.$request.staff.erp.erpConfig().then(res=>{
					if( this.config.getConfig ){
						self.filterForm.beginDate = res.result.Wap1GetOrdersBeginDate;
						self.filterForm.endDate = res.result.Wap1GetOrdersEndDate;
					}
					self.pageConfig.maxDate = res.result.Wap1GetOrdersMaxDate;
					self.pageConfig.minDate = res.result.Wap1GetOrdersMinDate;
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.timePicker.isFinishLoad = true;
					});
				}).then(()=>{
					if( isReset ){
						return ;
					}
					this.$nextTick(()=>{
						this.getErpOrders( this.filterForm );
					});
				});
			},
			getErpOrders( data ){
				let self = this;
				this.$request.staff.erp.erpOrders( data ).then(res=>{
					if( res.result == null || res.result.length < 6 ){
						self.config.list.pushLoading.finished = true;
					}
					self.config.list.pushLoading.loading = false;
					res.result.forEach((item,index)=>{
						self.info.panelList.push(item);
					});
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
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','ERP订单');
			if( sessionStorage.getItem('erp/getOrders') !== null ){
				let storageData = JSON.parse(sessionStorage.getItem('erp/getOrders'));
				this.filterForm = storageData;
				this.config.getConfig      = false;
				this.config.switch.checked = true;
			}
		},
		mounted(){

		},
		updated(){
			
		},
		beforeDestory(){
			
		},
		destroyed(){
			if( this.config.switch.checked ){
				sessionStorage.setItem('erp/getOrders',JSON.stringify(this.filterForm));
			}else{
				sessionStorage.removeItem('erp/getOrders');
			}
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
