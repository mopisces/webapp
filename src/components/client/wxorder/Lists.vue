<template>
	<div>
		<van-sticky :offset-top="46">
			<van-button plain hairline type="info" size="small" style="width:100%" @click="config.popup.filterShow = true">筛选</van-button>
			<van-tabs v-model="filterForm.orderState">
				<van-tab title="未审核" name="1"></van-tab>
				<van-tab title="已审核" name="2"></van-tab>
				<van-tab title="已删除" name="3"></van-tab>
			</van-tabs>
		</van-sticky>
		<van-pull-refresh v-model="config.list.pullRefresh.reloading" @refresh="pullOnRefresh">
			<van-list v-model="config.list.pushLoading.loading" :finished="config.list.pushLoading.finished"  finished-text="没有更多了" @load="onLoad" :offset="100">
				<van-panel v-for="(item,index) in wxOrdersList" :key="index">
					<div slot="header" style="margin-left:20px;">
						<van-tag plain type="primary">
							{{ cTypeName(item.CType) }}
						</van-tag>
						<van-tag plain type="warning" v-if=" item.IsCard === '1' ">
							常用订单标识:{{ item.CardFlag }}
						</van-tag>
						<van-tag plain type="danger" v-if=" item.IsDel === '1' ">
							删除原因:{{ item.DelRemark }}
						</van-tag>
					</div>
					<div slot="default">
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--2"></div>
							<div class="van-col van-col--11">客订单号:{{ item.CusPoNo }}</div>
							<div class="van-col van-col--11">
								<span v-if=" item.CType === 's' || item.CType === 'c' ">材质:{{ item.BoardId }}</span>
								<span v-else-if=" item.CType === 'x' ">套件:{{ item.ProductId }}</span>
								<span v-else-if=" item.CType === 't' ">货品编号:{{ item.MatNo }}</span>
							</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center" v-if=" item.CType === 'c' ">
							<div class="van-col van-col--2"></div>
							<div class="van-col van-col--22">箱型:{{ item.BoxName }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center" v-if=" item.CType === 'c' ">
							<div class="van-col van-col--2"></div>
							<div class="van-col van-col--22">
								纸箱规格(mm):{{ item.BoxL }}&nbsp;x&nbsp;{{ item.BoxW }}&nbsp;x&nbsp;{{ item.BoxH }}
							</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center" v-if=" item.CType === 's' || item.CType === 'c' ">
							<div class="van-col van-col--2"></div>
							<div class="van-col van-col--22">
								纸板规格(mm):{{ item.Length }}&nbsp;x&nbsp;{{ item.Width }}
							</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center" v-if="item.CType === 'x'">
							<div class="van-col van-col--2"></div>
							<div class="van-col van-col--22">
								套件:{{ item.ProductName }}
							</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--2"></div>
							<div class="van-col van-col--22">订单数:{{ item.OrdQty }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center" v-if="item.CType === 's' || item.CType === 'c'">
							<div class="van-col van-col--2"></div>
							<div class="van-col van-col--22">下单面积(㎡):{{ item.Area }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--2"></div>
							<div class="van-col van-col--22">送货地址:{{ item.SubDNAddress }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--2"></div>
							<div class="van-col van-col--11">下单日期:{{ item.BuildDate }}</div>
							<div class="van-col van-col--11">交货日期:{{ item.DeliveryDate }}</div>
						</div>
					</div>
					<div slot="footer" style="text-align:right;">
						<van-button size="small" type="primary" @click="wxDetailClick(item.CusPoNo)">详情</van-button>
						<van-button size="small" type="danger" v-if="item.IsDel === '0' && item.Checked === '0' && ( item.IsGroup === '0' || item.UsePay === '0' || item.Paid === '0' || item.Refund === '1' ) ">删除</van-button>
					</div>
				</van-panel>
				
			</van-list>
		</van-pull-refresh>
		<wx-order-detail :detailShow.sync="config.popup.detailShow" :cusOrderId="detailForm.cusOrderId"></wx-order-detail>
	</div>
</template>
<script>
	import { Button,  PullRefresh, Toast, List, SwitchCell, Panel, Sticky, Tag, Tab, Tabs } from 'vant';
	import WxOrderDetail from '@/components/subject/client/WxOrderDetail.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import { cTypeChange } from '@/util/index';
	export default {
		components:{
			[Button.name]: Button,
			[PullRefresh.name]: PullRefresh,
			[Toast.name]: Toast,
			[List.name]: List,
			[SwitchCell.name]: SwitchCell,
			[Panel.name]: Panel,
			[Sticky.name]: Sticky,
			[Tag.name]: Tag,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,

			WxOrderDetail,
			NewTimePicker,
			PopupFilter
		},
		data(){
			return {
				config:{
					popup : {
						filterShow : false,
						timePicker : {
							isFinishLoad : false
						},
						detailShow : false
					},
					list : {
						pullRefresh : {
							reloading : false,
							isInit    : true
						},
						pushLoading : {
							loading  : false,
							finished : false
						}
					}
				},
				filterForm:{
					beginDate  : '2019-12-12',
					endDate    : '2019-12-20',
					dateType   : 0,
					groupBy    : 2,
					orderType  : 'all',
					orderState : '1',
					curPage    : 0,
				},
				detailForm : {
					cusOrderId : ''
				},
				wxOrdersList:[],
			}
		},
		methods:{
			onLoad(){
				if( this.config.list.pullRefresh.isInit ){
					this.filterForm.curPage = 1;
					this.getConfig();
					this.config.list.pullRefresh.isInit = false;
				}else{
					this.filterForm.curPage++;
					this.getWxOrders( this.filterForm );
				}
			},
			pullOnRefresh(){
				this.filterForm.curPage = 0;
				this.wxOrdersList       = [];
				this.config.list.pullRefresh.reloading = false;
				this.config.list.pushLoading.finished  = false;
				this.config.list.pushLoading.loading   = true;
				this.onLoad();
			},
			getConfig( isReset = false ){
				let self = this;
				this.$request.client.ordersManage.wechatOrdersConfig().then(res=>{
					console.log(res)
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.timePicker.isFinishLoad = true;
					});
				}).then(()=>{
					if( isReset ){
						return ;
					}
					this.$nextTick(()=>{
						this.getWxOrders( this.filterForm );
					});
				});
			},
			getWxOrders( data ){
				let self = this;
				this.$request.client.ordersManage.wechatOrders( data ).then(res=>{
					if( res.result == null || res.result.order_data.length < 7 ){
						self.config.list.pushLoading.finished = true;
					}
					self.config.list.pushLoading.loading = false;
					res.result.order_data.forEach((item,index)=>{
						self.wxOrdersList.push(item);
					});
				});
			},
			cTypeName( cType ){
				return cTypeChange( cType );
			},
			wxDetailClick( cusOrderId ){
				this.detailForm.cusOrderId   = cusOrderId;
				this.config.popup.detailShow = true;
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','微信订单');
		},
		mounted(){

		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			orderStateChange(){
				return this.filterForm.orderState;
			}
		},
		watch:{
			orderStateChange( newV,oldV ){
				this.pullOnRefresh();
			}
		}
	}
</script>