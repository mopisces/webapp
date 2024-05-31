<!-- 原纸日用量 -->
<template>
	<div>
		<van-tabs v-model="formData.ordState" @change="change">
			<van-tab title="日明细" name="0">
				<karry-prev-next 
					ref="dailyUsed"
					:value.sync="formData.outDate" 
					dataType="dailyUsed"
				/>
				<van-notice-bar :text="config.noticeBar.text" left-icon="volume-o" />
			</van-tab>
  			<van-tab title="汇总" name="1">
				<van-notice-bar :text="config.noticeBar.text" left-icon="volume-o" />
  			</van-tab>
		</van-tabs>
		<!-- 菜单 -->
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
			:columns="config.table.list.columns" 
			:table-data="config.list.indexList" 
			row-hover-color="#eee" 
			row-click-color="#edf7ff" 
			even-bg-color="#fafafa" 
			:height="listTableHeight" 
			:row-click="detail"
		>
		</v-table>
		<!-- 筛选条件 -->
		<popup-filter :filterShow.sync="config.filter.show" @resetClick="reset" @filterClick="filter">
			<div slot="filter-field-1">
				<van-field 
					label="班次" 
					v-model="classUpper" 
					placeholder="请输入班次" 
					input-align="center" 
					maxlength="10">
				</van-field>
				<time-range-picker
					:beginDate.sync="formData.beginDate"
					:endDate.sync="formData.endDate"
					:maxDate.sync="formData.maxDate"
					:minDate.sync="formData.minDate"
				></time-range-picker>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)"/>
			</div>
		</popup-filter>
		<!-- 详细信息 -->
		<van-popup v-model="config.detail.show" :style="{ height:'80%', width: '95%' }">
			<v-table 
				is-horizontal-resize 
				:is-vertical-resize="true" 
				:style="'width:'+ pageW*0.95 + 'px;'" 
				:columns="config.table.detail.columns" 
				:table-data="config.list.detailList" 
				row-hover-color="#eee" 
				row-click-color="#edf7ff" 
				even-bg-color="#fafafa" 
				:height="pageH*0.8" 
			>
			</v-table>
		</van-popup>
	</div>
</template>

