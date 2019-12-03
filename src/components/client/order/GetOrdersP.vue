<template>
	<div>
		<van-sticky :offset-top="46">
			<div class="van-row">
				<div class="van-col van-col--12">
					<van-button plain hairline type="info" style="width:100%" @click="config.popup.leftPopup.show = true">客户信息信息</van-button>
				</div>
				<div class="van-col van-col--12">
					<van-button plain hairline type="info" style="width:100%"  @click="config.popup.rightFilter.show = true">筛选</van-button>
				</div>
			</div>
		</van-sticky>
		<prev-next @radioConfirm="radioConfirm" :radioData="radioData" v-if="config.prevNext.show"></prev-next>
		<template v-if="config.field.show">
			<van-field v-for="(item,index) in fieldData" :key="index" :value="item.OrdQty" readonly :label="item.guige" input-align="center" @click="fieldClick(index)">
				<div slot="right-icon" style="color:#0bf147">{{ item.sstate }}</div>
				<van-icon name="arrow" slot="button"/>
			</van-field>
		</template>
		<new-popup :leftShow.sync="config.popup.leftPopup.show" title="客户信息" position="left" :isClose="true">
			<div slot="new-popup-1">
				<van-field v-model="leftPopupData.CusShortName" input-align="center" label="客户简称" readonly/>
				<van-field v-model="leftPopupData.Merchandiser" input-align="center" label="跟单员" readonly/>
				<van-field v-model="leftPopupData.TaskName" input-align="center" label="业务员" readonly/>
				<van-field v-model="filterForm.beginDate" input-align="center" label="开始日期" readonly/>
				<van-field v-model="filterForm.endDate" input-align="center" label="结束日期" readonly/>
				<van-field v-model="leftPopupData.OrdCount" input-align="center" label="下单笔数" readonly/>
				<van-field v-model="leftPopupData.UnSelCount" input-align="center" label="未排笔数" readonly/>
				<van-field v-model="leftPopupData.SelCount" input-align="center" label="已排笔数" readonly/>
				<van-field v-model="leftPopupData.TOrdVol" input-align="center" label="下单立方" readonly/>
				<van-field v-model="leftPopupData.TProVol" input-align="center" label="生产立方" readonly/>
				<van-field v-model="leftPopupData.TStockVol" input-align="center" label="库存立方" readonly/>
				<van-field v-model="leftPopupData.TUnDeliVol" input-align="center" label="未送立方" readonly/>
			</div>
		</new-popup>
		<new-popup :leftShow.sync="config.popup.rightPopup.show" title="订单信息" position="right" :isClose="true">
			<div slot="new-popup-1">
				<van-field v-model="rightPopupData.OrderId" input-align="center" label="订单编号" readonly/>
				<van-field v-model="rightPopupData.CusPoNo" input-align="center" label="客订单号" readonly/>
				<van-field v-model="rightPopupData.guige" input-align="center" label="规格" readonly/>
				<van-field v-model="rightPopupData.ScoreInfo" input-align="center" label="压线" readonly/>
				<van-field v-model="rightPopupData.BoardName" input-align="center" label="材质名称" readonly/>
				<van-field v-model="rightPopupData.OrdQty" input-align="center" label="订单数" readonly/>
				<van-field v-model="rightPopupData.sstate" input-align="center" label="订单状态" readonly  @click="statusClick(rightPopupData.sstate)">
					<van-icon name="arrow-down" slot="right-icon" v-if="!config.step.show"></van-icon>
					<van-icon name="arrow-up" slot="right-icon" v-if="config.step.show"></van-icon>
				</van-field>
				<van-steps :active="config.step.active" v-if="config.step.show" direction="vertical">
					<van-step v-for="(item,index) in config.step.status" :key="index">{{item.title}}</van-step>
				</van-steps>
				<van-field v-model="rightPopupData.InTime" input-align="center" label="完工时间" readonly/>
				<van-field v-model="rightPopupData.TimeToGo" input-align="center" label="送货时间" readonly/>
				<van-field v-model="rightPopupData.ConfQty" input-align="center" label="回签数量" readonly/>
				<van-field v-model="rightPopupData.CarPName" input-align="center" label="送货司机" readonly/>
				<van-field v-model="rightPopupData.Phone" input-align="center" label="电话" readonly/>
				<van-field v-model="rightPopupData.CarNo" input-align="center" label="送货车号" readonly/>
			</div>
		</new-popup>
		<popup-filter :filterShow.sync="config.popup.rightFilter.show" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<van-field label="订单编号" v-model="filterForm.orderId" placeholder="模糊查询" input-align="center"></van-field>
				<van-field label="客订单号" v-model="filterForm.cusPoNo" placeholder="模糊查询" input-align="center"></van-field>
				<van-field label="板长" v-model="filterForm.boardLength" placeholder="模糊查询" input-align="center" type="number" maxlength="6"></van-field>
				<van-field label="板宽" v-model="filterForm.boardWidth" placeholder="模糊查询" input-align="center" type="number" maxlength="6"></van-field>
				<van-field label="压线" v-model="filterForm.lineBall" placeholder="模糊查询" input-align="center"></van-field>
				<van-field label="订单数" v-model="filterForm.orderQuantity" placeholder="模糊查询" input-align="center" type="number" maxlength="6"></van-field>
				<new-time-picker :dateTime.sync="filterForm.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker :dateTime.sync="filterForm.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker>
				<radio-cell :radioInfo.sync="filterForm.orderState" :radioColumns="config.step.status" title="订单状态"></radio-cell>
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button, Icon, Field, Step, Steps, Sticky } from 'vant';
	import PrevNext from '@/components/subject/PrevNext.vue';
	import NewPopup from '@/components/subject/NewPopup.vue';
	import RadioCell from '@/components/subject/RadioCell.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Field.name]: Field,
			[Step.name]: Step,
			[Steps.name]: Steps,
			[Sticky.name]: Sticky,

			PrevNext,
			NewPopup,
			RadioCell,
			PopupFilter,
			NewTimePicker
		},
		data(){
			return {
				config:{
					popup:{
						leftPopup:{
							show : false,
						},
						rightFilter:{
							show : false
						},
						rightPopup:{
							show : false
						}
					},
					prevNext:{
						show : false
					},
					field:{
						show : false
					},
					step:{
						show   : false,
						active : 0,
						status : [
							{ title:'全部',     value:0 },
							{ title:'未排产',   value:1 },
							{ title:'排产中',   value:2 },
							{ title:'生产中',   value:3 },
							{ title:'生产完成', value:4 },
							{ title:'装车中',   value:5 },
							{ title:'已送货',   value:6 },
							{ title:'已签收',   value:7 },
						]
					}
				},
				radioData : [],
				fieldData : [],
				filterForm:{
					orderId       : '',
					cusPoNo       : '',
					boardLength   : '',
					boardWidth    : '',
					lineBall      : '',
					orderQuantity : '',


					beginDate     : '',
					endDate       : '',
					orderState    : '8', 

					bookingDate   : ''
				},
				pageConfig:{
					maxDate : '',
					minDate : '',
				},
				leftPopupData  : {},
				rightPopupData : {}
			}
		},
		methods:{
			radioConfirm( val ){
				if( this.radioData.length != 0 ){
					this.filterForm.bookingDate = val;
					this.dailyOrders(this.filterForm);
				}
			},
			getConfig( isReset = false ){
				let self = this;
				this.$request.client.ordersManage.dailyOrdersConfig().then(res=>{
					if( !isReset ){
						self.filterForm.beginDate = res.result.GetOrdersPBeginDate;
						self.filterForm.endDate   = res.result.GetOrdersPEndDate;
					}
					self.pageConfig.maxDate   = res.result.GetOrdersPMaxDate;
					self.pageConfig.minDate   = res.result.GetOrdersPMinDate;
				}).then(()=>{
					this.$nextTick(()=>{
						this.optionalDate();
						this.cusInfo();
					});
				});
			},
			cusInfo(){
				let self = this;
				this.$request.client.ordersManage.dailyOrdersCusInfo( this.filterForm ).then(res=>{
					self.leftPopupData = res.result;
				});
			},
			optionalDate(){
				let self = this;
				this.$request.client.ordersManage.dailyOrderOptionalDate( this.filterForm ).then(res=>{
					self.radioData = res.result;
					self.radioData.forEach((item,index)=>{
						item['prevNext'] = item.OrderDate;
					});
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.prevNext.show = true;
					});
				});
			},
			dailyOrders( data ){
				let self = this;
				this.config.field.show = false;
				this.$request.client.ordersManage.dailyOrders( this.filterForm ).then(res=>{
					self.fieldData = res.result;
				}).then(()=>{
					this.$nextTick(() => {
					    this.config.field.show = true;
					});
				});
			},
			fieldClick( index ){
				this.rightPopupData   = this.fieldData[ index ];
				this.config.step.show = false;
				this.config.popup.rightPopup.show = true;
			},
			statusClick( status ){
				for (let i = this.config.step.status.length - 1; i >= 0; i--) {
					if( this.config.step.status[ i ].title === status ){
						this.config.step.active = i;
						break;
					}
				}
				this.config.step.show = !this.config.step.show;
			},
			resetClick(){

			},
			filterClick(){

			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','每日订单');
		},
		mounted(){
			this.getConfig();
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>