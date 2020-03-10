<template>
	<div id="wGetCusorder">
		<div style="width:100%;height:0.0625rem;"></div>
		<van-sticky :offset-top="46">
			<div class="van-row">
				<div class="van-col van-col--12">
					<van-button plain hairline type="info" style="width:100%" @click="config.popup.leftPopup.show = true">员工信息</van-button>
				</div>
				<div class="van-col van-col--12">
					<van-button plain hairline type="info" style="width:100%"  @click="config.popup.rightFilter.show = true">筛选</van-button>
				</div>
			</div>
		</van-sticky>
		<van-cell-group>
			<van-cell is-link :title="item.CusShortName + '(' + item.CusId + ')'" :value="item.OrdAmt" v-for="(item,index) in cellInfo" :key="index" @click="cellClick(item)"/>
		</van-cell-group>
		<new-popup :leftShow.sync="config.popup.leftPopup.show" :title="config.popup.leftPopup.title" :position="config.popup.leftPopup.position" :isClose="true">
			<div slot="new-popup-1">
				<van-field v-model="staffInfo.userName" readonly label="员工" input-align="center"/>
				<van-field v-model="filterForm.beginDate" readonly label="开始日期" input-align="center"/>
				<van-field v-model="filterForm.endDate" readonly label="结束日期" input-align="center"/>
				<van-field v-model="staffInfo.ordAmt" readonly label="下单金额" input-align="center"/>
				<van-field v-model="staffInfo.tLength" readonly label="下单米数" input-align="center"/>
				<van-field v-model="staffInfo.tSalesArea" readonly label="下单平方" input-align="center"/>
			</div>
		</new-popup>
		<popup-filter :filterShow.sync="config.popup.rightFilter.show" @resetClick="resetClick" @filterClick="filterClick" id="popup-filter">
			<div slot="filter-field-1">
				<cus-picker :cusName.sync="filterForm.cusName"></cus-picker>
				<new-time-picker v-if="config.popup.timeFilter.isFinishLoad" :dateTime.sync="filterForm.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker v-if="config.popup.timeFilter.isFinishLoad" :dateTime.sync="filterForm.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker>
				<van-switch-cell v-model="filterForm.addUserId" title="下单员"/>
				<van-switch-cell v-model="config.switch.rem.checked" title="记住筛选条件(本次登录有效)"/>
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button, Cell, CellGroup, Popup, Field, SwitchCell, Sticky  } from 'vant';
	import CusPicker from '@/components/subject/picker/CusPicker.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import NewPopup from '@/components/subject/NewPopup.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Popup.name]: Popup,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[Sticky.name]: Sticky,

			CusPicker,
			NewTimePicker,
			PopupFilter,
			NewPopup
		},
		data(){
			return {
				config:{
					getConfig : true,
					popup:{
						leftPopup:{
							show     : false,
							title    : '员工信息',
							position : 'left'
						},
						rightFilter:{
							show :false,
						},
						timeFilter:{
							isFinishLoad:false
						}
					},
					switch:{
						rem:{
							checked : true
						}
					}
				},
				staffInfo:{
					ordAmt     : '',
					tLength    : '',
					tSalesArea : '',
					userName   : ''
				},
				cellInfo:[],
				filterForm:{
					beginDate : '',
					endDate   : '',
					addUserId : false,
					cusName   : ''
				},
				pageConfig:{
					minDate    : '',
					maxDate    : '',
				}
			}
		},
		methods:{
			getUserInfo(){
				let self = this;
				this.$request.staff.user.getUserInfo().then(res=>{
					self.staffInfo.userName = res.result.user_name+'('+ res.result.erp_id +')';
				});
			},
			getDailyUser( data ){
				let self = this;
				this.$request.staff.daily.getDailyUser( data ).then(res=>{
					self.staffInfo.ordAmt     = res.result.OrdAmt;
					self.staffInfo.tLength    = res.result.TLength;
					self.staffInfo.tSalesArea = res.result.TSalesArea;
				}).then(()=>{
					this.getUserInfo();
				});
			},
			cellClick(item){
				let str  = JSON.stringify(Object.assign({},this.filterForm,item,this.pageConfig));
				sessionStorage.setItem('daily/wGetCusOrder/info',str);
				this.$router.push('/staff/daily/getOrdersP');
			},
			getDailyConfig( isReset = false ){
				let self = this;
				this.$request.staff.daily.dailyConfig().then(res=>{
					if( this.config.getConfig ){
						self.filterForm.beginDate = res.result.WGetCusOrderBeginDate;
						self.filterForm.endDate   = res.result.WGetCusOrderEndDate;
					}
					self.pageConfig.minDate = res.result.WGetCusOrderMinDate;
					self.pageConfig.maxDate = res.result.WGetCusOrderMaxDate;
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.timeFilter.isFinishLoad = true;
					})
				}).then(()=>{
					this.$nextTick(()=>{
						this.getDailyUser( this.filterForm );
					})
				}).then(()=>{
					if( isReset ){
						return ;
					}
					this.getDailyOrder( this.filterForm );
				});
			},
			getDailyOrder( data ){
				let self = this;
				this.$request.staff.daily.getDailyOrder( data ).then(res=>{
					self.cellInfo = res.result;
				});
			},
			resetClick(){
				this.filterForm = {
					beginDate:'',
					endDate:'',
					addUserId:false,
					cusName:''
				};
				this.$refs.cusPicker.cusPickerClean();
				sessionStorage.removeItem('daily/wGetCusorder');
				this.config.getConfig = true;
				this.config.switch.rem.checked = false;
				this.getDailyConfig( true );
			},
			filterClick(){
				this.config.popup.rightFilter.show = false;
				this.getDailyOrder( this.filterForm );
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','客户每日订单');
			if( sessionStorage.getItem('daily/wGetCusorder') !== null   ){
				let storageData = JSON.parse(sessionStorage.getItem('daily/wGetCusorder'));
				this.filterForm = storageData;
				this.config.getConfig     = false;
				this.config.switch.rem.checked = true;
			}
		},
		mounted(){
			this.getDailyConfig();
		},
		destroyed(){
			if( this.config.switch.rem.checked ){
				sessionStorage.setItem('daily/wGetCusorder',JSON.stringify(this.filterForm));
			}else{
				sessionStorage.removeItem('daily/wGetCusorder');
			}
		},
		computed:{
			
		},
		watch:{
			
		}
	}
</script>