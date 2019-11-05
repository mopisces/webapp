<template>
	<div>
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
				<!-- <van-field v-model="staffInfo." readonly label="员工" input-align="center"/> -->
				<van-field v-model="filterForm.beginDate" readonly label="开始日期" input-align="center"/>
				<van-field v-model="filterForm.endDate" readonly label="结束日期" input-align="center"/>
				<van-field v-model="staffInfo.ordAmt" readonly label="下单金额" input-align="center"/>
				<van-field v-model="staffInfo.tLength" readonly label="下单米数" input-align="center"/>
				<van-field v-model="staffInfo.tSalesArea" readonly label="下单平方" input-align="center"/>
			</div>
		</new-popup>
		<popup-filter :filterShow.sync="config.popup.rightFilter.show" @resetClick="resetClick" @filterClick="filterClick">
			<van-field readonly clickable label="客户名称" v-model="filterForm.cusName" placeholder="选择客户名称" input-align="center" @click="config.popup.cusFilter.show = true" slot="filter-field-1"></van-field>
			<van-field readonly clickable label="开始日期" v-model="filterForm.beginDate" placeholder="选择开始日期" input-align="center" @click="config.popup.timeFilter.start.show = true" slot="filter-field-2"></van-field>
			<van-field readonly clickable label="结束日期" v-model="filterForm.endDate" placeholder="选择结束日期" input-align="center" @click="config.popup.timeFilter.end.show = true" slot="filter-field-3"></van-field>
			<van-switch-cell v-model="filterForm.addUserId" title="下单员" slot="filter-field-4"/>
			<van-switch-cell v-model="config.switch.rem.checked" title="记住筛选条件(本次登录有效)"  slot="filter-field-7" />
		</popup-filter>
		<cus-picker ref="cusPicker" :show.sync="config.popup.cusFilter.show" :searchData.sync="pageConfig.searchData" @cusPickerCancel="cusPickerCancel"  @cusPickerConfirm="cusPickerConfirm"></cus-picker>
		<time-picker :dateTimeShow.sync="config.popup.timeFilter.start.show" :dateTime.sync="pageConfig.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" @onCancel="timePickerCancel" @onConfirm="timeBeginConfirm"></time-picker>
		<time-picker :dateTimeShow.sync="config.popup.timeFilter.end.show" :dateTime.sync="pageConfig.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" @onCancel="timePickerCancel" @onConfirm="timeEndConfirm"></time-picker>
	</div>
</template>
<script>
	import { Button, Cell, CellGroup, Popup, Field, SwitchCell, Sticky  } from 'vant';
	import { dateTimeFormat } from '@/util/index';
	import CusPicker from '@/components/subject/CusPicker.vue';
	import TimePicker from '@/components/subject/TimePicker.vue';
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
			TimePicker,
			PopupFilter,
			NewPopup
		},
		data(){
			return {
				config:{
					getConfig:true,
					popup:{
						leftPopup:{
							show :false,
							title:'员工信息',
							position:'left'
						},
						rightFilter:{
							show :false,
						},
						cusFilter:{
							show:false
						},
						timeFilter:{
							start:{
								show:false
							},
							end:{
								show:false
							}
						}
					},
					switch:{
						rem:{
							checked:true
						}
					}
				},
				staffInfo:{
					ordAmt:'',
					tLength:'',
					tSalesArea:'',
				},
				cellInfo:[],
				filterForm:{
					beginDate:'',
					endDate:'',
					addUserId:false,
					cusName:''
				},
				pageConfig:{
					searchData:'',
					beginDate:new Date(),
					endDate:new Date(),
					minDate:new Date(),
					maxDate:new Date(),
				}
			}
		},
		methods:{
			getDailyUser( data ){
				let self = this;
				this.$request.staff.daily.getDailyUser().then(res=>{
					self.staffInfo.ordAmt     = res.result.OrdAmt;
					self.staffInfo.tLength    = res.result.TLength;
					self.staffInfo.tSalesArea = res.result.TSalesArea;
				});
			},
			cellClick(item){
				let str  = JSON.stringify(Object.assign({},this.filterForm,item,{maxDate:dateTimeFormat( this.pageConfig.maxDate,'yyyy-MM-dd' ),minDate:dateTimeFormat( this.pageConfig.minDate,'yyyy-MM-dd' )}));
				sessionStorage.setItem('daily/wGetCusOrder/info',str);
				this.$router.push('/staff/daily/getOrdersP');
			},
			getDailyConfig( isReset = false ){
				let self = this;
				this.$request.staff.daily.dailyConfig().then(res=>{
					if( this.config.getConfig ){
						self.filterForm.beginDate = res.result.WGetCusOrderBeginDate;
						self.filterForm.endDate = res.result.WGetCusOrderEndDate;
						self.pageConfig.beginDate = new Date(res.result.WGetCusOrderBeginDate);
						self.pageConfig.endDate = new Date(res.result.WGetCusOrderEndDate);
					}
					self.pageConfig.minDate = new Date(res.result.WGetCusOrderMinDate);
					self.pageConfig.maxDate = new Date(res.result.WGetCusOrderMaxDate);
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
			},
			cusPickerCancel(){
				this.config.popup.cusFilter.show = false;
			},
			cusPickerConfirm( data ){
				this.config.popup.cusFilter.show = false;
				this.filterForm.cusName = data.key;
			},
			timePickerCancel(){
				this.config.popup.timeFilter.end.show = false;
				this.config.popup.timeFilter.start.show = false;
			},
			timeBeginConfirm( value ){
				this.filterForm.beginDate = dateTimeFormat( value.value,'yyyy-MM-dd' );
				this.timePickerCancel();
			},
			timeEndConfirm( value ){
				this.filterForm.endDate = dateTimeFormat( value.value,'yyyy-MM-dd' );
				this.timePickerCancel();
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','客户每日订单');
			if( sessionStorage.getItem('daily/wGetCusorder') !== null   ){
				let storageData = JSON.parse(sessionStorage.getItem('daily/wGetCusorder'));
				this.filterForm = storageData;
				this.pageConfig.beginDate = new Date(storageData.beginDate);
				this.pageConfig.endDate = new Date(storageData.endDate);
				this.config.getConfig = false;
				this.config.switch.rem.checked = true;
			}
		},
		mounted(){
			this.getDailyConfig();
			this.getDailyUser();
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