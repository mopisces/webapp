<template>
	<div>
		<van-button plain hairline type="info" size="small" style="width:100%" @click="config.popup.filterShow = true">筛选</van-button>
		<van-tabs v-model="active">
			<van-tab title="全部">
			</van-tab>
			<van-tab title="按日期">
			</van-tab>
		</van-tabs>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<van-field readonly clickable label="开始日期" v-model="filterForm.beginDate" placeholder="选择开始日期" input-align="center" @click="config.popup.timeShow.start = true" slot="filter-field-1"></van-field>
			<van-field readonly clickable label="结束日期" v-model="filterForm.endDate" placeholder="选择结束日期" input-align="center" @click="config.popup.timeShow.end = true" slot="filter-field-2"></van-field>
		</popup-filter>
		<time-picker :dateTimeShow.sync="config.popup.timeShow.start" :dateTime.sync="pageConfig.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" @onCancel="timePickerCancel" @onConfirm="timeBeginConfirm"></time-picker>
		<time-picker :dateTimeShow.sync="config.popup.timeShow.end"  :dateTime.sync="pageConfig.endDate"   :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" @onCancel="timePickerCancel" @onConfirm="timeEndConfirm"></time-picker>
	</div>
</template>
<script>
	import { Button, Field, Tab, Tabs } from 'vant';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import TimePicker from '@/components/subject/TimePicker.vue';
	import { dateTimeFormat } from '@/util/index';
	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,

			PopupFilter,
			TimePicker
		},
		data(){
			return {
				active:0,
				config:{
					popup:{
						filterShow:false,
						timeShow:{
							start:false,
							end:false,
						}
					}
				},
				filterForm:{
					beginDate:'',
					endDate:'',
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

			},
			filterClick(){

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
			}
		},	
		created(){
			this.$store.commit('staff/setHeaderTitle','原纸采购');
		},
		mounted(){

		},
		computed:{
			
		},
		watch:{

		}
	}
</script>