<template>
	<div>
		<van-sticky :offset-top="46">
			<van-button plain hairline type="info" size="small" style="width:100%" @click="config.popup.filterShow = true">筛选</van-button>
		</van-sticky>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
		<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;"  :columns="config.table.columns" :table-data="config.table.data" row-hover-color="#eee" row-click-color="#edf7ff" :height="config.table.height" even-bg-color="#fafafa"></v-table>
	</div>
</template>
<script>
	import { Button, SwitchCell, Sticky } from 'vant';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import RadioCell from '@/components/subject/RadioCell.vue';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';
	export default {
		components:{
			[Button.name]: Button,
			[SwitchCell.name]: SwitchCell,
			[Sticky.name]: Sticky,

			PopupFilter,
			NewTimePicker,
			RadioCell
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
			getConfig( isReset ){
				this.$request.client.cred.cusCreditBalanceConfig().then((res)=>{
					if( res.errorCode != '00000' ) return 
					if( this.config.getConfig ){
						this.filterForm.beginDate = res.result.GetCusFreeMBDetailBeginDate;
						this.filterForm.endDate   = res.result.GetCusFreeMBDetailEndDate;
					}
					this.pageConfig.minDate   = res.result.GetCusFreeMBDetailMinDate;
					this.pageConfig.maxDate   = res.result.GetCusFreeMBDetailMaxDate;
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.timePicker.isFinishLoad = true;
					});
				}).then(()=>{
					if( isReset ){
						return ;
					}
					this.$nextTick(()=>{
						this.fetchList();
					});
				});
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
				console.log(this.config.switch.checked)
				if( this.config.switch.checked ){
					setStorage('cred/wGetCusDetail',this.filterForm);
				}else{
					removeStorage('cred/wGetCusDetail');
				}
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','信用余额明细');
			if( getStorage('cred/wGetCusDetail') !== null ){
				let storageData = JSON.parse(getStorage('cred/wGetCusDetail'));
				this.filterForm = storageData;
				this.config.getConfig          = false;
				this.config.switchCell.checked = true;
			}
		},
		mounted(){
			this.config.table.height = window.screen.height - 176;
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