<!-- 原纸库存 -->
<template>
	<div>
		<van-notice-bar :text="config.noticeBar.text" left-icon="volume-o" background="#ecf9ff"/>
		<van-tabs v-model="formData.ordState" @change="change">
			<van-tab title="按门幅汇总" name="1">
				<karry-prev-next 
					ref="paperWidth"
					:value.sync="formData.keyWord" 
					dataType="paperWidth"
				/>
				<v-table 
					is-horizontal-resize 
					:is-vertical-resize="true" 
					style="width:100%;" 
					:columns="config.table.paperWidth.columns" 
					:table-data="config.list.paperWidth" 
					row-hover-color="#eee" 
					row-click-color="#edf7ff"  
					even-bg-color="#fafafa" 
					:height="viewH - config.table.commonH">
				</v-table>
			</van-tab>
			<van-tab title="按纸类汇总" name="2">
				<karry-prev-next 
					ref="paperCode"
					:value.sync="formData.keyWord" 
					dataType="paperCode"
				/>
				<v-table 
					is-horizontal-resize 
					:is-vertical-resize="true" 
					style="width:100%;" 
					:columns="config.table.paperCode.columns" 
					:table-data="config.list.paperCode" 
					row-hover-color="#eee" 
					row-click-color="#edf7ff"  
					even-bg-color="#fafafa" 
					:height="viewH - config.table.commonH">
				</v-table>
			</van-tab>
		</van-tabs>
	</div>
</template>

<script>
	/*vant组件*/
	import { Button, Tab, Tabs, NoticeBar } from "vant"
	/*自定义翻页组件*/
	import KarryPrevNext from "@/components/karry/prevNext/KarryPrevNext.vue"
	/*api接口*/
	import { fetchList } from "@/api/staff/paper.js"
	import { fetchColList } from "@/api/common/tableColumn.js"
	
	export default {
		components: {
			[Button.name]: Button,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			[NoticeBar.name]: NoticeBar,

			KarryPrevNext
		},
		data() {
			return {
				/*配置*/
				config: {
					noticeBar: {
						text: ''
					},
					/*表格配置*/
					table: {
						paperWidth: {
							columns: []
						},
						paperCode: {
							columns: []
						},
						commonH: 144
					},
					/*翻页配置*/
					prevNext: {
						paperWidth: [],
						paperCode: []
					},
					/*表格数据*/
					list: {
						paperWidth: [],
						paperCode: []
					}
				},
				/*筛选条件*/
				formData: {
					/*数据类型 3->原纸库存页面参数 4->原纸库存列表数据*/
					dataType: 3,
					/**
					 * 数据分类
					 * 1->按门幅汇总 2->按纸类汇总
					 */
					ordState: 1,
					/*选中关键词*/
					keyWord: null
				},
			}
		},
		async created() {
			await this.$store.commit('staff/setHeaderTitle', '原纸库存')
		},
		async mounted() {
			await this.setColums()
			await this.getConfig()
		},
		watch: {
			async keyWordChange(nVal, oVal) {
				if( nVal ) {
					await this.fetchData()
				}
			}
		},
		computed: {
			...window.Vuex.mapGetters({
				viewH: 'page/viewH'
			}),
			keyWordChange() {
				return this.formData.keyWord
			}
		},
		methods: {
			/*头部tabs改变*/
			change( name, index ) {
				this.formData.keyWord = this.$options.data().formData.keyWord
				setTimeout(async ()=>{
					if( this.formData.ordState == 1 ) {
						await this.$refs.paperWidth.complete(this.config.prevNext.paperWidth)
					} else {
						await this.$refs.paperCode.complete(this.config.prevNext.paperCode)
					}
				},200)
			},
			/*设置表格列信息*/
			async setColums() {
				const { result } = await fetchColList({tableName: 108})
				this.config.table.paperWidth.columns = result.paperWidth
				this.config.table.paperCode.columns = result.paperCode
			},
			/*获取页面参数*/
			async getConfig() {
				this.config.prevNext = this.$options.data().config.prevNext
				this.formData.dataType = 3
				const { result } = await fetchList(this.formData)
				this.config.prevNext.paperWidth = result.paperWidth
				this.config.prevNext.paperCode = result.paperCode
				if( this.formData.ordState == 1 ) {
					await this.$refs.paperWidth.complete(result.paperWidth)
				} else {
					await this.$refs.paperCode.complete(result.paperCode)
				}
				this.config.noticeBar.text = '原纸总库存:' + result.total
			},
			/*获取页面数据*/
			async fetchData() {
				this.formData.dataType = 4
				if( this.formData.ordState == 1 ) {
					this.config.list.paperWidth = this.$options.data().config.list.paperWidth
				} else {
					this.config.list.paperCode = this.$options.data().config.list.paperCode
				}
				const { result } = await fetchList(this.formData)
				if( this.formData.ordState == 1 ) {
					this.config.list.paperWidth = result
				} else {
					this.config.list.paperCode = result
				}
			}
		},
	}
</script>