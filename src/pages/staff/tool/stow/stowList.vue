<!-- 扫描装货 -->
<template>
	<div class="page-color" :style="'min-height: '+ viewH/16 +'rem;'">
		<drag-menu 
			defpositon="rt" 
			:pattern="{icon: 'plus'}"
			:content="config.menu.content"
			@trigger="trigger"
		/>
		<v-table 
			is-horizontal-resize 
			:is-vertical-resize="true" 
			:columns="config.table.columns" 
			:table-data="config.table.data" 
			:height="pageH-100"
			style="width:100%;" 
			row-hover-color="#eee" 
			row-click-color="#edf7ff" 
			even-bg-color="#fafafa"
			@on-custom-comp="customCompFunc">
		</v-table>
		<!-- 筛选弹窗 -->
		<popup-filter :filterShow.sync="config.filter.show" @resetClick="reset" @filterClick="filter">
			<div slot="filter-field-1">
				<time-range-picker
					:beginDate.sync="formData.beginDate"
					:endDate.sync="formData.endDate"
					:maxDate.sync="formData.maxDate"
					:minDate.sync="formData.minDate"
				></time-range-picker>
				<van-cell>
					<van-checkbox slot="icon" v-model="_showPack" shape="square">已准备</van-checkbox>
				</van-cell>
				<van-cell>
					<van-checkbox slot="icon" v-model="_showSign" shape="square">已回签</van-checkbox>
				</van-cell>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件" />
			</div>
		</popup-filter>
		<!-- 修改弹窗 -->
		<van-dialog 
			v-model="config.modify.show" 
			show-cancel-button 
			@confirm="doModify"
		>
			<car-picker :carCode.sync="modifyForm.carCode" @modifyPId="modifyPId"></car-picker>
			<carperson-picker :carPId.sync="modifyForm.carPId"></carperson-picker>
			<van-field 
				v-model="modifyForm.remark" 
				placeholder="输入备注" 
				input-align="center" 
				label="备注" 
			></van-field>
			<shipper-picker :taskName.sync="modifyForm.taskName"></shipper-picker>
		</van-dialog>
	</div>
</template>

