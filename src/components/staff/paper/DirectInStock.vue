<template>
	<div>
		<wx-scan :scanResult.sync="formData.strOrderId" urlType="2"></wx-scan>
		<van-field readonly input-align="center" label="订单信息" v-model="pageInfo.strOrderInfo" >
		</van-field>
		<div class="van-row" style="text-align:left;">
			<div class="van-col van-col--12">
				<van-field v-model="formData.iQty" placeholder="入库数" label="入库数" input-align="center" type="number" :maxlength="3">
				</van-field>
			</div>
			<div class="van-col van-col--12">
				<van-field v-model="formData.strWorkGorup" placeholder="班次" label="班次" input-align="center" :maxlength="10">
				</van-field>
			</div>
		</div>
		<div class="van-row" style="text-align:left;">
			<div class="van-col van-col--12">
				<van-field readonly v-model="pageInfo.iFinishedQty" label="已入库数" input-align="center" type="number" :maxlength="3" placeholder="已入库数">
				</van-field>
			</div>
			<div class="van-col van-col--12">
				<van-field readonly v-model="formData.strSchArea" label="传单库区" input-align="center" :maxlength="10" placeholder="传单库区">
				</van-field>
			</div>
		</div>
		<van-field readonly clickable label="库区" placeholder="请选择入库库区" input-align="center" @click=" config.popup.area.show = true " v-model="formData.strStockArea" v-if="pageInfo.bMStockArea"></van-field>
		<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTimeShow.sync="config.popup.timePicker.show" :dateTime.sync="formData.dInDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="选择入库日期"></new-time-picker>
	   	<van-field v-model="formData.strRemark" autosize label="备注" type="textarea" maxlength="50" placeholder="请输入备注" rows="2" show-word-limit/>
	   	<div class="van-row" style="text-align:center;margin-top:50px;" >
			<div class="van-col van-col--12">
				<van-button type="primary" size="normal" style="width:60%" @click="onSubmit">入库</van-button>
			</div>
			<div class="van-col van-col--12">
				<van-button type="primary" size="normal" style="width:60%" @click="resetClick">重置</van-button>
			</div>
		</div>
		<van-popup v-model="config.popup.area.show" position="bottom" :style="{ height: '100%' }">
			<van-sticky>
				<div class="van-nav-bar van-hairline--bottom" style="z-index: 1;">
					<div class="van-nav-bar__left">
						<span class="van-nav-bar__text">可选入库库区</span>
					</div>
					<div class="van-nav-bar__title van-ellipsis"></div>
					<div class="van-nav-bar__right" @click=" config.popup.area.show = false">
						<i class="van-icon van-icon-cross" style="font-size: 16px;"><!----></i>
					</div>
				</div>
			</van-sticky>
			<radio-cell :radioInfo.sync="formData.strStockArea" :radioColumns="pageInfo.stockAreaOpt" title=""></radio-cell>
		</van-popup>
		<template v-if="pageInfo.bSAreaControl">
			<v-table  is-horizontal-resize :is-vertical-resize="true" style="width:100%;"  :columns="config.table.columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" :height="500"></v-table>
		</template>
	</div>
