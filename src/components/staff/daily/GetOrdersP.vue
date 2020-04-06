<template>
	<div>
		<van-sticky :offset-top="46">
			<div class="van-row">
				<div class="van-col van-col--12">
					<van-button plain hairline type="info" style="width:100%" @click="config.popup.leftPopup.show = true">客户信息信息</van-button>
				</div>
				<div class="van-col van-col--12">
					<van-button plain hairline type="info" style="width:100%"  @click="config.popup.rightFilter.show = true">筛选</van-button>
				</div>
			</div>
		</van-sticky>
		<prev-next @radioConfirm="radioConfirm" :radioData="radioData" v-if="config.prevNext.show"></prev-next>
		<template v-if="config.field.show">
			<van-field v-for="(item,index) in fieldData" :key="index" :value="item.OrdQty" readonly :label="item.guige" input-align="center" @click="fieldClick(index)">
				<div slot="right-icon" style="color:#0bf147">{{ item.sstate }}</div>
				<van-icon name="arrow" slot="button"/>
			</van-field>
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
				<new-time-picker :dateTime.sync="filterCount.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker :dateTime.sync="filterCount.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker>
				<radio-cell :radioInfo.sync="filterForm.sState" :radioColumns="config.filterStatus.status" title="订单状态" v-if="config.filterStatus.show"></radio-cell>
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button, Icon, Popup, Field, Step, Steps, Sticky } from 'vant';
	import PrevNext from '@/components/subject/PrevNext.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import RadioCell from '@/components/subject/RadioCell.vue';
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
			RadioCell,
			PrevNext,
			NewPopup
		},
		data(){
			return {
				config:{
					popup:{
						leftPopup:{
							show :false,
							title:'员工信息',
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
					}
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
				fieldData:[],
				pageConfig:{
					maxDate : '',
					minDate : ''
				}
			}
		},
		methods:{
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
					self.fieldData = res.result;
				}).then(()=>{
					this.$nextTick(() => {
					    this.config.field.show = true;
					});
				});
			},
			getCountOrder( data ){
				let self = this;
				this.config.prevNext.show = false;
				this.$request.staff.daily.getCountOrder(data).then(res=>{
					self.radioData = res.result;
					self.radioData.forEach((item,index)=>{
						item['prevNext'] = item.OrderDate;
						item['tag']      = 'daily';
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
					this.filterForm.orderDate = val;
					this.getDailyDetail(this.filterForm);
				}
			},
			fieldClick( index ){
				this.rightPopupData = this.fieldData[ index ];
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
				this.filterForm.sState = 0;
			},
			async filterClick(){
				await this.getCountOrder( this.filterCount );
				this.filterForm.orderDate = this.radioData[0].OrderDate;
				this.getDailyDetail( this.filterForm );
				this.config.popup.rightFilter.show = false;
			},
			getConfig(){
				let self = this;
				this.$request.staff.daily.dailyConfig().then(res=>{
					if( res.errorCode != '00000' ){
						return ;
					}
					res.result.daily_order_status.forEach((item,index)=>{
						self.config.filterStatus.status.push({ title:item, value:item });
						if( item != '全部' ){
							self.config.step.status.push({ title:item, value:item });
						}
					});
					self.config.filterStatus.show = true;
				});
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','每日订单详细信息');
			if( sessionStorage.getItem('daily/wGetCusOrder/info') !== null ){
				this.form = JSON.parse(sessionStorage.getItem('daily/wGetCusOrder/info'));
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
			this.getConfig();
			this.getCusInfo( this.form );
			this.getCountOrder( this.filterCount );
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