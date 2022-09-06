<template>
	<div>
		<van-sticky :offset-top="46">
			<van-button plain hairline type="info" size="small" style="width:100%" @click="config.popup.filterShow = true">筛选</van-button>
		</van-sticky>
		<van-tabs v-model="config.tabs.active" sticky :offset-top="76">
			<van-tab title="全部">
				<div v-for="(value,key) in radioData" :key=" 'divider' + key ">
					<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;">
		      			 {{ value.prevNext }}
		  			</div>
		  			<div role="button" tabindex="0" class="van-cell van-cell--clickable" style="text-align:center;" v-for="(item,index) in cellList[value.prevNext]"  @click="detailClick(item,value.prevNext)" :key=" 'all' + index ">
		  				<div class="van-cell__title" >
							<span>{{ item.PONo }}</span>
						</div>
						<div class="van-cell__title" >
							<span>{{ item.ShortName }}</span>
						</div>
						<div class="van-cell__title" >
							<span>{{ item.SumPaper }}</span>
						</div>
						<div class="van-cell__title" >
							<span>{{ item.InQty }}/{{ item.POQty }}</span>
						</div>
						<i class="van-icon van-icon-arrow van-cell__right-icon"><!----></i>
		  			</div>
	  			</div>
			</van-tab>
			<van-tab title="按日期">
				<prev-next @radioConfirm="radioConfirm" :radioData="radioData" :radioVal="radioVal"  v-if=" config.tabs.active == 1 "></prev-next>
				<div role="button" tabindex="0" class="van-cell van-cell--clickable" style="text-align:center;" v-for="(item,index) in cellList[radioVal]" :key=" 'date' + index "  @click="detailClick(item,radioVal)">
	  				<div class="van-cell__title" >
						<span>{{ item.PONo }}</span>
					</div>
					<div class="van-cell__title" >
						<span>{{ item.ShortName }}</span>
					</div>
					<div class="van-cell__title" >
						<span>{{ item.SumPaper }}</span>
					</div>
					<div class="van-cell__title" >
						<span>{{ item.InQty }}/{{ item.POQty }}</span>
					</div>
					<i class="van-icon van-icon-arrow van-cell__right-icon"><!----></i>
	  			</div>
			</van-tab>
		</van-tabs>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)"/>
			</div>
		</popup-filter>
		<paper-buy-detail :detailShow.sync="config.popup.detailShow" :detailItem="config.detailTable.item" v-if="config.popup.detailShow" ></paper-buy-detail >
	</div>
</template>
<script>
	import { Button, Field, SwitchCell, Sticky, Tab, Tabs } from 'vant';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import PrevNext from '@/components/subject/PrevNext.vue';
	import PaperBuyDetail from '@/components/subject/PaperBuyDetail.vue';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';
	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[Sticky.name]: Sticky,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,

			PopupFilter,
			NewTimePicker,
			PrevNext,
			PaperBuyDetail
		},
		data(){
			return {
				radioData:[],
				radioVal:'',
				config:{
					getConfig:true,
					popup:{
						filterShow:false,
						timePicker:{
							isFinishLoad:false
						},
						detailShow:false
					},
					tabs:{
						active:0
					},
					switch:{
						checked:false
					},
					detailTable:{
						item:{}
					}
				},
				filterForm:{
					beginDate:'',
					endDate:'',
				},
				pageConfig:{
					maxDate:'',
					minDate:'',
				},
				cellList:{},
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
				this.config.tabs.active = 0;
			},
			paperBuyConfig( isReset = false ){
				let self = this;
				this.$request.staff.paperbuy.paperBuyConfig().then(res=>{
					if( self.config.getConfig ){
						self.filterForm.beginDate = res.result.WGetPOMainBeginDate;
						self.filterForm.endDate = res.result.WGetPOMainEndDate;
					}
					self.pageConfig.maxDate = res.result.WGetPOMainMaxDate;
					self.pageConfig.minDate = res.result.WGetPOMainMinDate;
				}).then(()=>{
					this.config.popup.timePicker.isFinishLoad = true;
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
					self.radioData = [];
					if( res.result ){
						res.result.po_date_select.forEach((item,index)=>{
							self.radioData.push({prevNext:item,tag:'poMain'});
						});
						self.cellList = res.result.data;
					}
				});
			},
			radioConfirm( value ){
				this.radioVal = value;
			},
			detailClick( item, date ){
				item['Date'] = date; 
				this.config.detailTable.item = item;
				this.config.popup.detailShow = true;
			},
			beforeunloadHandler(){
				if( this.config.switch.checked ){
					setStorage('paperbuy/wGetPOMain',this.filterForm);
				}else{
					removeStorage('paperbuy/wGetPOMain');
				}
			}
		},	
		created(){
			this.$store.commit('staff/setHeaderTitle','原纸采购');
			if( getStorage('paperbuy/wGetPOMain') !== null ){
				let storageData = JSON.parse(getStorage('paperbuy/wGetPOMain'));
				this.filterForm = storageData;
				this.config.getConfig = false;
				this.config.switch.checked = true;
			}
		},
		mounted(){
			this.paperBuyConfig();
			window.addEventListener('beforeunload', e => this.beforeunloadHandler());
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
