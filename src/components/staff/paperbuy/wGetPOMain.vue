<template>
	<div>
		<van-button plain hairline type="info" size="small" style="width:100%" @click="config.popup.filterShow = true">筛选</van-button>
		<van-tabs v-model="config.tabs.active">
			<van-tab title="全部">
				
			</van-tab>
			<van-tab title="按日期">
				<prev-next @radioConfirm="radioConfirm" :radioData="radioData" :radioVal="radioVal"  v-if=" config.tabs.active == 1 "></prev-next>
			</van-tab>
		</van-tabs>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<van-field readonly clickable label="开始日期" v-model="filterForm.beginDate" placeholder="选择开始日期" input-align="center" @click="config.popup.timeShow.start = true" slot="filter-field-1"></van-field>
			<van-field readonly clickable label="结束日期" v-model="filterForm.endDate" placeholder="选择结束日期" input-align="center" @click="config.popup.timeShow.end = true" slot="filter-field-2"></van-field>
			<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)"  slot="filter-field-7"/>
		</popup-filter>
		<time-picker :dateTimeShow.sync="config.popup.timeShow.start" :dateTime.sync="pageConfig.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" @onCancel="timePickerCancel" @onConfirm="timeBeginConfirm"></time-picker>
		<time-picker :dateTimeShow.sync="config.popup.timeShow.end"  :dateTime.sync="pageConfig.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" @onCancel="timePickerCancel" @onConfirm="timeEndConfirm"></time-picker>
	</div>
</template>
<script>
	import { Button, Field, SwitchCell, Tab, Tabs } from 'vant';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import TimePicker from '@/components/subject/TimePicker.vue';
	import PrevNext from '@/components/subject/PrevNext.vue';
	import { dateTimeFormat } from '@/util/index';
	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,

			PopupFilter,
			TimePicker,
			PrevNext
		},
		data(){
			return {
				radioData:[],
				radioVal:'',
				config:{
					getConfig:true,
					popup:{
						filterShow:false,
						timeShow:{
							start:false,
							end:false,
						}
					},
					tabs:{
						active:0
					},
					switch:{
						checked:false
					}
				},
				filterForm:{
					beginDate:'2011-11-05',
					endDate:'2019-11-05',
				},
				pageConfig:{
					beginDate:new Date(),
					endDate:new Date(),
					maxDate:new Date(),
					minDate:new Date(),
				}
			}
		},
		methods:{
			resetClick(){
				this.config.getConfig = true;
				this.info.switch.checked = true;
				this.paperBuyConfig( true );
			},
			filterClick(){
				this.paperBuy( this.filterForm );
				this.config.popup.filterShow = false;
			},
			timePickerCancel(){
				this.config.popup.timeShow.start = false;
				this.config.popup.timeShow.end = false;
			},
			timeBeginConfirm( val ){
				this.filterForm.beginDate = dateTimeFormat( val.value,'yyyy-MM-dd' );
				this.timePickerCancel();
			},
			timeEndConfirm( val ){
				this.filterForm.endDate = dateTimeFormat( val.value,'yyyy-MM-dd' );
				this.timePickerCancel();
			},
			paperBuyConfig( isReset = false ){
				let self = this;
				this.$request.staff.paperbuy.paperBuyConfig().then(res=>{
					if( self.config.getConfig ){
						self.pageConfig.beginDate = new Date(res.result.WGetPOMainBeginDate);
						self.pageConfig.endDate = new Date(res.result.WGetPOMainEndDate);
						self.filterForm.beginDate = res.result.WGetPOMainBeginDate;
						self.filterForm.endDate = res.result.WGetPOMainEndDate;
					}
					self.pageConfig.maxDate = new Date(res.result.WGetPOMainMaxDate);
					self.pageConfig.minDate = new Date(res.result.WGetPOMainMinDate);
				}).then(()=>{
					if( isReset ){
						return ;
					}
					this.paperBuy( this.filterForm );
				});
			},
			paperBuy( data ){
				let self = this;
				this.$request.staff.paperbuy.paperBuy( data ).then(res=>{
					console.log(res.result)
				});
			},
			radioConfirm( value ){
				
			}
		},	
		created(){
			this.$store.commit('staff/setHeaderTitle','原纸采购');
			if( sessionStorage.getItem('paperbuy/wGetPOMain') !== null ){
				let storageData = JSON.parse(sessionStorage.getItem('paperbuy/wGetPOMain'));
				this.filterForm = storageData;
				this.pageConfig.beginDate = new Date(storageData.beginDate);
				this.pageConfig.endDate = new Date(storageData.endDate);
				this.config.getConfig = false;
				this.info.switch.checked = true;
			}
		},
		mounted(){
			this.paperBuyConfig();
		},
		destroyed(){
			if( this.config.switch.checked ){
				sessionStorage.setItem('paperbuy/wGetPOMain',JSON.stringify(this.filterForm));
			}else{
				sessionStorage.removeItem('paperbuy/wGetPOMain');
			}
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>