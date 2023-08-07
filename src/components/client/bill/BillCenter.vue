<template>
	<div class="bill-center-container">
		<van-sticky :offset-top="46">
			<!-- <month-prev-next :dateTime.sync="formData.dateTime" :maxDate="pageConfig.maxDate" :minDate="pageConfig.minDate"></month-prev-next> -->
			<van-button plain hairline type="info" size="small" style="width:100%" @click="config.popup.filterShow = true">筛选</van-button>			
			<div class="bill-statis-container">
				<div class="bill-statis-list">
					<div class="bill-statis-item">
						<div class="bill-statis-name">
							上月未开
						</div>
						<div class="bill-statis-text text-color-blue">
							{{ statisInfo.LastInvAmt }}
						</div>
					</div>
					<div class="bill-statis-item">
						<div class="bill-statis-name">
							本月应开
						</div>
						<div class="bill-statis-text">
							{{ statisInfo.InvAmt }}
						</div>
					</div>
					<div class="bill-statis-item">
						<div class="bill-statis-name">
							本月已开
						</div>
						<div class="bill-statis-text text-color-green">
							{{ statisInfo.DNInvAmt }}
						</div>
					</div>
					<div class="bill-statis-item">
						<div class="bill-statis-name">
							本月未开
						</div>
						<div class="bill-statis-text text-color-yellow">
							{{ statisInfo.NeedInvAmt }}
						</div>
					</div>
				</div>
			</div>
		</van-sticky>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
		<!-- <van-tabs v-model="config.tabs.active" background="#f1f1f1" sticky :offset-top="46">
			<van-tab title="开票记录">
				<van-sticky :offset-top="100">
					<month-prev-next :dateTime.sync="formData.dateTime" :maxDate="pageConfig.maxDate" :minDate="pageConfig.minDate"></month-prev-next>
					<div class="bill-statis-container">
						<div class="bill-statis-list">
							<div class="bill-statis-item">
								<div class="bill-statis-name">
									上月未开
								</div>
								<div class="bill-statis-text text-color-blue">
									300823.67
								</div>
							</div>
							<div class="bill-statis-item">
								<div class="bill-statis-name">
									本月应开
								</div>
								<div class="bill-statis-text">
									0
								</div>
							</div>
							<div class="bill-statis-item">
								<div class="bill-statis-name">
									本月已开
								</div>
								<div class="bill-statis-text text-color-green">
									247569
								</div>
							</div>
							<div class="bill-statis-item">
								<div class="bill-statis-name">
									本月未开
								</div>
								<div class="bill-statis-text text-color-yellow">
									523263.87
								</div>
							</div>
						</div>
					</div>
				</van-sticky>
				<div :style="'height:'+ height+'px;overflow-y: scroll;'" class="bill-detail-container">
					<van-pull-refresh v-model="config.list.pullRefresh.reloading" @refresh="pullOnRefresh">
						<van-list v-model="config.list.pushLoading.loading" :finished="config.list.pushLoading.finished"  finished-text="没有更多了" @load="onLoad" :offset="100">
							<div class="bill-detail-card">
								<van-row >
									<van-col span="24" class="bill-detail-card-item bill-detail-status">已开发票</van-col>
								</van-row>
								<van-row>
									<van-col span="4" class="bill-detail-card-item">开票日期</van-col>
									<van-col span="6" class="bill-detail-card-item">2023-04-11</van-col>
									<van-col span="4" class="bill-detail-card-item">开票金额</van-col>
									<van-col span="10" class="bill-detail-card-item">376821</van-col>
								</van-row>
								<van-row>
									<van-col span="4" class="bill-detail-card-item">发票代码</van-col>
									<van-col span="6" class="bill-detail-card-item">22807615</van-col>
									<van-col span="4" class="bill-detail-card-item">发票号码</van-col>
									<van-col span="10" class="bill-detail-card-item">XSFP-2303-00078</van-col>
								</van-row>
								<van-row>
									<van-col span="4" class="bill-detail-card-item">发票备注</van-col>
									<van-col span="20" class="bill-detail-card-item"></van-col>
								</van-row>
							</div>
							<div class="bill-detail-card">
								<van-row >
									<van-col span="24" class="bill-detail-card-item bill-detail-status">已开发票</van-col>
								</van-row>
								<van-row>
									<van-col span="4" class="bill-detail-card-item">开票日期</van-col>
									<van-col span="6" class="bill-detail-card-item">2023-04-11</van-col>
									<van-col span="4" class="bill-detail-card-item">开票金额</van-col>
									<van-col span="10" class="bill-detail-card-item">376821</van-col>
								</van-row>
								<van-row>
									<van-col span="4" class="bill-detail-card-item">发票代码</van-col>
									<van-col span="6" class="bill-detail-card-item">22807615</van-col>
									<van-col span="4" class="bill-detail-card-item">发票号码</van-col>
									<van-col span="10" class="bill-detail-card-item">XSFP-2303-00078</van-col>
								</van-row>
								<van-row>
									<van-col span="4" class="bill-detail-card-item">发票备注</van-col>
									<van-col span="20" class="bill-detail-card-item"></van-col>
								</van-row>
							</div>
							<div class="bill-detail-card">
								<van-row >
									<van-col span="24" class="bill-detail-card-item bill-detail-status">已开发票</van-col>
								</van-row>
								<van-row>
									<van-col span="4" class="bill-detail-card-item">开票日期</van-col>
									<van-col span="6" class="bill-detail-card-item">2023-04-11</van-col>
									<van-col span="4" class="bill-detail-card-item">开票金额</van-col>
									<van-col span="10" class="bill-detail-card-item">376821</van-col>
								</van-row>
								<van-row>
									<van-col span="4" class="bill-detail-card-item">发票代码</van-col>
									<van-col span="6" class="bill-detail-card-item">22807615</van-col>
									<van-col span="4" class="bill-detail-card-item">发票号码</van-col>
									<van-col span="10" class="bill-detail-card-item">XSFP-2303-00078</van-col>
								</van-row>
								<van-row>
									<van-col span="4" class="bill-detail-card-item">发票备注</van-col>
									<van-col span="20" class="bill-detail-card-item"></van-col>
								</van-row>
							</div>
							<div class="bill-detail-card">
								<van-row >
									<van-col span="24" class="bill-detail-card-item bill-detail-status">已开发票</van-col>
								</van-row>
								<van-row>
									<van-col span="4" class="bill-detail-card-item">开票日期</van-col>
									<van-col span="6" class="bill-detail-card-item">2023-04-11</van-col>
									<van-col span="4" class="bill-detail-card-item">开票金额</van-col>
									<van-col span="10" class="bill-detail-card-item">376821</van-col>
								</van-row>
								<van-row>
									<van-col span="4" class="bill-detail-card-item">发票代码</van-col>
									<van-col span="6" class="bill-detail-card-item">22807615</van-col>
									<van-col span="4" class="bill-detail-card-item">发票号码</van-col>
									<van-col span="10" class="bill-detail-card-item">XSFP-2303-00078</van-col>
								</van-row>
								<van-row>
									<van-col span="4" class="bill-detail-card-item">发票备注</van-col>
									<van-col span="20" class="bill-detail-card-item"></van-col>
								</van-row>
							</div>
							<div class="bill-detail-card">
								<van-row >
									<van-col span="24" class="bill-detail-card-item bill-detail-status">已开发票</van-col>
								</van-row>
								<van-row>
									<van-col span="4" class="bill-detail-card-item">开票日期</van-col>
									<van-col span="6" class="bill-detail-card-item">2023-04-11</van-col>
									<van-col span="4" class="bill-detail-card-item">开票金额</van-col>
									<van-col span="10" class="bill-detail-card-item">376821</van-col>
								</van-row>
								<van-row>
									<van-col span="4" class="bill-detail-card-item">发票代码</van-col>
									<van-col span="6" class="bill-detail-card-item">22807615</van-col>
									<van-col span="4" class="bill-detail-card-item">发票号码</van-col>
									<van-col span="10" class="bill-detail-card-item">XSFP-2303-00078</van-col>
								</van-row>
								<van-row>
									<van-col span="4" class="bill-detail-card-item">发票备注</van-col>
									<van-col span="20" class="bill-detail-card-item"></van-col>
								</van-row>
							</div>
							<div class="bill-detail-card">
								<van-row >
									<van-col span="24" class="bill-detail-card-item bill-detail-status" >已开发票</van-col>
								</van-row>
								<van-row>
									<van-col span="4" class="bill-detail-card-item">开票日期</van-col>
									<van-col span="6" class="bill-detail-card-item">2023-04-11</van-col>
									<van-col span="4" class="bill-detail-card-item">开票金额</van-col>
									<van-col span="10" class="bill-detail-card-item">376821</van-col>
								</van-row>
								<van-row>
									<van-col span="4" class="bill-detail-card-item">发票代码</van-col>
									<van-col span="6" class="bill-detail-card-item">22807615</van-col>
									<van-col span="4" class="bill-detail-card-item">发票号码</van-col>
									<van-col span="10" class="bill-detail-card-item">XSFP-2303-00078</van-col>
								</van-row>
								<van-row>
									<van-col span="4" class="bill-detail-card-item">发票备注</van-col>
									<van-col span="20" class="bill-detail-card-item"></van-col>
								</van-row>
							</div>
							<div class="bill-detail-card">
								<van-row >
									<van-col span="24" class="bill-detail-card-item bill-detail-status">已开发票</van-col>
								</van-row>
								<van-row>
									<van-col span="4" class="bill-detail-card-item">开票日期</van-col>
									<van-col span="6" class="bill-detail-card-item">2023-04-11</van-col>
									<van-col span="4" class="bill-detail-card-item">开票金额</van-col>
									<van-col span="10" class="bill-detail-card-item">376821</van-col>
								</van-row>
								<van-row>
									<van-col span="4" class="bill-detail-card-item">发票代码</van-col>
									<van-col span="6" class="bill-detail-card-item">22807615</van-col>
									<van-col span="4" class="bill-detail-card-item">发票号码</van-col>
									<van-col span="10" class="bill-detail-card-item">XSFP-2303-00078</van-col>
								</van-row>
								<van-row>
									<van-col span="4" class="bill-detail-card-item">发票备注</van-col>
									<van-col span="20" class="bill-detail-card-item"></van-col>
								</van-row>
							</div>
						</van-list>
					</van-pull-refresh>
				</div>
			</van-tab>
			<van-tab title="开票申请"></van-tab>
			<van-tab title="开票资料"></van-tab>
		</van-tabs> -->
		
	</div>
