<!-- 客户往来统计 -->
<template>
	<div :style="'min-height: '+ viewH/16 +'rem;'">
		<drag-menu 
			defpositon="rt" 
			:popMenu="false"
			:pattern="{icon: 'filter-o'}"
			value="筛选"
			@fabClick="menuClick"
		>
		</drag-menu>
		<v-table 
			is-horizontal-resize 
			:is-vertical-resize="true" 
			style="width:100%;"  
			:columns="config.table.columns" 
			:table-data="config.indexList" 
			row-hover-color="#eee" 
			row-click-color="#edf7ff" 
			:height="viewH" 
			even-bg-color="#fafafa" 
			@on-custom-comp="customCompFunc">
		</v-table>
		<!-- 调整弹窗 -->
		<van-dialog 
			v-model:show="config.dialog.show" 
			:show-confirm-button="false" 
			:close-on-click-overlay="true" 
			@close="checkClose()"
		>
			<van-field 
				label="客户名称" 
				:value="rowData.cusId" 
				input-align="center" 
				readonly 
				style="line-height:36px;"
			/>
   			<van-field 
   				label="预警金额" 
   				v-model="rowData.preAmt" 
   				placeholder="请输入预警金额" 
   				input-align="center"  
   				style="line-height:36px;" 
   			/>
   			<van-field 
   				label="终止金额" 
   				v-model="rowData.minAmtCond" 
   				placeholder="请输入终止金额" 
   				input-align="center"  
   				style="line-height:36px;" 
   			/>
   			<van-button 
   				type="primary" 
   				:loading="config.dialog.submit.loading" 
   				loading-text="提交" 
   				style="width:80%;margin-left:10%;margin-bottom:2%;margin-top:2%;" 
   				round 
   				@click="updateCheck()"
   			>
   				修改
   			</van-button>
		</van-dialog>
		<!-- 筛选弹窗 -->
		<popup-filter 
			:filterShow.sync="config.filter.show"  
			@resetClick="reset" 
			@filterClick="filter"
		>
			<div slot="filter-field-1">
				<cus-picker :cusName.sync="formData.cusId" ></cus-picker>
				<van-field label="业务员" v-model="formData.task" placeholder="精确查询" input-align="center"/>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)"/>
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button, Field, SwitchCell, Dialog, Toast } from "vant"
	/*自定义筛选组件*/
	import PopupFilter from "@/components/subject/PopupFilter.vue"
	/*自定义客户选择组件*/
	import CusPicker from "@/components/subject/picker/CusPicker.vue"
	/*自定义拖动菜单组件*/
	import DragMenu from "@/components/subject/fab/DragMenu.vue"
	/*async validate*/
	import schema from "async-validator"
	/*自定义方法*/
	import { getStorage, setStorage, removeStorage } from "@/util/storage"
	/*api接口*/
	import { fetchList, doUpdate } from "@/api/staff/customer.js"
	import { fetchColList } from "@/api/common/tableColumn.js"

	export default {
		components: {
			[Button.name]: Button,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[Dialog.Component.name]: Dialog.Component,
			[Toast.name]: Toast,

			PopupFilter,
			CusPicker,
			DragMenu
		},
		data() {
			return {
				/*配置*/
				config: {
					/*筛选弹窗*/
					filter: {
						show: false
					},
					switch: {
						checked: false
					},
					/*调整金额弹窗*/
					dialog: {
						show: false,
						submit: {
							loading: false
						}
					},
					/*表格配置*/
					table: {
						columns: [],
					},
					/*表格数据*/
					indexList: [],
				},
				/*筛选条件*/
				formData: {
					/*数据类型*/
					dataType: 12,
					/*客户*/
					cusId: null,
					/*业务员*/
					task: null,
				},
				/*点击表格记录*/
				rowData: {
					//更新类型 1->客户往来统计更新中止金额
					updateType: 1,
					//客户
					cusId: null,
					//终止金额调整后
					preAmt: null,
					//终止金额调整前
					oldPreAmt: null,
					//预警金额调整后
					minAmtCond: null,
					//预警金额调整前
					oldMinAmtCond: null,
				},
				rules:{
					minAmtCond:[
						{ required : true, message : '请输入终止金额' }
					],
					preAmt:[
						{ required : true, message : '请输入预警金额' }
					]
				},
				/*验证类*/
				validator: null
			}
		},
		async created() {
			await this.$store.commit('staff/setHeaderTitle', '客户来往统计')
			if( getStorage('frec/cusContact') !== null  ) {
				let storageData = JSON.parse(getStorage('frec/cusContact'))
				this.formData = Object.assign({}, this.$options.data().formData, storageData)
				this.config.switch.checked = true
			}
			await this.setColums()
		},
		mounted() {
			this.validator = new schema(this.rules)
			window.addEventListener('beforeunload', e => this.beforeunloadHandler())
		},
		destroyed() {
			this.beforeunloadHandler()
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler())
		},
		computed: {
			...window.Vuex.mapGetters({
				viewH: 'page/viewH'
			})
		},
		methods: {
			/*菜单点击*/
			menuClick() {
				this.config.filter.show = true
			},
			/*设置表格列信息*/
			async setColums() {
				const { result } = await fetchColList({tableName: 103})
				this.config.table.columns = result
				await this.fetchData()
			},
			/*获取表格数据*/
			async fetchData() {
				this.config.indexList = this.$options.data().config.indexList
				const { result } = await fetchList(this.formData)
				this.config.indexList = result
			},
			/*调整点击*/
			customCompFunc( params ) {
				this.rowData = this.$options.data().rowData
				this.rowData = Object.assign({}, this.rowData, params.rowData)
				this.config.dialog.show = true
				console.log(this.rowData)
			},
			/*调整弹窗关闭*/
			checkClose(){
				this.rowData = this.$options.data().rowData
			},
			/*弹出层点击修改*/
			updateCheck() {
				this.validator.validate( this.rowData ).then(()=> {
					this.config.dialog.submit.loading = true
					this.update()
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message);
				})
			},
			/*更新数据*/
			async update() {
				const { result, msg } = await doUpdate(this.rowData)
				Toast.success(msg)
				this.config.dialog.submit.loading = false
				this.config.dialog.show = false
				setTimeout(async ()=> {
					await this.fetchData()
				}, 2000)
			},
			/*重置按钮*/
			async reset() {
				this.formData = this.$options.data().formData
				this.config.filter.show = false
				this.config.switch.checked = false
				await this.fetchData()
			},
			/*筛选按钮*/
			async filter() {
				await this.fetchData()
			},
			beforeunloadHandler(){
				if( this.config.switch.checked ){
					setStorage('frec/cusContact', this.formData)
				}else{
					removeStorage('frec/cusContact')
				}
			},
		}
	}
</script>