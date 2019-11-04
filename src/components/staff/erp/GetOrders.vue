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
				<van-panel v-for="(item,index) in info.panelList" :key="index">
					<div slot="default">
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
							<div class="van-col van-col--6">订单数:{{ item.OrdQty }}</div>
							<div class="van-col van-col--6">送货数:{{ item.DeliQty }}</div>
							<div class="van-col van-col--6">退货数:{{ item.ReturnQty }}</div>
						</div>
					</div>
					<div slot="footer" style="text-align: right;">
						<van-button size="small" type="info" @click="detailShowClick(item.strOrderId)">详情</van-button>
					</div>
				</van-panel>
			</van-list>
		</van-pull-refresh>
		<popup-filter :filterShow.sync="config.popup.filterShow"  @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<van-field label="订单编号" v-model="filterForm.orderId" placeholder="精确查询" input-align="center"  type="number" maxlength="10"></van-field>
				<van-field label="板长" v-model="filterForm.boardLength" placeholder="精确查询" input-align="center"  type="number" maxlength="10"></van-field>
				<van-field label="板宽" v-model="filterForm.boardWidth" placeholder="精确查询" input-align="center"  type="number" maxlength="10"></van-field>
				<van-field label="箱长" v-model="filterForm.boxLength" placeholder="精确查询" input-align="center"  type="number" maxlength="10"></van-field>
				<van-field label="箱宽" v-model="filterForm.boxWidth" placeholder="精确查询" input-align="center"  type="number" maxlength="10"></van-field>
				<van-field label="箱高" v-model="filterForm.boxHeight" placeholder="精确查询" input-align="center"  type="number" maxlength="10"></van-field>
				<van-field label="订单数" v-model="filterForm.orderQuantity" placeholder="精确查询" input-align="center" type="number" maxlength="10"></van-field>
			</div>
			<van-field readonly clickable label="客户名称" :value="filterForm.cusName" placeholder="选择客户名称" input-align="center" @click="config.popup.cusShow = true"  slot="filter-field-2"></van-field>
			<radio-cell :radioInfo.sync="filterForm.dateType" :radioColumns="config.radio.radioColumns" title="日期类型" slot="filter-field-3"></radio-cell>
			<van-field readonly clickable label="开始日期" v-model="filterForm.beginDate" placeholder="选择开始日期" input-align="center" @click="config.popup.timeShow.start = true" slot="filter-field-3"></van-field>
			<van-field readonly clickable label="结束日期" v-model="filterForm.endDate" placeholder="选择结束日期" input-align="center" @click="config.popup.timeShow.end = true" slot="filter-field-4"></van-field>
			<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" slot="filter-field-5" @change="filterRemClick"/>
		</popup-filter>
		<cus-picker :show.sync="config.popup.cusShow" :searchData.sync="cusPicker.searchData" :index.sync="pageConfig.defaultIndex" @cusPickerCancel="cusPickerCancel" @cusPickerConfirm="cusPickerConfirm"></cus-picker>
		<time-picker :dateTimeShow.sync="config.popup.timeShow.start" :dateTime.sync="pageConfig.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate"  @onCancel="timePickerCancel" @onConfirm="timeBeginConfirm"></time-picker>
		<time-picker :dateTimeShow.sync="config.popup.timeShow.end" :dateTime.sync="pageConfig.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" @onCancel="timePickerCancel" @onConfirm="timeEndConfirm"></time-picker>
		<order-detail :orderType="detailData.orderType" :orderId="detailData.orderId" :detailShow.sync="config.popup.detailShow" @detailClose="detailClose"></order-detail>
	</div>
