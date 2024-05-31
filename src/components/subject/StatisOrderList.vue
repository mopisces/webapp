<template>
	<div>
		<van-popup v-model="popupShow" :style="{ height: '100%', width:'100%' }" position="bottom">
			<van-sticky>
				<div class="van-nav-bar van-hairline--bottom" style="z-index: 1;">
					<div class="van-nav-bar__left">
						<span class="van-nav-bar__text">统计下的ERP订单</span>
					</div>
					<div class="van-nav-bar__title van-ellipsis"></div>
					<div class="van-nav-bar__right" @click="closeClick">
						<i class="van-icon van-icon-cross" style="font-size: 16px;"><!----></i>
					</div>
				</div>
				<van-notice-bar color="#1989fa" background="#ecf9ff">
					<span>统计类型:{{ statisFomatter(filterForm.sType) }}&nbsp;&nbsp;</span>
					<span v-if="filterForm.limitValue">条件对象:{{ factorFormatter(filterForm.limitFactor) }}&nbsp;&nbsp;</span>
					<span v-if="filterForm.limitValue">条件值:{{ filterForm.limitValue }}&nbsp;&nbsp;</span>
					<span >日期类型:{{ dateFomatter(filterForm.dateType) }}&nbsp;&nbsp;</span>
					开始日期:{{ filterForm.beginDate }}&nbsp;&nbsp;
					结束日期:{{ filterForm.endDate }}&nbsp;&nbsp;
					<span v-if="filterForm.remainDay">出库超期天数:{{ filterForm.remainDay }}&nbsp;&nbsp;</span>
					<span v-if="filterForm.diffDay">交货超期天数:{{ filterForm.diffDay }}</span>
				</van-notice-bar>
			</van-sticky>
			<van-pull-refresh class="page-color" v-model="pullRefresh.reloading" @refresh="pullOnRefresh">
				<van-list v-model="pushLoading.loading" :finished="pushLoading.finished"  finished-text="没有更多了" @load="onLoad">
					<card 
						v-for="(item,index) in listInfo" 
						:key="index"
						:title="item.strOrderId"
						:extra="item.CusPoNo"
						:subTitle="item.CusShortName+'('+item.CusId+')'"
						:is-shadow="true"
						@click="detailOnClick(item)"
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
							<div class="card-actions-item" @click="detailOnClick(item)">
								<van-icon color="#3c9cff" class-prefix="iconfont" name="caidan" size="18"/>
								<span class="card-actions-item-text blue-color">详情</span>
							</div>
						</div>
					</card>
					<!-- <van-panel v-for="(item,index) in listInfo" :key="index" style="font-size:0.8125rem;background-color:#f5f7fa;margin:0 0.5rem 0.1rem 0.5rem;">
						<div slot="default" style="padding:0.5rem;">
							<van-row type="flex" justify="center">
								<van-col span="20"  style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">货品名称:{{ item.MatName }}</van-col>
							</van-row>
							<van-row type="flex" justify="center">
								<van-col span="20"  style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">订单编号:{{ item.strOrderId }}</van-col>
							</van-row>
							<van-row type="flex" justify="center">
								<van-col span="10"  style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">客订单号:{{ item.CusPoNo }}</van-col>
								<van-col span="10"  style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">材质:{{ item.BoardId }}</van-col>
							</van-row>
							<van-row type="flex" justify="center">
								<van-col span="10" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">客户:{{ item.CusId }}</van-col>
								<van-col span="10"  style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">客户简称:{{ item.CusShortName }}</van-col>
							</van-row>
							<van-row type="flex" justify="center">
								<van-col span="20" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">规格:{{ item.GuiGe }}</van-col>
							</van-row>
							<van-row type="flex" justify="center">
								<van-col span="20" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">压线:{{ item.ScoreInfo }}</van-col>
							</van-row>
							<van-row type="flex" justify="center">
								<van-col span="10" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">订单数:{{ item.OrdQty }}</van-col>
								<van-col span="10" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">送货数:{{ item.DeliQty }}</van-col>
							</van-row>
							<van-row type="flex" justify="center">
								<van-col span="20"  v-if=" type === 'stockQty' ">库存数:{{ item.StockQty }}</van-col>
								<van-col span="20"  v-if=" type === 'returnQty' ">退货数:{{ item.ReturnQty }}</van-col>
							</van-row>
						</div>
						<div slot="footer" style="text-align: right;">
							<van-button size="mini" type="info" @click="detailOnClick(item)">详情</van-button>
						</div>
					</van-panel> -->
				</van-list>
			</van-pull-refresh>
		</van-popup>
		<order-detail :orderType="orderDetail.orderType" :orderId="orderDetail.orderId" :detailShow.sync="orderDetail.show"></order-detail>
	</div>
