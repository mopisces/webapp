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
		<van-popup 
			v-model="config.popup.info.show" 
			round 
			:style="{ height: '14rem', width: '95%', backgroundColor: '#f1f1f1' }"
		>
			<card
				:title="cusInfo.CusShortName"
				:extra="cusInfo.TaskName"
				:is-shadow="true"
			>
				<div class="card-body-container">
					<div class="card-body-item card-body-item-100">
						<span>
							日期区间:
							<span class="mg-left-20">
								{{ filterForm.beginDate }}~{{ filterForm.endDate }}
							</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>
							送货单笔数:
							<span class="mg-left-20">
								{{ cusInfo.iCount }}
							</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>
							送货数量:
							<span class="mg-left-20">
								{{ cusInfo.DeliQty }}
							</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>
							销售面积:
							<span class="mg-left-20">
								{{ cusInfo.TSalesArea }}㎡
							</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>
							送货立方:
							<span class="mg-left-20">
								{{ cusInfo.TVolume }}m³
							</span>
						</span>
					</div>
				</div>
			</card>
		</van-popup>
		
		<popup-filter :filterShow.sync="config.popup.rightFilter.show" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<van-field label="订单编号" v-model="filterForm.orderId" placeholder="模糊查询" input-align="center"></van-field>
				<van-field label="客订单号" v-model="filterForm.cusPoNo" placeholder="模糊查询" input-align="center"></van-field>
				<van-field label="板长" v-model="filterForm.boardLength" placeholder="模糊查询" input-align="center" type="number" maxlength="6"></van-field>
				<van-field label="板宽" v-model="filterForm.boardWidth" placeholder="模糊查询" input-align="center" type="number" maxlength="6"></van-field>
				<van-field label="压线" v-model="filterForm.lineBall" placeholder="模糊查询" input-align="center"></van-field>
				<van-field label="订单数" v-model="filterForm.orderQuantity" placeholder="模糊查询" input-align="center" type="number" maxlength="6"></van-field>
				<!-- <new-time-picker :dateTime.sync="filterForm.beginDate" :minDate="filterForm.minDate" :maxDate="filterForm.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker :dateTime.sync="filterForm.endDate" :minDate="filterForm.minDate" :maxDate="filterForm.maxDate" label="结束日期"></new-time-picker> -->
				<time-range-picker
					:beginDate.sync="filterForm.beginDate"
					:endDate.sync="filterForm.endDate"
					:maxDate.sync="filterForm.maxDate"
					:minDate.sync="filterForm.minDate"
				></time-range-picker>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button, Icon, Popup, Field, SwitchCell, Step, Steps, Sticky } from 'vant';
	import PrevNext from '@/components/subject/PrevNext.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	//import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';

	import Card from '@/components/subject/card/Card.vue'
	import TimeRangePicker from '@/components/subject/time/TimeRangePicker.vue'

	/*api接口*/
	import { getWebConfig } from '@/api/common/webConfig.js'

	export default {
		components:{
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[Step.name]: Step,
			[Steps.name]: Steps,
			[Sticky.name]: Sticky,

			PrevNext,
			PopupFilter,
			//NewTimePicker,
			Card,
			TimeRangePicker
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
						info: {
							show: false
						}
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
				cusInfo: {
					CusShortName: null,
					TaskName: null,
					iCount: null,
					DeliQty: null,
					TSalesArea: null,
					TVolume: null,
				},
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
			async getConfig( isInit = true ){
				const { result } = await getWebConfig({paramType: 'clientDeli'})
				if( isInit ){
					this.filterForm.beginDate = result.ClientDeliveryDailyBeginDate
					this.filterForm.endDate = result.ClientDeliveryDailyEndDate
				}
				this.filterForm.maxDate = result.ClientDeliveryDailyMaxDate
				this.filterForm.minDate = result.ClientDeliveryDailyMinDate
				await this.optionalDate()
			},
			cusInfoClick(){
				this.cusInfo = this.$options.data().cusInfo
				this.$request.client.delivery.cusInfo( this.filterForm ).then(res=>{
					if( res.errorCode == '00000' ){
						this.cusInfo = res.result
					}
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.info.show = true
					});
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
					self.config.prevNext.show = true;
					self.filterForm.deliveryDate = self.radioData[0].DNDate;
				}).then(()=>{
					this.$nextTick(() => {
						if( this.filterForm.deliveryDate ){
							this.dailyOrders(this.filterForm.deliveryDate);
						}
					});
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
				this.config.popup.rightFilter.show = false;
			},
			getTableConfig(){
				this.$request.common.table.getTableConfig().then(res=>{
					this.config.table.columns = res.clientDeliveryDaily;
				});
			},
			beforeunloadHandler(){
				if( this.config.switch.checked ){
					setStorage('client-delivery/index',this.filterForm);
				}else{
					removeStorage('client-delivery/index');
				}
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','每日送货');
			if( getStorage('client-delivery/index') !== null ){
				let storageData = JSON.parse(getStorage('client-delivery/index'));
				this.filterForm = storageData;
				this.config.switch.checked = true;
				this.getConfig( false );
			}else{
				this.getConfig();
			}
		},
		mounted(){
			this.getTableConfig();
			this.config.table.height  = window.screen.height - 210;
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
	@import '~@/assets/style/card.css';
</style>