<template>
	<div>
		<van-tabs v-model="filterForm.dataType">
			<van-tab title="按门幅汇总" name="1">
				<prev-next @radioConfirm="radioConfirm" :radioData="radioData.widthData"  v-if="config.prevNext.show"></prev-next>
			</van-tab>
  			<van-tab title="按纸类汇总" name="2">
  				<prev-next @radioConfirm="radioConfirm" :radioData="radioData.codeData"  v-if=" filterForm.dataType == 2 "></prev-next>
  			</van-tab>
		</van-tabs>
		<template v-if=" filterForm.dataType == 1 ">
			<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.widthColumns" :table-data="tableData.widthData" row-hover-color="#eee" row-click-color="#edf7ff"  odd-bg-color="#aab3ac">
			</v-table>
		</template>
		<template v-if=" filterForm.dataType == 2 ">
			<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.codeColumns" :table-data="tableData.codeData" row-hover-color="#eee" row-click-color="#edf7ff"  odd-bg-color="#aab3ac" :height="config.table.height">
			</v-table>
		</template>
	</div>
</template>
<style>
	.header-color{
        color:#0bf147;
	}
</style>
<script>
	import { Button, Tab, Tabs } from 'vant';
	import PrevNext from '@/components/subject/PrevNext.vue';
	import { VTable, VPagination } from 'vue-easytable';
	export default {
		components:{
			[Button.name]: Button,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,

			[VTable.name]: VTable,
			[VPagination.name]: VPagination,

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
							{field: 'PaperCode', title: '纸类', width: 80, titleAlign: 'center', columnAlign: 'center', titleCellClassName: 'header-color',isResize:true ,isFrozen: true},
							{field: 'ZJWt', title: '整卷重量', width: 80, titleAlign: 'center', columnAlign: 'center',titleCellClassName: 'header-color',isResize:true},
							{field: 'iZJCount', title: '整卷卷数', width: 80, titleAlign: 'center', columnAlign: 'center',titleCellClassName: 'header-color',isResize:true},
							{field: 'RWt', title: '残卷重量', width: 80, titleAlign: 'center', columnAlign: 'center',titleCellClassName: 'header-color',isResize:true},
							{field: 'iRCount', title: '残卷卷数', width: 80, titleAlign: 'center', columnAlign: 'center',titleCellClassName: 'header-color',isResize:true},
						],
						codeColumns:[
							{field: 'PaperWidth', title: '门幅', width: 80, titleAlign: 'center', columnAlign: 'center',titleCellClassName: 'header-color',isResize:true ,isFrozen: true},
							{field: 'ZJWt', title: '整卷重量', width: 80, titleAlign: 'center', columnAlign: 'center',titleCellClassName: 'header-color',isResize:true},
							{field: 'iZJCount', title: '整卷卷数', width: 80, titleAlign: 'center', columnAlign: 'center',titleCellClassName: 'header-color',isResize:true},
							{field: 'RWt', title: '残卷重量', width: 80, titleAlign: 'center', columnAlign: 'center',titleCellClassName: 'header-color',isResize:true},
							{field: 'iRCount', title: '残卷卷数', width: 80, titleAlign: 'center', columnAlign: 'center',titleCellClassName: 'header-color',isResize:true},
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
				}
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

					self.radioData.widthData.forEach((item,index)=>{
						item['prevNext'] = item.PaperWidth;
					});
					self.radioData.codeData.forEach((item,index)=>{
						item['prevNext'] = item.PaperCode;
					});
					self.filterForm.dataType = 1;
					self.filterForm.searchData = self.radioData.widthData[0].PaperWidth;
				}).then(()=>{
					this.$nextTick(() => {
					    this.config.prevNext.show = true;
					});
				}).then(()=>{
					this.getData(this.filterForm);
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
			}
		},
		mounted(){
			this.getPageConfig();
			this.config.table.height = window.screen.height - 210;
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
