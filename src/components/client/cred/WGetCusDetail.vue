<template>
	<div>
		<van-sticky :offset-top="46">
			<van-button plain hairline type="info" size="small" style="width:100%" @click="config.popup.filterShow = true">筛选</van-button>
		</van-sticky>
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
		<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;"  :columns="config.table.columns" :table-data="config.table.data" row-hover-color="#eee" row-click-color="#edf7ff" :height="config.table.height" even-bg-color="#fafafa"></v-table>
	</div>
</template>
<script>
	import { Button, SwitchCell, Sticky } from 'vant';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	/*自定义方法*/
	import { getStorage, setStorage, removeStorage } from '@/util/storage'

	import TimeRangePicker from '@/components/subject/time/TimeRangePicker.vue'
	/*api接口*/
	import { getWebConfigJWT } from '@/api/common/webConfig.js'

	export default {
		components:{
			[Button.name]: Button,
			[SwitchCell.name]: SwitchCell,
			[Sticky.name]: Sticky,

			PopupFilter,
			TimeRangePicker
		},
		data(){
			return {
				config:{
					getConfig:true, 
					table:{
						height:null,
						columns: [],
						data:[]
					},
					popup:{
						filterShow:false,
						timePicker:{
							isFinishLoad:false,
						}
					},
					switch:{
						checked:false
					}
				},
				pageConfig:{
					minDate:null,
					maxDate:null
				},
				filterForm:{
					beginDate: null,
					endDate: null
				}
			}
		},
		methods:{
			getTableConfig(){
				this.$request.common.table.getTableConfig().then(res=>{
					this.config.table.columns = res.wGetCusDetail;
				});
			},
			async getConfig( isReset ){
				const { result } = await getWebConfigJWT({paramType: 'clientCB'})
				if( this.config.getConfig ){
					this.filterForm.beginDate = result.GetCusFreeMBDetailBeginDate
					this.filterForm.endDate = result.GetCusFreeMBDetailEndDate
				}
				this.pageConfig.minDate = result.GetCusFreeMBDetailMinDate
				this.pageConfig.maxDate = result.GetCusFreeMBDetailMaxDate
				if( isReset ) return 
				await this.fetchList()
			},
			fetchList(){
				this.config.table.data = [];
				this.$request.client.cred.cusCreditBalanceList(this.filterForm).then((res)=>{
					if( res.errorCode == '00000' ){
						this.config.table.data = res.result;
					}
				});
			},
			resetClick(){
				this.filterForm = this.$options.data().filterForm;
				removeStorage('cred/wGetCusDetail');
				this.config.getConfig      = true;
				this.config.switch.checked = false;
				this.getConfig( true );
			},
			filterClick(){
				this.config.table.data = [];
				this.fetchList();
				this.config.popup.filterShow = false;
			},
			beforeunloadHandler(){
				if( this.config.switch.checked ){
					setStorage('cred/wGetCusDetail',this.filterForm);
				}else{
					removeStorage('cred/wGetCusDetail');
				}
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','信用余额明细2');
			if( getStorage('cred/wGetCusDetail') !== null ){
				let storageData = JSON.parse(getStorage('cred/wGetCusDetail'));
				this.filterForm = storageData;
				this.config.getConfig          = false;
				this.config.switchCell.checked = true;
			}
		},
		mounted(){
			this.config.table.height = window.screen.height - 126;
			window.addEventListener('beforeunload', e => this.beforeunloadHandler());
			this.getTableConfig();
			this.getConfig();
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