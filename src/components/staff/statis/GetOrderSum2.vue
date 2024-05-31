<template>
	<div class="amount-statis-container">
		<div class="amount-statis-filter">
			<van-button 
				plain 
				hairline 
				type="info" 
				size="small" 
				style="width:100%" 
				@click="config.popup.filterShow = true">
				筛选
			</van-button>
		</div>
		<div class="amount-statis-card">
			<div class="bill-statis-list">
				<div class="bill-statis-item">
					<div class="bill-statis-text">
						下单金额
					</div>
					<div class="bill-statis-value">
						{{ formData.dailyTotal }}
					</div>
				</div>
				<div class="bill-statis-item">
					<div class="bill-statis-text">
						送货金额
					</div>
					<div class="bill-statis-value">
						{{ formData.deliveryTotal }}
					</div>
				</div>
				<div class="bill-statis-item">
					<div class="bill-statis-text">
						上月返点金额
					</div>
					<div class="bill-statis-value">
						{{ formData.pointTotal }}
					</div>
				</div>
			</div>
		</div>
	
		<van-tabs v-model="config.tabs.active">
			<van-tab title="退货汇总">
				<v-table 
					is-horizontal-resize 
					:is-vertical-resize="true" 
					style="width:100%;" 
					:columns="config.table.columns.return" 
					:table-data="config.table.data.return" 
					row-hover-color="#eee" 
					row-click-color="#edf7ff" 
					:height="config.table.height" 
					even-bg-color="#fafafa">
				</v-table>
			</van-tab>
			<van-tab title="返利汇总">
				<v-table 
					is-horizontal-resize 
					:is-vertical-resize="true" 
					style="width:100%;" 
					:columns="config.table.columns.rebate" 
					:table-data="config.table.data.rebate" 
					row-hover-color="#eee" 
					row-click-color="#edf7ff" 
					:height="config.table.height" 
					even-bg-color="#fafafa">
				</v-table>
			</van-tab>
		</van-tabs>
		<popup-filter 
			:filterShow.sync="config.popup.filterShow" 
			@resetClick="resetClick" 
			@filterClick="filterClick">
			<div slot="filter-field-1">
				<van-cell-group title="下单金额">
					
					<time-range-picker
						:beginDate.sync="filterForm.dailyBeginDate"
						:endDate.sync="filterForm.dailyEndDate"
						:maxDate.sync="pageConfig.dailyMaxDate"
						:minDate.sync="pageConfig.dailyMinDate"
					></time-range-picker>
				</van-cell-group>
				<van-cell-group title="收货金额">
					<time-range-picker
						:beginDate.sync="filterForm.deliveryBeginDate"
						:endDate.sync="filterForm.deliveryEndDate"
						:maxDate.sync="pageConfig.deliveryMaxDate"
						:minDate.sync="pageConfig.deliveryMinDate"
					></time-range-picker>
				</van-cell-group>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
	</div>
