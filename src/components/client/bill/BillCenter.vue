<template>
	<div class="bill-center-container page-color">
		<van-sticky :offset-top="46">
			<van-button plain hairline type="info" size="small" style="width:100%" @click="config.popup.filterShow = true">筛选</van-button>			
		</van-sticky>
		<card 
			title="开票信息"
			:extra="filterForm.beginDate+'~'+filterForm.endDate"
			:is-shadow="true"
		>
			<div class="card-body-container">
				<div class="card-body-item card-body-item-100">
					<span>上月未开:
						<span class="mg-left-20 blue-color">{{ statisInfo.LastInvAmt }}</span>
					</span>
				</div>
				<div class="card-body-item card-body-item-100">
					<span>本月应开:
						<span class="mg-left-20 gray-color">{{ statisInfo.InvAmt }}</span>
					</span>
				</div>
				<div class="card-body-item card-body-item-100">
					<span>本月已开:
						<span class="mg-left-20 green-color">{{ statisInfo.DNInvAmt }}</span>
					</span>
				</div>
				<div class="card-body-item card-body-item-100">
					<span>本月未开:
						<span class="mg-left-20 red-color">{{ statisInfo.NeedInvAmt }}</span>
					</span>
				</div>
			</div>
		</card>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<time-range-picker
					:beginDate.sync="filterForm.beginDate"
					:endDate.sync="filterForm.endDate"
					:maxDate.sync="pageConfig.maxDate"
					:minDate.sync="pageConfig.minDate"
				></time-range-picker>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button, Cell, CellGroup, SwitchCell, Sticky  } from 'vant';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';

	import TimeRangePicker from '@/components/subject/time/TimeRangePicker.vue'
	import Card from '@/components/subject/card/Card.vue'
	/*api接口*/
	import { getWebConfigJWT } from '@/api/common/webConfig.js'

	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[SwitchCell.name]: SwitchCell,
			[Sticky.name]: Sticky,

			PopupFilter,

			TimeRangePicker,
			Card
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
			async getConfig(isReset = false){
				const { result } = await getWebConfigJWT({paramType: 'clientBill'})
				if( this.config.getConfig ){
					this.filterForm.beginDate = result.GetCusBillCenterBeginDate
					this.filterForm.endDate = result.GetCusBillCenterEndDate
				}
				this.pageConfig.minDate = result.GetCusBillCenterMinDate
				this.pageConfig.maxDate = result.GetCusBillCenterMaxDate
				if( isReset ) return 
				await this.fetchData()
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
	.bill-center-container {
		height: 33.8125rem;
		width: 100%;
	}
	@import '~@/assets/style/card.css';
</style>