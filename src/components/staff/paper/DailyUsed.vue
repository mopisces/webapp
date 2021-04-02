<template>
	<div>
		<van-button plain hairline type="info" size="normal" style="width:100%" @click="config.popup.filterShow = true">筛选</van-button>
		<prev-next @radioConfirm="radioConfirm" :radioData="radioData" :radioVal="radioVal"  v-if="config.prevNext.show"></prev-next>
		<van-notice-bar :text="config.notice.text" left-icon="volume-o" />
		<!-- <div role="button" tabindex="0" class="van-cell van-cell--clickable" v-for="(item,index) in listData" :key="index" @click="listClick(item)" style="font-size:15px;">
			<div class="van-cell__title">
				<span>{{ item.InNo }}</span><br/>
				<span>{{ item.PONo }}</span>
			</div>
			<div class="van-cell__title">
				<span>{{ item.InQty }}&nbsp;件</span><br/>
				<span>{{ item.SumPaper }}</span>
			</div>
			<div class="van-cell__title">
				<span>{{ item.SumInWt }}&nbsp;kg</span><br/>
				<span>{{ item.ShortName }}</span>
			</div>
			<van-icon name="arrow" color="#ddd" size="24" style="margin-top:9px"/>
		</div> -->
		<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.info.columns" :table-data="listData" row-hover-color="#eee" row-click-color="#edf7ff" even-bg-color="#fafafa" :height="config.table.info.height" :row-click="detailClick">
		</v-table>
		<van-popup v-model="config.popup.show" position="top" :style="{ height:'100%' }" v-if="config.popup.show">
			<div class="header" style="width:100%;position:fixed;height:46px;top:0px;text-align:center;">
				<div class="van-nav-bar van-hairline--bottom">
					<div class="van-nav-bar__title van-ellipsis">
						详细信息 
					</div>
				</div>
			</div>
			<div class="content" style="width:100%;margin-top:46px;">
				<!-- <van-field center input-align="right" label="收货日期" v-model="detailData.fieldData.RecDate"></van-field>
				<van-field center input-align="right" label="收货单号" v-model="detailData.fieldData.InNo"></van-field>
				<van-field center input-align="right" label="供应商" v-model="detailData.fieldData.ShortName"></van-field> -->
				<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.detail.columns" :table-data="detailData.tableData" row-hover-color="#eee" row-click-color="#edf7ff" even-bg-color="#fafafa" :height="config.table.detail.height" >
				</v-table>
			</div>	
			<div class="footer" style="width:100%;position:fixed;height:46px;bottom:0px;">
				<van-button type="primary" size="normal" style="width:100%;position:fixed;bottom:0;" @click="config.popup.show = false">关闭</van-button>
			</div>
		</van-popup>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)"/>
			</div>
		</popup-filter>
	</div>
	
