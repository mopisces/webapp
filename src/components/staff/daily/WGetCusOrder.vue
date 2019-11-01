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
		<van-popup ref="staffInfo" v-model="config.popup.leftPopup.show" position="left"  :style="{ width: '100%', height:'100%' }">
			<div class="van-nav-bar van-nav-bar--fixed van-hairline--bottom">
				<div class="van-nav-bar__title van-ellipsis">
					员工信息
				</div>
			</div>
			<div style="margin-top:46px">
				<!-- <van-field v-model="staffInfo." readonly label="员工" input-align="center"/>
				<van-field v-model="staffInfo." readonly label="开始日期" input-align="center"/>
				<van-field v-model="staffInfo." readonly label="结束日期" input-align="center"/> -->
				<van-field v-model="staffInfo.ordAmt" readonly label="下单金额" input-align="center"/>
				<van-field v-model="staffInfo.tLength" readonly label="下单米数" input-align="center"/>
				<van-field v-model="staffInfo.tSalesArea" readonly label="下单平方" input-align="center"/>
			</div>
			<van-button type="primary" size="normal" style="width:100%;" @click="config.popup.leftPopup.show = false">关闭</van-button>
		</van-popup>
		<popup-filter :filterShow="config.popup.rightFilter.show" @resetClick="resetClick" @filterClick="filterClick" @filterOverlayClick="filterOverlayClick" >
			<van-field readonly clickable label="客户名称" v-model="filterForm.cusName" placeholder="选择客户名称" input-align="center" @click="config.popup.cusFilter.show = true" slot="filter-field-1"></van-field>
			<van-field readonly clickable label="开始日期" v-model="filterForm.beginDate" placeholder="选择开始日期" input-align="center" @click="config.popup.timeFilter.start.show = true" slot="filter-field-2"></van-field>
			<van-field readonly clickable label="结束日期" v-model="filterForm.endDate" placeholder="选择结束日期" input-align="center" @click="config.popup.timeFilter.end.show = true" slot="filter-field-3"></van-field>
			<van-switch-cell v-model="filterForm.addUserId" title="下单员" slot="filter-field-4"/>
			<van-switch-cell v-model="config.switch.rem.checked" title="记住筛选条件(本次登录有效)"  slot="filter-field-7" @change="filterRemClick"/>
		</popup-filter>
		<cus-picker :show="config.popup.cusFilter.show" :searchData="pageConfig.searchData" :index="pageConfig.defaultIndex" @cusPickerCancel="cusPickerCancel"  @cusPickerConfirm="cusPickerConfirm" @cusPickerInput="cusPickerInput"></cus-picker>
		<time-picker :dateTimeShow="config.popup.timeFilter.start.show" :dateTime="pageConfig.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" @clickOverlay="timePickerOverlay" @onCancel="timePickerCancel" @onConfirm="timeBeginConfirm"></time-picker>
		<time-picker :dateTimeShow="config.popup.timeFilter.end.show" :dateTime="pageConfig.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" @clickOverlay="timePickerOverlay" @onCancel="timePickerCancel" @onConfirm="timeEndConfirm"></time-picker>
	</div>
