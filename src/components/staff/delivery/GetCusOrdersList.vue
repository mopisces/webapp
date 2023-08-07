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
			<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" :height="config.table.height" even-bg-color="#fafafa">
			</v-table>
		</template>
		<new-popup :leftShow.sync="config.popup.leftPopup.show" :title="config.popup.leftPopup.title" :position="config.popup.leftPopup.position" :isClose="true">
			<div slot="new-popup-1">
				<van-field v-model="leftPopupData.CusShortName" readonly label="客户简称" input-align="center"/>
				<van-field v-model="leftPopupData.TaskName" readonly label="业务员" input-align="center"/>
				<van-field v-model="form.beginDate" readonly label="开始日期" input-align="center"/>
				<van-field v-model="form.endDate" readonly label="结束日期" input-align="center"/>
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
				<van-field label="压线" v-model="filterForm.scoreInfo" placeholder="模糊查询" input-align="center"></van-field>
				<van-field label="订单数" v-model="filterForm.orderQuantity" placeholder="模糊查询" input-align="center" type="number" maxlength="6"></van-field>
				<new-time-picker :dateTime.sync="filterCount.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker :dateTime.sync="filterCount.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker>
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button, Icon, Popup, Field, Step, Steps, Sticky } from 'vant';
	import PrevNext from '@/components/subject/PrevNext.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import NewPopup from '@/components/subject/NewPopup.vue';
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
			NewTimePicker,
			PrevNext,
			NewPopup
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
						rightFilter:{
							show :false,
						}
					},
					prevNext:{
						show:false
					},
					field:{
						show : false
					},
				},
				form:{
					cusId     : '',
					beginDate : '',
					endDate   : ''
				},
				leftPopupData:{},
				radioData:[],
				filterForm:{
					cusId         :null,
					orderId       : '',
					cusPoNo       : '',
					boardLength   : '',
					boardWidth    : '',
					scoreInfo     : '',
					orderQuantity : '',
					deliveryDate  : '',
				},
				filterCount:{
					cusId     : '',
					beginDate : '',
					endDate   : '',
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
				this.$request.staff.delivery.cusInfo( data ).then(res=>{
					self.leftPopupData = res.result;
				});
			},
			getDailyDetail( data ){
				let self = this;
				this.config.field.show = false;
				this.$request.staff.delivery.detail( data ).then(res=>{
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
				this.$request.staff.delivery.dateInfo(data,filter).then(res=>{
					self.radioData = res.result;
					self.radioData.forEach((item,index)=>{
						item['prevNext'] = item.DNDate;
						item['tag']      = 'delivery';
					});
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
				if( this.radioData.length != 0 ){
					this.filterForm.deliveryDate = val;
					this.getDailyDetail(this.filterForm);
				}
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
				Object.keys(this.filterForm).forEach((item) => {
					if( item != 'cusId' ){
						this.filterForm[item] = null;
					}
				});
			},
			filterClick(){
				this.getCountOrder( this.filterCount, this.filterForm );
				this.filterForm.deliveryDate = this.radioData[0].DNDate;
				this.getDailyDetail( this.filterForm );
				this.config.popup.rightFilter.show = false;
			},
			getTableConfig(){
				this.$request.common.table.getTableConfig().then(res=>{
					this.config.table.columns = res.staffDeliveryDaily;
				});
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','每日送货详细信息');
			if( sessionStorage.getItem('delivery/GetDNMain/info') !== null ){
				this.form = JSON.parse(sessionStorage.getItem('delivery/GetDNMain/info'));
				this.pageConfig.maxDate    = this.form.maxDate;
				this.pageConfig.minDate    = this.form.minDate;
				this.filterCount.cusId     = this.form.CusId;
				this.filterCount.beginDate = this.form.beginDate;
				this.filterCount.endDate   = this.form.endDate;
			}else{
				this.$router.go(-1);
			}
		},
		mounted(){
			this.getCusInfo( this.form );
			this.getCountOrder( this.filterCount, this.filterForm );
			this.getTableConfig();
			this.config.table.height = window.screen.height - 220;
		},
		destroyed(){
			
		},
		computed:{
			
		},
		watch:{
			
		}
	}
</script>