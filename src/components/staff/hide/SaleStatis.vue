<template>
	<div>
		<van-button plain hairline type="info" size="small" style="width:100%;height:40px;" @click="config.popup.filterShow = true">筛选</van-button>
		<van-tabs v-model="filterForm.tabs">
			<van-tab title="接单">
				<template v-if=" config.produce == 0 ">
					<div role="button" tabindex="0" class="van-cell">
						<div class="van-cell__title">
							<span>按单金额合计</span>
						</div>
						<div class="van-cell__value">
							<span style="color:black;">{{orderTakeData.OrdAmt}}</span>
						</div>
					</div>
					<div role="button" tabindex="0" class="van-cell">
						<div class="van-cell__title">
							<span>二层米数合计</span>
						</div>
						<div class="van-cell__value">
							<span style="color:black;">{{orderTakeData.TLength0}}</span>
						</div>
					</div>
					<div role="button" tabindex="0" class="van-cell">
						<div class="van-cell__title">
							<span>单坑米数合计</span>
						</div>
						<div class="van-cell__value">
							<span style="color:black;">{{orderTakeData.TLength1}}</span>
						</div>
					</div>
					<div role="button" tabindex="0" class="van-cell">
						<div class="van-cell__title">
							<span>双坑米数合计</span>
						</div>
						<div class="van-cell__value">
							<span style="color:black;">{{orderTakeData.TLength2}}</span>
						</div>
					</div>
					<div role="button" tabindex="0" class="van-cell">
						<div class="van-cell__title">
							<span>三坑米数合计</span>
						</div>
						<div class="van-cell__value">
							<span style="color:black;">{{orderTakeData.TLength3}}</span>
						</div>
					</div>
					<div role="button" tabindex="0" class="van-cell">
						<div class="van-cell__title">
							<span>按单米数合计</span>
						</div>
						<div class="van-cell__value">
							<span style="color:black;">{{orderTakeData.TLength}}</span>
						</div>
					</div>
					<div role="button" tabindex="0" class="van-cell">
						<div class="van-cell__title">
							<span>未排米数合计</span>
						</div>
						<div class="van-cell__value">
							<span style="color:black;">{{orderTakeData.WTLength}}</span>
						</div>
					</div>
					<div role="button" tabindex="0" class="van-cell">
						<div class="van-cell__title">
							<span>接单客户数</span>
						</div>
						<div class="van-cell__value">
							<span style="color:black;">{{orderTakeData.ccount}}</span>
						</div>
					</div>
					<div role="button" tabindex="0" style="align:left;line-height:24px;padding:8px 16px;">
						<div style="text-align:center;">班组排产米数统计</div>
					</div>
				</template>
				<template v-else>
					<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;"  :columns="config.table.columns.orderTake" :table-data="config.table.data.orderTake" row-hover-color="#eee" row-click-color="#edf7ff" :height="0.5 * config.table.height" even-bg-color="#fafafa"></v-table>
				</template>
				<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;"  :columns="config.table.columns.meters" :table-data="config.table.data.planSum"  :height="config.table.meterTableHeight" row-hover-color="#eee" row-click-color="#edf7ff" even-bg-color="#fafafa"></v-table>
			</van-tab>
			<van-tab title="客户">
				<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;"  :columns="config.table.columns.cus" :table-data="config.table.data.cus" row-hover-color="#eee" row-click-color="#edf7ff" :height="config.table.height" even-bg-color="#fafafa"></v-table>
			</van-tab>
			<van-tab title="业务员">
				<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;"  :columns="config.table.columns.task" :table-data="config.table.data.task" row-hover-color="#eee" row-click-color="#edf7ff" :height="config.table.height" even-bg-color="#fafafa"></v-table>
			</van-tab>
		</van-tabs>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)"/>
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button, Col, Row, Tab, Tabs, SwitchCell } from 'vant';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Col.name]: Col,
			[Row.name]: Row,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			[SwitchCell.name]: SwitchCell,

			PopupFilter,
			NewTimePicker
		},
		data(){
			return {
				config:{
					getConfig:true,
					popup:{
						filterShow:false,
						timePicker:{
							isFinishLoad:false
						}
					},
					switch:{
						checked:false
					},
					table:{
						meterTableHeight:0,
						height:0,
						columns:{
							cus:[],
							task:[],
							meters:[],
							orderTake:[]
						},
						data:{
							cus:[],
							task:[],
							planSum:[],
							orderTake:[]
						}
					},
					produce:0
				},
				pageConfig:{
					maxDate:'',
					minDate:'',
				},
				orderTakeData:{
					OrdAmt:null,
					TLength0:null,
					TLength1:null,
					TLength2:null,
					TLength3:null,
					TLength:null,
					WTLength:null,
					ccount:null
				},
				filterForm:{
					tabs:'',
					beginDate:'',
					endDate:''
				}
			}
		},
		methods:{
			getConfig( isReset = false ){
				let self = this;
				this.$request.staff.statis.getSaleStatisConfig().then(res=>{
					if( res.errorCode == '00000' ){
						self.pageConfig.maxDate   = res.result.OrderTakeMaxDate;
						self.pageConfig.minDate   = res.result.OrderTakeMinDate;
						if( self.config.getConfig ){
							self.filterForm.beginDate = res.result.OrderTakeBeginDate;
							self.filterForm.endDate   = res.result.OrderTakeEndDate;
						}
						self.config.produce = res.produce;
					}
					self.config.popup.timePicker.isFinishLoad = true;
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.timePicker.isFinishLoad = true;
					});
				}).then(()=>{
					if( isReset ){
						return ;
					}
					this.getSaleStatisData();
				});
			},
			getSaleStatisData(){
				for( let key in this.orderTakeData ){
					this.orderTakeData[key] = null;
				}
				this.config.table.data.cus = [];
				this.config.table.data.task = [];
				this.config.table.data.planSum = [];
				this.config.table.data.orderTake = [];
				let self = this;
				this.$request.staff.statis.getSaleStatisData(this.filterForm).then(res=>{
					if( res.errorCode == '00000' ){
						if( self.config.produce == 1 ){
							self.config.table.data.orderTake = res.result.fac_ord_sum;
						} else {
							if( res.result.fac_ord_sum ){
								self.orderTakeData = res.result.fac_ord_sum;
							}
						}
						if( res.result.cus_ord_sum.length > 0 ){
							self.config.table.data.cus = res.result.cus_ord_sum;
						}
						if( res.result.task_ord_sum.length > 0 ){
							self.config.table.data.task = res.result.task_ord_sum;
						}
						if( res.result.w_plan_sum && res.result.w_plan_sum.length > 0 ){
							self.config.table.data.planSum = res.result.w_plan_sum;
						}
					}
				});
			},
			resetClick(){
				this.config.switch.checked = false;
				this.config.getConfig = true;
				this.getConfig(true);
			},
			filterClick(){
				this.config.popup.filterShow = false;
				this.getSaleStatisData();
			},
			getTableConfig(){
				this.$request.common.table.getTableConfig().then(res=>{
					this.config.table.columns.cus = res.saleStatisCus;
					this.config.table.columns.task = res.saleStatisTask;
					this.config.table.columns.meters = res.saleStatisMeters;
					this.config.table.columns.orderTake = res.saleStatisOrder;
				});
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','接单统计');
			if( sessionStorage.getItem('hide/SaleStatis') !== null  ){
				let storageData = JSON.parse(sessionStorage.getItem('hide/SaleStatis'));
				this.filterForm = storageData;
				this.config.getConfig = false;
				this.config.switch.checked = true;
			}
		},
		mounted(){
			this.getConfig();
			this.getTableConfig();
			this.config.table.height  = window.screen.height - 86;
			this.config.table.meterTableHeight = window.screen.height - 508;
		},
		updated(){
			
		},
		destroyed(){
			if( this.config.switch.checked ){
				sessionStorage.setItem('hide/SaleStatis',JSON.stringify(this.filterForm));
			}else{
				sessionStorage.removeItem('hide/SaleStatis');
			}
		},
		computed:{
			produceChange(){
				return this.config.produce
			}
		},
		watch:{
			produceChange( newV, oldV){
				this.config.table.meterTableHeight = this.config.table.height * 0.4
			}
		}
	}
</script>