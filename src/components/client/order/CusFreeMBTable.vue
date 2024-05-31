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
				<time-range-picker
					:beginDate.sync="filterForm.beginDate"
					:endDate.sync="filterForm.endDate"
					:maxDate.sync="pageConfig.maxDate"
					:minDate.sync="pageConfig.minDate"
				></time-range-picker>
				
			</div>
			<div slot="filter-field-2">
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button, Sticky } from 'vant';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';

	import TimeRangePicker from '@/components/subject/time/TimeRangePicker.vue'
	/*api接口*/
	import { getWebConfig } from '@/api/common/webConfig.js'

	export default {
		components:{
			[Button.name]: Button,
			[Sticky.name]: Sticky,

			PopupFilter,
			TimeRangePicker
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
			async getConfig( isReset = false ){
				const { result } = await getWebConfig({paramType: 'clientCB'})
				if( !this.config.isInit ){
					this.filterForm.beginDate = result.CusFreeMBTableBeginDate
					this.filterForm.endDate = result.CusFreeMBTableEndDate
				}
				this.pageConfig.maxDate = result.CusFreeMBTableMaxDate
				this.pageConfig.minDate = result.CusFreeMBTableMinDate
				if( isReset ) return 
				this.config.isInit = false
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
				this.config.table.height = window.screen.height - 176;
			},
			beforeunloadHandler(){
				if( this.config.switch.checked ){
					setStorage('order/cusFreeMBTable',JSON.stringify(this.filterForm));
				}else{
					setStorage('order/cusFreeMBTable');
				}
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','对账单明细');
			if( getStorage('order/cusFreeMBTable') !== null ){
				let storageData = JSON.parse(getStorage('order/cusFreeMBTable'));
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