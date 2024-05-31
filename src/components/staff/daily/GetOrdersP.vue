<template>
	<div>
		<van-sticky :offset-top="46">
			<div class="van-row">
				<div class="van-col van-col--12">
					<van-button plain hairline type="info" style="width:100%" @click="cusInfoClick()">客户信息</van-button>
				</div>
				<div class="van-col van-col--12">
					<van-button plain hairline type="info" style="width:100%"  @click="config.popup.rightFilter.show = true">筛选</van-button>
				</div>
			</div>
		</van-sticky>
		<prev-next @radioConfirm="radioConfirm" :radioData="radioData" v-if="config.prevNext.show"></prev-next>
		<template v-if="config.field.show">
			<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" :height="config.table.height" even-bg-color="#fafafa" :row-click="rowClick">
			</v-table>
		</template>
		<new-popup :leftShow.sync="config.popup.leftPopup.show" :title="config.popup.leftPopup.title" :position="config.popup.leftPopup.position" :isClose="true">
			<div slot="new-popup-1">
				<van-field v-model="leftPopupData.CusShortName" readonly label="客户简称" input-align="center"/>
				<van-field v-model="leftPopupData.Merchandiser" readonly label="跟单员" input-align="center"/>
				<van-field v-model="leftPopupData.TaskName" readonly label="业务员" input-align="center"/>
				<van-field v-model="form.beginDate" readonly label="开始日期" input-align="center"/>
				<van-field v-model="form.endDate" readonly label="结束日期" input-align="center"/>
				<van-field v-model="leftPopupData.OrdCount" readonly label="下单笔数" input-align="center"/>
				<van-field v-model="leftPopupData.UnSelCount" readonly label="未排笔数" input-align="center"/>
				<van-field v-model="leftPopupData.SelCount" readonly label="已排笔数" input-align="center"/>
				<van-field v-model="leftPopupData.TOrdVol" readonly label="下单立方" input-align="center"/>
				<van-field v-model="leftPopupData.TProVol" readonly label="生产立方" input-align="center"/>
				<van-field v-model="leftPopupData.TStockVol" readonly label="库存立方" input-align="center"/>
				<van-field v-model="leftPopupData.TUnDeliVol" readonly label="未送立方" input-align="center"/>
				<template v-show="config.showOrdAmt">
					<van-field v-model="leftPopupData.OrdAmt" readonly label="排单未送金额" input-align="center"/>
				</template>
			</div>
		</new-popup>
		<new-popup :leftShow.sync="config.popup.rightPopup.show" :title="config.popup.rightPopup.title" :position="config.popup.rightPopup.position" :isClose="true">
			<div slot="new-popup-1">
				<van-field v-model="rightPopupData.OrderId" readonly label="订单编号" input-align="center"/>
				<van-field v-model="rightPopupData.CusPoNo" readonly label="客订单号" input-align="center"/>
				<van-field v-model="rightPopupData.guige" readonly label="规格" input-align="center"/>
				<van-field v-model="rightPopupData.ScoreInfo" readonly label="压线" input-align="center"/>
				<van-field v-model="rightPopupData.BoardName" readonly label="材质名称" input-align="center"/>
				<van-field v-model="rightPopupData.OrdQty" readonly label="订单数" input-align="center"/>
				<van-field v-model="rightPopupData.OrderDate" readonly label="下单日期" input-align="center"/>
				<van-field v-model="rightPopupData.sstate" readonly label="订单状态" input-align="center" @click="statusClick(rightPopupData.sstate)">
					<van-icon name="arrow-down" slot="right-icon" v-if="!config.step.show"></van-icon>
					<van-icon name="arrow-up" slot="right-icon" v-if="config.step.show"></van-icon>
				</van-field>
				<van-steps :active="config.step.active" v-if="config.step.show" direction="vertical">
					<van-step v-for="(item,index) in config.step.status" :key="index">{{item.title}}</van-step>
				</van-steps>
				<van-field v-model="rightPopupData.InTime" readonly label="完工时间" input-align="center" v-if="rightPopupData.InTime"/>
				<van-field v-model="rightPopupData.TimeToGo" readonly label="送货时间" input-align="center" v-if="rightPopupData.TimeToGo"/>
				<van-field v-model="rightPopupData.ConfQty" readonly label="回签数量" input-align="center" v-if="rightPopupData.ConfQty"/>
				<van-field v-model="rightPopupData.CarPName" readonly label="送货司机" input-align="center" v-if="rightPopupData.CarPName"/>
				<van-field v-model="rightPopupData.Phone" readonly label="电话" input-align="center" v-if="rightPopupData.Phone"/>
				<van-field v-model="rightPopupData.CarNo" readonly label="送货车号" input-align="center" v-if="rightPopupData.CarNo" @click="phoneClick(rightPopupData.CarNo)"/>
			</div>
		</new-popup>
		<popup-filter :filterShow.sync="config.popup.rightFilter.show" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<van-field label="订单编号" v-model="filterForm.orderId" placeholder="模糊查询" input-align="center"></van-field>
				<van-field label="客订单号" v-model="filterForm.cusPoNo" placeholder="模糊查询" input-align="center"></van-field>
				<van-field label="板长" v-model="filterForm.boardLength" placeholder="模糊查询" input-align="center" type="number" maxlength="6"></van-field>
				<van-field label="板宽" v-model="filterForm.boardWidth" placeholder="模糊查询" input-align="center" type="number" maxlength="6"></van-field>
				<van-field label="压线" v-model="filterForm.scoreInfo" placeholder="模糊查询" input-align="center"></van-field>
				<van-field label="订单数" v-model="filterForm.orderQuantity" placeholder="模糊查询" input-align="center" type="number" maxlength="6"></van-field>
				<time-range-picker
					:beginDate.sync="filterCount.beginDate"
					:endDate.sync="filterCount.endDate"
					:maxDate.sync="pageConfig.maxDate"
					:minDate.sync="pageConfig.minDate"
				></time-range-picker>
				<!-- <new-time-picker :dateTime.sync="filterCount.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker :dateTime.sync="filterCount.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker> -->
				<uni-check-box
					label="订单状态"
					:localdata="config.filterStatus.status"
					:radioData.sync="filterForm.sState" 
					:map="{text: 'title', value: 'value'}"
				>
				</uni-check-box>
				<!-- <radio-cell :radioInfo.sync="filterForm.sState" :radioColumns="config.filterStatus.status" title="订单状态" v-if="config.filterStatus.show"></radio-cell> -->
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button, Icon, Popup, Field, Step, Steps, Sticky } from 'vant';
	import PrevNext from '@/components/subject/PrevNext.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	//import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import RadioCell from '@/components/subject/RadioCell.vue';
	import NewPopup from '@/components/subject/NewPopup.vue';
	import { getStorage, setStorage } from '@/util/storage';

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
			[Step.name]: Step,
			[Steps.name]: Steps,
			[Sticky.name]: Sticky,
			
			PopupFilter,
			//NewTimePicker,
			RadioCell,
			PrevNext,
			NewPopup,
			UniCheckBox,
			TimeRangePicker
		},
		data(){
			return {
				config:{
					table:{
						columns:[],
						height:0
					},
					popup:{
						leftPopup:{
							show :false,
							title:'客户信息',
							position:'left'
						},
						rightPopup:{
							show :false,
							title:'订单详细信息',
							position:'right'
						},
						rightFilter:{
							show :false,
						}
					},
					prevNext:{
						show:false
					},
					step:{
						show:false,
						status:[],
						active:0
					},
					radio:{
						title : '订单状态'
					},
					field:{
						show : false
					},
					filterStatus : {
						show   : false,
						status : []
					},
					showOrdAmt: false
				},
				form:{
					cusId     : '',
					beginDate : '',
					endDate   : ''
				},
				leftPopupData:{},
				rightPopupData:{},
				radioData:[],
				filterForm:{
					orderId       : '',
					cusPoNo       : '',
					boardLength   : '',
					boardWidth    : '',
					scoreInfo     : '',
					orderQuantity : '',
					orderDate     : '',
					sState        : '全部',
				},
				filterCount:{
					cusId     : '',
					beginDate : '',
					endDate   : '',
					sState    : '全部'
				},
				tableData:[],
				pageConfig:{
					maxDate : '',
					minDate : ''
				}
			}
		},
		methods:{
			cusInfoClick(){
				this.form.beginDate = this.filterCount.beginDate;
				this.form.endDate = this.filterCount.endDate;
				this.getCusInfo(this.form);
				this.config.popup.leftPopup.show = true;
			},
			getCusInfo( data ){
				let self = this;
				this.$request.staff.daily.getCusInfo( data ).then(res=>{
					self.leftPopupData = res.result;
				});
			},
			getDailyDetail( data ){
				let self = this;
				this.config.field.show = false;
				this.$request.staff.daily.getOrderDeatil( data ).then(res=>{
					self.tableData = res.result;
				}).then(()=>{
					this.$nextTick(() => {
					    this.config.field.show = true;
					});
				});
			},
			getCountOrder( data, filter ){
				let self = this;
				this.config.prevNext.show = false;
				this.$request.staff.daily.getCountOrder(data,filter).then(res=>{
					self.radioData = [];
					if( res.errorCode != '00000' ){
						return false;
					}
					self.radioData = res.result;
					self.radioData.forEach((item,index)=>{
						item['prevNext'] = item.OrderDate;
						item['tag']      = 'daily';
					});
					self.filterForm.orderDate = self.radioData[0].OrderDate;
				}).then(()=>{
					this.$nextTick(() => {
					    this.config.prevNext.show = true;
					});
				}).then(()=>{
					if( this.radioData.length != 0 ){
						this.filterForm.cusId = this.form.CusId;
					}
				});
			},
			radioConfirm( val ){
				if( this.radioData ){
					this.filterForm.orderDate = val;
					this.getDailyDetail(this.filterForm);
				}
			},
			rowClick(rowIndex,rowData,column){
				this.rightPopupData = rowData;
				this.config.step.show = false;
				this.config.popup.rightPopup.show = true;
			},
			phoneClick( tel ){
				window.location.tel = 'tel://' + tel;
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
			rightPopupClose(){
				this.config.popup.rightPopup.show = false;
				this.config.step.show = false;
			},
			resetClick(){
				this.filterForm.sState = '全部';
				Object.keys(this.filterForm).forEach((item) => {
					if( item != 'sState' ){
						this.filterForm[item] = null;
					}
				});
			},
			filterClick(){
				this.getCountOrder( this.filterCount, this.filterForm );
				this.getDailyDetail( this.filterForm );
				this.config.popup.rightFilter.show = false;
			},
			async getConfig(){
				const { result } = await getWebConfig({paramType: 'staffDaily'})
				result.daily_order_status.forEach((item,index)=>{
					this.config.filterStatus.status.push({ title:item, value:item });
					if( item != '全部' ){
						this.config.step.status.push({ title:item, value:item });
					}
				})
				this.config.showOrdAmt = result.WGetCusOrderShowAmt == 1 ? true : false
				this.config.filterStatus.show = true
			},
			getTableConfig(){
				this.$request.common.table.getTableConfig().then(res=>{
					this.config.table.columns = res.getOrdersP;
					this.config.table.columns.forEach((item)=>{
						if(item.field == 'sstate'){
							item['formatter'] = (rowData)=>{
								return '<span style="color:#0bf147">' + rowData.sstate + '</span>';
							};
						}
					});
				});
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','每日订单详细信息');
			if( getStorage('daily/wGetCusOrder/info') !== null ){
				this.form = JSON.parse(getStorage('daily/wGetCusOrder/info'));
				this.pageConfig.maxDate    = this.form.maxDate;
				this.pageConfig.minDate    = this.form.minDate;
				this.filterCount.cusId     = this.form.CusId;
				this.filterCount.beginDate = this.form.beginDate;
				this.filterCount.endDate   = this.form.endDate;
			}else{
				this.$router.go(-1);
			}
			this.$store.commit('staff/setBackPath','/staff/daily/wGetCusOrder');
		},
		mounted(){
			this.getConfig();
			this.getCusInfo( this.form );
			this.getCountOrder( this.filterCount, this.filterForm );
			this.getTableConfig();
			this.config.table.height = window.screen.height - 200;
		},
		destroyed(){
			
		},
		computed:{
			sStateChange(){
				return this.filterForm.sState;
			}
		},
		watch:{
			sStateChange( newV, oldV ){
				this.filterCount.sState = newV;
			}
		}
	}
</script>