<!-- 信用余额2 -->
<template>
	<div>
		<drag-menu 
			defpositon="rt" 
			:popMenu="false"
			:pattern="{icon: 'filter-o'}"
			value="筛选"
			@fabClick="menuClick"
		></drag-menu>
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
		></v-table>
		<popup-filter :filterShow.sync="config.filter.show" @resetClick="reset" @filterClick="filter">
			<div slot="filter-field-1">
				<time-range-picker
					:beginDate.sync="formData.beginDate"
					:endDate.sync="formData.endDate"
					:maxDate.sync="formData.maxDate"
					:minDate.sync="formData.minDate"
				></time-range-picker>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
	</div>
</template>

<script>
	/*vant组件*/
	import { SwitchCell } from "vant"
	/*自定义拖动菜单组件*/
	import DragMenu from "@/components/subject/fab/DragMenu.vue"
	/*自定义筛选弹窗组件*/
	import PopupFilter from "@/components/subject/PopupFilter.vue"
	/*自定义日期区间组件*/
	import TimeRangePicker from "@/components/subject/time/TimeRangePicker.vue"
	/*自定义方法*/
	import { getStorage, setStorage, removeStorage } from "@/util/storage"
	/*api接口*/
	import { getWebConfigJWT } from "@/api/common/webConfig.js"
	import { fetchColList } from "@/api/common/tableColumn.js"
	import { fetchList } from "@/api/client/customer.js" 
	export default {
		components: {
			[SwitchCell.name]: SwitchCell,

			DragMenu,
			PopupFilter,
			TimeRangePicker
		},
		data() {
			return {
				/*配置*/
				config: {
					/*筛选弹窗*/
					filter: {
						show: false
					},
					// 表格配置
					table: {
						columns: [],
					},
					switch: {
						checked: false
					},
					/*表格数据*/
					indexList: [],
				},
				/*筛选条件*/
				formData: {
					/**
					 * 数据类型
					 * 8->信用余额明细2
					 */
					dataType: 8,
					//开始日期
					beginDate: null,
					//结束日期
					endDate: null,
					//最小日期
					minDate: null,
					//最大日期
					maxDate: null,
				},
			}
		},
		async created() {
			await this.$store.commit('client/setHeaderTitle',' 信用余额明细2')
			if( getStorage('cred/wGetCusDetail') !== null ) {
				let storageData = JSON.parse(getStorage('cred/wGetCusDetail'))
				this.formData = Object.assign({}, this.$options.data().formData, storageData)
				this.config.switch.checked = true
				await this.fetchData()
			} else {
				await this.getConfig()
			}
		},
		async mounted() {
			await this.setColums()
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
				const { result } = await fetchColList({tableName: 3})
				this.config.table.columns = result
			},
			/*获取页面参数*/
			async getConfig() {
				const { result } = await getWebConfigJWT({paramType: 'clientCB'})
				this.formData.beginDate = result.GetCusFreeMBDetailBeginDate
				this.formData.endDate = result.GetCusFreeMBDetailEndDate
				this.formData.minDate = result.GetCusFreeMBDetailMinDate
				this.formData.maxDate = result.GetCusFreeMBDetailMaxDate
				await this.fetchData()
			},
			/*获取列表数据*/
			async fetchData() {
				this.config.indexList = this.$options.data().config.indexList
				const { result } = await fetchList(this.formData)
				this.config.indexList = result
			},
			/*重置按钮*/
			async reset() {
				this.formData = this.$options.data().formData
				this.config.switch.checked = false	
				this.config.filter.show = false
				await this.getConfig()
			},
			/*筛选按钮*/
			async filter() {
				await this.fetchData()
			},
			beforeunloadHandler(){
				if( this.config.switch.checked ){
					setStorage('cred/wGetCusDetail', this.formData)
				}else{
					removeStorage('cred/wGetCusDetail')
				}
			}
		},
	}
</script>