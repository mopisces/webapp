<template>
	<div>
		<van-sticky :offset-top="47">
			<div class="van-row">
				<div class="van-col van-col--12">
					<van-button plain hairline type="info" style="width:100%" @click="cusInfoClick()">客户信息信息</van-button>
				</div>
				<div class="van-col van-col--12">
					<van-button plain hairline type="info" style="width:100%"  @click="config.popup.rightFilter.show = true">筛选</van-button>
				</div>
			</div>
		</van-sticky>
		<prev-next @radioConfirm="radioConfirm" :radioData="radioData" v-if="config.prevNext.show"></prev-next>
		<template v-if="config.field.show">
			<v-table  is-horizontal-resize :is-vertical-resize="true" style="width:100%;"  :columns="config.table.columns" :table-data="fieldData" row-hover-color="#eee" row-click-color="#edf7ff" :height="config.table.height" even-bg-color="#fafafa" @on-custom-comp="fieldClick"></v-table>
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
				<van-field v-model="rightPopupData.InTime" input-align="center" label="完工时间" readonly v-if="rightPopupData.InTime" />
				<van-field v-model="rightPopupData.TimeToGo" input-align="center" label="送货时间" readonly v-if="rightPopupData.TimeToGo" />
				<van-field v-model="rightPopupData.ConfQty" input-align="center" label="回签数量" readonly v-if="rightPopupData.ConfQty" />
				<van-field v-model="rightPopupData.CarPName" input-align="center" label="送货司机" readonly v-if="rightPopupData.CarPName" />
				<van-field v-model="rightPopupData.Phone" input-align="center" label="电话" readonly v-if="rightPopupData.Phone" />
				<van-field v-model="rightPopupData.CarNo" input-align="center" label="送货车号" readonly v-if="rightPopupData.CarNo" />
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
				<new-time-picker :dateTime.sync="filterForm.beginDate" :minDate="filterForm.minDate" :maxDate="filterForm.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker :dateTime.sync="filterForm.endDate" :minDate="filterForm.minDate" :maxDate="filterForm.maxDate" label="结束日期"></new-time-picker>
				<radio-cell :radioInfo.sync="filterForm.orderState" :radioColumns="config.filterStatus.status" title="订单状态" v-if="config.filterStatus.show"></radio-cell>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button, Icon, Field, SwitchCell, Step, Steps, Sticky } from 'vant';
	import PrevNext from '@/components/subject/PrevNext.vue';
	import NewPopup from '@/components/subject/NewPopup.vue';
	import RadioCell from '@/components/subject/RadioCell.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';
	export default {
		components:{
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
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
					table:{
						columns : [
							{field: 'guige', title: '规格', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true ,isFrozen: true},
							{field: 'OrdQty', title: '订单数量', width: 60, titleAlign: 'center', columnAlign: 'center',isResize:true ,isFrozen: true},
							{field: 'sstate', title: '订单状态', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true },
							{field: 'dailyDetail', title: '详情',width: 100, titleAlign: 'center',componentName:'table-operate',columnAlign:'center',isResize:true}
						],
						height     : 0,
						showOrdAmt : false,
						alreadyCalc: false,
					},
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
						status : []
					},
					switch:{
						checked : false
					},
					filterStatus:{
						show   : false,
						status : []
					},
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
					orderState    : '全部', 
					bookingDate   : '',
					maxDate       : '',
					minDate       : '',
					showOrdAmt    : false
				},
				leftPopupData  : {},
				rightPopupData : {},
				isReset : false
			}
		},
		methods:{
			radioConfirm( val ){
				if( this.radioData.length != 0 ){
					this.filterForm.bookingDate = val;
					this.dailyOrders(this.filterForm);
				}
			},
			getConfig( isInit = true ){
				this.config.step.status         = [];
				this.config.filterStatus.status = [];
				let self = this;
				this.$request.client.ordersManage.dailyOrdersConfig().then(res=>{
					if( res.result.WGetCusOrderShowAmt == '1' ){
						self.config.table.columns.splice(2,0,{field: 'OrdAmt', title: '金额', width: 70, titleAlign: 'center', columnAlign: 'center',isResize:true,formatter:(rowData)=>{
							if( rowData.sstate == '未审核' ){
								return '<span style="color:#ddd;">' + rowData.OrdAmt + '</span>';
							}else{
								return rowData.OrdAmt;
							}
						}});
						self.config.table.showOrdAmt = true;
					}
					if( isInit ){
						self.filterForm.beginDate = res.result.GetOrdersPBeginDate;
						self.filterForm.endDate   = res.result.GetOrdersPEndDate;
					}
					self.filterForm.maxDate   = res.result.GetOrdersPMaxDate;
					self.filterForm.minDate   = res.result.GetOrdersPMinDate;
					res.result.daily_order_status.forEach((item,index)=>{
						if( item != '全部' ){
							self.config.step.status.push({ title: item, value:item });
						}
					});
					res.result.daily_order_status.forEach((item,index)=>{
						self.config.filterStatus.status.push({ title: item, value:item });
					});
				}).then(()=>{
					this.$nextTick(()=>{
						this.optionalDate();
						this.config.filterStatus.show = true;
					});
				});
			},
			cusInfoClick(){
				let self = this;
				this.$request.client.ordersManage.dailyOrdersCusInfo( this.filterForm ).then(res=>{
					if( res.errorCode != '00000' ){
						self.leftPopupData = [];
						return ;
					}
					self.leftPopupData = res.result;
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.leftPopup.show = true;
					});
				});
			},
			optionalDate(){
				let self = this;
				this.config.prevNext.show   = false;
				this.$request.client.ordersManage.dailyOrderOptionalDate( this.filterForm ).then(res=>{
					if( res.result && res.errorCode == '00000' && res.result.length > 0 ){
						self.radioData = res.result;
						self.radioData.forEach((item,index)=>{
							item['prevNext'] = item.OrderDate;
							item['tag']      = 'daily';
						});
						self.config.prevNext.show   = true;
						self.filterForm.bookingDate = this.radioData[0].OrderDate;
					}
				});
			},
			dailyOrders( data ){
				let self = this;
				this.config.field.show = false;
				this.$request.client.ordersManage.dailyOrders( this.filterForm ).then(res=>{
					if( res.errorCode != '00000' ){
						return ;
					}
					self.fieldData = res.result;
					if( self.config.table.showOrdAmt  ){
						self.fieldData.push({
							guige :'汇总金额',
							OrdQty:'----',
							OrdAmt:0.00,
							sstate:'----',
							last  : 1
						})
					}
				}).then(()=>{
					this.$nextTick(() => {
					    this.config.field.show = true;
					    this.config.table.alreadyCalc = false;
					});
				});
			},
			fieldClick( params ){
				if( params.type == 'clacAmtOrd' ){
					if( this.config.table.alreadyCalc ){
						return ;
					}
					var total = 0;
					this.fieldData.pop();
					this.fieldData.forEach((item,index)=>{
						total += parseFloat(item.OrdAmt);
					});
					this.fieldData.push({
						guige :'汇总金额',
						OrdQty:'----',
						OrdAmt:total.toFixed(2),
						sstate:'----',
						last  : 1
					});
					this.config.table.alreadyCalc = true;
					return ;
				}
				this.rightPopupData   = this.fieldData[ params.index ];
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
				this.filterForm = {
					orderId       : '',
					cusPoNo       : '',
					boardLength   : '',
					boardWidth    : '',
					lineBall      : '',
					orderQuantity : '',
					beginDate     : '',
					endDate       : '',
					orderState    : '全部', 
					bookingDate   : ''
				};
				this.config.switch.checked = false;
				this.getConfig();
			},
			filterClick(){
				this.optionalDate();
				this.dailyOrders();
				this.config.popup.rightFilter.show = false;
			},
			beforeunloadHandler(){
				if( this.config.switch.checked ){
					setStorage('client-daily/getOrdersP',this.filterForm);
				}else{
					removeStorage('client-daily/getOrdersP');
				}
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','每日订单');
			if( getStorage('client-daily/getOrdersP') !== null ){
				let storageData = JSON.parse(getStorage('client-daily/getOrdersP'));
				this.filterForm = storageData;
				this.config.switch.checked = true;
				this.getConfig( false );
			}else{
				this.getConfig();
			}
		},
		mounted(){
			this.config.table.height  = window.screen.height - 225;
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