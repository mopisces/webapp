<template>
	<div>
		<wx-scan :scanResult.sync="formData.strOrderId" urlType="2"></wx-scan>
		<van-field input-align="center" label="订单信息" v-model="pageInfo.strOrderInfo" type="textarea" :rows="1" autosize placeholder="订单信息" readonly class="field-readonly"></van-field>
		<div class="van-row" style="text-align:left;">
			<div class="van-col van-col--12">
				<field-label-variable :value.sync="formData.iQty" label="入库数" placeholder="入库数" maxlength="5" :onFocus.sync="config.field.iQtyOnFocus"></field-label-variable>
			</div>
			<div class="van-col van-col--12">
				<op-class-field :opClass.sync="formData.strWorkGorup"></op-class-field>
			</div>
		</div>
		<div class="van-row" style="text-align:left;">
			<div class="van-col van-col--12">
				<field-label-variable :value.sync="pageInfo.iFinishedQty" label="已入库数" placeholder="已入库数" maxlength="10" type="number" readonly="readonly"></field-label-variable>
			</div>
			<div class="van-col van-col--12">
				<field-label-variable :value.sync="formData.strSchArea" label="传单库区" placeholder="传单库区" maxlength="10" readonly="readonly"></field-label-variable>
			</div>
		</div>
		<uni-check-box
			label="库区"
			:localdata="pageInfo.stockAreaOpt"
			:radioData.sync="formData.strStockArea" 
			:map="{text: 'title', value: 'value'}"
		>
		</uni-check-box>
		<!-- <van-field readonly clickable label="库区" placeholder="请选择入库库区" input-align="center" @click=" config.popup.area.show = true " v-model="formData.strStockArea" v-if="pageInfo.bMStockArea">
			<van-icon name="arrow" slot="right-icon"/>
		</van-field> -->
		<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTimeShow.sync="config.popup.timePicker.show" :dateTime.sync="formData.dInDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="选择入库日期"></new-time-picker>
	   	<van-field v-model="formData.strRemark" autosize label="备注" type="textarea" maxlength="50" placeholder="请输入备注" rows="1"/>
	   	<div class="van-row" style="text-align:center;padding:0.625rem;" >
			<div class="van-col van-col--12">
				<van-button type="primary" size="small" style="width:60%" @click="onSubmit">入库</van-button>
			</div>
			<div class="van-col van-col--12">
				<van-button type="primary" size="small" style="width:60%" @click="resetClick">重置</van-button>
			</div>
		</div>
		<!-- <van-popup v-model="config.popup.area.show" round position="bottom" :style="{ height: '50%' }" closeable>
			<div style="height:2.5rem;width100%;"></div>
			<radio-cell :radioInfo.sync="formData.strStockArea" :radioColumns="pageInfo.stockAreaOpt" title=""></radio-cell>
			<uni-check-box
				:localdata="pageInfo.stockAreaOpt"
				:radioData.sync="formData.strStockArea" 
				:map="{text: 'title', value: 'value'}"
			>
			</uni-check-box>
		</van-popup> -->
		<template v-if="pageInfo.bSAreaControl">
			<v-table  is-horizontal-resize :is-vertical-resize="true" style="width:100%;"  :columns="config.table.columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" even-bg-color="#fafafa" :height="config.table.height" @on-custom-comp="customCompFunc"></v-table>
		</template>
	</div>
</template>
<script>
	import { Button, Icon, Popup, Field, Dialog, Toast } from 'vant';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import WxScan from '@/components/subject/WxScan.vue';
	import RadioCell from '@/components/subject/RadioCell.vue';
	import OpClassField from '@/components/subject/staff/OpClassField.vue';
	import FieldLabelVariable from '@/components/subject/staff/FieldLabelVariable.vue';
	import schema from 'async-validator';

	import UniCheckBox from '@/components/subject/checkbox/UniCheckBox.vue';
	export default {
		components:{
			[Popup.name]: Popup,
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Field.name]: Field,
			[Dialog.name]: Dialog,
			[Toast.name]: Toast,

			NewTimePicker,
			WxScan,
			RadioCell,
			OpClassField,
			FieldLabelVariable,
			UniCheckBox
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
							{field: 'directInStock', title: '操作',width: 70, titleAlign: 'center',componentName:'table-operate',columnAlign:'center',isResize:true},
							{field: 'StockArea', title: '传单库区', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'LeftQty', title: '未装订单数',width: 80,  titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'LeftSArea', title: '未装折五面积', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
						],
						height: 0
					},
					field:{
						iQtyOnFocus:false
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
				},
				activeColor: '#f5f5f5'
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
					});
					this.getUserInfo();
				});
			},
			getLastSchArea( orderId ){
				let self = this;
				this.$request.staff.paper.getLastSchArea( orderId ).then(res=>{
					if(res.errorCode == '00000'){
						if( res.result.length == 0 ){
							self.formData.strStockArea = '';
						}else{
							self.formData.strStockArea = res.result[0].StockArea;
						}
					}
				});
			},
			getOrdSchArea( orderId ){
				let self = this;
				this.$request.staff.paper.getOrdSchArea( orderId ).then(res=>{
					self.tableData = res.result[0];
					if( res.result.length === 0 ){
						self.formData.strSchArea = '';
					}else if( res.result.length === 1 ){
						self.formData.strSchArea = res.result[0].StockArea
					}else{
						/*Dialog.alert({
							title   : '该订单有多条传单记录',
							message : '请选择明细'
						});*/
					}
				});
			},
			getOrdInInfo( orderId ){
				let self = this;
				this.$request.staff.paper.getOrdInInfo( orderId ).then(res=>{
					if( res.errorCode != '00000' ){
						self.submitReset();
						return ;
					}
					self.pageInfo.strOrderInfo = '订单数:' + res.result.OrdQty + '客户:' + res.result.CusShortName + ' 规格:' + res.result.OrderDescr;
					self.pageInfo.iFinishedQty = res.result.FinishedQty;
					if( res.result.MatName !== '' && res.result.OrderType === 'x' ){
						self.pageInfo.strOrderInfo += ' 货品名称:' + res.result.MatName;
					}
					self.config.field.iQtyOnFocus = true;
				});
			},
			onSubmit(){
				let self = this;
				this.validator.validate( this.formData ).then(()=>{
					self.directInStock( self.formData );
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message);
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
			},
			getUserInfo(){
				let self = this;
				this.$request.staff.user.getUserInfo().then(res=>{
					self.formData.strFactoryId = res.result.factory_id;
					self.formData.strUserId    = res.result.erp_id 
				});
			},
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','直接入库');
			if( typeof(this.$route.query.scanRes) == 'string' ){
				this.formData.strOrderId = this.$route.query.scanRes;
			}
		},
		mounted(){
			this.validator = new schema(this.rules);
			this.config.table.height = window.screen.height - 350;
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
					this.config.field.iQtyOnFocus = false;
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
<style scoped>
	.van-field__word-limit{
		line-height: 1rem;
	}
	.van-field__control {
		background-color: #00000d;
	}
</style>