</template>
<script>
	import { Button, Icon, Popup, Field, NoticeBar, SwitchCell } from 'vant';
	import PrevNext from '@/components/subject/PrevNext.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Field.name]: Field,
			[NoticeBar.name]: NoticeBar,
			[SwitchCell.name]: SwitchCell,

			PrevNext,
			PopupFilter,
			NewTimePicker
		},
		data(){
			return {
				radioData:[],
				radioVal:'',
				listData:[],
				detailData:{
					fieldData:{},
					tableData:{}
				},
				config:{
					getConfig:true,
					prevNext:{
						show:false
					},
					popup:{
						show:false,
						filterShow:false,
						timePicker:{
							isFinishLoad:false
						}
					},
					switch:{
						checked:false
					},
					table : {
						info:{
							height : 0,
							columns : [],
						},
						detail:{
							height : 0,
							columns : [],
						}
					},

					notice:{
						sumWeight:0,
						text:''
					}
				},
				filterMain:{
					outDate:''
				},
				pageConfig:{
					maxDate:null,
					minDate:null,
				},
				filterForm:{
					beginDate:null,
					endDate:null,
				}
			}
		},
		methods:{
			radioConfirm( value ){
				this.filterMain.outDate = value;
				this.paperDailyUsedInfo( this.filterMain.outDate );
			},
			getPaperDailyUsedConfig( isReset = false ){
				let self = this;
				this.$request.staff.paper.paperDailyUsedConfig().then(res=>{
					/*self.radioVal  = res.result[0].OutDate;
					self.radioData = res.result;
					self.radioData.forEach((item,index)=>{
						item['prevNext'] = item.OutDate; 
					});*/
					if( self.config.getConfig ){
						self.filterForm.beginDate = res.result.PaperDailyUsedBeginDate;
						self.filterForm.endDate = res.result.PaperDailyUsedEndDate;
					}
					self.pageConfig.maxDate = res.result.PaperDailyUsedMaxDate;
					self.pageConfig.minDate = res.result.PaperDailyUsedMinDate;
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.timePicker.isFinishLoad = true;
					});
				}).then(()=>{
					/*this.$nextTick(() => {
					    this.config.prevNext.show = true;
					});*/
					this.paperDailyUsedDateInfo();
				});
			},
			paperDailyUsedDateInfo(){
				let self = this;
				this.radioVal = null;
				this.radioData = [];
				this.listData = [];
				this.config.notice.text = '暂无数据';
				this.config.prevNext.show = false;
				this.$request.staff.paper.paperDailyUsedDateInfo(this.filterForm).then(res=>{
					if(res.errorCode == '00000'){
						self.radioVal  = res.result[0].OutDate;
						self.radioData = res.result;
						self.radioData.forEach((item,index)=>{
							item['prevNext'] = item.OutDate; 
						});
					}
				}).then(()=>{
					this.$nextTick(() => {
						if( this.radioData.length != 0 ){
							this.config.prevNext.show = true;
						}
					});
				});
			},
			paperDailyUsedDetail( data ){
				let self = this;
				this.$request.staff.paper.paperDailyUsedDetail( data ).then(res=>{
					self.detailData.tableData = res.result;
				}).then(()=>{
					this.config.popup.show = true;
				});
			},
			paperDailyUsedInfo( data ){
				let self = this;
				self.config.notice.sumWeight = 0;
				this.$request.staff.paper.paperDailyUsedInfo( data ).then(res=>{
					self.listData = res.result;
					self.listData.forEach((item)=>{
						self.config.notice.sumWeight += Number(item.SRWt);
					});
					self.config.notice.text = '总重量:' + self.config.notice.sumWeight + 'kg';
				});
			},
			/*listClick( data ){
				this.detailData.fieldData = data;
				this.paperInDetail( data.InNo );
			},*/
			getTableConfig(){
				this.$request.common.table.getTableConfig().then(res=>{
					this.config.table.info.columns = res.staffDailyUsedInfo;
					this.config.table.detail.columns = res.staffDailyUsedDetail;
				});
			},
			detailClick(rowIndex,rowData,column){
				this.detailData.fieldData = rowData;
				this.paperDailyUsedDetail(rowData);
			},
			resetClick(){
				this.filterForm = {
					maxDate:null,
					minDate:null,
				}
				this.config.switch.checked = false;
				this.config.getConfig = true;
				this.paperDailyUsedDateInfo();
			},
			filterClick(){
				this.config.popup.filterShow = false;
				this.paperDailyUsedDateInfo();
			}
		},
		created(){
			this.getPaperDailyUsedConfig();
			if( sessionStorage.getItem('paper/dailyUsed') !== null  ){
				let storageData = JSON.parse(sessionStorage.getItem('paper/dailyUsed'));
				this.filterForm = storageData;
				this.config.getConfig = false;
				this.config.switch.checked = true;
			}
		},
		mounted(){
			this.$store.commit('staff/setHeaderTitle','原纸日用量');
			this.config.table.info.height = window.screen.height - 126;
			this.config.table.detail.height = window.screen.height - 140;
			this.getTableConfig();
		},
		destroyed(){
			if( this.config.switch.checked ){
				sessionStorage.setItem('paper/dailyUsed',JSON.stringify(this.filterForm));
			}else{
				sessionStorage.removeItem('paper/dailyUsed');
			}
		},
		computed:{
			
		},
		watch:{
			
		}
	}
</script>