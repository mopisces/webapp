<!-- 常用订单 -->
<template>
	<div class="page-color">
		<!-- 头部 -->
		<van-sticky :offset-top="46">
			<van-tabs v-model="formData.ordType" @change="change">
				<van-tab title="简单纸板" name="s"></van-tab>
				<van-tab title="纸箱纸板" name="c"></van-tab>
				<van-tab title="纸箱" name="x"></van-tab>
			</van-tabs>
		</van-sticky>
		<!-- 数据列表 -->
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
					:title="item.cusPoNo"
					:is-shadow="true"
					v-for="(item,index) in config.indexList"
					:key="index"
				>
					<div class="card-body-container">
						<div class="card-body-item card-body-item-100">
							<div>订单标识:
								<van-tag 
									class="mg-left-20" 
									plain 
									type="success"
								>
									{{ item.cardFlag }}
								</van-tag>
								<van-tag 
									v-if="item.usePay == 1"
									class="mg-left-20" 
									mark 
									type="primary"
								>
									需要下单后支付
								</van-tag>
							</div>
						</div>
						<div 
							v-if=" formData.ordType === 's' || formData.ordType === 'c' "
							class="card-body-item card-body-item-100"
						>
							<span>纸板规格:
								<span class="mg-left-20">{{ item.length }}×{{ item.width }}</span>
								<span class="mg-left-20">{{ item.boardId }}</span>
							</span>
						</div>
						<div 
							v-if="formData.ordType === 'c'" 
							class="card-body-item card-body-item-100"
						>
							<span>箱型信息:
								<span class="mg-left-20">{{ item.boxName || '暂无箱型信息' }}</span>
							</span>
						</div>
						<div 
							v-if=" formData.ordType === 'c' "
							class="card-body-item card-body-item-100"
						>
							<span>纸箱规格:
								<span class="mg-left-20">{{ item.boxL }}×{{ item.boxW }}×{{ item.boxH }}</span>
							</span>
						</div>
						<div 
							v-if="formData.ordType === 'x'" 
							class="card-body-item card-body-item-100"
						>
							<span>套件信息:
								<span class="mg-left-20">{{ item.productName || '暂无套件信息' }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>订单总数:
								<span class="mg-left-20">{{ item.ordQty }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<span>送货地址:
								<span class="mg-left-20">{{ item.subDNAddress }}</span>
							</span>
						</div>
						<div class="card-body-item card-body-item-100">
							<div class="card-body-txt green-color">下单</div>|
							<div class="card-body-txt red-color">交货</div>:
							<span class="mg-left-20 green-color">{{ item.buildDate }}</span>
							<span class="mg-left-20 red-color">{{ item.deliveryDate }}</span>
						</div>
					</div>
					<div slot="actions" class="card-actions">
						<div 
							class="card-actions-item" 
							@click="doCancel( item )"
						>
							<van-icon color="#f56c6c" name="star-o" size="18"/>
							<span class="card-actions-item-text yellow-color">取消常用</span>
						</div>
						<div 
							class="card-actions-item" 
							@click="doBuild( item )"
						>
							<van-icon color="#3c9cff" class-prefix="iconfont" name="xiadan" size="18"/>
							<span class="card-actions-item-text blue-color">快速下单</span>
						</div>
					</div>
				</card>
			</van-list>
		</van-pull-refresh>
	</div>
</template>

<script>
	/*vant组件*/
	import { Button, Icon, Dialog, PullRefresh, Toast, List, Panel, Sticky, Tag, Tab, Tabs } from "vant"
	/*自定义卡片组件*/
	import Card from "@/components/subject/card/Card.vue"
	/*api接口*/
	import { fetchList, doOpData } from "@/api/client/customer.js"

	export default {
		components: {
			[Button.name]: Button,
			[Icon.name]: Icon,
			[PullRefresh.name]: PullRefresh,
			[Toast.name]: Toast,
			[List.name]: List,
			[Panel.name]: Panel,
			[Sticky.name]: Sticky,
			[Tag.name]: Tag,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,

			Card
		},
		data() {
			return {
				/*配置*/
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
				},
				/*筛选条件*/
				formData: {
					/**
					 * 数据类型
					 * 22->常用订单
					 */
					dataType: 22,
					/**
					 * 订单类型
					 * s->简单纸板 c->纸箱纸板 x->纸箱
					 */
					ordType: 's',
					//分页大小
					pageSize: 6,
					//分页当前页
					pageNo: 1
				},
			}
		},
		created() {
			this.$store.commit('client/setHeaderTitle', '常用订单')
		},
		async mounted() {
			await this.fetchData()
		},
		methods: {
			/*头部标签改变*/
			async change(name, title) {
				await window.scrollTo(0, 0)
				this.config.indexList = this.$options.data().config.indexList
				await this.fetchData()
			},
			/*获取列表数据*/
			async fetchData() {
				try {
					const { result } = await fetchList(this.formData)
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
			},
			/*下拉刷新*/
			async pullOnRefresh() {
				this.formData.pageNo = 1
				await this.fetchData()
				this.config.pullRefresh.reloading = false
			},
			/*上拉加载*/
			async onLoad() {
				this.formData.pageNo++
				await this.fetchData()
			},
			/*取消常用订单*/
			async doCancel( rowData ) {
				const { result } = await doOpData({
					//10->取消常用订单
					dataType: 10,
					cusPoNo: rowData.cusPoNo
				})
				Toast({
					type: 'success',
					message: '取消成功',
					duration: 2000,
					onClose: async ()=> {
						await this.pullOnRefresh()
					}
				})
			},
			/*快速下单*/
			doBuild( rowData ) {
				if( rowData.usePay == 1 ) {
					switch( rowData.cType ){
						case 's' :
							this.$router.push({ name:'sBuildPay', params: { orderId: rowData.cusPoNo, buildType: 2 } })
							break;
						case 'c' :
							this.$router.push({ name:'cBuildPay', params: { orderId: rowData.cusPoNo, buildType: 2 } })
							break;
						default : 
							Toast.fail('非法的订单类型');
					}
				} else {
					switch( rowData.cType ){
						case 's' :
							this.$router.push({ name:'sBuild', params: { orderId: rowData.cusPoNo, buildType: 2 } })
							break;
						case 'c' :
							this.$router.push({ name:'cBuild', params: { orderId: rowData.cusPoNo, buildType: 2 } })
							break;
						case 'x' : 
							this.$router.push({ name:'xBuild', params: { orderId: rowData.cusPoNo, buildType: 2 } })
							break;
						default : 
							Toast.fail('非法的订单类型');
					}
				}
			},
		}
	}
</script>

<style type="text/css">
	@import '~@/assets/style/card.css';
</style>