</template>
<script>
	import { Popup, Button, Icon, Field, Dialog, Toast, Sticky } from 'vant';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import WxScan from '@/components/subject/WxScan.vue';
	import RadioCell from '@/components/subject/RadioCell.vue';
	import { VTable, VPagination } from 'vue-easytable';
	import schema from 'async-validator';
	export default {
		components:{
			[Popup.name]: Popup,
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Field.name]: Field,
			[Dialog.name]: Dialog,
			[Toast.name]: Toast,
			[Sticky.name]: Sticky,

			[VTable.name]: VTable,
			[VPagination.name]: VPagination,

			NewTimePicker,
			WxScan,
			RadioCell
		},
		data(){
			return {
				config:{
					popup:{
						timePicker:{
							show : false,
							isFinishLoad:false
						},
						area:{
							show:false
						}
					},
					table:{
						columns:[
							{field: 'directInStock', title: '操作',width: 100, titleAlign: 'center',componentName:'table-operate',columnAlign:'center',isResize:true},
							{field: 'StockArea', title: '传单库区', titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'LeftQty', title: '未装订单数', titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'LeftSArea', title: '未装折五面积', titleAlign: 'center', columnAlign: 'center',isResize:true},
						]
					}
				},
				formData:{
					strOrderId   : '',   //订单号
					strRemark    : '',   //备注	
					strStockArea : '',   //入库库区
					strSchArea   : '',   //传单库区
					strWorkGorup : '',   //班次
					dInDate      : '',   //入库日期
					iQty         : '',   //入库数
					strFactoryId : '',   //FactoryId
					strUserId    : '',   //ERPId
				},
				pageConfig:{
					maxDate    : '',
					minDate    : '',
				},
				pageInfo:{
					strOrderInfo  : '',   //订单信息
					iFinishedQty  : '',   //已入库数
					stockAreaOpt  : [],   //入库库区可选项
					bSAreaControl : false,//库区控制
					bMStockArea   : false,//显示库区
				},
				tableData:[],
				validator:{},
				rules:{
					strOrderId : [
						{ required: true, message: '请输入订单号'},
						{ pattern:'^[0-9A-Za-z]{11,12}$', message: '订单号格式错误' } 
					],
					iQty : [
						{ required: true, message:'入库数不能为空' }
					],
					dInDate : [
						{ required: true, message:'请选择入库日期' }
					]
				}
			}
		},
		methods:{
			directInConfig(){
				let self = this;
				this.$request.staff.paper.directInConfig().then(res=>{
					self.pageConfig.maxDate    = res.result.time.DirectInStockMaxDate;
					self.pageConfig.minDate    = res.result.time.DirectInStockMinDate;
					self.formData.dInDate      = res.result.time.DirectInStockDate;
					res.result.select_area.forEach((item,index)=>{
						self.pageInfo.stockAreaOpt.push({title:item.StockArea,value:item.StockArea});
					});
					self.pageInfo.bMStockArea   = res.result.controller_config.b_m_stock_area == '0' ? false : true;
					self.pageInfo.bSAreaControl = res.result.controller_config.b_s_area_control == '0' ? false : true;
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.timePicker.isFinishLoad = true;
					})
				});
			},
			getLastSchArea( orderId ){
				let self = this;
				this.$request.staff.paper.getLastSchArea( orderId ).then(res=>{
					
				});
			},
			getOrdSchArea( orderId ){
				let self = this;
				this.$request.staff.paper.getOrdSchArea( orderId ).then(res=>{
					self.tableData = res.result;
					if( res.result.length === 0 ){
						self.formData.strSchArea = '';
					}else if( res.result.length === 1 ){
						self.formData.strSchArea = res.result[0].StockArea
					}else{

					}
				});
			},
			getOrdInInfo( orderId ){
				let self = this;
				this.$request.staff.paper.getOrdInInfo( orderId ).then(res=>{
					self.pageInfo.strOrderInfo = '订单数:' + res.result.OrdQty + '客户:' + res.result.CusShortName + ' 规格:' + res.result.OrderDescr;
					self.pageInfo.iFinishedQty = res.result.FinishedQty;
					if( res.result.MatName !== '' && res.result.OrderType === 'x' ){
						self.pageInfo.strOrderInfo += ' 货品名称:' + res.result.MatName;
					}
				});
			},
			onSubmit(){
				let self = this;
				this.validator.validate( this.formData ).then(()=>{
					self.getUserInfo();
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message);
				});				
			},
			getUserInfo(){
				let self = this;
				this.$request.staff.user.getUserInfo().then(res=>{
					self.formData.strFactoryId = res.result.factory_id;
					self.formData.strUserId    = res.result.erp_id;
				}).then(()=>{
					this.$nextTick(()=>{
						this.directInStock( this.formData );
					})
				});
			},
			directInStock( data ){
				let self = this;
				this.$request.staff.connecterp.directInStock( data ).then(res=>{
					if( res.data.result[1] === false ){
						Dialog.alert({
							title   : '入库失败',
							message : res.data.result[0]
						});
					}else{
						Dialog.alert({
							message: '入库成功',
						}).then(()=>{
							this.submitReset();
						});
					}
				});
			},
			submitReset(){
				this.pageInfo.strOrderInfo = '';
				this.tableData             = [];
				this.formData.strStockArea = '';
				this.pageInfo.stockAreaOpt = []; 
				this.formData.strSchArea   = '';
				this.formData.strRemark    = '';
				this.formData.iQty         = null;
				this.pageInfo.iFinishedQty = 0;
			},
			resetClick(){
				this.formData.strOrderId = '';
				this.submitReset();
			},
			customCompFunc( params ){
				if( params.type == 'operate' ){
					this.formData.strSchArea = params.rowData.StockArea;
				}
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','直接入库');
			if( typeof(this.$route.query.scanRes) == 'string' ){
				this.formData.strOrderId = this.$route.query.scanRes;
			}
		},
		mounted(){
			this.validator = new schema(this.rules);
			this.directInConfig();
		},
		computed:{
			strOrderIdChange(){
				return this.formData.strOrderId;
			}
		},
		watch:{
			strOrderIdChange( newV, oldV ){
				if( newV.length === 11 ){
					this.getOrdInInfo( newV );
					if( this.pageInfo.bSAreaControl ){
						this.getLastSchArea( newV );
						this.getOrdSchArea( newV );
					}
				}
				
			}
		}
	}
</script>
<style>
	.van-field__word-limit{
		line-height: 1rem;
	}
</style>