<script>
	/*vant组件*/
	import { Cell, Checkbox, Field,  SwitchCell, Dialog, Toast } from "vant"
	/*自定义拖动菜单组件*/
	import DragMenu from "@/components/subject/fab/DragMenu.vue"
	/*自定义筛选组件*/
	import PopupFilter from "@/components/subject/PopupFilter.vue"
	/*自定义日期区间组件*/
	import TimeRangePicker from "@/components/subject/time/TimeRangePicker.vue"
	import CarPicker from "@/components/subject/picker/CarPicker.vue"
	import CarpersonPicker from "@/components/subject/picker/CarpersonPicker.vue"
	import ShipperPicker from "@/components/subject/picker/ShipperPicker.vue"
	/*第三方校验库*/
	import schema from "async-validator"
	/*自定义方法*/
	import { getStorage, setStorage, removeStorage } from "@/util/storage"
	/*api接口*/
	import { fetchColList } from "@/api/common/tableColumn.js"
	import { getWebConfig } from "@/api/common/webConfig.js"
	import { fetchList } from "@/api/staff/tool.js"

	export default {
		components: {
			[Cell.name]: Cell,
			[Checkbox.name]: Checkbox,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[Dialog.Component.name]: Dialog.Component,
			[Toast.name]: Toast,

			DragMenu,
			PopupFilter,
			TimeRangePicker,
			CarPicker,
			CarpersonPicker,
			ShipperPicker
		},
		data() {
			return {
				/*配置*/
				config: {
					//筛选弹窗
					filter: {
						show: false
					},
					//菜单配置
					menu: {
						content: [
							{
								text: '筛选',
								iconPath: 'filter-o',
								active: false
							},
							{
								text: '添加',
								iconPath: 'plus',
								active: false
							}
						]
					},
					//表格配置
					table: {
						columns: [],
						data: []
					},
					switch: {
						checked: false
					},
					//修改弹窗
					modify: {
						show: false
					},
					rules:{
						strFactoryId: [
							{ required : true , message : '请刷新页面获取厂商ID' },
						],
						strFactoryId: [
							{ required : true , message : '请刷新页面获取厂商ID' },
						],
						strOrderId: [
							{ required : true , message : '请选择装货单类型' },
						],
						strCarCode: [
							{ required : true , message : '请选择车辆编号' },
						],
						strCarPId: [
							{ required : true , message : '请选择司机' },
						],
						strAPPerson: [
							{ required : true , message : '请选择发货员' },
						],
						PackDate: [
							{ required : true , message : '请选择日期' },
						]
					}
				},
				//筛选条件
				formData: {
					//数据类型 3->扫描装货列表
					dataType: 3,
					//准备状态
					showPack: 0,
					//回签状态
					showSign: 0,
					//开始日期
					beginDate: null,
					//结束日期
					endDate: null,
					//最小日期
					minDate: null,
					//最大日期
					maxDate: null,
				},
				//新增表单
				addForm: {
					//添加日期最大值
					maxDate: null,
					//添加日期最小值
					minDate: null,
					//添加日期
					addDate: null,
					//erp编号
					erpId: null,
					//厂商ID
					factoryId: null,
				},
				//修改表单
				modifyForm: {
					pListNo: '',
					orderType: '',
					factoryId: '',
					subFacId: '',
					date: '',
					carCode: '',
					carPId: '',
					loader: '',
					carFee: 0,
					taskName: '',
					remark: '',
				},
				validator: {}
			}
		},
		computed: {
			...window.Vuex.mapGetters({
				viewH: 'page/viewH',
				pageH: 'page/pageH',
			}),
			_showPack: {
				get() {
					return this.formData.showPack
				},
				set( val ) {
					this.formData.showPack = val ? 1:0
				}
			},
			_showSign: {
				get() {
					return this.formData.showSign
				},
				set( val ) {
					this.formData.showSign = val ? 1:0
				}
			},
		},
		async created(){
			this.$store.commit('staff/setHeaderTitle','扫面装货')
			this.$store.commit('staff/setBackPath', '/staff/index/menu')
			if( getStorage('stow/lists') ) {
				let storageData = JSON.parse(getStorage('stow/lists'))
				this.formData = Object.assign({}, this.$options.data().formData, storageData)
				this.config.switch.checked = true
				await this.getConfig(false)
			} else {
				await this.getConfig()
			}
		},
		async mounted() {
			await this.setColums()
			this.validator = new schema( this.config.rules )
			window.addEventListener('beforeunload', e => this.beforeunloadHandler())
		},
		destroyed() {
			this.beforeunloadHandler()
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler())
		},
		methods: {
			//菜单点击
			trigger({index, item}) {
				if( index == 0 ) {
					this.config.filter.show = true
				}
			},
			/*设置表格列信息*/
			async setColums() {
				const { result } = await fetchColList({tableName: 111})
				this.config.table.columns = result
				this.config.table.columns.map(col=> {
					if( col.field == 'CarState' ) {
						col.formatter = (rowData)=> {
							if( rowData.CarState == 0 ){
								return '<span style="color:red;font-weight: bold;">装货中</span>';
							}
							if( rowData.CarState == 1 ){
								return '<span style="color:blue;font-weight: bold;">已准备</span>';
							}
							if( rowData.CarState == 2 ){
								return '<span style="color:#1a991d;font-weight: bold;">已回签</span>';
							}
						}
					}
					return col
				})
			},
			/*获取页面参数*/
			async getConfig( isResize = true ){
				const { result } = await getWebConfig({paramType: 'staffStow'})
				if( isResize ) {
					this.formData.beginDate = result.beginDate
					this.formData.endDate = result.endDate
					this.formData.maxDate = result.maxDate
					this.formData.minDate = result.minDate
				}
				this.addForm.maxDate = result.addMaxDate
				this.addForm.minDate = result.addMinDate
				this.addForm.addDate = result.addDate
				this.addForm.erpId = result.erpId
				this.addForm.factoryId = result.factoryId

				await this.fetchData()
			},
			/*获取表格数据*/
			async fetchData() {
				this.config.table.data = this.$options.data().config.table.data
				const { result } = await fetchList(this.formData)
				this.config.table.data = result
			},
			//行方法
			customCompFunc(params){
				if( params.type == 'modify' ){
					this.modifyForm = this.$options.data().modifyForm
					this.modifyCarPerson(params.rowData)
					return 
				}
				let data = {
					pListNo: params.rowData.PListNo,
					strFactoryId: params.userInfo.strFactoryId,
					strUserId: params.userInfo.strUserId,
					index: params.index
				};
				if( params.type === 'prepare' ){
					this.preparePack( data )
				}
				if( params.type === 'cancelPre' ){
					this.unPreparePack( data )
				}
			},
			//修改装货单
			modifyCarPerson(rowData) {
				this.modifyForm.pListNo = rowData.PListNo
				this.modifyForm.orderType = rowData.OrderType
				this.modifyForm.factoryId = rowData.FactoryId
				this.modifyForm.subFacId = rowData.SubFacId
				this.modifyForm.date = rowData.PackDate
				this.modifyForm.carCode = rowData.CarCode ? rowData.CarCode : ''
				this.modifyForm.carPId = rowData.CarPId ?  rowData.CarPId : ''
				this.modifyForm.taskName = rowData.APPerson ? rowData.APPerson : ''
				this.modifyForm.remark = rowData.Remark ? rowData.Remark : ''
				this.config.modify.show = true
			},
			//执行修改
			doModify() {

			},
			/*重置按钮*/
			async reset() {
				this.formData = this.$options.data().formData
				this.config.switch.checked = false	
				this.config.filter.show = false
				await this.getConfig(true)
			},
			/*筛选按钮*/
			async filter() {
				await this.fetchData()
			},
			beforeunloadHandler(){
				if( this.config.switch.checked ){
					setStorage('stow/lists', this.formData)
				}else{
					removeStorage('stow/lists')
				}
			}
		}
	}
</script>