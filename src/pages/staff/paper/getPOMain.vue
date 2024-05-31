<!-- 原纸采购 -->
<template>
	<div>
		<drag-menu 
			defpositon="rt" 
			:popMenu="false"
			:pattern="{icon: 'filter-o'}"
			value="筛选"
			@fabClick="menuClick"
		></drag-menu>
		<van-tabs v-model="formData.active" @change="change">
			<van-tab title="全部">
				<div class="page-color" :style="'min-height: '+ (viewH-96)/16 +'rem;'">
					<div
						v-for="(item,index) in config.mock.indexList" 
						:key="index"
					>
						<van-divider style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250);">{{ index }}</van-divider>
						<card 
							:title="rowData.poNo" 
							:extra="rowData.shortName"
							:is-shadow="true"
							v-for="(rowData,idx) in item" 
							:key="idx"
						>
							<div class="card-body-container">
								<div class="card-body-item card-body-item-100">
									<span>采购|入库:
										<span class="mg-left-20">{{ rowData.poQty }}</span>
										<span class="mg-left-20">{{ rowData.inQty }}</span>
									</span>
								</div>
								<div class="card-body-item card-body-item-100">
									<span>纸类:
										<span class="mg-left-20">{{ rowData.sumPaper }}</span>
									</span>
								</div>
							</div>
							<div slot="actions" class="card-actions">
								<div class="card-actions-item" @click="detail(rowData)">
									<van-icon color="#3c9cff" class-prefix="iconfont" name="caidan" size="18"/>
									<span class="card-actions-item-text blue-color">详情</span>
								</div>
							</div>
						</card>
					</div>
				</div>
			</van-tab>
			<van-tab title="按日期">
				<karry-prev-next 
					ref="poMain"
					:value.sync="formData.poDate" 
					dataType="poMain"
				/>
				<div class="page-color" :style="'min-height: '+ (viewH-104)/16 +'rem;'">
					<div
						v-for="(item,index) in config.mock.mockList" 
						:key="index"
					>
						<card 
							:title="item.poNo" 
							:extra="item.shortName"
							:is-shadow="true"
							:key="idx"
						>
							<div class="card-body-container">
								<div class="card-body-item card-body-item-100">
									<span>采购|入库:
										<span class="mg-left-20">{{ item.poQty }}</span>
										<span class="mg-left-20">{{ item.inQty }}</span>
									</span>
								</div>
								<div class="card-body-item card-body-item-100">
									<span>纸类:
										<span class="mg-left-20">{{ item.sumPaper }}</span>
									</span>
								</div>
							</div>
							<div slot="actions" class="card-actions">
								<div class="card-actions-item" @click="detail(item)">
									<van-icon color="#3c9cff" class-prefix="iconfont" name="caidan" size="18"/>
									<span class="card-actions-item-text blue-color">详情</span>
								</div>
							</div>
						</card>
					</div>
				</div>
			</van-tab>
		</van-tabs>
		<!-- 筛选弹窗 -->
		<popup-filter :filterShow.sync="config.filter.show" @resetClick="reset" @filterClick="filter">
			<div slot="filter-field-1">
				<time-range-picker
					:beginDate.sync="formData.beginDate"
					:endDate.sync="formData.endDate"
					:maxDate.sync="formData.maxDate"
					:minDate.sync="formData.minDate"
				></time-range-picker>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)"/>
			</div>
		</popup-filter>
		<!-- 详情 -->
		<van-popup v-model="config.popup.show"  :style="{ width: '95%', height:'90%' }" round>
			<van-field center input-align="right" label="采购日期" v-model="rowData.poDate"></van-field>
			<van-field center input-align="right" label="采购单号" v-model="rowData.poNo"></van-field>
			<van-field center input-align="right" label="供应商" v-model="rowData.shortName"></van-field>
			<v-table 
				is-horizontal-resize 
				:is-vertical-resize="true" 
				style="width:100%;" 
				:columns="config.table.columns" 
				:table-data="config.mock.tableList" 
				row-hover-color="#eee" 
				row-click-color="#edf7ff" 
				even-bg-color="#fafafa" 
				:height="pageH*0.9-150" 
			>
			</v-table>
		</van-popup>
	</div>
</template>

