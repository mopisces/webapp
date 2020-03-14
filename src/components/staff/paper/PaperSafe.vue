<template>
	<div>
		<van-sticky>
			<van-button plain hairline type="info" size="small" style="width:100%" @click="config.popup.filterShow = true">筛选</van-button>
			<van-tabs v-model="filterForm.safePaperState">
				<van-tab title="全部"></van-tab>
				<van-tab title="小于安全库存"></van-tab>
				<van-tab title="大于安全库存"></van-tab>
				<van-tab title="有库存的"></van-tab>
			</van-tabs>
		</van-sticky>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<radio-cell :radioInfo.sync="filterForm.safePaperType" :radioColumns="config.radio.options" :title="config.radio.title" slot="filter-field-1"></radio-cell>
			<van-field label="原纸代码" v-model="filterForm.safePaperCode" input-align="center" placeholder="精确查询"  slot="filter-field-2"></van-field>
			<van-field label="门幅" v-model="filterForm.safePaperWidth" input-align="center" placeholder="精确查询"  slot="filter-field-3"></van-field>
			<van-field label="纸种名称" v-model="filterForm.safePaperName" input-align="center" placeholder="精确查询"  slot="filter-field-4"></van-field>
			<van-field label="生产备注" v-model="filterForm.safeSRemark" input-align="center" placeholder="精确查询"  slot="filter-field-5"></van-field>
			<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)"  slot="filter-field-7" />
		</popup-filter>
		<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.columns" :table-data="table.data" row-hover-color="#eee" row-click-color="#edf7ff" :column-cell-class-name="columnCellClass" :height="config.table.height" even-bg-color="#fafafa">
		</v-table>
	</div>
</template>
<script>
	import { Button, Field, SwitchCell, Sticky, Tab, Tabs} from 'vant';
	import { VTable, VPagination } from 'vue-easytable';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import RadioCell from '@/components/subject/RadioCell.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[Sticky.name]: Sticky,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,

			[VTable.name]: VTable,
			[VPagination.name]: VPagination,

			PopupFilter,
			RadioCell
		},
		data(){
			return {
				config:{
					popup:{
						filterShow:false
					},
					table:{
						columns:[
							{field: 'PaperCode', title: '原纸代码', width: 70, titleAlign: 'center', columnAlign: 'center',isResize:true ,isFrozen: true},
							{field: 'PaperWidth', title: '门幅', width: 70, titleAlign: 'center', columnAlign: 'center',isResize:true ,isFrozen: true},
							{field: 'PCount', title: '库存件数', width: 70, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'SafeCount', title: '安全库存', width: 70, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'MaxCount', title: '上限库存', width: 70, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'PaperType', title: '纸种类型', width: 70, titleAlign: 'center', columnAlign: 'center',isResize:true,formatter:(rowData)=>{
								switch( rowData.PaperType ){
									case '0':
										return '<span>无</span>';
										break;
									case '1':
										return '<span>牛皮挂面</span>';
										break;
									case '2':
										return '<span>涂布白板</span>';
										break;
									case '3':
										return '<span>瓦纸</span>';
										break;
									default : 
										return '暂无数据';
								}
							} },
							{field: 'PaperName', title: '纸种名称', width: 120, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'SRemark', title: '生产备注', width: 150, titleAlign: 'center', columnAlign: 'center',isResize:true},
						],
						height : 0
					},
					switch:{
						checked:false
					},
					radio:{
						options:[
							{ title:'全部', value:0},
							{ title:'无', value:1},
							{ title:'牛皮挂面', value:2},
							{ title:'涂布白板', value:3},
							{ title:'瓦纸', value:4},
						],
						title:'纸种类型'
					}
				},
				table:{
					data:[]
				},
				filterForm:{
					safePaperState : 0,
					safePaperType  : 0,
					safePaperCode  : '',
					safePaperWidth : '',
					safePaperName  : '',
					safeSRemark    : ''
				}
			}
		},
		methods:{
			resetClick(){
				this.filterForm = {
					safePaperState : 0,
					safePaperType  : 0,
					safePaperCode  : '',
					safePaperWidth : '',
					safePaperName  : '',
					safeSRemark    : ''
				};
				this.config.switch.checked = false;
			},
			filterClick(){
				this.getTableData( this.filterForm );
				this.config.popup.filterShow = false;
			},
			getTableData( data ){
				let self = this;
				this.$request.staff.paper.staffPaperSafe( data ).then(res=>{
					self.table.data = res.result;
				});
			},
			columnCellClass( rowIndex,columnName,rowData ){
				if( Number(rowData.PCount) < Number(rowData.SafeCount) ){
					return 'less';
				}
			}	
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','安全库存');
			if( sessionStorage.getItem('paper/paperSafe') !== null  ){
				this.filterForm = JSON.parse(sessionStorage.getItem('paper/paperSafe'));
				this.config.switch.checked = true;
			}
		},
		mounted(){
			this.getTableData( this.filterForm );
			this.config.table.height = window.screen.height - 170;
		},
		destroyed(){
			if( this.config.switch.checked ){
				sessionStorage.setItem('paper/paperSafe',JSON.stringify(this.filterForm));
			}else{
				sessionStorage.removeItem('paper/paperSafe');
			}
		},
		computed:{
			paperState(){
				return this.filterForm.safePaperState;
			}
		},
		watch:{
			paperState( newV,oldV ){
				this.getTableData( this.filterForm );
			}
		}
	}
</script>
