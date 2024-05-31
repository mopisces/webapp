<template>
	<div class="page-color">
		<van-sticky :offset-top="46">
			<van-button plain hairline type="info" size="small" style="width:100%" @click="config.popup.filterShow = true">筛选</van-button>
			<van-tabs v-model="filterForm.type">
				<van-tab title="送货" name="1"></van-tab>
				<van-tab title="退货" name="2"></van-tab>
				<van-tab title="调账折扣" name="3"></van-tab>
			</van-tabs>
		</van-sticky>
		<van-pull-refresh v-model="config.list.pullRefresh.reloading" @refresh="pullOnRefresh">
			<card 
				:title="item.strOrderId" 
				:subTitle="item.IssueDate"
				:extra="item.CusPoNo"
				:is-shadow="true"
				v-for="(item, index) in listData" 
				:key="index"
			>
				<div class="card-body-container">
					<div class="card-body-item card-body-item-100">
						<div class="card-body-txt">单号:</div>
						<span class="mg-left-20">{{ item.DNStr }}</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>订单类型:
							<span class="mg-left-20">{{ item.CTypeName }}</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>订单规格:
							<span class="mg-left-20">{{ item.GuiGe }}</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>送货数量:
							<span class="mg-left-20">{{ item.DeliQty }}</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>送货金额:
							<span class="mg-left-20">{{ item.Amount }}元</span>
						</span>
					</div>
				</div>
			</card>
			<!-- <van-panel v-for="(item,index) in listData" :key="index" style="font-size:0.8125rem;background-color:#f1f1f1;margin:0 0.5rem 0.1rem 0.5rem;">
				<div slot="default" style="padding:0.5rem;">
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--22">
							生效日期:
							<span style="color:#1da02b;">{{ item.IssueDate }}</span>
						</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--10">
							类型:
							<span style="color:#1da02b;">{{ item.CTypeName }}</span>
						</div>
						<div class="van-col van-col--12">
							单号:
							<span style="color:#1da02b;">{{ item.DNStr }}</span>
						</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--22">
							订单编号:
							<span style="color:#1da02b;">{{ item.strOrderId }}</span>
						</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--22">
							客订单号:
							<span style="color:#1da02b;">{{ item.CusPoNo }}</span>
						</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--22">
							规格:
							<span style="color:#1da02b;">{{ item.GuiGe }}</span>
						</div>
					</div>
					<div class="van-row van-row--flex van-row--justify-center">
						<div class="van-col van-col--10">
							送货数:
							<span style="color:#1da02b;">{{ item.DeliQty }}</span>
						</div>
						<div class="van-col van-col--12">
							金额:
							<span style="color:#1da02b;">{{ item.Amount }}</span>
						</div>
					</div>
					<div slot="footer" style="text-align: right;" v-if=" filterForm.type == '1' || filterForm.type == '2' ">
						<van-button size="mini" type="info" @click="detailShowClick(item.strOrderId)">详情</van-button>
					</div>
				</div>
			</van-panel> -->
		</van-pull-refresh>
		<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0rem 1rem;">
      		我也是有底线的
  		</div>
  		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
  			<div slot="filter-field-1">
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
	import { Button, PullRefresh, List, SwitchCell, Sticky, Tab, Tabs } from 'vant';
	import OrderDetail from '@/components/subject/OrderDetail.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';
	import { exportExcel } from '@/util/exportToExcel'
	import { dateTimeFormat } from '@/util'

	import Card from '@/components/subject/card/Card.vue'
	import TimeRangePicker from '@/components/subject/time/TimeRangePicker.vue'
	/*api接口*/
	import { getWebConfig } from '@/api/common/webConfig.js'

	export default {
		components:{
			[Button.name]: Button,
			[PullRefresh.name]: PullRefresh,
			[List.name]: List,
			[SwitchCell.name]: SwitchCell,
			[Sticky.name]: Sticky,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,

			OrderDetail,
			PopupFilter,

			Card,
			TimeRangePicker
		},
		data(){
			return {
				config:{
					list : {
						pullRefresh : {
							reloading : false,
						}
					},
					popup : {
						detailShow : false,
						filterShow : false,
						timePicker : {
							isFinishLoad : false
						}
					},
					switch:{
						checked : false
					},
					isInit : true
				},
				filterForm:{
					beginDate : '',
					endDate   : '',
					type      : '1',
				},
				pageConfig:{
					maxDate : '',
					minDate : '',
				},
				listData : [],
				detailData : {
					orderType : '',
					orderId   : ''
				}
			}
		},
		methods:{
			pullOnRefresh(){
				this.statementAccount();
			},
			async getConfig( isReset = false ){
				const { result } = await getWebConfig({paramType: 'clientCB'})
				if( !this.config.isInit ){
					this.filterForm.beginDate = result.GetCusFreeMBBeginDate
					this.filterForm.endDate = result.GetCusFreeMBEndDate
				}
				this.pageConfig.maxDate = result.GetCusFreeMBMaxDate
				this.pageConfig.minDate = result.GetCusFreeMBMinDate
				if( isReset ) return 
				await this.statementAccount()
				this.config.isInit = false
			},
			statementAccount(){
				let self = this;
				self.listData = [];
				this.$request.client.cred.statementAccount( this.filterForm ).then(res=>{
					self.listData = res.result;
				}).then(()=>{
					this.config.list.pullRefresh.reloading = false;
				});
			},
			detailShowClick( strOrderId ){
				this.detailData.orderId      = strOrderId.substring(1);
				this.detailData.orderType    = strOrderId[0];
				this.config.popup.detailShow = true;
			},
			detailClose(){
				this.config.popup.detailShow = false;
			},
			resetClick(){
				this.config.switch.checked = false;
				removeStorage('client-order/getCusFreeMB');
				this.getConfig( true );
			},
			filterClick(){
				this.pullOnRefresh();
			},
			beforeunloadHandler(){
				if( this.config.switch.checked ){
					setStorage('client-order/getCusFreeMB',this.filterForm);
				}else{
					removeStorage('client-order/getCusFreeMB');
				}
			},
			download(){
				exportExcel(this.listData,'hellowolrd')
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','对账单');
			if( getStorage('client-order/getCusFreeMB') !== null ){
				let storageData = JSON.parse(getStorage('client-order/getCusFreeMB'));
				this.filterForm = storageData;
				this.config.switch.checked = true;
			}else{
				this.config.isInit = false;
			}
		},
		mounted(){
			this.getConfig();
			window.addEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		updated(){
			
		},
		destroyed(){
			this.beforeunloadHandler();
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		computed:{
			typeChange(){
				return this.filterForm.type;
			}
		},
		watch:{
			typeChange( newV,oldV ){
				this.pullOnRefresh();
			}
		}
	}
</script>

<style type="text/css">
	@import '~@/assets/style/card.css';
</style>