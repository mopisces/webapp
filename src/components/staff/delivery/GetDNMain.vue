<template>
	<div id="wGetCusorder"  style="padding-bottom:3.125rem;">
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
			<van-cell is-link :title="item.CusShortName + '(' + item.CusId + ')'" :value="item.TSalesArea" v-for="(item,index) in cellInfo" :key="index" @click="cellClick(item)"/>
		</van-cell-group>
		<new-popup :leftShow.sync="config.popup.leftPopup.show" :title="config.popup.leftPopup.title" :position="config.popup.leftPopup.position" :isClose="true">
			<div slot="new-popup-1">
				<van-field v-model="staffInfo.userName" readonly label="员工" input-align="center"/>
				<van-field v-model="filterForm.beginDate" readonly label="开始日期" input-align="center"/>
				<van-field v-model="filterForm.endDate" readonly label="结束日期" input-align="center"/>
				<van-field v-model="staffInfo.amt" readonly label="送货金额" input-align="center"/>
				<van-field v-model="staffInfo.tSalesArea" readonly label="销售面积" input-align="center"/>
				<van-field v-model="staffInfo.tVolume" readonly label="送货立方" input-align="center"/>
			</div>
		</new-popup>
		<popup-filter :filterShow.sync="config.popup.rightFilter.show" @resetClick="resetClick" @filterClick="filterClick" id="popup-filter">
			<div slot="filter-field-1">
				<cus-picker :cusName.sync="filterForm.cusName" ref="cusPicker"></cus-picker>
				<!-- <new-time-picker v-if="config.popup.timeFilter.isFinishLoad" :dateTime.sync="filterForm.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker v-if="config.popup.timeFilter.isFinishLoad" :dateTime.sync="filterForm.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker> -->
				<time-range-picker
					:beginDate.sync="filterForm.beginDate"
					:endDate.sync="filterForm.endDate"
					:maxDate.sync="pageConfig.maxDate"
					:minDate.sync="pageConfig.minDate"
				></time-range-picker>
				<!-- <van-switch-cell v-model="filterForm.addUserId" title="下单员" v-if=" false "/> -->
				<van-switch-cell v-model="config.switch.rem.checked" title="记住筛选条件(本次登录有效)"/>
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button, Cell, CellGroup, Popup, Field, SwitchCell, Sticky  } from 'vant';
	import CusPicker from '@/components/subject/picker/CusPicker.vue';
	//import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import NewPopup from '@/components/subject/NewPopup.vue';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';

	import TimeRangePicker from '@/components/subject/time/TimeRangePicker.vue'
	/*api接口*/
	import { getWebConfig } from '@/api/common/webConfig.js'

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
			//NewTimePicker,
			PopupFilter,
			NewPopup,

			TimeRangePicker
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
					amt        : '',
					tSalesArea : '',
					tVolume    : '',
				},
				cellInfo:[],
				filterForm:{
					beginDate : '',
					endDate   : '',
					//addUserId : false,
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
			getStaffInfo( data ){
				let self = this;
				this.$request.staff.delivery.staffInfo( data ).then(res=>{
					self.staffInfo.amt        = res.result.Amt;
					self.staffInfo.tSalesArea = res.result.TSalesArea;
					self.staffInfo.tVolume    = res.result.TVolume;
				}).then(()=>{
					this.getUserInfo();
				});
			},
			cellClick(item){
				let str  = JSON.stringify(Object.assign({},this.filterForm,item,this.pageConfig));
				sessionStorage.setItem('delivery/GetDNMain/info',str);
				this.$router.push('/staff/delivery/getCusOrdersList');
			},
			async getDailyConfig( isReset = false ){
				const { result } = await getWebConfig({paramType: 'staffDeli'})
				if( this.config.getConfig ){
					this.filterForm.beginDate = result.StaffDeliveryDailyBeginDate
					this.filterForm.endDate   = result.StaffDeliveryDailyEndDate
				}
				this.pageConfig.minDate = result.StaffDeliveryDailyMinDate
				this.pageConfig.maxDate = result.StaffDeliveryDailyMaxDate
				await this.getStaffInfo( this.filterForm )
				if( isReset ) return
				this.getDailyOrder( this.filterForm )
			},
			getDailyOrder( data ){
				let self = this;
				this.$request.staff.delivery.ListInfo( data ).then(res=>{
					self.cellInfo = res.result;
				});
			},
			resetClick(){
				this.filterForm = {
					beginDate:'',
					endDate:'',
					//addUserId:false,
					cusName:''
				};
				this.$refs.cusPicker.cusPickerClean();
				removeStorage('delivery/GetDNMain');
				this.config.getConfig = true;
				this.config.switch.rem.checked = false;
				this.getDailyConfig( true );
			},
			filterClick(){
				this.config.popup.rightFilter.show = false;
				this.getDailyOrder( this.filterForm );
			},
			beforeunloadHandler(){
				if( this.config.switch.rem.checked ){
					setStorage('delivery/GetDNMain',this.filterForm);
				}else{
					removeStorage('delivery/GetDNMain');
				}
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','客户每日送货');
			if( getStorage('delivery/GetDNMain') !== null   ){
				let storageData = JSON.parse(getStorage('delivery/GetDNMain'));
				this.filterForm = storageData;
				this.config.getConfig     = false;
				this.config.switch.rem.checked = true;
			}
		},
		mounted(){
			this.getDailyConfig();
			window.addEventListener('beforeunload', e => this.beforeunloadHandler());
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