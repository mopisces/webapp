<template>
	<div id="wGetCusorder" style="padding-bottom: 3.125rem;height:100%;">
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
				<cus-picker ref="cusPicker" :cusName.sync="filterForm.cusName"></cus-picker>
				
				<time-range-picker
					:beginDate.sync="filterForm.beginDate"
					:endDate.sync="filterForm.endDate"
					:maxDate.sync="pageConfig.maxDate"
					:minDate.sync="pageConfig.minDate"
				></time-range-picker>
				<van-switch-cell v-model="filterForm.addUserId" title="下单员" v-if=" false "/>
				<van-switch-cell v-model="config.switch.rem.checked" title="记住筛选条件(本次登录有效)"/>
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button, Cell, CellGroup, Popup, Field, SwitchCell, Sticky  } from 'vant';
	import CusPicker from '@/components/subject/picker/CusPicker.vue';
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
							checked : false
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
				setStorage('daily/wGetCusOrder/info',str);
				this.$router.push('/staff/daily/getOrdersP');
			},
			async getDailyConfig( isReset = false ){
				const { result } = await getWebConfig({paramType: 'staffDaily'})
				if( this.config.getConfig ){
					this.filterForm.beginDate = result.WGetCusOrderBeginDate
					this.filterForm.endDate   = result.WGetCusOrderEndDate
				}
				this.pageConfig.minDate = result.WGetCusOrderMinDate
				this.pageConfig.maxDate = result.WGetCusOrderMaxDate
				await this.getDailyUser( this.filterForm )
				if( isReset ) return 
				await this.getDailyOrder( this.filterForm )
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
				removeStorage('daily/wGetCusorder');
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
					setStorage('daily/wGetCusorder',this.filterForm);
				}else{
					removeStorage('daily/wGetCusorder');
				}
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','客户每日订单');
			removeStorage('daily/wGetCusOrder/info');
			if( getStorage('daily/wGetCusorder') !== null   ){
				let storageData = JSON.parse( getStorage('daily/wGetCusorder') );
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