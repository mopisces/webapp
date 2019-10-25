<template>
	<div>
		<van-tabs v-model="config.tabs.active">
			<van-tab title="按门幅汇总">
				<prev-next-width @radioConfirm="radioConfirm" :radioData="radioData.widthData"  v-if="config.prevNext.show"></prev-next-width>
			</van-tab>
  			<van-tab title="按纸类汇总">
  				<prev-next-code @radioConfirm="radioConfirm" :radioData="radioData.codeData"  v-if="config.tabs.active == 1"></prev-next-code>
  			</van-tab>
		</van-tabs>
		<template v-if=" config.tabs.active == 0 ">
			<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.widthColumns" :table-data="tableData.widthData" row-hover-color="#eee" row-click-color="#edf7ff" :height="500" >
			</v-table>
		</template>
		<template v-if=" config.tabs.active == 1 ">
			<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.codeColumns" :table-data="tableData.codeData" row-hover-color="#eee" row-click-color="#edf7ff" :height="500" >
			</v-table>
		</template>
	</div>
</template>
<script>
	import { Button, Tab, Tabs } from 'vant';
	import PrevNextWidth from '@/components/subject/paper/PrevNextWidth.vue';
	import PrevNextCode from '@/components/subject/paper/PrevNextCode.vue';
	import { VTable, VPagination } from 'vue-easytable';
	export default {
		components:{
			[Button.name]: Button,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,

			[VTable.name]: VTable,
			[VPagination.name]: VPagination,

			PrevNextWidth,
			PrevNextCode
		},
		data(){
			return {
				active:0,
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
							{field: 'PaperCode', title: '纸类', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true ,isFrozen: true},
							{field: 'PaperCode', title: '整卷重量', width: 140, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'PaperCode', title: '整卷卷数', width: 140, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'PaperCode', title: '残卷重量', width: 140, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'PaperCode', title: '残卷卷数', width: 140, titleAlign: 'center', columnAlign: 'center',isResize:true},
						],
						codeColumns:[
							{field: 'PaperWidth', title: '门幅', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true ,isFrozen: true},
							{field: 'PaperCode', title: '整卷重量', width: 140, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'PaperCode', title: '整卷卷数', width: 140, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'PaperCode', title: '残卷重量', width: 140, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'PaperCode', title: '残卷卷数', width: 140, titleAlign: 'center', columnAlign: 'center',isResize:true},
						]
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
					dataType:0,
					searchData:''
				}
			}
		},
		methods:{
			radioConfirm(){

			},
			getPageConfig(){
				let self = this;
				this.$request.staff.paper.stockConfig().then(res=>{
					self.radioData.widthData = res.result.width_select;
					self.radioData.codeData = res.result.code_select;
				}).then(()=>{
					this.$nextTick(() => {
					    this.config.prevNext.show = true;
					});
				});
			},
			getData( data ){
				let self = this;
				this.$request.staff.paper.stockMain( data ).then(res=>{
					console.log(res.result)
				});	
			}
		},
		mounted(){
			this.getPageConfig();
			this.getData( this.filterForm );
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