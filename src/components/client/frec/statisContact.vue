<template>
	<div>
		<van-sticky :offset-top="50">
			<van-button plain hairline type="info" style="width:100%"  @click="config.popup.rightFilter.show = true">筛选</van-button>
		</van-sticky>
		<van-field label="客户" readonly v-model="info.Customer" input-align="center" style="line-height:36px;" />
		<van-field label="业务员" readonly v-model="info.Manager" input-align="center" style="line-height:36px;" />
		<van-field label="上次月结日期" readonly v-model="info.EndDate" input-align="center" style="line-height:36px;" />
		<van-field label="上期余额" readonly v-model="info.LastAmt" input-align="center" style="line-height:36px;" />
		<van-field label="确收金额" readonly v-model="info.ConfAmt" input-align="center" style="line-height:36px;" />
		<van-field label="调整金额" readonly v-model="info.AdjustAmt" input-align="center" style="line-height:36px;" />
		<van-field label="收款金额" readonly v-model="info.CusPayAmt" input-align="center" style="line-height:36px;" />
		<van-field label="期末欠款" readonly v-model="info.CurAmt" input-align="center" style="line-height:36px;" />
		<popup-filter :filterShow.sync="config.popup.rightFilter.show" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker>
				<van-switch-cell v-model="config.switchCell.checked" title="记住筛选条件(本次登录有效)"/>
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button, Field, SwitchCell, Sticky } from 'vant';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';
	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[Sticky.name]: Sticky,

			PopupFilter,
			NewTimePicker,
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
			getConfig( isReset = false ){
				this.$request.client.frec.statisContactConfig().then(res=>{
					if( res.errorCode == '00000' ){
						this.pageConfig.maxDate = res.result.Wap0StatisContactMaxDate;
						this.pageConfig.minDate = res.result.Wap0StatisContactMinDate;
						if( this.config.getConfig ){
							this.filterForm.beginDate = res.result.Wap0StatisContactBeginDate;
							this.filterForm.endDate = res.result.Wap0StatisContactEndDate;
						}
					}
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
				})
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