</template>
<script>

	import { Button, CellGroup, SwitchCell, Tab, Tabs } from 'vant';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';

	import TimeRangePicker from '@/components/subject/time/TimeRangePicker.vue'

	/*api接口*/
	import { getWebConfig } from '@/api/common/webConfig.js'
	
	export default {
		components:{
			[Button.name]: Button,
			[CellGroup.name]: CellGroup,
			[SwitchCell.name]: SwitchCell,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,

			PopupFilter,
			TimeRangePicker
		},
		data(){
			return {
				config:{
					popup:{
						filterShow: false,
						timePicker:{
							isFinishLoad: false
						}
					},
					tabs: {
						active: 0
					},
					table: {
						height: null,
						columns:{
							return: [],
							rebate: []
						},
						data:{
							return: [],
							rebate: []
						}
					},
					switch: {
						checked: false
					}
				},
				pageConfig:{
					dailyMinDate: null,
					dailyMaxDate: null,
					deliveryMinDate: null,
					deliveryMaxDate: null,
				},
				filterForm:{
					dailyBeginDate: null,
					dailyEndDate: null,
					deliveryBeginDate: null,
					deliveryEndDate: null
				},
				formData: {
					dailyTotal: null,
					deliveryTotal: null,
					pointTotal: null
				}
			}
		},
		methods:{
			async getConfig( isReset = false, isInit = true ){
				const { result } = await getWebConfig({paramType: 'staffStatis'})
				if( isReset ) {
					this.filterForm.dailyBeginDate = result.StaffAmountStatisDailyBeginDate
					this.filterForm.dailyEndDate = result.StaffAmountStatisDailyEndDate
					this.filterForm.deliveryBeginDate = result.StaffAmountStatisDeliveryBeginDate
					this.filterForm.deliveryEndDate = result.StaffAmountStatisDeliveryEndDate
				}
				this.pageConfig.dailyMinDate = result.StaffAmountStatisDailyMinDate
				this.pageConfig.dailyMaxDate = result.StaffAmountStatisDailyMaxDate
				this.pageConfig.deliveryMinDate = result.StaffAmountStatisDeliveryMinDate
				this.pageConfig.deliveryMaxDate = result.StaffAmountStatisDeliveryMaxDate
				if( !isReset || isInit ){
					await this.fetchData()
				}
			},
			fetchData(){
				this.config.table.data.return = [];
				this.config.table.data.rebate = [];
				this.$request.staff.statis.getStatisAmountData( this.filterForm ).then(res=>{
					if( res.errorCode == '00000' ){
						this.formData.dailyTotal = res.result.daily_order_amount;
						this.formData.deliveryTotal = res.result.delivery_amount;
						this.formData.pointTotal = res.result.rebate_amount;

						this.config.table.data.return = res.result.return_detail;
						this.config.table.data.rebate = res.result.rebate_detail;

					}
				})
			},
			resetClick(){
				this.getConfig( true, false );
			},
			filterClick(){
				this.fetchData();
			},
			getTableConfig(){
				this.$request.common.table.getTableConfig().then(res=>{
					this.config.table.columns.return = res.staffStatisAmountReturn;
					this.config.table.columns.rebate = res.staffStatisAmountRebate;
				});
			},
			beforeunloadHandler(){
				if( this.config.switch.checked ){
					setStorage('staff/statis/amountStatis',this.filterForm);
				}else{
					removeStorage('staff/statis/amountStatis');
				}
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','订单统计2');
			if( getStorage('staff/statis/amountStatis') !== null ){
				let storageData = JSON.parse(getStorage('staff/statis/amountStatis'));
				this.filterForm = storageData;
				this.config.switch.checked = true;
				this.getConfig( false, true );
			}else{
				this.getConfig( true, true );
			}
		},
		mounted(){
			this.config.table.height  = window.screen.height - 205;
			this.getTableConfig();
			window.addEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		updated(){
			
		},
		destroyed(){
			this.beforeunloadHandler();
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>
<style type="text/css">
	.amount-statis-container{
		background-color: #f1f1f1;
		padding-bottom: 3.125rem;
	}

	.amount-statis-filter{
		padding: 0.2rem 0.5rem;
		width: 100%;
	}

	.amount-statis-card{
		padding: 0.2rem 0.5rem;
		width: 100%;
		height: 4.625rem;
	}

	.bill-statis-list{
		width: 100%;
	    height: 4.1875rem;
	    box-sizing: border-box;
	    display: flex;
	    align-items: center;
	    justify-content: space-between;
	    background-color: #fff;
	    box-shadow: 0 0.0625rem 0.625rem hsl(0deg 0% 72% / 10%);
	    border-radius: 0.5rem;
	    padding: 0.1rem;
	}

	.bill-statis-item{
		flex: 1;
    	display: flex;
    	flex-direction: column;
    	align-items: center;
	}

	.bill-statis-text{
		font-size:0.8rem;
		padding-bottom: 0.2rem;
	}
	
	.bill-statis-value{
		font-size: 1rem; 
	}
</style>