</template>
<script>
	import { Button, Cell, CellGroup, Popup, Field, SwitchCell, Sticky  } from 'vant';
	import { dateTimeFormat } from '@/util/index';
	import CusPicker from '@/components/subject/CusPicker.vue';
	import TimePicker from '@/components/subject/TimePicker.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
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
			PopupFilter
		},
		data(){
			return {
				config:{
					popup:{
						leftPopup:{
							show :false,
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
					defaultIndex:-1,
					searchData:'',
					beginDate:new Date(),
					endDate:new Date(),
					minDate:new Date(),
					maxDate:new Date(),
				}
			}
		},
		methods:{
			cellClick(item){
				let str  = JSON.stringify(Object.assign({},this.filterForm,item,{maxDate:dateTimeFormat( this.pageConfig.maxDate,'yyyy-MM-dd' ),minDate:dateTimeFormat( this.pageConfig.minDate,'yyyy-MM-dd' )}));
				sessionStorage.setItem('daily/wGetCusOrder/info',str);
				this.$router.push('/staff/daily/getOrdersP');
			},
			getDailyConfig(){
				let self = this;
				this.$request.staff.daily.dailyConfig().then(res=>{
					self.filterForm.beginDate = res.result.WGetCusOrderBeginDate;
					self.filterForm.endDate = res.result.WGetCusOrderEndDate;

					self.pageConfig.beginDate = new Date(res.result.WGetCusOrderBeginDate);
					self.pageConfig.endDate = new Date(res.result.WGetCusOrderEndDate);
					self.pageConfig.minDate = new Date(res.result.WGetCusOrderMinDate);
					self.pageConfig.maxDate = new Date(res.result.WGetCusOrderMaxDate);
					
				}).then(()=>{
					this.getDailyOrder( this.filterForm );
				}).then(()=>{

					sessionStorage.setItem('daily/wGetCusOrder---pageConfig',JSON.stringify(this.pageConfig));
				});
			},
			getDailyOrder( data ){
				let self = this;
				this.$request.staff.daily.getDailyOrder( data ).then(res=>{
					self.cellInfo = res.result;
				});
			},
			resetClick(){
				let init = JSON.parse(sessionStorage.getItem('daily/wGetCusOrder---pageConfig'));
				this.filterForm = {
					beginDate:dateTimeFormat( init.beginDate,'yyyy-MM-dd' ),
					endDate:dateTimeFormat( init.endDate,'yyyy-MM-dd' ),
					addUserId:false,
					orderCusId:'',
					cusName:''
				};
			},
			filterClick(){
				this.filterOverlayClick();
				this.getDailyOrder( this.filterForm );
			},
			filterOverlayClick(){
				this.config.popup.rightFilter.show = false;
			},
			filterRemClick( checked ){
				this.removeItem();
				if( checked === false ){
					this.config.switch.rem.checked = false;
				}else{
					this.config.switch.rem.checked = true;
					sessionStorage.setItem('daily/wGetCusorder---pageConfig',JSON.stringify(this.pageConfig));
					sessionStorage.setItem('daily/wGetCusorder',JSON.stringify(this.filterForm));
				}
			},
			cusPickerCancel(){
				this.config.popup.cusFilter.show = false;
			},
			cusPickerConfirm( data ){
				this.config.popup.cusFilter.show = false;
				this.filterForm.cusName = data.key;
			},
			cusPickerInput(){
				this.pageConfig.searchData = value;
			},
			getPageName(){
				return 'daily/wGetCusOrder';
			},
			timePickerOverlay(){
				this.timePickerCancel();
			},
			timePickerCancel(){
				this.config.popup.timeFilter.end.show = false;
				this.config.popup.timeFilter.start.show = false;
			},
			timeBeginConfirm( value ){
				this.filterForm.beginDate = dateTimeFormat( value.value,'yyyy-MM-dd' );
				this.pageConfig.beginDate = value.value;
				this.timePickerCancel();
			},
			timeEndConfirm( value ){
				this.filterForm.endDate = dateTimeFormat( value.value,'yyyy-MM-dd' );
				this.pageConfig.endDate = value.value;
				this.timePickerCancel();
			},
			removeItem(){
				sessionStorage.removeItem('daily/wGetCusorder');
				sessionStorage.removeItem('daily/wGetCusorder---pageConfig');
			}
		},
		mounted(){
			this.getDailyConfig();
			this.removeItem();
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','客户每日订单');
			if( sessionStorage.getItem('daily/wGetCusorder') !== null   ){
				this.filterForm = JSON.parse(sessionStorage.getItem('daily/wGetCusorder'));
			}
			if( sessionStorage.getItem('daily/wGetCusorder---pageConfig') !== null  ){
				this.pageConfig = JSON.parse(sessionStorage.getItem('daily/wGetCusorder---pageConfig'));
			}
		},
		computed:{
			
		},
		watch:{
			filterForm:{
				handler( val, oldVal ){
					this.config.switch.rem.checked = false;
				},
				deep:true
			}
		}
	}
</script>