<template>
	<div class="page-color">
		<van-sticky :offset-top="46">
			<!-- <van-button plain hairline type="info" size="small" style="width:100%" @click="config.popup.filterShow = true">筛选</van-button> -->
			<van-tabs v-model="filterForm.orderState">
				<van-tab title="未审核" name="1"></van-tab>
				<van-tab title="已审核" name="2"></van-tab>
				<van-tab title="已删除" name="3"></van-tab>
			</van-tabs>
		</van-sticky>
		<!-- 筛选按钮 -->
		<drag-menu 
			defpositon="rt" 
			:popMenu="false"
			:pattern="{icon: 'filter-o'}"
			value="筛选"
			@fabClick="menuClick"
		></drag-menu>
		<van-pull-refresh v-model="config.list.pullRefresh.reloading" @refresh="pullOnRefresh">
			<van-list v-model="config.list.pushLoading.loading" :finished="config.list.pushLoading.finished"  finished-text="没有更多了" @load="onLoad" :offset="100">
				<van-swipe-cell 
					v-for="(item,index) in wxOrdersList" 
					:key="index"
				>
					<template 
						slot="right"  
						v-if="item.IsDel === '0' && item.Checked === '0' && (( item.IsGroup === '0' && item.UsePay == null  )  || ( item.UsePay == '1' && item.Refund == 1 ) || ( item.UsePay == '1' && item.Paid == 0 ) )"
						>
						<van-button 
							square 
							text="删除" 
							type="danger" 
							style="height:100%;" 
							@click="delClick(item.CusPoNo)"
						/>
					</template>
					<template 
						slot="left"
						v-if="item.IsDel === '0' && item.Checked === '0' && ((item.UsePay == '1' && item.Paid == 0 && item.IsGroup == 0))"
					>
						<van-button 
							square 
							text="修改" 
							type="primary" 
							style="height:100%;" 
							@click="modifyClick(item)"
						/>
					</template>
					<card 
						:title="item.CusPoNo"
						:extra="item.Title"
						:thumbnail="item.IsGroup === '1' && item.PayDeadlineTime?item.pic:''"
						:is-shadow="true"
					>
						<div class="card-body-container">
							<div class="card-body-item card-body-item-100">
								<div>付款状态:
									<span 
										class="mg-left-20" 
										v-if=" item.UsePay === '1' && item.Paid === '0' "
									>
										<span v-if=" item.IsOverTime ">超时</span>未付款
									</span>
									<span 
										class="mg-left-20 blue-color" 
										v-if=" item.UsePay === '1' && item.Paid === '1' && item.Apply === '0' && item.Refund === '0' " 
									>
										已付款
									</span>
									<span 
										class="mg-left-20 red-color" 
										v-if=" item.UsePay === '1' && item.Paid === '1' && item.Checked === '0' && item.Apply === '1' && item.Refund === '0' ">
										申请退款中
									</span>
									<span class="mg-left-20 gray-color" v-if=" item.UsePay === '1' && item.Paid === '1' && ((item.Checked === '0' && item.Apply === '1') || (item.Checked === '1' && item.Apply === '0')) && item.Refund === '1' ">
										已退款
									</span>
								</div>
							</div>
							<div class="card-body-item card-body-item-100">
								<div class="card-body-txt">订单标识</div>:
								<van-tag class="mg-left-20" type="primary">
									{{ cTypeName(item.CType) }}
								</van-tag>
								<van-tag 
								 	v-if=" item.IsCard === '1' " 
								 	class="mg-left-20"  
								 	type="warning" 
								 >
									{{ item.CardFlag }}
								</van-tag>
							</div>
							<!-- <div 
								v-if="item.IsGroup === '1' && item.PayDeadlineTime && item.Title" 
								class="card-body-item card-body-item-100"
							>
								<span>团购标题:
									<span class="mg-left-20">{{ item.Title }}</span>
								</span>
							</div> -->
							<div v-if="item.IsDel==='1'" class="card-body-item card-body-item-100">
								<span>删除原因:
									<span class="mg-left-20 red-color" >{{ item.DelRemark }}</span>
								</span>
							</div>
							<div v-if="item.CType === 's'||item.CType === 'c'" class="card-body-item card-body-item-100">
								<span>纸板规格:
									<span class="mg-left-20">{{ item.Length }}×{{ item.Width }}</span>
									<span class="mg-left-20">{{ item.BoardId }}</span>
								</span>
							</div>
							<div v-if="item.CType === 'c'" class="card-body-item card-body-item-100">
								<span>纸箱规格:
									<span class="mg-left-20">{{ item.BoxL }}×{{ item.BoxW }}×{{ item.BoxH }}</span>
								</span>
							</div>
							<div v-if="item.CType === 'c'" class="card-body-item card-body-item-100">
								<span>箱型信息:
									<span class="mg-left-20">{{ item.BoxName }}</span>
								</span>
							</div>
							<div v-if="item.CType === 'x'" class="card-body-item card-body-item-100">
								<span>套件信息:
									<span class="mg-left-20" >{{ item.ProductId }}</span>
									<span class="mg-left-20" >{{ item.ProductName }}</span>
								</span>
							</div>
							<div v-if="item.CType === 't'" class="card-body-item card-body-item-100">
								<span>货品编号:
									<span class="mg-left-20" >{{ item.MatNo }}</span>
								</span>
							</div>
							<div class="card-body-item card-body-item-100">
								<span>订单信息:
									<span class="mg-left-20">
										{{ item.OrdQty }}
										<span v-if="item.CType === 's'">片</span>
										<span v-else>个</span>
									</span>
									<span 
										v-if="item.CType === 's' || item.CType === 'c'" 
										class="mg-left-20"
									>
										{{ item.Area }}㎡
									</span>
								</span>
							</div>
							<div class="card-body-item card-body-item-100">
								<span>压线信息:
									<span class="mg-left-20">{{ item.ScoreInfo }}</span>
								</span>
							</div>
							<div class="card-body-item card-body-item-100">
								<span>送货地址:
									<span class="mg-left-20">{{ item.SubDNAddress }}</span>
								</span>
							</div>
							<div class="card-body-item card-body-item-100">
								<div class="card-body-txt green-color">下单</div>|
								<div class="card-body-txt red-color">交货</div>:
								<span class="mg-left-20 green-color">{{ item.BuildDate }}</span>
								<span class="mg-left-20 red-color">{{ item.DeliveryDate }}</span>
							</div>
							<div v-if="item.IsGroup == 0&&pageConfig.isCalc" class="card-body-item card-body-item-100">
								<div class="card-body-txt blue-color">价格</div>|
								<div class="card-body-txt yellow-color">金额</div>:
								<span class="mg-left-20 blue-color">{{ item.WebCalPrice }}元/㎡</span>
								<span class="mg-left-20 yellow-color">{{ item.WebCalAmt }}元</span>
							</div>
							<div v-if="item.IsGroup == 1" class="card-body-item card-body-item-100">
								<div class="card-body-txt blue-color">价格</div>|
								<div class="card-body-txt yellow-color">金额</div>:
								<span class="mg-left-20 blue-color">{{ item.Price }}元/㎡</span>
								<span class="mg-left-20 yellow-color">{{ item.Cost }}元</span>
							</div>

						</div>
						<div slot="actions" class="card-actions">
							<div 
								v-if=" filterForm.orderState == 1 && item.UsePay === '1' "
								class="card-actions-item" 
								@click="payDetailClick(item.CusPoNo)"
							>
								<van-icon color="#3c9cff" name="peer-pay" size="18"/>
								<span class="card-actions-item-text blue-color">支付信息</span>
							</div>
							<div 
								class="card-actions-item" 
								@click="wxDetailClick(item.CusPoNo)"
							>
								<van-icon color="#3c9cff" name="bars" size="18"/>
								<span class="card-actions-item-text blue-color">详情</span>
							</div>
							<div 
								v-if=" item.Checked === '1' && item.IsCard === '0' && item.CType !== 't' "
								class="card-actions-item" 
								@click="setCommon( item.CusPoNo )"
							>
								<van-icon color="#f9ae3d" name="star" size="18"/>
								<span class="card-actions-item-text yellow-color">设为常用</span>
							</div>
							<div 
								v-if=" item.Checked === '1' && item.IsCard === '1' && item.CType !== 't' "
								class="card-actions-item" 
								@click="cancelCommon( item.CusPoNo )"
							>
								<van-icon color="#f56c6c" name="star-o" size="18"/>
								<span class="card-actions-item-text red-color">取消常用</span>
							</div>
							<div 
								v-if=" item.Checked === '1' && item.IsCard === '1' "
								class="card-actions-item" 
								@click="buildOrder( item )"
							>
								<van-icon color="#3c9cff" class-prefix="iconfont" name="xiadan" size="18"/>
								<span class="card-actions-item-text blue-color">快速下单</span>
							</div>
						</div>
					</card>
				</van-swipe-cell>
				<!-- <van-panel  v-for="(item,index) in wxOrdersList" :key="index" style="font-size:0.8125rem;">
					<div slot="header" style="margin-left:1.25rem;color:#1a991d" v-if="item.IsGroup === '1' && item.PayDeadlineTime ">
						<div style="height:3.125rem;width:100%;display: flex;" @click="headerClick(item)">
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
					<div slot="header" style="margin-left:1.25rem;color:#1a991d" v-if=" item.IsGroup === '0' && item.PayDeadlineTime ">
						<div style="line-height:3.125rem;font-size:0.875rem;width:90%;color: #ffa500;text-align:right;">
							付款状态：
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
					<div slot="default">
						<van-swipe-cell>
							<template 
								slot="right"  
								v-if="item.IsDel === '0' && item.Checked === '0' && (( item.IsGroup === '0' && item.UsePay == null  )  || ( item.UsePay == '1' && item.Refund == 1 ) || ( item.UsePay == '1' && item.Paid == 0 ) )"
								>
								<van-button 
									square 
									text="删除" 
									type="danger" 
									style="height:100%;" 
									@click="delClick(item.CusPoNo)"
								/>
							</template>
							<template 
								slot="left"
								v-if="item.IsDel === '0' && item.Checked === '0' && ((item.UsePay == '1' && item.Paid == 0 && item.IsGroup == 0))"
							>
								<van-button 
									square 
									text="修改" 
									type="primary" 
									style="height:100%;" 
									@click="modifyClick(item)"
								/>
							</template>
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
								<div class="van-col van-col--22" >
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
								<div class="van-col van-col--22">压线信息:{{ item.ScoreInfo }}</div>
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
							<div class="van-row van-row--flex van-row--justify-center" v-if=" item.IsGroup == 0 && pageConfig.isCalc ">
								<div class="van-col van-col--2"></div>
								<div class="van-col van-col--11">计价价格:{{ item.WebCalPrice }}</div>
								<div class="van-col van-col--11">金额:{{ item.WebCalAmt }}</div>
							</div>
							<div class="van-row van-row--flex van-row--justify-center" v-if=" item.IsGroup == 1">
								<div class="van-col van-col--2"></div>
								<div class="van-col van-col--11">团购价格:{{ item.Price }}</div>
								<div class="van-col van-col--11">团购金额:{{ item.Cost }}</div>
							</div>
						</van-swipe-cell>
					</div>
					<div slot="footer" style="text-align:right;">
						<van-button size="small" color="linear-gradient(to right, #4bb0ff, #6149f6)" @click="payDetailClick(item.CusPoNo)" v-if=" filterForm.orderState == 1 && item.UsePay === '1' ">
							支付信息
						</van-button>
						<van-button size="small" type="primary" @click="wxDetailClick(item.CusPoNo)">
							详情
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
				</van-panel> -->
			</van-list>
		</van-pull-refresh>
		<float-nav v-if=" config.floatNav.show && config.floatNav.isFinish && filterForm.orderState==1" :listData=" config.floatNav.listData " :selectNum=" config.floatNav.selectNum "></float-nav>
		<wx-order-detail :detailShow.sync="config.popup.detailShow" :cusOrderId="detailForm.cusOrderId" v-if="config.popup.detailShow"></wx-order-detail>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<uni-check-box
					label="订单类型"
					:localdata="config.radio.orderType"
					:radioData.sync="filterForm.orderType" 
					:map="{text: 'title', value: 'value'}"
				>
				</uni-check-box>
				<uni-check-box
					label="是否团购"
					:localdata="config.radio.groupBy"
					:radioData.sync="filterForm.groupBy" 
					:map="{text: 'title', value: 'value'}"
				>
				</uni-check-box>
				<uni-check-box
					label="日期"
					:localdata="config.radio.dateType"
					:radioData.sync="filterForm.dateType" 
					:map="{text: 'title', value: 'value'}"
				>
				</uni-check-box>
			
				<time-range-picker
					:beginDate.sync="filterForm.beginDate"
					:endDate.sync="filterForm.endDate"
					:maxDate.sync="pageConfig.maxDate"
					:minDate.sync="pageConfig.minDate"
				></time-range-picker>
				
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
		<van-popup v-model="config.popup.del.show" position="bottom" >
			<div class="van-hairline--top-bottom van-picker__toolbar">
				<button type="button" class="van-picker__cancel"></button>
				<div class="van-ellipsis van-picker__title" style="color:#4bb0ff">请选择删除原因</div>
				<button type="button" class="van-picker__confirm"></button>
			</div>
			<uni-check-box
				:localdata="config.radio.defaultDelRemark"
				:radioData.sync="delForm.delRemak" 
				:map="{text: 'title', value: 'value'}"
			>
			</uni-check-box>
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
	import { Button, Icon, Image, Popup, Field, Dialog, PullRefresh, SwipeCell, Toast, List, SwitchCell, Panel, Sticky, Tag, Tab, Tabs } from 'vant';
	import WxOrderDetail from '@/components/subject/client/WxOrderDetail.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import RadioCell from '@/components/subject/RadioCell.vue';
	/*import FloatNav from '@/components/subject/client/FloatNav.vue';*/
	import FloatNav from '@/components/karry/floatNav/KarryFloatNav.vue';
	import schema from 'async-validator';
	import { cTypeChange } from '@/util/index';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';

	import Card from '@/components/subject/card/Card.vue'
	import UniCheckBox from '@/components/subject/checkbox/UniCheckBox.vue'
	import TimeRangePicker from '@/components/subject/time/TimeRangePicker.vue'
	/*自定义拖动菜单组件*/
	import DragMenu from "@/components/subject/fab/DragMenu.vue"

	/*api接口*/
	import { getWebConfig } from '@/api/common/webConfig.js'

	export default {
		components:{
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Image.name]: Image,
			[Popup.name]: Popup,
			[Field.name]: Field,
			[Dialog.Component.name]: Dialog.Component,
			[PullRefresh.name]: PullRefresh,
			[SwipeCell.name]: SwipeCell,
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
			FloatNav,

			Card,
			UniCheckBox,
			TimeRangePicker,
			DragMenu
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
						dateType : [
							{title:'下单日期', value:0},
							{title:'交货日期', value:1}
						],
						defaultDelRemark: []
					},
					switch: {
						checked: false
					},
					dialog: {
						show: false
					},
					setCommon: {
						show: false
					},
					floatNav: {
						show: false,
						isFinish: false,
						listData: [],
						now: new Date(),
						selectNum : 0
					}
				},
				filterForm:{
					beginDate: '',
					endDate: '',
					dateType: 0,
					groupBy: 2,
					orderType: 'all',
					orderState: '1',
					curPage: 0,
				},
				detailForm : {
					cusOrderId : ''
				},
				pageConfig : {
					minDate : '',
					maxDate : '',
					isCalc: false
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
			/*筛选按钮*/
			menuClick() {
				this.config.popup.filterShow = true
			},
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
			async getConfig( isReset = false ){
				this.config.radio.defaultDelRemark = this.$options.data().config.radio.defaultDelRemark
				const { result } = await getWebConfig({paramType: 'clientOM'})
				if( this.config.getConfig ){
					this.filterForm.beginDate = result.WeborderBeginDate
					this.filterForm.endDate = result.WeborderEndDate
				}
				this.pageConfig.minDate = result.WeborderMinDate
				this.pageConfig.maxDate = result.WeborderMaxDate
				this.pageConfig.isCalc = result.BuildAddCalc == 1 ? true : false
				result.WeborderDefaultDelRemark.split(',').forEach((item,index)=>{
					this.config.radio.defaultDelRemark.push({title:item,value:item})
				})
				if(result.UseWxPay == 1 || result.UseAliPay == 1 || result.UseYSBPay == 1 || result.UseCreditPay == 1)
					this.config.floatNav.show = true
				if( isReset ) return 
				await this.getWxOrders( this.filterForm )
			},
			getWxOrders( data ){
				let self = this;
				this.$request.client.ordersManage.wechatOrders( data ).then(res=>{
					if( res.result == null || res.result.order_data.length < 7 ){
						self.config.list.pushLoading.finished = true;
					}
					self.config.list.pushLoading.loading = false;
					if( res.errorCode != '00000' ){
						return false;
					}
					res.result.order_data.forEach((item,index)=>{
						if( item['FirstPic'] != null ){
							item['pic'] = item.FirstPic;
						}
						self.wxOrdersList.push(item);
					});
					//res.result.unchecked_order_data = [];
					self.config.floatNav.listData = [];
					if( res.result.unchecked_order_data && res.result.unchecked_order_data.length != 0 ){
						res.result.unchecked_order_data.forEach((item,index)=>{
							self.config.floatNav.listData.push({
								boardId : item.BoardId,
								matNo   : item.MatNo,
								title   : item.Title,
								cost    : Number(item.Cost),
								id      : item.Id,
								pic     : item.FirstPic == null ? '' : item.FirstPic,
								isover  : item.PayDeadlineTime * 1000 > self.config.floatNav.now ? false : true,
								cusPoNo : item.CusPoNo,
								isGroup : item.WebProductId == 0 ? 0 : 1,
								deadline: item.PayDeadlineTime * 1000
							});
							if( item.PayDeadlineTime*1000 > self.config.floatNav.now ){
								self.config.floatNav.selectNum++;
							}
						});
						self.config.floatNav.isFinish = true;
					}
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
				removeStorage('client/wxOrders');
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
			modifyClick( item ){
				//console.log(item)
				if( item.IsGroup != 0 ){
					return 
				}
				//跳转支付下单
				if( item.UsePay == 1 && item.CType == 's' ){
					this.$router.push({ name:'sBuildPay', params: { orderId: item.CusPoNo, buildType: 1 } })
				}
				if( item.UsePay == 1 && item.CType == 'c' ){
					this.$router.push({ name:'cBuildPay', params: { orderId: item.CusPoNo, buildType: 1 } })
				}
				//跳转非支付下单
				if( item.UsePay == 0 && item.CType == 's' ){
					this.$router.push({ name:'sBuild', params: { orderId: item.CusPoNo, buildType: 1 } })
				}
				if( item.UsePay == 0 && item.CType == 'c' ){
					this.$router.push({ name:'cBuild', params: { orderId: item.CusPoNo, buildType: 1 } })
				}
				if( item.UsePay == 0 && item.CType == 'x' ){
					this.$router.push({ name:'xBuild', params: { orderId: item.CusPoNo, buildType: 1 } })
				}
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
						this.delForm = this.$options.data().delForm
					}
				}).then(()=>{
					var self = this;
					setTimeout(function(){
						self.config.popup.del.show = false;
						self.pullOnRefresh();
					},1000);
				});
			},
			headerClick( rowData ){
				if( rowData.BoardId ){
					this.$router.push({ name:'boardDetail', params:{ productId:rowData.WebProductId } });
				}else{
					this.$router.push({ name:'boxDetail', params:{ productId:rowData.WebProductId } });
				}
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
						if( item.PayDeadlineTime ){
							this.$router.push({
								name:'sBuildPay',
								params : {
									orderId : item.CusPoNo
								}
							});
						}else{
							this.$router.push({
								name:'sBuild',
								params : {
									orderId : item.CusPoNo
								}
							});
						}
						break;
					case 'c':
						if( item.PayDeadlineTime ){
							this.$router.push({
								name:'cBuildPay',
								params : {
									orderId : item.CusPoNo
								}
							});
						}else{
							this.$router.push({
								name:'cBuild',
								params : {
									orderId : item.CusPoNo
								}
							});
						}
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
			},
			payDetailClick( cusPoNo ){
				this.$router.push({ name:'payDetail', params:{ orderId : cusPoNo } });
			},
			beforeunloadHandler(){
				if( this.config.switch.checked ){
					setStorage('client/wxOrders',this.filterForm);
				}else{
					removeStorage('client/wxOrders');
				}
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','微信订单')
			this.$store.commit('client/setBackPath', '/client/wxorder/lists')
			if( getStorage('client/wxOrders') ){
				let storageData = JSON.parse(getStorage('client/wxOrders'));
				this.filterForm            = storageData;
				this.config.getConfig      = false;
				this.config.switch.checked = true;
			}
		},
		mounted(){
			this.validator = new schema(this.delRules);
			window.addEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		updated(){
			
		},
		destroyed(){
			this.beforeunloadHandler();
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler());
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
			},
			delShow() {
				return this.config.popup.del.show;
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
			},
			delShow( newV,oldV ) {
				if( !newV ){
					this.delForm = this.$options.data().delForm
				}
			}
		}
	}
</script>
<style type="text/css">
	@import '~@/assets/style/card.css';
</style>