</template>
<script>
	import { Button, Cell, CellGroup, /*Col, Row, Field, PullRefresh, List,*/ SwitchCell, Sticky,/*Tab, Tabs*/  } from 'vant';
	//import MonthPrevNext from '@/components/subject/client/MonthPrevNext.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';
	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			/*[Col.name]: Col,
			[Row.name]: Row,
			[Field.name]: Field,
			[PullRefresh.name]: PullRefresh,
			[List.name]: List,*/
			[SwitchCell.name]: SwitchCell,
			[Sticky.name]: Sticky,
			/*[Tab.name]: Tab,
			[Tabs.name]: Tabs,*/

			NewTimePicker,
			PopupFilter
			//MonthPrevNext
		},
		data(){
			return {
				config:{
					getConfig: true,
					tabs:{
						active:0
					},
					list:{
						pullRefresh:{
							reloading : false,
							isInit    : true
						},
						pushLoading:{
							finished : false,
							loading  : false
						}
					},
					popup:{
						filterShow: false,
						timePicker:{
							isFinishLoad: false
						}
					},
					switch:{
						checked: false
					}
				},
				pageConfig : {
					minDate : null,
					maxDate : null,
				},
				filterForm:{
					beginDate:null,
					endDate:null
				},
				statisInfo:{
					//上月未开
					LastInvAmt: null,
					//本月应开
					InvAmt: null,
					//本月已开
					DNInvAmt: null,
					//本月未开
					NeedInvAmt: null
				},
				height : window.innerHeight - 244
			}
		},
		methods:{
			/*pullOnRefresh(){
				console.log('pullOnRefresh')
			},
			onLoad(){
				console.log('onLoad')
			},*/
			getConfig(isReset = false){
				this.$request.client.bill.getBillCenterConfig().then((res)=>{
					if (res.errorCode !== '00000') return 
					if( this.config.getConfig ){
						this.filterForm.beginDate = res.result.GetCusBillCenterBeginDate;
						this.filterForm.endDate = res.result.GetCusBillCenterEndDate;
					}
					this.pageConfig.minDate = res.result.GetCusBillCenterMinDate;
					this.pageConfig.maxDate = res.result.GetCusBillCenterMaxDate;
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.timePicker.isFinishLoad = true;
					});
				}).then(()=>{
					if( isReset ){
						return ;
					}
					this.$nextTick(()=>{
						this.fetchData();
					});
				});
			},
			fetchData(){
				this.$request.client.bill.getStatisData(this.filterForm).then((res)=>{
					if (res.errorCode !== '00000') return 
					this.statisInfo = res.result;
				});
			},
			resetClick(){
				this.getConfig(true);
			},
			filterClick(){
				this.fetchData();
			},
			beforeunloadHandler(){
				if( this.config.switch.checked ){
					setStorage('client/billCenter',this.filterForm);
				}else{
					removeStorage('client/billCenter');
				}
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','开票信息');
			if( getStorage('client/billCenter') ){
				let storageData = JSON.parse(getStorage('client/billCenter'));
				this.filterForm            = storageData;
				this.config.getConfig      = false;
				this.config.switch.checked = true;
			}
		},
		mounted(){
			this.getConfig();
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
	.bill-center-container{
		background-color: #f1f1f1;
		padding-bottom: 3.125rem;
	}
	.filter-box-container{
		padding: 0.5rem 1rem;
	}
	.bill-statis-container{
		padding: 0.2rem 0;
		width: 100%;
		height: 4.625rem;
	}
	.bill-statis-list{
		width: 100%;
	    height: 4.1875rem;
	    box-sizing: border-box;
	    display: flex;
	    align-items: center;
	    justify-content: space-between;
	    background-color: #fff;
	    box-shadow: 0 0.0625rem 0.625rem hsl(0deg 0% 72% / 10%);
	    border-radius: 0.5rem;
	    padding: 0.1rem;
	}
	.bill-statis-item{
		flex: 1;
    	display: flex;
    	flex-direction: column;
    	align-items: center;
	}
	.bill-statis-name{
		font-size:0.8rem;
		padding-bottom: 0.2rem;
	}
	.bill-statis-text{
		font-size: 1rem; 
	}
	.text-color-yellow{
		color:#d8d813;
	}
	.text-color-green{
		color:#3dd813;
	}
	.text-color-blue{
		color:#10a2e0;
	}
	.bill-detail-container{
		padding: 0.2rem 0.9375rem;
	}
	.bill-detail-card{
		width: 100%;
		height: 6.625rem;
		box-sizing: border-box;
		padding: 0.8rem 0;
		padding-left:0.5rem;
	    background-color: #fff;
	    box-shadow: 0 0.0625rem 0.625rem hsl(0deg 0% 72% / 10%);
	    border-radius: 0.5rem;
	    margin-top:0.2rem;
	}
	.bill-detail-card-item{
		padding: 0.2rem;
		font-size: 0.4rem;
		overflow: hidden;        
		text-overflow:ellipsis;  
		white-space: nowrap;
	}
	.bill-detail-status{
		font-weight: 600;
		color: blue;
	}
</style>