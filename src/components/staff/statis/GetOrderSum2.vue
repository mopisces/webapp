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
					<new-time-picker 
						v-if="config.popup.timePicker.isFinishLoad" 
						:dateTime.sync="filterForm.dailyBeginDate" 
						:minDate="pageConfig.dailyMinDate" 
						:maxDate="pageConfig.dailyMaxDate" 
						label="开始日期">
					</new-time-picker>
					<new-time-picker 
						v-if="config.popup.timePicker.isFinishLoad" 
						:dateTime.sync="filterForm.dailyEndDate" 
						:minDate="pageConfig.dailyMinDate" 
						:maxDate="pageConfig.dailyMaxDate" 
						label="结束日期">
					</new-time-picker>
				</van-cell-group>
				<van-cell-group title="收货金额">
					<new-time-picker 
						v-if="config.popup.timePicker.isFinishLoad" 
						:dateTime.sync="filterForm.deliveryBeginDate" 
						:minDate="pageConfig.deliveryMinDate" 
						:maxDate="pageConfig.deliveryMaxDate" 
						label="开始日期">
					</new-time-picker>
					<new-time-picker 
						v-if="config.popup.timePicker.isFinishLoad" 
						:dateTime.sync="filterForm.deliveryEndDate" 
						:minDate="pageConfig.deliveryMinDate" 
						:maxDate="pageConfig.deliveryMaxDate" 
						label="结束日期">
					</new-time-picker>
				</van-cell-group>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button, CellGroup, SwitchCell, Tab, Tabs } from 'vant';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';
	export default {
		components:{
			[Button.name]: Button,
			[CellGroup.name]: CellGroup,
			[SwitchCell.name]: SwitchCell,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,

			NewTimePicker,
			PopupFilter
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
			getConfig( isReset = false, isInit = true ){
				this.$request.staff.statis.getStatisAmonutConfig().then(res=>{
					if( res.errorCode == '00000' ){
						this.pageConfig.dailyMinDate = res.result.StaffAmountStatisDailyMinDate;
						this.pageConfig.dailyMaxDate = res.result.StaffAmountStatisDailyMaxDate;
						this.pageConfig.deliveryMinDate = res.result.StaffAmountStatisDeliveryMinDate;
						this.pageConfig.deliveryMaxDate = res.result.StaffAmountStatisDeliveryMaxDate;
						if( isReset ){
							this.filterForm.dailyBeginDate = res.result.StaffAmountStatisDailyBeginDate;
							this.filterForm.dailyEndDate = res.result.StaffAmountStatisDailyEndDate;
							this.filterForm.deliveryBeginDate = res.result.StaffAmountStatisDeliveryBeginDate;
							this.filterForm.deliveryEndDate = res.result.StaffAmountStatisDeliveryEndDate;
						}
					}
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.timePicker.isFinishLoad = true;
						if( !isReset || isInit ){
							this.fetchData();
						}
					});
				});
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
			this.$store.commit('staff/setHeaderTitle','订单统计');
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