<script>
	/*vant组件*/
	import { Icon, Popup, Field, SwitchCell, Divider, Sticky, Tab, Tabs } from 'vant'
	/*自定义拖动菜单组件*/
	import DragMenu from "@/components/subject/fab/DragMenu.vue"
	/*自定义筛选弹窗组件*/
	import PopupFilter from "@/components/subject/PopupFilter.vue"
	/*自定义日期区间组件*/
	import TimeRangePicker from "@/components/subject/time/TimeRangePicker.vue"
	/*自定义翻页组件*/
	import KarryPrevNext from "@/components/karry/prevNext/KarryPrevNext.vue"
	/*自定义卡片组件*/
	import Card from "@/components/subject/card/Card.vue"
	/*自定义方法*/
	import { getStorage, setStorage, removeStorage } from "@/util/storage"
	/*api接口*/
	import { getWebConfig } from "@/api/common/webConfig.js"
	import { fetchList } from "@/api/staff/paper.js"
	import { fetchColList } from "@/api/common/tableColumn.js"

	export default {
		components: {
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[Divider.name]: Divider,
			[Sticky.name]: Sticky,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,


			DragMenu,
			PopupFilter,
			TimeRangePicker,
			KarryPrevNext,
			Card
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
					/*列表数据*/
					mock: {
						/*原始数据*/
						indexList: [],
						/*模拟数据*/
						mockList: [],
						/*详情*/
						tableList: [],
						/*日期数据*/
						dateList: []
					},
					/*表格配置*/
					table: {
						columns: []
					},
					/*详情弹窗*/
					popup: {
						show: false
					},
				},
				/*筛选条件*/
				formData: {
					/*数据类型 11->原纸采购列表数据 12->原纸采购详情*/
					dataType: 11,
					// 采购单号
					poNo: null,
					//开始日期
					beginDate: null,
					//结束日期
					endDate: null,
					//最小日期
					minDate: null,
					//最大日期
					maxDate: null,
					/*采购日期*/
					poDate: null,
					active: 0,
				},
				rowData: {

				},
			}
		},
		async created() {
			await this.$store.commit('staff/setHeaderTitle', '原纸采购')
			if( getStorage('paperbuy/wGetPOMain') !== null ) {
				let storageData = JSON.parse(getStorage('paperbuy/wGetPOMain'))
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
		watch: {
			poDateChange(nVal, oVal) {
				if( nVal ) {
					this.config.mock.mockList = this.$options.data().config.mock.mockList
					this.config.mock.mockList = this.config.mock.indexList[nVal]
				}
			}
		},
		computed: {
			...window.Vuex.mapGetters({
				viewH: 'page/viewH',
				pageH: 'page/pageH',
			}),
			poDateChange() {
				return this.formData.poDate
			}
		},
		methods: {
			/*头部tabs改变*/
			change( name, index ) {
				if( name == 1 ) {
					setTimeout(async ()=>{
						await this.$refs.poMain.complete(this.config.mock.dateList)
					},200)
				}
			},
			/*菜单点击*/
			menuClick() {
				this.config.filter.show = true
			},
			/*设置表格列信息*/
			async setColums() {
				const { result } = await fetchColList({tableName: 110})
				this.config.table.columns = result
			},
			/*获取页面参数*/
			async getConfig() {
				const { result } = await getWebConfig({paramType: 'staffPaperBuy'})
				this.formData.beginDate = result.WGetPOMainBeginDate
				this.formData.endDate = result.WGetPOMainEndDate
				this.formData.maxDate = result.WGetPOMainMaxDate
				this.formData.minDate = result.WGetPOMainMinDate
				await this.fetchData()
			},
			/*获取列表数据*/
			async fetchData() {
				this.config.mock = this.$options.data().config.mock
				this.formData.dataType = 11
				const { result } = await fetchList(this.formData)
				this.config.mock.dateList = result.dateList
				this.config.mock.indexList = result.list
			},
			/*详情点击*/
			async detail(item) {
				this.rowData = this.$options.data().rowData
				this.config.mock.tableList = this.$options.data().config.mock.tableList
				this.rowData = Object.assign({}, this.rowData, item)
				const { result } = await fetchList({
					dataType: 12,
					poNo: item.poNo
				})
				this.config.mock.tableList = result
				this.config.popup.show = true
			},
			/*重置按钮*/
			async reset() {
				this.formData = this.$options.data().formData
				this.config.filter.show = false
				this.config.switch.checked = false
				await this.getConfig()
			},
			/*筛选按钮*/
			async filter() {
				await this.fetchData()
			},
			beforeunloadHandler(){
				if( this.config.switch.checked ){
					setStorage('paperbuy/wGetPOMain', this.formData)
				}else{
					removeStorage('paperbuy/wGetPOMain')
				}
			}
		}
	}
</script>

<style type="text/css">
	@import '~@/assets/style/card.css';
</style>