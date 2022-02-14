<template>
	<div>
		<van-sticky :offset-top="48">
			<van-button plain hairline type="info" size="normal" style="width:50%;" @click="onRefresh()">刷新</van-button>
			<van-button plain hairline type="info" size="normal" style="width:50%;" @click="config.popup.filterShow = true">筛选</van-button>
			<div style="height:0.5rem;width:100%;"></div>
		</van-sticky>
		<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.columns" :table-data="table.data" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :height="config.table.height" even-bg-color="#fafafa">
		</v-table>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker>
			</div>
			<div slot="filter-field-2">
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button, Sticky } from 'vant';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Sticky.name]: Sticky,

			NewTimePicker,
			PopupFilter
		},
		data(){
			return {
				config:{
					switch:{
						checked : false
					},
					popup:{
						filterShow:false,
						timePicker:{
							isFinishLoad:false
						}
					},
					table:{
						columns:[],
						height:0,
					},
					isInit : true
				},
				table:{
					data:[]
				},
				filterForm:{
					beginDate:null,
					endDate:null
				},
				pageConfig:{
					minDate:null,
					maxDate:null,
				}
			}
		},
		methods:{
			getConfig( isReset = false ){
				let self = this;
				this.$request.client.cred.statementAccountConfig().then(res=>{
					if( !self.config.isInit ){
						self.filterForm.beginDate = res.result.CusFreeMBTableBeginDate;
						self.filterForm.endDate   = res.result.CusFreeMBTableEndDate;
					}
					self.pageConfig.maxDate   = res.result.CusFreeMBTableMaxDate;
					self.pageConfig.minDate   = res.result.CusFreeMBTableMinDate;
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.timePicker.isFinishLoad = true;
						if( isReset ){
							return ;
						}
					});
				}).then(()=>{
					this.config.isInit = false;
				});
			},
			getTableDate(){
				let self = this;
				this.$request.client.cred.cusFreeMBTable().then(res=>{
					
				});
			},
			onRefresh(){

			},
			resetClick(){

			},
			filterClick(){

			},
			customCompFunc(){

			},
			setElementSize(){
				this.config.table.height = window.screen.height - 126;
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','对账单明细');
			if( sessionStorage.getItem('order/cusFreeMBTable') !== null ){
				let storageData = JSON.parse(sessionStorage.getItem('order/cusFreeMBTable'));
				this.filterForm = storageData;
				this.config.getConfig      = false;
				this.config.switch.checked = true;
			}
		},
		mounted(){
			this.setElementSize()	
			window.onresize = () => {
				return (() => {
					this.setElementSize()
				})()
			}
			this.getConfig();
		},
		updated(){
			
		},
		destroyed(){
			if( this.config.switch.checked ){
				sessionStorage.setItem('order/cusFreeMBTable',JSON.stringify(this.filterForm));
			}else{
				sessionStorage.removeItem('order/cusFreeMBTable');
			}
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>