</template>
<script>
	import { Button, Field, PullRefresh, List, SwitchCell, Panel, Sticky, Tab, Tabs } from 'vant';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import CusPicker from '@/components/subject/CusPicker.vue';
	import RadioCell from '@/components/subject/RadioCell.vue';
	import TimePicker from '@/components/subject/TimePicker.vue';
	import OrderDetail from '@/components/subject/OrderDetail.vue';
	import { dateTimeFormat } from '@/util/index';
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
			TimePicker,
			OrderDetail
		},
		data(){
			return {
				active:'0',
				pageConfig:{
					defaultIndex:-1,
					beginDate:new Date(),
					minDate:new Date(),
					maxDate:new Date(),
					endDate:new Date()
				},
				cusPicker:{
					searchData:'',
				},
				config:{
					getConfig:true,
					isInit:true,
					popup:{
						filterShow:false,
						cusShow:false,
						timeShow:{
							start:false,
							end:false
						},
						detailShow:false,
					},
					list:{
						pullRefresh:{
							reloading:false,
							isInit:true
						},
						pushLoading:{
							finished:false,
							loading:false
						}
					},
					radio:{
						radioColumns:[
							{title:'订单日期',value:'1'},
							{title:'交货日期',value:'2'}
						],
					},
					switch:{
						checked:false
					}
				},
				info:{
					panelList:[],
				},
				filterForm:{
					orderId:'',
					boardLength:'',
					boardWidth:'',
					boxLength:'',
					boxWidth:'',
					boxHeight:'',
					orderQuantity:'',
					cusName:'',
					dateType:'1',
					beginDate:'',
					endDate:'',
					curPage:1,
					erpState:0
				},
				detailData:{
					orderId:'',
					orderType:'',
					strOrderId:''
				}
			}
		},
		methods:{
			pullOnRefresh(){
				this.getErpOrders( this.filterForm , true);
				this.config.list.pullRefresh.reloading = false;
			},
			onLoad(){
				if( this.config.list.pullRefresh.isInit ){
					this.getConfig();
					this.config.list.pullRefresh.isInit = false;
				}else{
					this.getErpOrders( this.filterForm );
				}
			},
			resetClick(){
				this.filterForm = {
					orderId:'',
					boardLength:'',
					boardWidth:'',
					boxLength:'',
					boxWidth:'',
					boxHeight:'',
					orderQuantity:'',
					cusName:'',
					dateType:'1',
					curPage:1,
					erpState:0,
					beginDate:'',
					endDate:''
				};
				sessionStorage.removeItem('erp/getOrders');
				this.getConfig( true );
			},
			filterClick(){
				this.getErpOrders( this.filterForm ,true );
				this.config.popup.filterShow = false;
			},
			cusPickerCancel(){
				this.config.popup.cusShow = false;
				this.filterForm.cusName = '';
			},
			cusPickerConfirm( result ){
				this.config.popup.cusShow = false;
				this.filterForm.cusName = '';
				this.pageConfig.defaultIndex = -1;
				if( JSON.stringify(result.value) !== '[]' ){
					this.pageConfig.defaultIndex = result.index;
					this.filterForm.cusName = result.key;
				}
			},

			timePickerCancel(){
				this.config.popup.timeShow.start = false;
				this.config.popup.timeShow.end = false;
			},
			timeBeginConfirm( value ){
				this.filterForm.beginDate = dateTimeFormat( value.value,'yyyy-MM-dd' );
				this.pageConfig.beginDate = value.value;
				this.timePickerCancel();
			},
			timeEndConfirm( value ){
				this.filterForm.endDate = dateTimeFormat( value.value,'yyyy-MM-dd' );
				this.pageConfig.endDate = value.value;
				this.timePickerCancel();
			},
			filterRemClick( checked ){
				if( checked ){
					let storageData = Object.assign({},this.filterForm,{defaultIndex:this.pageConfig.defaultIndex})
					sessionStorage.setItem('erp/getOrders',JSON.stringify(storageData));
				}else{
					sessionStorage.removeItem('erp/getOrders');
				}
			},

			getConfig( isReset = false ){
				let self = this;
				this.$request.staff.erp.erpConfig().then(res=>{
					if( this.config.getConfig ){
						self.filterForm.beginDate = res.result.Wap1GetOrdersBeginDate;
						self.filterForm.endDate = res.result.Wap1GetOrdersEndDate;

						self.pageConfig.beginDate = new Date(res.result.Wap1GetOrdersBeginDate);
						self.pageConfig.endDate = new Date(res.result.Wap1GetOrdersEndDate);
					}
					self.pageConfig.maxDate = new Date(res.result.Wap1GetOrdersMaxDate);
					self.pageConfig.minDate = new Date(res.result.Wap1GetOrdersMinDate);
				}).then(()=>{
					if( isReset ){
						return ;
					}
					this.getErpOrders( this.filterForm );
				});
			},
			getErpOrders( data , isReloading = false ){
				let self = this;
				data.curPage++;
				if( isReloading ){
					data.curPage = 1;
				}
				this.$request.staff.erp.erpOrders( data ).then(res=>{
					if( isReloading ){
						self.info.panelList = [];
						self.info.panelList = res.result;
					}else{
						res.result.forEach((item,index)=>{
							self.info.panelList.push(item);
						});
					}
					self.config.list.pushLoading.loading = false;
					if( res.result == null || res.result.length < 6 ){
						self.config.list.pushLoading.finished = true;
					}
				});
			},
			detailShowClick( strOrderId ){
				this.detailData.orderId = strOrderId.substring(1);
				this.detailData.orderType = strOrderId[0];
				this.detailData.strOrderId = strOrderId;
				this.config.popup.detailShow = true;
			},
			detailClose(){
				this.config.popup.detailShow = false;
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','ERP订单');
			if( sessionStorage.getItem('erp/getOrders') ){
				let storageData = JSON.parse(sessionStorage.getItem('erp/getOrders'));
				this.pageConfig.defaultIndex = storageData.defaultIndex;
				delete storageData.defaultIndex;
				this.filterForm = storageData;
				this.pageConfig.beginDate = new Date(storageData.beginDate);
				this.pageConfig.endDate = new Date(storageData.endDate);
				this.config.getConfig = false;
				this.config.switch.checked = true;
			}
		},
		mounted(){
			
		},
		updated(){

		},
		computed:{
			orderState(){
				return this.filterForm.erpState;
			}
		},
		watch:{
			orderState( newV,oldV ){
				this.getErpOrders( this.filterForm, true );
			},
			filterForm:{
				handler( newV, oldV ){
					if( this.config.getConfig ){
						this.config.switch.checked = false;
					}
				},
				deep:true
			}
		}
	}
</script>