</template>
<script>
	import { Button, Icon, Row, Col, Popup, PullRefresh, List, NoticeBar, Panel, Sticky  } from 'vant';
	import OrderDetail from '@/components/subject/OrderDetail.vue';
	import Card from '@/components/subject/card/Card.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Row.name]: Row,
			[Col.name]: Col,
			[Popup.name]: Popup,
			[PullRefresh.name]: PullRefresh,
			[List.name]: List,
			[NoticeBar.name]: NoticeBar,
			[Panel.name]: Panel,
			[Sticky.name]: Sticky,

			OrderDetail,
			Card
		},
		props:['show','filterForm','type'],
		data(){
			return {
				popupShow : this.show,
				pullRefresh:{
					reloading : false,
				},
				pushLoading:{
					loading  : false,
					finished : false
				},
				listInfo : [],
				formData:{
					curPage : 0,
				},
				orderDetail:{
					show      : false,
					orderId   : '',
					orderType : ''
				},
				noticeStr:{
					limitValue : ''
				},
			}
		},
		methods:{
			statisDetail(){
				let self = this;
				let data = {
					curPage   : this.formData.curPage,
					sType     : this.filterForm.sType,
					dateType  : this.filterForm.dateType,
					beginDate : this.filterForm.beginDate,
					endDate   : this.filterForm.endDate,
					remainDay : this.filterForm.remainDay ? this.filterForm.remainDay : '',
					diffDay   : this.filterForm.diffDay ? this.filterForm.diffDay : ''
				};
				if( this.filterForm.limitFactor ){
					data.limitFactor = this.filterForm.limitFactor;
					data.limitValue  = this.filterForm.limitValue;
				}
				this.$request.staff.statis.statisDetail( data ).then(res=>{
					res.result.forEach((item,index)=>{
						self.listInfo.push(item);
					});
					this.pushLoading.loading = false;
					if( res.result == null || res.result.length != 6 ){
						self.pushLoading.finished = true;
					}
				});
			},
			pullOnRefresh(){
				this.formData.curPage = 1;
				this.listInfo = [];
				this.statisDetail();
				this.pullRefresh.reloading = false;
			},
			onLoad(){
				this.formData.curPage++;
				this.statisDetail();
			},
			detailOnClick( item ){
				this.orderDetail.orderId = item.strOrderId.substring(1);
				this.orderDetail.orderType = item.strOrderId[0];
				this.orderDetail.show = true;
			},
			closeClick(){
				this.popupShow = false;
			},
			statisFomatter( sType ){
				switch( sType ){
					case 1 :
						return '订单统计';
						break;
					case 2 :
						return '退货统计';
						break;
					case 3 :
						return '库存统计';
						break;
					default:
						return '';
				}
			},
			dateFomatter( dateType ){
				switch( dateType ){
					case 1 :
						return '订单日期';
						break;
					case 2 :
						return '交货日期';
						break;
					case 3 :
						return '退货日期';
						break;
					case 4 :
						return '生效日期';
						break;
					default:
						return '';
				}
			},
			factorFormatter( factor ){
				switch( factor ){
					case 'flutes' :
						return '坑型';
						break;
					case 'cusId' :
						return '客户';
						break;
					case 'taskId' :
						return '业务员';
						break;
					case 'returnCause' :
						return '退货原因';
						break;
					default:
						return '汇总';
				}
			}
		},
		created(){
			
		},
		mounted(){

		},
		computed:{
			
		},
		watch:{
			show(newV,oldV){
				this.popupShow = newV;
			},
			popupShow(newV,oldV){
				this.$emit("update:show", newV);
			}
		}
	}
</script>
<style type="text/css">
	@import '~@/assets/style/card.css';
</style>
