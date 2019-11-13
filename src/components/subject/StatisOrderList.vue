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
			<van-pull-refresh v-model="pullRefresh.reloading" @refresh="pullOnRefresh">
				<van-list v-model="pushLoading.loading" :finished="pushLoading.finished"  finished-text="没有更多了" @load="onLoad">
					<van-panel v-for="(item,index) in listInfo" :key="index">
						<div slot="default">
							<van-row type="flex" justify="center">
								<van-col span="20">货品名称:{{ item.MatName }}</van-col>
							</van-row>
							<van-row type="flex" justify="center">
								<van-col span="20">订单编号:{{ item.strOrderId }}</van-col>
							</van-row>
							<van-row type="flex" justify="center">
								<van-col span="10">客订单号:{{ item.CusPoNo }}</van-col>
								<van-col span="10">材质:{{ item.BoardId }}</van-col>
							</van-row>
							<van-row type="flex" justify="center">
								<van-col span="10">客户:{{ item.CusId }}</van-col>
								<van-col span="10">客户简称:{{ item.CusShortName }}</van-col>
							</van-row>
							<van-row type="flex" justify="center">
								<van-col span="20">规格:{{ item.GuiGe }}</van-col>
							</van-row>
							<van-row type="flex" justify="center">
								<van-col span="20">压线:{{ item.ScoreInfo }}</van-col>
							</van-row>
							<van-row type="flex" justify="center">
								<van-col span="8">订单数:{{ item.OrdQty }}</van-col>
								<van-col span="6">送货数:{{ item.DeliQty }}</van-col>
								<van-col span="6"  v-if=" type === 'stockQty' ">库存数:{{ item.StockQty }}</van-col>
								<van-col span="6"  v-if=" type === 'returnQty' ">退货数:{{ item.ReturnQty }}</van-col>
							</van-row>
						</div>
						<div slot="footer" style="text-align: right;">
							<van-button size="small" type="info" @click="detailOnClick(item)">详情</van-button>
						</div>
					</van-panel>
				</van-list>
			</van-pull-refresh>
		</van-popup>
		<order-detail :orderType="orderDetail.orderType" :orderId="orderDetail.orderId" :detailShow.sync="orderDetail.show"></order-detail>
	</div>
</template>
<script>
	import { Button, Row, Col, Popup, PullRefresh, List, NoticeBar, Panel, Sticky  } from 'vant';
	import OrderDetail from '@/components/subject/OrderDetail.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Row.name]: Row,
			[Col.name]: Col,
			[Popup.name]: Popup,
			[PullRefresh.name]: PullRefresh,
			[List.name]: List,
			[NoticeBar.name]: NoticeBar,
			[Panel.name]: Panel,
			[Sticky.name]: Sticky,

			OrderDetail
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
				};
				if( this.filterForm.limitFactor ){
					data.limitFactor = this.filterForm.limitFactor;
					data.limitValue  = this.filterForm.limitValue;
				}
				console.log(this.formData.curPage);
				this.$request.staff.statis.statisDetail( data ).then(res=>{
					res.result.forEach((item,index)=>{
						self.listInfo.push(item);
					});
					this.pushLoading.loading = false;
					if( res.result == null || res.result.length != 6 ){
						self.pushLoading.finished = true;
					}
				}).then(()=>{
					
				});
			},
			pullOnRefresh(){
				this.formData.curPage = 1;
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