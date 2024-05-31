<!-- 信用余额 -->
<template>
	<div class="page-color cus-amt-pd" :style="'min-height: '+ viewH/16 +'rem;'">
		<card 
			:title="rowData.cusName"
			:extra="rowData.taskName"
			:subTitle="rowData.queryTime"
			:is-shadow="true"
		>
			<div class="card-body-container">
				<div class="card-body-item card-body-item-100">
					<div class="card-body-txt">是否停单:</div>
					<div v-if="rowData.stopped==1" class="mg-left-20">
						<van-icon color="#5ac725" class-prefix="iconfont" name="gou" size="16"/>
					</div>
					<div v-else class="mg-left-20">
						<van-icon color="#f56c6c" class-prefix="iconfont" name="guanbi" size="12"/>
					</div>
				</div>
				<div class="card-body-item card-body-item-100">
					<div class="card-body-txt">是否月结:</div>
					<div v-if="rowData.settleDay==1" class="mg-left-20">
						<van-icon color="#5ac725" class-prefix="iconfont" name="gou" size="16"/>
					</div>
					<div v-else class="mg-left-20">
						<van-icon color="#f56c6c" class-prefix="iconfont" name="guanbi" size="12"/>
					</div>
				</div>
				<div class="card-body-item card-body-item-100">
					<span>下单未送:
						<span class="mg-left-20 yellow-color">{{ rowData.ordNeedAmt }}元</span>
					</span>
				</div>
				<div class="card-body-item card-body-item-100">
					<span>信用额度:
						<span class="mg-left-20 green-color">{{ rowData.minAmtCond }}元</span>
					</span>
				</div>
				<div class="card-body-item card-body-item-100">
					<span>当前欠款:
						<span class="mg-left-20 red-color">{{ rowData.curAmt }}元</span>
					</span>
				</div>
				<div class="card-body-item card-body-item-100">
					<span>信用余额:
						<span class="mg-left-20 green-color">{{ rowData.leftMinAmtCond }}元</span>
					</span>
				</div>
			</div>
			<div slot="actions" class="card-actions">
				<div class="card-actions-item" @click="fetchData()">
					<van-icon color="#3c9cff" name="replay" size="18"/>
					<span class="card-actions-item-text blue-color">刷新</span>
				</div>
			</div>
		</card>
	</div>
</template>

<script>
	/*vant组件*/
	import { Icon } from 'vant';
	/*自定义卡片组件*/
	import Card from "@/components/subject/card/Card.vue"
	/*api接口*/
	import { fetchList } from "@/api/client/customer.js"

	export default {
		components: {
			[Icon.name]: Icon,

			Card
		},
		data() {
			return {
				/*页面数据*/
				rowData: {
					cusName: null,
					taskName: null,
					stopped: 0,
					settleDay: 0,
					ordNeedAmt: 0,
					minAmtCond: 0,
					curAmt: 0,
					leftMinAmtCond: 0,
					queryTime: null
				},
				/*筛选条件*/
				formData: {
					/**
					 * 数据类型
					 * 7->信用余额数据
					 */
					dataType: 7
				}
			}
		},
		async created() {
			await this.$store.commit('client/setHeaderTitle', '信用余额')
		},
		async mounted() {
			await this.fetchData()
		},
		computed: {
			...window.Vuex.mapGetters({
				viewH: 'page/viewH'
			})
		},
		methods: {
			async fetchData() {
				this.rowData = this.$options.data().rowData
				const { result } = await fetchList(this.formData)
				this.rowData = Object.assign({}, this.rowData, result)
			}
		}
	}
</script>

<style type="text/css">
	@import '~@/assets/style/card.css';

	.cus-amt-pd {
		padding-top: 0.5rem;
	}
</style>