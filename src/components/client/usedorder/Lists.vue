<template>
	<div>
		<van-sticky :offset-top="46">
			<van-tabs v-model="filterForm.orderType">
				<van-tab title="简单纸板" name="s"></van-tab>
				<van-tab title="纸箱纸板" name="c"></van-tab>
				<van-tab title="纸箱"     name="x"></van-tab>
			</van-tabs>
		</van-sticky>
		<van-pull-refresh v-model="config.list.pullRefresh.reloading" @refresh="pullOnRefresh">
			<van-list v-model="config.list.pushLoading.loading" :finished="config.list.pushLoading.finished"  finished-text="到底了" @load="onLoad" :offset="100">
				<van-panel v-for="(item,index) in panelData" :key="index" style="font-size:0.8125rem;margin-top:0.8rem;background-color:#f5f5f5;">
					<div slot="header" style="padding:0.5rem;">
						<van-tag plain type="success" style="margin-left:1rem;margin-top:0.3125‬rem;font-size:0.75rem;">标识:{{ item.CardFlag }}</van-tag>
						<van-tag mark type="primary" style="margin-left:1rem;" v-if="item.UsePay == 1">需要下单后支付</van-tag>
					</div>
					<div slot="default" style="padding-left:1.5rem;padding-bottom:0.5rem;">
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--24">客订单号:&nbsp;{{ item.CusPoNo }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center"  v-if=" filterForm.orderType === 's' || filterForm.orderType === 'c' ">
							<div class="van-col van-col--24">材质&nbsp;&nbsp;:&nbsp;{{ item.BoardId }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center" v-if=" filterForm.orderType === 'c' ">
							<div class="van-col van-col--24">箱型:&nbsp;{{ item.BoxName }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center"  v-if=" filterForm.orderType === 'c' ">
							<div class="van-col van-col--24">
								纸箱规格:&nbsp;{{ item.BoxL }}&nbsp;x&nbsp;{{ item.BoxW }}&nbsp;x&nbsp;{{ item.BoxH }}
							</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center" v-if=" filterForm.orderType === 's' || filterForm.orderType === 'c' ">
							<div class="van-col van-col--24">纸板规格:&nbsp;{{ item.Length }}&nbsp;x&nbsp;{{ item.Width }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center" v-if=" filterForm.orderType === 'x' ">
							<div class="van-col van-col--24">套件:&nbsp;{{ item.ProductName }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--24">订单总数:&nbsp;{{ item.OrdQty }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--24">送货地址:&nbsp;{{ item.SubDNAddress }}</div>
						</div>
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--12">下单日期:&nbsp;{{ item.BuildDate }}</div>
							<div class="van-col van-col--12">交货日期:&nbsp;{{ item.DeliveryDate }}</div>
						</div>
					</div>
					<div slot="footer" style="text-align:right;">
						<van-button size="mini" plain type="danger" style="margin-right:15px;" @click="cancelClick( item.CusPoNo )">取消常用</van-button>
						<van-button size="mini" plain type="primary" @click="fastBuild( item )">快速下单</van-button>
					</div>
				</van-panel>
			</van-list>
		</van-pull-refresh>
	</div>
</template>
<script>
	import { Button, Dialog, PullRefresh, Toast, List, Panel, Sticky, Tag, Tab, Tabs } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[PullRefresh.name]: PullRefresh,
			[Toast.name]: Toast,
			[List.name]: List,
			[Panel.name]: Panel,
			[Sticky.name]: Sticky,
			[Tag.name]: Tag,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
		},
		data(){
			return {
				config:{
					list:{
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
				filterForm : {
					orderType : 's',
					curPage   : 0,
				},
				panelData : [],
			}
		},
		methods:{
			onLoad(){
				if( this.config.list.pullRefresh.isInit ){
					this.filterForm.curPage = 1;
					this.commonOrders( this.filterForm );
					this.config.list.pullRefresh.isInit = false;
				}else{
					this.filterForm.curPage++;
					this.commonOrders( this.filterForm );
				}
			},
			pullOnRefresh(){
				this.config.list.pullRefresh.reloading = false;
				this.config.list.pushLoading.finished  = false;
				this.config.list.pushLoading.loading   = true;;
				this.filterForm.curPage = 0;
				this.panelData = [];
				this.onLoad();
			},
			commonOrders( data ){
				let self = this;
				this.$request.client.ordersManage.commonOrders( data ).then(res=>{
					if( res.result == null || res.result.length < 5 ){
						self.config.list.pushLoading.finished = true;
					}
					self.config.list.pushLoading.loading = false;
					if( res.errorCode != '00000' ){
						return false;
					}
					res.result.forEach((item,index)=>{
						self.panelData.push(item);
					});
				});
			},
			cancelClick( orderId ){
				Dialog.confirm({
					message: '确认取消?'
				}).then(()=>{
					this.cancelCommon( orderId );
				}).catch(()=>{
					Dialog.close();
				});
			},
			cancelCommon( orderId ){
				let self = this;
				this.$request.client.ordersManage.cancelCommon( orderId ).then(res=>{
					if( res.errorCode === '00000' ){
						Toast.success(res.msg);
					}else{
						Toast.fail(res.msg);
					}
				}).then(()=>{
					this.$nextTick(()=>{
						this.pullOnRefresh();
					});
				});
			},
			fastBuild( item ){
				if( item.UsePay == 1 ){
					switch( item.CType ){
						case 's' :
							this.$router.push({ name:'sBuildPay', params: { orderId: item.CusPoNo, buildType: 2 } })
							break;
						case 'c' :
							this.$router.push({ name:'cBuildPay', params: { orderId: item.CusPoNo, buildType: 2 } })
							break;
						default : 
							Toast.fail('非法的订单类型');
					}
				}else{
					switch( item.CType ){
						case 's' :
							this.$router.push({ name:'sBuild', params: { orderId: item.CusPoNo, buildType: 2 } })
							break;
						case 'c' :
							this.$router.push({ name:'cBuild', params: { orderId: item.CusPoNo, buildType: 2 } })
							break;
						case 'x' : 
							this.$router.push({ name:'xBuild', params: { orderId: item.CusPoNo, buildType: 2 } })
							break;
						default : 
							Toast.fail('非法的订单类型');
					}
				}
				
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','常用订单');
		},
		mounted(){

		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			orderTypeChange(){
				return this.filterForm.orderType;
			}
		},
		watch:{
			orderTypeChange( newV,oldV ){
				this.pullOnRefresh();
			}
		}
	}
</script>