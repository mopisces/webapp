<template>
	<div>
		<van-notice-bar :text="total" left-icon="volume-o" background="#ecf9ff"/>
		<van-tabs v-model="filterForm.dataType" sticky>
			<van-tab title="按门幅汇总" name="1">
				<prev-next @radioConfirm="radioConfirm" :radioData="radioData.widthData"  v-if="config.prevNext.show"></prev-next>
			</van-tab>
  			<van-tab title="按纸类汇总" name="2">
  				<prev-next @radioConfirm="radioConfirm" :radioData="radioData.codeData"  v-if=" filterForm.dataType == 2 "></prev-next>
  			</van-tab>
		</van-tabs>
		<template v-if=" filterForm.dataType == 1 ">
			<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.widthColumns" :table-data="tableData.widthData" row-hover-color="#eee" row-click-color="#edf7ff"  even-bg-color="#fafafa" :height="config.table.height">
			</v-table>
		</template>
		<template v-if=" filterForm.dataType == 2 ">
			<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.codeColumns" :table-data="tableData.codeData" row-hover-color="#eee" row-click-color="#edf7ff"  even-bg-color="#fafafa" :height="config.table.height">
			</v-table>
		</template>
	</div>
</template>
<script>
	import { Button, Tab, Tabs, NoticeBar } from 'vant';
	import PrevNext from '@/components/subject/PrevNext.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			[NoticeBar.name]: NoticeBar,
			PrevNext
		},
		data(){
			return {
				radioData:{
					widthData:[],
					codeData:[]
				},
				radioVal:'',
				config:{
					prevNext:{
						show:false
					},
					table:{
						widthColumns:[
							{field: 'PaperCode', title: '纸类', width: 40, titleAlign: 'center', columnAlign: 'center', isResize:true ,isFrozen: true},
							{field: 'ZJWt', title: '整卷重量', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'iZJCount', title: '整卷卷数', width: 60, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'RWt', title: '残卷重量', width: 70, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'iRCount', title: '残卷卷数', width: 60, titleAlign: 'center', columnAlign: 'center',isResize:true},
						],
						codeColumns:[
							{field: 'PaperWidth', title: '门幅', width: 50, titleAlign: 'center', columnAlign: 'center',isResize:true ,isFrozen: true},
							{field: 'ZJWt', title: '整卷重量', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'iZJCount', title: '整卷卷数', width: 60, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'RWt', title: '残卷重量', width: 70, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'iRCount', title: '残卷卷数', width: 60, titleAlign: 'center', columnAlign: 'center',isResize:true},
						],
						height : 0
					},
					tabs:{
						active:0
					}
				},
				tableData:{
					widthData:[],
					codeData:[]
				},
				filterForm:{
					dataType:1,
					searchData:''
				},
				total:''
			}
		},
		methods:{
			radioConfirm( val ){
				this.filterForm.searchData = val;
				this.getData(this.filterForm);
			},
			getPageConfig(){
				let self = this;
				this.$request.staff.paper.stockConfig().then(res=>{
					self.radioData.widthData = res.result.width_select;
					self.radioData.codeData = res.result.code_select;
					if( res.result.width_select.length > 0 ){
						self.radioData.widthData.forEach((item,index)=>{
							item['prevNext'] = item.PaperWidth;
						});
						self.filterForm.searchData = self.radioData.widthData[0].PaperWidth;
					}
					if( res.result.code_select.length > 0 ){
						self.radioData.codeData.forEach((item,index)=>{
							item['prevNext'] = item.PaperCode;
						});
					}
					self.filterForm.dataType = 1;
					self.total = '原纸总库存:  ' + res.result.total;
				}).then(()=>{
					this.$nextTick(() => {
					    this.config.prevNext.show = true;
					});
				}).then(()=>{
					if( this.filterForm.searchData ){
						this.getData(this.filterForm);
					}
				});
			},
			getData( data ){
				let self = this;
				this.$request.staff.paper.stockMain( data ).then(res=>{
					if( data.dataType == 1 ){
						self.tableData.widthData = res.result;
					}else{
						self.tableData.codeData = res.result;
					}
				});	
			},
			getTableConfig(){
				this.$request.common.table.getTableConfig().then(res=>{
					this.config.table.widthColumns = res.getSStocksWidth;
					this.config.table.codeColumns = res.getSStocksCode;
				});
			}
		},
		mounted(){
			this.getTableConfig();
			this.getPageConfig();
			this.config.table.height = window.screen.height - 260;
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','原纸库存');
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>
<style>
	.v-table-title-class{
		color:#1a991d;
		font-size: 0.8125rem;
	}
</style>
