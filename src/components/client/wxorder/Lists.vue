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
				<van-panel v-for="(item,index) in wxOrdersList" :key="index" style="font-size:0.8125rem;">
					<div slot="header" style="margin-left:1.25rem;color:#1a991d" v-if="item.IsGroup === '1'">
						<div style="height:3.125rem;width:100%;display: flex;" @click="headerClick">
							<div style="display: inline-flex;line-height:3.125rem;width:75%;overflow: hidden;">
								<van-image :src="item.pic" round style="width: 25%; height: 100%;display: inline-flex;" />
								<span class="van-ellipsis" style="width:70%;">
									<span style="color: #e01835;font-size:0.8125rem;" v-if=" item.BoardId && !item.MatNo ">
										{{ item.BoardId }}
									</span>
									<span v-else-if=" !item.BoardId && item.MatNo ">
										{{ item.MatNo }}
									</span>
									<span v-if=" item.Title ">{{ item.Title }}</span>
								</span>
								<i class="van-icon van-icon-arrow" style="display: table-cell; vertical-align: middle; font-size: 1rem;top: 17px;color:#4bb0ff;"></i>
							</div>
							<div style="display: inline-flex;line-height:3.125rem;font-size:0.875rem;width:30%;color: #ffa500;text-align:center;">
								<span v-if=" item.UsePay === '1' && item.Paid === '0' ">
									<span v-if=" item.IsOverTime ">超时</span>未付款
								</span>
								<span v-if=" item.UsePay === '1' && item.Paid === '1' && item.Apply === '0' && item.Refund === '0' " style="color: #1a991d;">
									已付款
								</span>
								<span v-if=" item.UsePay === '1' && item.Paid === '1' && item.Checked === '0' && item.Apply === '1' && item.Refund === '0' " style="color: #ff0000;">
									申请退款中
								</span>
								<span v-if=" item.UsePay === '1' && item.Paid === '1' && ((item.Checked === '0' && item.Apply === '1') || (item.Checked === '1' && item.Apply === '0')) && item.Refund === '1' " style="color: #666;">
									已退款
								</span>
							</div>
						</div>
					</div>
					<div slot="default">
						<div class="van-row van-row--flex van-row--justify-center">
							<div class="van-col van-col--2"></div>
							<div class="van-col van-col--22">
								<van-tag plain type="primary" style="font-size:0.75rem;">
									{{ cTypeName(item.CType) }}
								</van-tag>
								<van-tag plain type="warning" v-if=" item.IsCard === '1' " style="font-size:0.75rem;">
									常用订单标识:{{ item.CardFlag }}
								</van-tag>
								<van-tag plain type="danger" v-if=" item.IsDel === '1' " style="font-size:0.75rem;">
									删除原因:{{ item.DelRemark }}
								</van-tag>
							</div>
						</div>
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
							<div class="van-col van-col--11" v-if="item.CType === 's' || item.CType === 'c'" >订单数:{{ item.OrdQty }}</div>
							<div class="van-col van-col--22" v-else>订单数:{{ item.OrdQty }}</div>
							<div class="van-col van-col--11"  v-if="item.CType === 's' || item.CType === 'c'">下单面积(㎡):{{ item.Area }}</div>
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
						<van-button size="small" type="primary" @click="wxDetailClick(item.CusPoNo)">
							详情
						</van-button>
						<van-button size="small" type="danger" v-if="item.IsDel === '0' && item.Checked === '0' && ( item.IsGroup === '0' || item.UsePay === '0' || item.Paid === '0' || item.Refund === '1' ) " @click="delClick(item.CusPoNo)">
							删除
						</van-button>
						<van-button size="small" type="warning" v-if=" item.Checked === '1' && item.IsCard === '0' && item.CType !== 't' " @click="setCommon( item.CusPoNo )">
							设为常用
						</van-button>
						<van-button size="small" plain type="danger" v-if=" item.Checked === '1' && item.IsCard === '1' && item.CType !== 't' " @click="cancelCommon( item.CusPoNo )">
							取消常用
						</van-button>
						<van-button size="small" plain type="primary" v-if=" item.Checked === '1' && item.IsCard === '1' " @click=" buildOrder( item ) ">
							快速下单
						</van-button>
					</div>
				</van-panel>
			</van-list>
		</van-pull-refresh>
		<float-nav></float-nav>
		<wx-order-detail :detailShow.sync="config.popup.detailShow" :cusOrderId="detailForm.cusOrderId" v-if="config.popup.detailShow"></wx-order-detail>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<radio-cell :radioInfo.sync="filterForm.orderType" :radioColumns="config.radio.orderType" title="订单类型"></radio-cell>
				<radio-cell :radioInfo.sync="filterForm.groupBy" :radioColumns="config.radio.groupBy" title="是否团购"></radio-cell>
				<radio-cell :radioInfo.sync="filterForm.dateType" :radioColumns="config.radio.dateType" title="日期类型"></radio-cell>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
		<van-popup v-model="config.popup.del.show" position="bottom" >
			<div class="van-hairline--top-bottom van-picker__toolbar">
				<button type="button" class="van-picker__cancel"></button>
				<div class="van-ellipsis van-picker__title" style="color:#4bb0ff">请选择删除原因</div>
				<button type="button" class="van-picker__confirm"></button>
			</div>
			<radio-cell :radioInfo.sync="delForm.delRemak" :radioColumns="config.radio.defaultDelRemark"></radio-cell>
			<van-field value="其他原因" size="large" readonly input-align="center" @click="otherReason()"/>
			<van-button type="primary" size="normal" style="width:50%" @click="delConfirm()">确认</van-button>
			<van-button type="info" size="normal" style="width:50%" @click="config.popup.del.show = false">取消</van-button>
		</van-popup>
		<van-dialog v-model="config.dialog.show" title="请填写删除原因" @confirm="delConfirm()" @cancel="config.dialog.show = false" show-cancel-button>
			<van-field v-model="delForm.delRemak" size="large" input-align="center" placeholder="请填写删除原因"/>
		</van-dialog>
		<van-dialog v-model="config.setCommon.show" title="请为这个常用订单添加标识" @confirm="setCommonConfirm()" @cancel="config.setCommon.show = false" show-cancel-button>
			<van-field v-model="setCommonForm.cardFlag" size="large" input-align="center" placeholder="请填写标识"/>
		</van-dialog>
	</div>
