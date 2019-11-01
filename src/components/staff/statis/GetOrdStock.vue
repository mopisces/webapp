<template>
	<div>
		<van-sticky :offset-top="46">
			<van-dropdown-menu>
				<van-dropdown-item v-model="filterInfo.statisType" :options="config.dropMenu.options.statisType" />
				<van-dropdown-item v-model="filterInfo.statisMethod" :options="config.dropMenu.options.statisMethod" @change="statisMethodChange" />
				<van-dropdown-item v-model="filterInfo.chartType" :options="config.dropMenu.options.chartType" :disabled="config.dropMenu.disabled" />
				<van-dropdown-item v-model="filterInfo.chartProp" :options="config.dropMenu.options.chartProp" :disabled="config.dropMenu.disabled" />
			</van-dropdown-menu>
			<van-button plain hairline type="info" size="normal" style="width:50%;" @click="onRefresh()">刷新</van-button>
			<van-button plain hairline type="info" size="normal" style="width:50%;" @click="config.popup.filterShow = true">筛选</van-button>
		</van-sticky>
		<van-panel v-for="(item,index) in info.panelList" :key="index">
			<div slot="default">
				<div class="van-row van-row--flex van-row--justify-center">
					<div class="van-col van-col--10">客户编号:{{ item.CusId }}</div>
					<div class="van-col van-col--10">客户简称:{{ item.CusShortName }}</div>
				</div>
				<div class="van-row van-row--flex van-row--justify-center">
					<div class="van-col van-col--10">库存数:{{ item.StockQty }}</div>
					<div class="van-col van-col--10">库存面积:{{ item.StockArea }}</div>
				</div>
				<div class="van-row van-row--flex van-row--justify-center">
					<div class="van-col van-col--10">库存金额:{{ item.StockAmt }}</div>
					<div class="van-col van-col--10">总数:{{ item.sumCount }}</div>
				</div>
			</div>
			<div slot="footer" style="text-align: right;">
				<van-button size="small" type="info" @click="config.popup.listShow = true">订单</van-button>
			</div>
		</van-panel>
		<van-popup v-model="config.popup.listShow" position="bottom" :style="{ height: '100%' }">
			<van-nav-bar left-text="统计下的ERP订单" @click-right="config.popup.listShow = false" >
				<van-icon name="cross" slot="right" size="16"/>
			</van-nav-bar>
			<van-notice-bar color="#1989fa" background="#ecf9ff">
				统计类型:库存统计&nbsp;&nbsp;条件对象:{{ filterInfo.statisType }}&nbsp;&nbsp;日期类型:{{  }}&nbsp;&nbsp;开始日期:{{  }}&nbsp;&nbsp;结束日期:{{  }}&nbsp;&nbsp;出库超期天数:{{  }}&nbsp;&nbsp;交货超期天数:{{  }}
			</van-notice-bar>
			<van-pull-refresh v-model="config.list.pullRefresh.reloading" @refresh="pullOnRefresh">
				<van-list v-model="config.list.pushLoading.loading" :finished="config.list.pushLoading.finished"  finished-text="没有更多了" @load="onLoad">
					<van-panel v-for="(item,index) in info.popupList" :key="index">
						<div slot="default">
							<div class="van-row van-row--flex van-row--justify-center">
								<div class="van-col van-col--20">货品名称:{{ item.MatName }}</div>
							</div>
							<div class="van-row van-row--flex van-row--justify-center">
								<div class="van-col van-col--20">订单编号:{{ item.strOrderId }}</div>
							</div>
							<div class="van-row van-row--flex van-row--justify-center">
								<div class="van-col van-col--10">客订单号:{{ item.CusPoNo }}</div>
								<div class="van-col van-col--10">材质:{{ item.BoardId }}</div>
							</div>
							<div class="van-row van-row--flex van-row--justify-center">
								<div class="van-col van-col--10">客户:{{ item.CusId}}</div>
								<div class="van-col van-col--10">客户简称:{{ item.CusShortName }}</div>
							</div>
							<div class="van-row van-row--flex van-row--justify-center">
								<div class="van-col van-col--20">规格:{{ item.GuiGe }}</div>
							</div>
							<div class="van-row van-row--flex van-row--justify-center">
								<div class="van-col van-col--20">压线:{{ item.ScoreInfo }}</div>
							</div>
							<div class="van-row van-row--flex van-row--justify-center">
								<div class="van-col van-col--6">订单数:{{ item.OrdQty }}</div>
								<div class="van-col van-col--6">送货数:{{ item.DeliQty }}</div>
								<div class="van-col van-col--6">库存数:{{ item.StockQty }}</div>
							</div>
						</div>
						<div slot="footer" style="text-align: right;">
							<van-button size="small" type="info" @click="detailOnClick(item.strOrderId)">详情</van-button>
						</div>
					</van-panel>
				</van-list>
			</van-pull-refresh>
		</van-popup>
		<van-popup v-model="config.popup.detailShow" position="right" :style="{ width: '100%',height:'100%' }">
			<van-nav-bar left-text="统计下的ERP订单" @click-right="config.popup.detailShow = false" >
				<van-icon name="cross" slot="right" size="16"/>
			</van-nav-bar>
			<order-detail :orderType="detailData.orderType" :orderId="detailData.orderId"></order-detail>
		</van-popup>
		<!-- <popup-status :show="config.popup.detailShow" @statusCloseClick="statusCloseClick" :statisType="statisType" :chartType="chartType" :chartProperties="chartProperties"></popup-status> -->
	</div>
