<!-- 安全库存 -->
<template>
	<div>
		<van-tabs v-model="formData.ordState" @change="change">
			<van-tab title="全部" name="0"></van-tab>
			<van-tab title="库存不足" name="1"></van-tab>
			<van-tab title="库存充足" name="2"></van-tab>
			<van-tab title="有库存" name="3"></van-tab>
		</van-tabs>
		<!-- 菜单按钮 -->
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
			:column-cell-class-name="columnCellClass" 
			:height="viewH" 
			even-bg-color="#fafafa"
		>
		</v-table>
		<!-- 筛选弹窗 -->
		<popup-filter :filterShow.sync="config.filter.show" @resetClick="reset" @filterClick="filter">
			<div slot="filter-field-1">
				<uni-check-box
					label="纸种类型"
					:localdata="config.radio.paperType"
					:radioData.sync="formData.paperType" 
					:map="{text: 'title', value: 'value'}"
				>
				</uni-check-box>
				<van-field 
					label="原纸代码" 
					v-model="formData.paperCode" 
					input-align="center" 
					placeholder="精确查询">
				</van-field>
				<van-field 
					label="门幅" 
					v-model="formData.paperWidth" 
					input-align="center" 
					placeholder="精确查询">
				</van-field>
				<van-field 
					label="纸种名称" 
					v-model="formData.paperName" 
					input-align="center" 
					placeholder="精确查询">
				</van-field>
				<van-field 
					label="生产备注" 
					v-model="formData.pRemark" 
					input-align="center" 
					placeholder="精确查询">
				</van-field>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
	</div>
</template>

<script>
	/*vant组件*/
	import { Field, SwitchCell, Sticky, Tab, Tabs} from "vant"
	/*自定义拖动菜单组件*/
	import DragMenu from "@/components/subject/fab/DragMenu.vue"
	/*自定义客户筛选组件*/
	import PopupFilter from "@/components/subject/PopupFilter.vue"
	/*自定义单选组件*/
	import UniCheckBox from "@/components/subject/checkbox/UniCheckBox.vue"
	/*自定义方法*/
	import { getStorage, setStorage, removeStorage } from "@/util/storage"
	/*api接口*/
	import { fetchList } from "@/api/staff/paper.js"
	import { fetchColList } from "@/api/common/tableColumn.js"

	export default {
		components: {
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[Sticky.name]: Sticky,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,

			DragMenu,
			PopupFilter,
			UniCheckBox
		},
		data() {
			return{
				/*配置*/
				config: {
					/*筛选弹窗*/
					filter: {
						show: false
					},
					/*单选配置*/
					radio: {
						paperType: [
							{ title: '全部', value: 0},
							{ title: '无', value: 1},
							{ title: '牛皮挂面', value: 2},
							{ title: '涂布白板', value: 3},
							{ title: '瓦纸', value: 4},
						]
					},
					/*表格配置*/
					table: {
						columns: []
					},
					/*记录筛选条件*/
					switch: {
						checked: false
					},
					/*列表数据*/
					indexList: []
				},
				/*筛选条件*/
				formData: {
					/*数据类型 2->安全库存*/
					dataType: 2,
					/**
					 * 数据分类
					 * 安全库存 0->全部 1->大于安全库存 2->大于安全库存 3->有库存的
					*/
					ordState: 0,
					/**
					 * 纸种类型
					 * 0->全部 1->无 2->牛皮挂面 3->涂布白板 4->瓦纸
					 */
					paperType: 0,
					//原纸代码|纸质
					paperCode: null,
					//门幅
					paperWidth: null,
					//纸种名称
					paperName: null,
					//生产备注
					pRemark: null,
				},
			}
		},
		async created() {
			await this.$store.commit('staff/setHeaderTitle', '安全库存')
			if( getStorage('paper/paperSafe') !== null  ) {
				let storageData = JSON.parse(getStorage('erp/getOrders'))
				this.formData = Object.assign({}, this.$options.data().formData, storageData)
				this.config.switch.checked = true
			}
			await this.setColums()
		},
		mounted() {
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
				const { result } = await fetchColList({tableName: 107})
				this.config.table.columns = result
				this.config.table.columns.map(col=> {
					if( col.field == 'PaperType' ) {
						col.formatter = (rowData)=>{
							switch( rowData.PaperType ){
								case '0':
									return '<span>无</span>'
									break
								case '1':
									return '<span>牛皮挂面</span>'
									break
								case '2':
									return '<span>涂布白板</span>'
									break
								case '3':
									return '<span>瓦纸</span>'
									break
								default: 
									return '暂无数据'
							}
						}
					}
					return col
				})
				await this.fetchData()
			},
			/*表格单元设置class*/
			columnCellClass( rowIndex,columnName,rowData ){
				if( Number(rowData.PCount) < Number(rowData.SafeCount) ){
					return 'less'
				}
			},
			/*头部tabs改变*/
			async change(name, title) {
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
				await this.fetchData()
			},
			/*筛选按钮*/
			async filter() {
				await this.fetchData()
			},
			beforeunloadHandler() {
				if( this.config.switch.checked ){
					setStorage('paper/paperSafe', this.formData)
				}else{
					removeStorage('paper/paperSafe')
				}
			}
		}
	}
</script>
