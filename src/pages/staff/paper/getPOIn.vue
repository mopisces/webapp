<!-- 原纸收货 -->
<template>
	<div>
		<karry-prev-next 
			ref="poIn"
			:value.sync="formData.recDate" 
			dataType="poIn"
		/>
		<van-notice-bar :text="config.noticeBar.text" left-icon="volume-o" background="#ecf9ff"/>
		<card 
			:title="item.inNo" 
			:extra="item.poNo"
			:subTitle="item.shortName"
			:is-shadow="true"
			v-for="(item,index) in config.indexList" 
			:key="index"
		>
			<div class="card-body-container">
				<div class="card-body-item card-body-item-100">
					<span>入库信息:
						<span class="mg-left-20">{{ item.inQty }}</span>件
						<span class="mg-left-20">{{ item.sumInWt }}</span>kg
					</span>
				</div>
				<div class="card-body-item card-body-item-100">
					<span>入库纸类:
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

		<van-popup v-model="config.popup.show"  :style="{ width: '95%', height:'90%' }" round>
			<van-field center input-align="right" label="收货日期" v-model="rowData.recDate"></van-field>
			<van-field center input-align="right" label="收货单号" v-model="rowData.inNo"></van-field>
			<van-field center input-align="right" label="供应商" v-model="rowData.shortName"></van-field>
			<v-table 
				is-horizontal-resize 
				:is-vertical-resize="true" 
				style="width:100%;" 
				:columns="config.table.columns" 
				:table-data="config.tableList" 
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
	import { Button, Icon, Popup, Field, NoticeBar } from "vant"
	/*自定义翻页组件*/
	import KarryPrevNext from "@/components/karry/prevNext/KarryPrevNext.vue"
	/*自定义卡片组件*/
	import Card from "@/components/subject/card/Card.vue"
	/*api接口*/
	import { fetchList } from "@/api/staff/paper.js"
	import { fetchColList } from "@/api/common/tableColumn.js"

	export default {
		components: {
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Field.name]: Field,
			[NoticeBar.name]: NoticeBar,

			KarryPrevNext,
			Card,
		},
		data() {
			return {
				/*配置*/
				config: {
					noticeBar: {
						text: null
					},
					popup: {
						show: false
					},
					table: {
						columns: []
					},
					/*列表数据*/
					indexList: [],
					/*详情表格数据*/
					tableList: [],
				},
				/*筛选条件*/
				formData: {
					/**
					 * 数据类型
					 * 8->原纸收货日期 9->原纸收货列表数据 10->原纸收货详情
					 */
					dataType: 8,
					/*收货日期*/
					recDate: null,
				},
				/*点击信息*/
				rowData: {
					/*收货日期*/
					recDate: null,
					/*收货单号*/
					inNo: null,
					/*供应商*/
					shortName: null,
				},
			}
		},
		async created() {
			await this.$store.commit('staff/setHeaderTitle', '原纸收货')
			await this.getConfig()
		},
		async mounted() {
			await this.setColums()
		},
		watch: {
			async recDateChange(nVal, oVal) {
				if( nVal ) {
					await this.fetchData()
				}
			}
		},
		computed: {
			...window.Vuex.mapGetters({
				pageW: 'page/pageW',
				pageH: 'page/pageH',
			}),
			recDateChange() {
				return this.formData.recDate
			},
		},
		methods: {
			/*设置表格列信息*/
			async setColums() {
				const { result } = await fetchColList({tableName: 109})
				this.config.table.columns = result
			},
			/*获取配置*/
			async getConfig() {
				this.formData.dataType = 8
				const { result } = await fetchList(this.formData)
				setTimeout(async ()=> {
					await this.$refs.poIn.complete(result)
				}, 200)
			},
			/*获取列表数据*/
			async fetchData() {
				this.config.indexList = this.$options.data().config.indexList
				this.config.noticeBar = this.$options.data().config.noticeBar
				this.formData.dataType = 9
				const { result } = await fetchList(this.formData)
				this.config.indexList = result.list
				this.config.noticeBar.text = result.text
			},
			/*列表点击*/
			async detail( item ) {
				this.rowData = this.$options.data().rowData
				this.config.tableList = this.$options.data().config.tableList
				this.rowData = Object.assign({}, this.rowData, item)
				const { result } = await fetchList({
					dataType: 10,
					inNo: item.inNo
				})
				this.config.tableList = result
				this.config.popup.show = true
			}
		},
	}
</script>

<style type="text/css">
	@import '~@/assets/style/card.css';
</style>
