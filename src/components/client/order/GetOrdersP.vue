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
			<v-table  is-horizontal-resize :is-vertical-resize="true" style="width:100%;"  :columns="config.table.columns" :table-data="fieldData" row-hover-color="#eee" row-click-color="#edf7ff" :height="viewH-config.table.commonH" even-bg-color="#fafafa" @on-custom-comp="fieldClick"></v-table>
		</template>
		<!-- 客户信息弹窗 -->
		<van-popup 
			v-model="config.popup.cusInfo.show" 
			round 
			:style="{ height: '14rem', width: '95%', backgroundColor: '#f1f1f1' }"
		>
			<card
				:title="cusInfo.CusShortName"
				:subTitle="cusInfo.Merchandiser"
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
						<div class="card-body-txt blue-color">下单</div>|
						<div class="card-body-txt red-color">未排</div>|
						<div class="card-body-txt green-color">已排</div>:
						<span class="mg-left-20 blue-color">{{ cusInfo.OrdCount }}</span>笔
						<span class="mg-left-20 red-color">{{ cusInfo.UnSelCount }}</span>笔
						<span class="mg-left-20 green-color">{{ cusInfo.SelCount }}</span>笔
					</div>
					<div class="card-body-item card-body-item-100">
						<div class="card-body-txt green-color">下单</div>|
						<div class="card-body-txt blue-color">生产</div>:
						<span class="mg-left-20 green-color">{{ cusInfo.TOrdVol }}</span>m³
						<span class="mg-left-20 blue-color">{{ cusInfo.TProVol }}</span>m³
					</div>
					<div class="card-body-item card-body-item-100">
						<div class="card-body-txt yellow-color">库存</div>|
						<div class="card-body-txt red-color">未送</div>:
						<span class="mg-left-20 yellow-color">{{ cusInfo.TStockVol }}</span>m³
						<span class="mg-left-20 red-color">{{ cusInfo.TUnDeliVol }}</span>m³
					</div>
					<div 
						v-if="config.table.showOrdAmt" 
						class="card-body-item card-body-item-100"
					>
						<span>
							排单未送:
							<span class="mg-left-20 red-color">{{ cusInfo.OrdAmt }}</span>元
						</span>
					</div>
				</div>
			</card>
		</van-popup>
		<!-- 订单信息弹窗 -->
		<van-popup 
			v-model="config.popup.ordInfo.show" 
			round 
			:style="{ height: '22.5rem', width: '98%', backgroundColor: '#f1f1f1' }"
		>
			<div style="margin: 1rem 0.2rem 0rem 0.2rem;">
				<van-steps :active="config.step.active"  style="width:100%;">
					<van-step v-for="(item,index) in config.step.status" :key="index">{{item.title}}</van-step>
				</van-steps>
			</div>
			<card
				:title="ordInfo.CusPoNo"
				:extra="ordInfo.OrderId"
				:is-shadow="true"
			>
				<div class="card-body-container">
					<div class="card-body-item card-body-item-100">
						<span>
							规格信息:
							<span class="mg-left-20">
								{{ ordInfo.guige }}
							</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>
							压线信息:
							<span class="mg-left-20">
								{{ ordInfo.ScoreInfo }}
							</span>
							<span class="mg-left-20">
								{{ ordInfo.BoardName }}
							</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>
							订单数量:
							<span class="mg-left-20">
								{{ ordInfo.OrdQty }}
							</span>
						</span>
					</div>
					
					<div
						v-if="ordInfo.InTime" 
						class="card-body-item card-body-item-100"
					>
						<span>
							完工时间:
							<span class="mg-left-20">
								{{ ordInfo.InTime }}
							</span>
						</span>
					</div>
					<div 
						v-if="ordInfo.TimeToGo"  
						class="card-body-item card-body-item-100"
					>
						<span>
							送货时间:
							<span class="mg-left-20">
								{{ ordInfo.TimeToGo }}
							</span>
						</span>
					</div>
					<div 
						v-if="ordInfo.ConfQty"  
						class="card-body-item card-body-item-100"
					>
						<span>
							回签数量:
							<span class="mg-left-20">
								{{ ordInfo.ConfQty }}
							</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>
							送货司机:
							<span v-if="ordInfo.CarPName" class="mg-left-20">
								{{ ordInfo.CarPName }}
							</span>
							<span v-if="ordInfo.Phone" class="mg-left-20">
								<a :href="'tel:' + ordInfo.Phone">{{ ordInfo.Phone }}</a>
							</span>
							<span v-if="ordInfo.CarNo" class="mg-left-20">
								{{ ordInfo.CarNo }}
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
			
				<time-range-picker
					:beginDate.sync="filterForm.beginDate"
					:endDate.sync="filterForm.endDate"
					:maxDate.sync="filterForm.maxDate"
					:minDate.sync="filterForm.minDate"
				></time-range-picker>
				<uni-check-box
					label="订单状态"
					:localdata="config.filterStatus.status"
					:radioData.sync="filterForm.orderState" 
					:map="{text: 'title', value: 'value'}"
				>
				</uni-check-box>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button, Icon, Popup, Field, SwitchCell, Step, Steps, Sticky } from 'vant';
	import PrevNext from '@/components/subject/PrevNext.vue';
	import RadioCell from '@/components/subject/RadioCell.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	//import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';

	import Card from '@/components/subject/card/Card.vue'
	import UniCheckBox from '@/components/subject/checkbox/UniCheckBox.vue'
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
			RadioCell,
			PopupFilter,
			//NewTimePicker,
			Card,
			UniCheckBox,
			TimeRangePicker
		},
		data(){
			return {
				config:{
					table:{
						columns : [
							{field: 'guige', title: '规格', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true ,isFrozen: true},
							{field: 'ScoreType', title: '压线类型', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true ,isFrozen: true},
							{field: 'OrdQty', title: '订单数量', width: 60, titleAlign: 'center', columnAlign: 'center',isResize:true ,isFrozen: true},
							{field: 'sstate', title: '订单状态', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true },
							{field: 'dailyDetail', title: '详情',width: 100, titleAlign: 'center',componentName:'table-operate',columnAlign:'center',isResize:true}
						],
						height     : 0,
						showOrdAmt : false,
						alreadyCalc: false,
						commonH: 140
					},
					popup:{
						rightFilter:{
							show : false
						},
						cusInfo: {
							show: false,
						},
						ordInfo: {
							show: false
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
					popover: {
						show: false
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
				cusInfo: {
					CusShortName: null,
					Merchandiser: null,
					TaskName: null,
					OrdCount: null,
					UnSelCount: null,
					SelCount: null,
					TOrdVol: null,
					TProVol: null,
					TStockVol: null,
					TUnDeliVol: null,
					OrdAmt: null
				},
				ordInfo: {
					OrderId: null,
					CusPoNo: null,
					guige: null,
					ScoreInfo: null,
					BoardName: null,
					OrdQty: null,
					sstate: null,
					InTime: null,
					TimeToGo: null,
					ConfQty: null,
					CarPName: null,
					Phone: null,
					CarNo: null
				},
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
			async getConfig( isInit = true ){
				this.config.step.status = this.$options.data().config.step.status
				this.config.filterStatus.status = this.$options.data().config.filterStatus.status
				const { result } = await getWebConfig({paramType: 'clientOM'})
				if( result.WGetCusOrderShowAmt == '1' ) {
					this.config.table.columns.splice( 3, 0, {
						field: 'OrdAmt', 
						title: '金额', 
						width: 70, 
						titleAlign: 'center', 
						columnAlign: 'center',
						isResize:true,
						formatter:(rowData)=>{
							if( rowData.sstate == '未审核' ){
								return '<span style="color:#ddd;">' + rowData.OrdAmt + '</span>'
							}else{
								return rowData.OrdAmt
							}
						}
					})
				}
				if( isInit ){
					this.filterForm.beginDate = result.GetOrdersPBeginDate
					this.filterForm.endDate = result.GetOrdersPEndDate
				}
				this.filterForm.maxDate = result.GetOrdersPMaxDate
				this.filterForm.minDate = result.GetOrdersPMinDate
				result.daily_order_status.forEach((item,index)=>{
					if( item != '全部' ){
						this.config.step.status.push({ title: item, value:item })
					}
					this.config.filterStatus.status.push({ title: item, value:item })
				})
				await this.optionalDate()
				this.config.filterStatus.show = true	
			},
			cusInfoClick(){
				this.cusInfo = this.$options.data().cusInfo
				this.$request.client.ordersManage.dailyOrdersCusInfo( this.filterForm ).then(res=>{
					if( res.errorCode == '00000' ) {
						this.cusInfo = res.result
					}
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.cusInfo.show = true
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
				this.ordInfo = this.$options.data().ordInfo
				this.config.step.active = this.$options.data().config.step.active
				this.ordInfo = this.fieldData[ params.index ]
				this.statusClick( this.ordInfo.sstate )
				this.config.popup.ordInfo.show = true
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
			console.log(this.$store.state.client)
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
			this.config.table.height  = window.screen.height - 215;
			window.addEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		updated(){
			
		},
		destroyed(){
			this.beforeunloadHandler();
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		computed:{
			...window.Vuex.mapGetters({
				viewH: 'page/viewH',
			}),
		},
		watch:{

		}
	}
</script>
<style>
	@import '~@/assets/style/card.css';
	/* .van-steps--horizontal{
		padding: 0 !important;
	}
	
	.van-steps__items {
		margin: 0 !important;
		padding-bottom: 0 !important; 
	} */
</style>