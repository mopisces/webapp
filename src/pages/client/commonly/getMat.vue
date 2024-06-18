<!-- 常用材质 -->
<template>
	<div>
		<van-sticky :offset-top="46">
			<van-search placeholder="请输入搜索关键词" v-model="formData.keyWord" @search="search()" />
		</van-sticky>
		<van-checkbox-group v-model="opData.dataList">
			<van-cell-group>
				<van-cell 
					v-for="(item, index) in config.indexList" 
					:key="index" 
					:title="item" 
					clickable 
					@click="toggle(index)"
				>
					<div slot="title">
						{{ item.boardId }}
						<van-tag v-if=" item.boardName " type="danger" size="medium">
							{{ item.boardName }}
						</van-tag>
					</div>
					<van-checkbox ref="mat" slot="right-icon" :name="item.boardId" />
				</van-cell>
			</van-cell-group>
		</van-checkbox-group>
		<div class="box-item"></div>
		<div class="commonly-mat-footer">
			<van-row>
				<van-col span="16">
					<van-switch-cell v-model="formData.ordState" title="只显示已选择" @change="stateChange"/>
				</van-col>
				<van-col span="8">
					<van-button class="commonly-mat-footer-btn" type="primary" @click="doUpdate()">保存</van-button>
				</van-col>
			</van-row>
		</div>
	</div>
</template>

<script>
	/*vant组件*/
	import { Button, Cell, CellGroup, Col, Row, Checkbox, CheckboxGroup, Search, SwitchCell, Toast, Sticky, Tag } from "vant"
	/*api接口*/
	import { fetchList, doOpData } from "@/api/client/customer.js"
	export default {
		components: {
			[Button.name]: Button,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Col.name]: Col,
			[Row.name]: Row,
			[Checkbox.name]: Checkbox,
			[CheckboxGroup.name]: CheckboxGroup,
			[Search.name]: Search,
			[SwitchCell.name]: SwitchCell,
			[Toast.name]: Toast,
			[Sticky.name]: Sticky,
			[Tag.name]: Tag,
		},
		data() {
			return {
				/*配置*/
				config: {
					/*页面数据*/
					indexList: [],
				},
				/*筛选条件*/
				formData: {
					/**
					 * 数据类型
					 * 23->常用材质
					 */
					dataType: 23,
					/**
					 * 订单分类
					 * 0->显示全部 1->显示已选择
					 */
					ordState: 0,
					/*搜索关键词*/
					keyWord: null,
				},
				opData: {
					//数据类型 11->保存常用材质
					dataType: 11,
					//常用材质
					dataList: []
				},
			}
		},
		created() {
			this.$store.commit('client/setHeaderTitle', '常用材质')
		},
		async mounted() {
			await this.fetchData()
		},
		methods: {
			/*checkbox点击*/
			toggle(index){
				this.$refs.mat[index].toggle()
			},
			/*获取列表数据*/
			async fetchData() {
				const { result } = await fetchList({
					dataType: 23,
					ordState: this.formData.ordState?1:0,
					keyWord: this.formData.keyWord
				})
				this.opData.dataList = result.selected
				this.config.indexList = result.list
			},
			/*头部送搜索*/
			async search() {
				await this.fetchData()
			},
			/*底部状态切换*/
			async stateChange(checked) {
				await this.fetchData()
			},
			/*保存*/
			async doUpdate() {
				const { result, msg } = await doOpData(this.opData)
				Toast({
					type: 'success',
					message: msg,
					duration: 2000,
					onClose: async ()=> {
						await this.fetchData()
					}
				})
			}
		},
	}
</script>

<style>
	.commonly-mat-footer {
		position: fixed;
		bottom: 3.125rem;
		width: 100%;
		background-color: #fff;
	}

	.commonly-mat-footer-btn {
		width: 100%;
		height: 2.5rem;
		border: none; 
	}

	.van-button {
		height: 2.5rem !important;
	}

	.van-search {
		padding: 0rem 0.8rem 0.2rem 0.8rem !important;
	}

	.box-item {
		width: 100%;
		height: 2.5rem;
	}
</style>