</template>
<script>
	import { Button, Image, Popup, Field, Dialog, PullRefresh, Toast, List, SwitchCell, Panel, Sticky, Tag, Tab, Tabs } from 'vant';
	import WxOrderDetail from '@/components/subject/client/WxOrderDetail.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import RadioCell from '@/components/subject/RadioCell.vue';
	import FloatNav from '@/components/subject/client/FloatNav.vue';
	import schema from 'async-validator';
	import { cTypeChange } from '@/util/index';
	export default {
		components:{
			[Button.name]: Button,
			[Image.name]: Image,
			[Popup.name]: Popup,
			[Field.name]: Field,
			[Dialog.Component.name]: Dialog.Component,
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
			PopupFilter,
			RadioCell,
			FloatNav
		},
		data(){
			return {
				config:{
					getConfig : true,
					popup : {
						del : {
							defaultDelRemark:[],
							show : false,
						},
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
					},
					radio:{
						orderType : [
							{title:'全部',     value:'all'},
							{title:'简单纸板', value:'s'},
							{title:'纸箱纸板', value:'c'},
							{title:'纸箱' ,    value:'x'},
							{title:'淘宝箱',   value:'t'},
						],
						groupBy   : [
							{title:'全部', value:2},
							{title:'是' ,  value:1},
							{title:'否',   value:0},
						],
						dateType  : [
							{title:'下单日期', value:0},
							{title:'交货日期', value:1}
						],
						defaultDelRemark : [

						]
					},
					switch : {
						checked : false
					},
					dialog : {
						show : false
					},
					setCommon : {
						show : false
					}
				},
				filterForm:{
					beginDate  : '',
					endDate    : '',
					dateType   : 0,
					groupBy    : 2,
					orderType  : 'all',
					orderState : '1',
					curPage    : 0,
				},
				detailForm : {
					cusOrderId : ''
				},
				pageConfig : {
					minDate : '',
					maxDate : ''
				},
				delForm : {
					cusOrderId : '',
					delRemak   : '',
				},
				wxOrdersList:[],
				delRules : {
					cusOrderId : [
						{ required : true, message: '请选择要删除的订单' }
					],
					delRemak : [
						{ required : true, message: '请选择或填写删除原因' }
					]
				},
				validator : {},
				setCommonForm : {
					orderId  : '',
					cardFlag : '' 
				}
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
					if( this.config.getConfig ){
						self.filterForm.beginDate = res.result.WeborderBeginDate;
						self.filterForm.endDate   = res.result.WeborderEndDate;
					}
					self.pageConfig.minDate   = res.result.WeborderMinDate;
					self.pageConfig.maxDate   = res.result.WeborderMaxDate;
					self.config.radio.defaultDelRemark = [];
					res.result.WeborderDefaultDelRemark.split(',').forEach((item,index)=>{
						self.config.radio.defaultDelRemark.push({title:item,value:item});
					});
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
					//console.log(res.result.order_data);return;
					res.result.order_data.forEach((item,index)=>{
						//console.log(item)
						if( item['FirstPic'] != null ){
							item['pic'] = require('@/assets/groupImg/' + item.FirstPic);
						}
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
			},
			resetClick(){
				this.filterForm = {
					beginDate  : '',
					endDate    : '',
					dateType   : 0,
					groupBy    : 2,
					orderType  : 'all',
					orderState : this.filterForm.orderState,
					curPage    : 0,
				};
				sessionStorage.removeItem('client/wxOrders');
				this.config.getConfig      = true;
				this.config.switch.checked = false;
				this.getConfig( true );
			},
			filterClick(){
				this.wxOrdersList = [];
				this.pullOnRefresh();
				this.config.popup.filterShow = false;
			},
			delClick( cusOrderId ){
				this.delForm.cusOrderId    = cusOrderId;
				this.config.popup.del.show = true;
			},
			otherReason( cusOrderId ){
				this.delForm.delRemak      = '';
				this.config.popup.del.show = false;
				this.config.dialog.show    = true;
			},
			delConfirm(){
				let self = this;
				this.validator.validate(this.delForm).then(()=>{
					self.wechatDelete( this.delForm );
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message);
				});
			},
			wechatDelete( data ){
				this.$request.client.ordersManage.wechatDelete( data ).then(res=>{
					if( res.errorCode === '00000' ){
						Toast.success(res.msg);
					}
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.del.show = false;
						this.pullOnRefresh();
					});
				});
			},
			headerClick(){
				console.log('headerClick');
			},
			setCommon( orderId ){
				this.setCommonForm.orderId = orderId;
				this.config.setCommon.show = true;
			},
			setCommonConfirm(){
				let self = this;
				this.$request.client.ordersManage.wechatSetCommon( this.setCommonForm ).then(res=>{
					if( res.errorCode == '00000' ){
						Toast.success('设置成功');
						self.pullOnRefresh();
					}else{
						Toast.fail('设置失败');
					}
				});
			},
			cancelCommon( orderId ){
				let self = this;
				Dialog.confirm({
					message: '确认取消?'
				}).then(()=>{
					self.$request.client.ordersManage.wechatCancel( orderId ).then(res=>{
						if( res.errorCode == '00000' ){
							Toast.success('取消成功');
							self.pullOnRefresh();
						}else{
							Toast.fail('取消失败');
						}
					});
				}).catch(()=>{
					Dialog.close();
				});
			},
			buildOrder( item ){
				switch( item.CType ){
					case 's':
						this.$router.push({
							name:'sBuild',
							params : {
								orderId : item.CusPoNo
							}
						});
						break;
					case 'c':
						this.$router.push({
							name:'cBuild',
							params : {
								orderId : item.CusPoNo
							}
						});
						break;
					case 'x':
						this.$router.push({
							name:'xBuild',
							params : {
								orderId : item.CusPoNo
							}
						});
						break;
					default :
						return false;
				}
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','微信订单');
			if( sessionStorage.getItem('client/wxOrders') !== null ){
				let storageData = JSON.parse(sessionStorage.getItem('client/wxOrders'));
				this.filterForm            = storageData;
				this.config.getConfig      = false;
				this.config.switch.checked = true;
			}
		},
		mounted(){
			this.validator = new schema(this.delRules);
		},
		updated(){
			
		},
		destroyed(){
			if( this.config.switch.checked ){
				sessionStorage.setItem('client/wxOrders',JSON.stringify(this.filterForm));
			}else{
				sessionStorage.removeItem('client/wxOrders');
			}
		},
		computed:{
			orderStateChange(){
				return this.filterForm.orderState;
			},
			groupByChange(){
				return this.filterForm.groupBy;
			},
			setCommonShow(){
				return this.config.setCommon.show;
			}
		},
		watch:{
			orderStateChange( newV,oldV ){
				this.pullOnRefresh();
			},
			groupByChange( newV,oldV ){
				if( newV == 1 ){
					this.config.radio.orderType = [
						{title:'全部',     value:'all'},
						{title:'简单纸板', value:'s'},
						{title:'纸箱纸板', value:'c'},
						{title:'淘宝箱',   value:'t'},
					];
					if( this.filterForm.orderType === 'x' ){
						this.filterForm.orderType = '';
					}
				}else if( newV == 0 ){
					this.config.radio.orderType = [
						{title:'全部',     value:'all'},
						{title:'简单纸板', value:'s'},
						{title:'纸箱纸板', value:'c'},
						{title:'纸箱' ,    value:'x'},
					];
					if( this.filterForm.orderType === 't' ){
						this.filterForm.orderType = '';
					}
				}else{
					this.config.radio.orderType = [
						{title:'全部',     value:'all'},
						{title:'简单纸板', value:'s'},
						{title:'纸箱纸板', value:'c'},
						{title:'纸箱' ,    value:'x'},
						{title:'淘宝箱',   value:'t'},
					];
				}

			},
			setCommonShow( newV,oldV ){
				if( newV == false ){
					this.setCommonForm.cardFlag = '';
				}
			}
		}
	}
</script>