</template>
<script>
	import { Button, Cell, Icon, Popup, DropdownMenu, DropdownItem, PullRefresh, List,NoticeBar, Panel, Sticky, NavBar } from 'vant';
	import OrderDetail from '@/components/subject/OrderDetail.vue';
	//import PopupStatus from '@/components/subject/PopupStatus.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[DropdownMenu.name]: DropdownMenu,
			[DropdownItem.name]: DropdownItem,
			[PullRefresh.name]: PullRefresh,
			[List.name]: List,
			[NoticeBar.name]: NoticeBar,
			[Panel.name]: Panel,
			[Sticky.name]: Sticky,
			[NavBar.name]: NavBar,

			OrderDetail,
			//PopupStatus
		},
		data(){
			return {
				chartProperties:[
					{text:'ccc',value:'ccc'},
					{text:'ddd',value:'ddd'},
					{text:'eee',value:'eee'}
				],
				chartType:['3D饼状图','饼状图','直线图','走势图'],
				statisType:[
					{text:'aaa',value:'a'},
					{text:'bbb',value:'b'},
					{text:'ccc',value:'c'},
				],
				value:'aaa',
				config:{
					popup:{
						filterShow:false,
						listShow:false,
						detailShow:false
					},
					dropMenu:{
						disabled:true,
						options:{
							statisType:[
								{ text: '汇总', value: '汇总' },
								{ text: '按客户', value: '按客户' },
							],
							statisMethod:[
								{ text: '列表', value: '列表' },
								{ text: '图表', value: '图表' },
							],
							chartType:[
								{ text: '不可选',   value: '不可选' },
								{ text: '3D饼状图', value: '3D饼状图' },
								{ text: '饼状图',   value: '饼状图' },
								{ text: '3D环形图', value: '3D环形图' },
								{ text: '柱状图',   value: '柱状图' },
								{ text: '直线图',   value: '直线图' },
								{ text: '走势图',   value: '走势图' }
							],
							chartProp:[
								{ text: '不可选',   value: '不可选' },
								{ text: '库存数',   value: '库存数' },
								{ text: '库存面积', value: '库存面积' },
								{ text: '库存金额', value: '库存金额' },
								{ text: '总款数',   value: '总款数' },
							]
						}
					},
					list:{
						pullRefresh:{
							reloading:false
						},
						pushLoading:{
							loading:false,
							finished:false
						}
					}
				},
				filterInfo:{
					statisType:'汇总',
					statisMethod:'列表',
					chartType:'不可选',
					chartProp:'不可选',
				},
				info:{
					panelList:[],
					popupList:[]
				},
				detailData:{
					orderId:'',
					orderType:'',
					strOrderId:''
				}
			}
		},
		methods:{
			statisMethodChange( val ){
				if( val == '图表' ){
					this.filterInfo.chartType = '3D饼状图';
					this.filterInfo.chartProp = '库存数';
					this.config.dropMenu.disabled = false;
					this.config.dropMenu.options.chartType.shift();
					this.config.dropMenu.options.chartProp.shift();
				}else{
					this.config.dropMenu.disabled = true;
					this.config.dropMenu.options.chartType.unshift({ text: '不可选',   value: '不可选' });
					this.config.dropMenu.options.chartProp.unshift({ text: '不可选',   value: '不可选' });
					this.filterInfo.chartType = '不可选';
					this.filterInfo.chartProp = '不可选';
				}
			},
			statisDetail(){
				let self = this;
				this.$request.staff.statis.statisDetail().then(res=>{
					if( res.result.length != 6 ){
						self.config.list.pushLoading.finished = true;
					}
					res.result.forEach((item,index)=>{
						self.info.popupList.push(item);
					});
					this.config.list.pushLoading.loading = false;
				});
			},
			
			onRefresh(){
				this.getOrdStock();
			},
			getOrdStock(){
				let self = this;
				this.$request.staff.statis.getOrdStock().then(res=>{
					self.info.panelList = res.result;
				});
			},

			onLoad(){
				/*cur_page ++ */
				this.statisDetail();
			},
			pullOnRefresh(){
				/*cur_page = 1 */
				this.info.popupList = [];
				this.statisDetail();
				this.config.list.pullRefresh.reloading = false;
			},

			detailOnClick( strOrderId ){
				this.detailData.orderId = strOrderId.substring(1);
				this.detailData.orderType = strOrderId[0];
				this.detailData.strOrderId = strOrderId;
				this.config.popup.detailShow = true;
			},

			statusCloseClick(){
				this.config.popup.detailShow = false;
			}

		},
		mounted(){
			this.getOrdStock();
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','库存统计');
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>
<style>
	.van-dropdown-menu__title{
		line-height: 0.9rem;
	}
</style>