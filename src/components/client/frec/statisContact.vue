<template>
	<div class="page-color">
		<van-sticky :offset-top="50">
			<van-button plain hairline type="info" style="width:100%"  @click="config.popup.rightFilter.show = true">筛选</van-button>
		</van-sticky>
		<card 
			:title="info.Customer"
			:extra="info.Manager"
			:is-shadow="true"
		>
			<div class="card-body-container">
				<div class="card-body-item card-body-item-100">
					<span>上次月结:
						<span>{{ info.EndDate }}</span>
					</span>
				</div>
				<div class="card-body-item card-body-item-50">
					<span>上期余额:
						<span>{{ info.LastAmt }}</span>
					</span>
				</div>
				<div class="card-body-item card-body-item-50">
					<span>确收金额:
						<span>{{ info.ConfAmt }}</span>
					</span>
				</div>
				<div class="card-body-item card-body-item-50">
					<span>调整金额:
						<span>{{ info.AdjustAmt }}</span>
					</span>
				</div>

				<div class="card-body-item card-body-item-50">
					<span>收款金额:
						<span>{{ info.CusPayAmt }}</span>
					</span>
				</div>
				<div class="card-body-item card-body-item-50">
					<span>期末欠款:
						<span>{{ info.CurAmt }}</span>
					</span>
				</div>
			</div>
		</card>
		
		<popup-filter :filterShow.sync="config.popup.rightFilter.show" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<time-range-picker
					:beginDate.sync="filterForm.beginDate"
					:endDate.sync="filterForm.endDate"
					:maxDate.sync="pageConfig.maxDate"
					:minDate.sync="pageConfig.minDate"
				></time-range-picker>
				<van-switch-cell v-model="config.switchCell.checked" title="记住筛选条件(本次登录有效)"/>
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button, Field, SwitchCell, Sticky } from 'vant';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	//import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';

	import TimeRangePicker from '@/components/subject/time/TimeRangePicker.vue'
	import Card from '@/components/subject/card/Card.vue'

	/*api接口*/
	import { getWebConfig } from '@/api/common/webConfig.js'

	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[Sticky.name]: Sticky,

			PopupFilter,
			//NewTimePicker,
			TimeRangePicker,
			Card
		},
		data(){
			return {
				pageConfig:{
					maxDate   : '',
					minDate   : ''
				},
				config:{
					getConfig: true,
					popup:{
						rightFilter:{
							show:false
						},
						timePicker:{
							isFinishLoad:false
						}
					},
					switchCell:{
						checked:false
					},
				},
				info:{
					Customer:null,
					Manager:null,
					EndDate:null,
					LastAmt:null,
					ConfAmt:null,
					AdjustAmt:null,
					CusPayAmt:null,
					CurAmt:null
				},
				filterForm:{
					beginDate : null,
					endDate   : null,
				}
			}
		},
		methods:{
			async getConfig( isReset = false ){
				const { result } = await getWebConfig({paramType: 'clientFrec'})
				this.pageConfig.maxDate = result.maxDate
				this.pageConfig.minDate = result.minDate
				if( this.config.getConfig ){
					this.filterForm.beginDate = result.beginDate
					this.filterForm.endDate = result.endDate
				}
				if( isReset ) return 
				await this.fetchData()
			},
			fetchData(){
				this.info = this.$options.data().info;
				this.$request.client.frec.fetchStatisContact(this.filterForm).then(res=>{
					if( res.errorCode == '00000' ){
						this.info.Customer = res.result.CusShortName + '(' + res.result.CusId + ')';
						this.info.Manager = res.result.TaskName + '(' + res.result.TaskId + ')';
						this.info.EndDate = res.result.EndDate;
						this.info.LastAmt = res.result.LastAmt;
						this.info.ConfAmt = res.result.ConfAmt;
						this.info.AdjustAmt = res.result.AdjustAmt;
						this.info.CusPayAmt = res.result.CusPayAmt;
						this.info.CurAmt = res.result.CurAmt;
					}
				})
			},
			resetClick(){
				this.config.getConfig = true;
				this.getConfig(true);
			},
			filterClick(){
				this.fetchData();
			},
			beforeunloadHandler(){
				if( this.config.switchCell.checked ){
					setStorage('frec/statisContact',this.filterForm);
				}else{
					removeStorage('frec/statisContact');
				}
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','往来统计');
			if( getStorage('frec/statisContact') !== null ){
				let storageData = JSON.parse(getStorage('frec/statisContact'));
				this.filterForm = storageData;
				this.config.getConfig          = false;
				this.config.switchCell.checked = true;
			}
		},
		mounted(){
			this.getConfig()
			window.addEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		updated(){
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		destroyed(){
			
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>

<style type="text/css">
	@import '~@/assets/style/card.css';
</style>