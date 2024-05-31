<!-- 统计模块订单列表 -->
<template>
	<div class="page-color" :style="'min-height: '+ viewH/16 +'rem;'">
		<van-pull-refresh 
			v-model="config.pullRefresh.reloading" 
			@refresh="pullOnRefresh"
		>
			<van-list 
				v-model="config.list.loading" 
				:finished="config.list.finished" 
				finished-text="没有更多了" 
				:immediate-check="false"
				@load="onLoad"
			>
				<card 
					v-for="(item,index) in config.indexList" 
					:key="index"
					:title="item.strOrderId"
					:extra="item.CusPoNo"
					:subTitle="item.CusShortName+'('+item.CusId+')'"
					:is-shadow="true"
				>
					<div class="card-body-container">
						<div 
							v-if="item.MatName"
							class="card-body-item card-body-item-100"
						>
							<span>货品名称:
								<span class="mg-left-20">{{ item.MatName }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>规格信息:
								<span class="mg-left-20">{{ item.GuiGe }}</span>
								<span class="mg-left-20">{{ item.BoardId }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>压线信息:
								<span class="mg-left-20">{{ item.ScoreInfo }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<div class="card-body-txt blue-color">订单</div>|
							<div class="card-body-txt green-color">送货:</div>
							<span class="mg-left-20 red-color">{{ item.OrdQty }}</span>
							<span class="mg-left-20 green-color">{{ item.DeliQty }}</span>
						</div>
						<div
							v-if=" type === 'stockQty' " 
							class="card-body-item card-body-item-100"
						>
							<span>库存数量:
								<span class="mg-left-20">{{ item.StockQty }}</span>
							</span>
						</div>
						<div 
							v-if=" type === 'returnQty' "
							class="card-body-item card-body-item-100"
						>
							<span>退货数量:
								<span class="mg-left-20">{{ item.ReturnQty }}</span>
							</span>
						</div>
					</div>
					<div slot="actions" class="card-actions">
						<div class="card-actions-item" @click="detailClick(item)">
							<van-icon color="#3c9cff" class-prefix="iconfont" name="caidan" size="18"/>
							<span class="card-actions-item-text blue-color">详情</span>
						</div>
					</div>
				</card>
			</van-list>
		</van-pull-refresh>
		<!-- 订单详细信息 -->
		<ord-desc 
			:detailShow.sync="config.ordDesc.show"
			:cusOrderId="config.ordDesc.cusOrderId"
		></ord-desc>
	</div>
</template>

<script>
	/*vant组件*/
	import { Icon, PullRefresh, List, NoticeBar, Sticky  } from "vant"
	/*自定义卡片组件*/
	import Card from "@/components/subject/card/Card.vue"
	/*自定义订单详细信息组件*/
	import OrdDesc from "@/components/karry/ordDesc/OrdDesc.vue"
	/*api接口*/
	import { fetchDetailList } from "@/api/staff/statis.js"
	export default {
		components: {
			[Icon.name]: Icon,
			[PullRefresh.name]: PullRefresh,
			[List.name]: List,
			[NoticeBar.name]: NoticeBar,
			[Sticky.name]: Sticky,

			OrdDesc,
			Card
		},
		data() {
			return {
				/*页面配置*/
				config: {
					/*下拉刷新*/
					pullRefresh: {
						reloading: false
					},
					/*上拉加载*/
					list: {
						loading: false,
						finished: false
					},
					/*数据列表*/
					indexList: [],
					/*订单详细信息*/
					ordDesc: {
						show: false,
						cusOrderId: null,
					}
				},
				/*筛选条件*/
				formData: {
					//日期类型
					dateType: 0,
					//开始日期
					beginDate: null,
					//结束日期
					endDate: null,
					//筛选条件 0->门幅 1->客户 2->业务员 3->退货原因 
					filterName: 0,
					//筛选内容
					filterVal: null,
					//存储过程GetOrders的类型 1->GetOrderSum 2->GetOrdReturnSum 3->GetOrdStock
					getOrdersType: null,
					//在库超期天数
					remainDay: 0,
					//交货超期天数
					diffDay: 0,
					//分页大小
					pageSize: 4,
					//分页当前页
					pageNo: 1
				}
			}
		},
		async mounted() {
			await this.$store.commit('staff/setHeaderTitle', '统计订单信息')
			if( this.$route.query ) {
				this.formData = Object.assign({}, this.$options.data().formData, this.$route.query)
				await this.onLoad()
			} else {
				this.$router.replace('/staff/index/menu')
			}
		},
		computed: {
			...window.Vuex.mapGetters({
				viewH: 'page/viewH'
			})
		},
		methods: {
			/*详细信息*/
			detailClick(item) {
				this.config.ordDesc.show = true
				this.config.ordDesc.cusOrderId = item.orderType + item.orderId
			},
			/*下拉刷新*/
			async pullOnRefresh() {
				this.formData.pageNo = 1
				await this.fetchList()
				this.config.pullRefresh.reloading = false
			},
			/*上拉加载*/
			async onLoad() {
				this.formData.pageNo++
				await this.fetchList()
			},
			/*获取列表数据*/
			async fetchList() {
				try {
					const { result } = await fetchDetailList(this.formData)
					if( this.formData.pageNo == 1 ) {
						this.config.indexList = result
					} else {
						result.forEach((item,index)=>{
							this.config.indexList.push(item)
						})
					}
					if( result.length < this.formData.pageSize ) {
						this.config.list.finished = true
					} else {
						this.config.list.finished = false
					}
				} catch( err ) {
					this.config.list.finished = true
				} finally {
					this.config.list.loading = false
				}
			}
		}
	}
</script>

<style type="text/css">
	@import '~@/assets/style/card.css';
</style>