<script>
	/*vant组件*/
	import { Icon, Popup, Field, NoticeBar, SwitchCell, Tab, Tabs } from "vant"
	/*自定义拖动菜单组件*/
	import DragMenu from "@/components/subject/fab/DragMenu.vue"
	/*自定义翻页组件*/
	import KarryPrevNext from "@/components/karry/prevNext/KarryPrevNext.vue"
	/*自定义筛选组件*/
	import PopupFilter from "@/components/subject/PopupFilter.vue"
	/*自定义日期区间组件*/
	import TimeRangePicker from "@/components/subject/time/TimeRangePicker.vue"
	/*自定义方法*/
	import { getStorage, setStorage, removeStorage } from "@/util/storage"
	/*api接口*/
	import { getWebConfig } from "@/api/common/webConfig.js"
	import { fetchColList } from "@/api/common/tableColumn.js"
	import { fetchList } from "@/api/staff/paper.js"

	export default {
		components: {
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Field.name]: Field,
			[NoticeBar.name]: NoticeBar,
			[SwitchCell.name]: SwitchCell,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,

			DragMenu,
			KarryPrevNext,
			PopupFilter,
			TimeRangePicker
		},
		data() {
			return {
				/*配置*/
				config: {
					/*头部信息*/
					noticeBar: {
						text: null,
					},
					/*筛选弹窗*/
					filter: {
						show: false
					},
					/*详情弹窗*/
					detail: {
						show: false
					},
					/*表格配置*/
					table: {
						list: {
							columns: [],
							commonH: 144
						},
						detail: {
							columns: [],
						},
					},
					/*记录筛选条件*/
					switch: {
						checked: false
					},
					/*表格数据*/
					list: {
						indexList: [],
						detailList: []
					},
					/*日期*/
					dateList: []
				},
				/*筛选条件*/
				formData: {
					/**
					 * 请求的数据类型
					 * 5->原纸日用量日期 6->原纸日用量列表数据 7->原纸日用量详情
					 */
					dataType: 5,
					/**
					 * 数据分类
					 * 0->日明细 1->汇总
					 */
					ordState: 0,
					//开始日期
					beginDate: null,
					//结束日期
					endDate: null,
					//最小日期
					minDate: null,
					//最大日期
					maxDate: null,
					/*出库日期*/
					outDate: null,
					/*班次*/
					opClass: null,
					/*原纸代码|纸质*/
					paperCode: null,
				},
			}
		},
		async created() {
			await this.$store.commit('staff/setHeaderTitle', '原纸日用量')
			if( getStorage('paper/dailyUsed') !== null ) {
				let storageData = JSON.parse(getStorage('paper/dailyUsed'))
				this.formData = Object.assign({}, this.$options.data().formData, storageData)
				this.config.switch.checked = true
				await this.fetchDate()
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
		watch: {
			async outDateChange(nVal, oVal) {
				if( nVal ) {
					await this.fetchData()
				}
			}
		},
		computed: {
			...window.Vuex.mapGetters({
				viewH: 'page/viewH',
				pageW: 'page/pageW',
				pageH: 'page/pageH',
			}),
			classUpper: {
				get() {
					return this.formData.opClass
				},
				set( nVal ) {
					this.formData.opClass = nVal.nVal()
				}
			},
			outDateChange() {
				return this.formData.outDate
			},
			listTableHeight: {
				get() {
					return this.formData.ordState == 0 ? this.viewH - 144 : this.viewH - 84
				}
			}
		},
		methods: {
			/*菜单点击*/
			menuClick() {
				this.config.filter.show = true
			},
			/*头部标签改变*/
			async change( name, index ) {
				if( this.formData.ordState == 0 ) {
					await this.fetchDate()
				} else {
					await this.fetchData()
				}
			},
			/*设置表格列信息*/
			async setColums() {
				const { result } = await fetchColList({tableName: 106})
				this.config.table.list.columns = result.total
				this.config.table.detail.columns = result.detail
			},
			/*获取页面参数*/
			async getConfig() {
				const { result } = await getWebConfig({paramType: 'staffPaper'})
				this.formData.beginDate = result.PaperDailyUsedBeginDate
				this.formData.endDate = result.PaperDailyUsedEndDate
				this.formData.maxDate = result.PaperDailyUsedMaxDate
				this.formData.minDate = result.PaperDailyUsedMinDate
				await this.fetchDate()
			},
			/*获取日期*/
			async fetchDate() {
				this.config.dateList = this.$options.data().config.dateList
				this.formData.outDate = this.$options.data().formData.outDate
				this.formData.dataType = 5
				const { result } = await fetchList(this.formData)
				this.config.dateList = result
				setTimeout(async ()=> {
					await this.$refs.dailyUsed.complete(result)
				}, 200)
			},
			/*获取表格数据*/
			async fetchData() {
				this.config.list.indexList = this.$options.data().config.list.indexList
				this.config.noticeBar.text = this.$options.data().config.noticeBar.text
				this.formData.dataType = 6
				const { result } = await fetchList(this.formData)
				this.config.list.indexList = result.list
				this.config.noticeBar.text = '总重量:' + result.total + 'kg'
			},
			/*表格点击*/
			async detail( rowIndex, rowData, column ) {
				this.config.list.detailList = this.$options.data().config.list.detailList
				this.formData.paperCode = this.$options.data().formData.paperCode
				this.formData.dataType = 7
				this.formData.paperCode = rowData.paperCode
				const { result } = await fetchList(this.formData)
				this.config.list.detailList = result
				this.config.detail.show = true
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
				if( this.formData.ordState == 0 ) {
					await this.fetchDate()
				} else {
					await this.fetchData()
				}
			},
			beforeunloadHandler(){
				if( this.config.switch.checked ){
					setStorage('paper/dailyUsed', this.formData) 
				}else{
					removeStorage('paper/dailyUsed')
				}
			}
		}
	}
</script>