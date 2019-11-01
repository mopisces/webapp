<template>
	<div>
		<van-sticky>
			<van-button plain hairline type="info" size="small" style="width:100%" @click="config.popup.filterShow = true">筛选</van-button>
			<van-tabs v-model="filterForm.safePaperState">
				<van-tab title="全部"></van-tab>
				<van-tab title="小于库存"></van-tab>
				<van-tab title="大于库存"></van-tab>
				<van-tab title="有库存的"></van-tab>
			</van-tabs>
		</van-sticky>
		<popup-filter :filterShow="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick" @filterOverlayClick="filterOverlayClick">
			<van-radio-group v-model="filterForm.safePaperType" slot="filter-field-1">
				<van-cell-group title="纸种类型">
					<van-cell title="全部" clickable @click="filterForm.safePaperType = '0'">
						<van-radio slot="right-icon" name="0" />
					</van-cell>
					<van-cell title="无" clickable @click="filterForm.safePaperType = '1'">
						<van-radio slot="right-icon" name="1" />
					</van-cell>
					<van-cell title="牛皮挂面" clickable @click="filterForm.safePaperType = '2'">
						<van-radio slot="right-icon" name="2" />
					</van-cell>
					<van-cell title="涂布白板" clickable @click="filterForm.safePaperType = '3'">
						<van-radio slot="right-icon" name="3" />
					</van-cell>
					<van-cell title="瓦纸" clickable @click="filterForm.safePaperType = '4'">
						<van-radio slot="right-icon" name="4" />
					</van-cell>
				</van-cell-group>
			</van-radio-group>
			<van-field label="原纸代码" v-model="filterForm.safePaperCode" input-align="center" placeholder="精确查询"  slot="filter-field-2"></van-field>
			<van-field label="门幅" v-model="filterForm.safePaperWidth" input-align="center" placeholder="精确查询"  slot="filter-field-3"></van-field>
			<van-field label="纸种名称" v-model="filterForm.safePaperName" input-align="center" placeholder="精确查询"  slot="filter-field-4"></van-field>
			<van-field label="生产备注" v-model="filterForm.safeSRemark" input-align="center" placeholder="精确查询"  slot="filter-field-5"></van-field>
			<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)"  slot="filter-field-7" @change="filterRemClick"/>
		</popup-filter>
		<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.columns" :table-data="table.data" row-hover-color="#eee" row-click-color="#edf7ff" >
		</v-table>
	</div>
</template>
<script>
	import { Button, Cell, CellGroup, Field, RadioGroup, Radio, SwitchCell, Sticky, Tab, Tabs} from 'vant';
	import { VTable, VPagination } from 'vue-easytable';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Field.name]: Field,
			[RadioGroup.name]: RadioGroup,
			[Radio.name]: Radio,
			[SwitchCell.name]: SwitchCell,
			[Sticky.name]: Sticky,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,

			[VTable.name]: VTable,
			[VPagination.name]: VPagination,

			PopupFilter
		},
		data(){
			return {
				active:'1',
				config:{
					popup:{
						filterShow:false
					},
					table:{
						columns:[
							{field: 'PaperCode', title: '原纸代码', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true ,isFrozen: true},
							{field: 'PaperWidth', title: '门幅', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true ,isFrozen: true},
							{field: 'PCount', title: '库存件数', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'SafeCount', title: '安全库存', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'MaxCount', title: '上限库存', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'PaperType', title: '纸种类型', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'PaperName', title: '纸种名称', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'SRemark', title: '生产备注', width: 150, titleAlign: 'center', columnAlign: 'center',isResize:true},
						],
					},
					switch:{
						checked:false
					}
				},
				table:{
					data:[]
				},
				filterForm:{
					safePaperState:0,
					safePaperType:'0',
					safePaperCode:'',
					safePaperWidth:'',
					safePaperName:'',
					safeSRemark:''
				}
			}
		},
		methods:{
			resetClick(){
				this.filterForm = {
					safePaperState:0,
					safePaperType:'0',
					safePaperCode:'',
					safePaperWidth:'',
					safePaperName:'',
					safeSRemark:''
				};
				this.removeItem();
			},
			filterClick(){
				this.getTableData( this.filterForm );
				this.config.popup.filterShow = false;
			},
			filterOverlayClick(){
				this.config.popup.filterShow = false;
			},
			getTableData( data ){
				let self = this;
				this.$request.staff.paper.staffPaperSafe( data ).then(res=>{
					self.table.data = res.result;
				});
			},
			filterRemClick( checked ){
				if( checked === false ){
					this.config.switch.checked = false;
					this.removeItem();
				}else{
					this.config.switch.checked = true;
					sessionStorage.setItem('paper/paperSafe',JSON.stringify(this.filterForm));
				}
			},
			removeItem(){
				sessionStorage.removeItem('paper/paperSafe');
			}
		},
		mounted(){
			this.getTableData( this.filterForm );
			this.removeItem();
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','安全库存');
			if( sessionStorage.getItem('paper/paperSafe') !== null  ){
				this.filterForm = JSON.parse(sessionStorage.getItem('paper/paperSafe'));
			}
		},
		computed:{
			paperState(){
				return this.filterForm.safePaperState;
			}
		},
		watch:{
			filterForm:{
				handler( val, oldVal ){
					this.config.switch.checked = false;
				},
				deep:true
			},
			paperState( newV,oldV ){
				this.getTableData( this.filterForm );
			}
		}
	}
</script>