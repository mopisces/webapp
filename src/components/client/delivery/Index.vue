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
			<v-table  is-horizontal-resize :is-vertical-resize="true" style="width:100%;"  :columns="config.table.columns" :table-data="fieldData" row-hover-color="#eee" row-click-color="#edf7ff" :height="config.table.height" even-bg-color="#fafafa"></v-table>
		</template>
		<new-popup :leftShow.sync="config.popup.leftPopup.show" title="客户信息" position="left" :isClose="true">
			<div slot="new-popup-1">
				<van-field v-model="leftPopupData.CusShortName" readonly label="客户简称" input-align="center"/>
				<van-field v-model="leftPopupData.TaskName" readonly label="业务员" input-align="center"/>
				<van-field v-model="filterForm.beginDate" readonly label="开始日期" input-align="center"/>
				<van-field v-model="filterForm.endDate" readonly label="结束日期" input-align="center"/>
				<van-field v-model="leftPopupData.iCount" readonly label="送货单笔数" input-align="center"/>
				<van-field v-model="leftPopupData.DeliQty" readonly label="送货数" input-align="center"/>
				<van-field v-model="leftPopupData.TSalesArea" readonly label="销售面积" input-align="center"/>
				<van-field v-model="leftPopupData.TVolume" readonly label="送货立方" input-align="center"/>
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
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button, Icon, Field, SwitchCell, Step, Steps, Sticky } from 'vant';
	import PrevNext from '@/components/subject/PrevNext.vue';
	import NewPopup from '@/components/subject/NewPopup.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
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
			PopupFilter,
			NewTimePicker
		},
		data(){
			return {
				config:{
					table:{
						columns : [],
						height     : 0,
					},
					popup:{
						leftPopup:{
							show : false,
						},
						rightFilter:{
							show : false
						},
						
					},
					prevNext:{
						show : false
					},
					field:{
						show : false
					},
					switch:{
						checked : false
					},
				},
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
					deliveryDate  : '',
					maxDate       : '',
					minDate       : '',
				},
				leftPopupData  : {},
				isReset : false
			}
		},
		methods:{
			radioConfirm( val ){
				if( this.radioData.length != 0 ){
					this.filterForm.deliveryDate = val;
					this.dailyOrders(this.filterForm);
				}
			},
			getConfig( isInit = true ){
				let self = this;
				this.$request.client.delivery.dailyConfig().then(res=>{
					if( isInit ){
						self.filterForm.beginDate = res.result.ClientDeliveryDailyBeginDate;
						self.filterForm.endDate   = res.result.ClientDeliveryDailyEndDate;
					}
					self.filterForm.maxDate   = res.result.ClientDeliveryDailyMaxDate;
					self.filterForm.minDate   = res.result.ClientDeliveryDailyMinDate;
				}).then(()=>{
					this.$nextTick(()=>{
						this.optionalDate();
					});
				});
			},
			cusInfoClick(){
				this.cusInfo();
				this.config.popup.leftPopup.show = true;
			},
			cusInfo(){
				let self = this;
				this.$request.client.delivery.cusInfo( this.filterForm ).then(res=>{
					if( res.errorCode != '00000' ){
						self.leftPopupData = [];
						return ;
					}
					self.leftPopupData = res.result;
				});
			},
			optionalDate(){
				let self = this;
				this.config.prevNext.show   = false;
				this.$request.client.delivery.dateInfo( this.filterForm ).then(res=>{
					if( res.errorCode != '00000' || res.result.length <= 0 ){
						return ;
					}
					self.radioData = res.result;
					self.radioData.forEach((item,index)=>{
						item['prevNext'] = item.DNDate;
						item['tag']      = 'delivery';
					});
					self.config.prevNext.show   = true;
					self.filterForm.deliveryDate = this.radioData[0].DNDate;
				});
			},
			dailyOrders( data ){
				let self = this;
				this.config.field.show = false;
				this.$request.client.delivery.detail( this.filterForm ).then(res=>{
					if( res.errorCode != '00000' ){
						return ;
					}
					self.fieldData = res.result;
				}).then(()=>{
					this.$nextTick(() => {
					    this.config.field.show = true;
					});
				});
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
					deliveryDate  : null
				};
				this.config.switch.checked = false;
				this.getConfig();
			},
			filterClick(){
				this.optionalDate();
				this.dailyOrders();
				this.config.popup.rightFilter.show = false;
			},
			getTableConfig(){
				this.$request.common.table.getTableConfig().then(res=>{
					this.config.table.columns = res.clientDeliveryDaily;
				});
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','每日送货');
			if( sessionStorage.getItem('client-delivery/index') !== null ){
				let storageData = JSON.parse(sessionStorage.getItem('client-delivery/index'));
				this.filterForm = storageData;
				this.config.switch.checked = true;
				this.getConfig( false );
			}else{
				this.getConfig();
			}
		},
		mounted(){
			this.getTableConfig();
			this.config.table.height  = window.screen.height - 225;
		},
		updated(){
			
		},
		destroyed(){
			if( this.config.switch.checked ){
				sessionStorage.setItem('client-delivery/index',JSON.stringify(this.filterForm));
			}else{
				sessionStorage.removeItem('client-delivery/index');
			}
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>