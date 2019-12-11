<template>
	<div>
		<wx-scan :scanResult.sync="formData.strOrderId" urlType="4"></wx-scan>
		<van-field v-model="formData.strOrderInfo" disabled rows="1" autosize label="订单信息" type="textarea" input-align="center" placeholder="订单信息"></van-field>
		<van-field v-model="formData.iQty" disabled label="数量" type="number" input-align="center"></van-field>
		<van-field readonly clickable label="库区" v-model="formData.strStockArea" placeholder="选择库区" input-align="center" v-if=" pageConfig.bMStockArea == 1 " @click=" config.popup.show = true ">
			<van-icon slot="right-icon" size="16" name="arrow"/>
		</van-field>
		<van-field v-model="formData.strRemark" rows="1" autosize label="备注" type="textarea" placeholder="输入备注"></van-field>
		<div class="van-row van-row--flex van-row--justify-end">
			<div class="van-col van-col--8">
				<van-button type="primary" style="width:90%" @click="onChangeClick()" :disabled="config.button.change.disabled">修改</van-button>
			</div>
			<div class="van-col van-col--8">
				<van-button plain type="primary" style="width:100%" @click="onResetClick()">重置</van-button>
			</div>
		</div>
		<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :height="config.table.height">
		</v-table>
		<van-popup v-model="config.popup.show" position="top" :style="{ height: '100%' }">
			<van-picker show-toolbar title="请选择库区" :columns="pageConfig.stockAreaOpt" @cancel=" config.popup.show = false " @confirm="stockAreaConfirm" :default-index="pageConfig.defaultIndex"/>
		</van-popup>
	</div>
</template>
<script>
	import { Button, Icon, Popup, Field, Picker, Dialog, Toast } from 'vant';
	import WxScan from '@/components/subject/WxScan.vue';
	import { VTable, VPagination } from 'vue-easytable';
	import schema from 'async-validator';
	export default {
		components:{
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Field.name]: Field,
			[Picker.name]: Picker,
			[Toast.name]: Toast,

			[VTable.name]: VTable,
			[VPagination.name]: VPagination,

			WxScan
		},
		data(){
			return {
				formData:{
					strOrderId   : '',   //订单号
					strOrderInfo : '',   //订单信息
					iQty         : 0,    //数量
					strStockArea : '',   //库区
					strRemark    : '',   //备注
					ikey1        : 0,    //定位主键相关
					ikey2        : 0,
                	ikey3        : 0,
                	iOpType      : 0,
                	strFactoryId : '',
                	strUserId    : '',
                	areaQty      : '',
				},
				pageConfig:{
					bMStockArea   : 0,   //是否显示库区
					stockAreaOpt  : [],  //库区可选项
					defaultIndex  : -1,  //库区默认选中
				},
				config:{
					popup:{
						show:false
					},
					table:{
						columns:[
							{field: 'stockOperate', title: '操作',width: 100, titleAlign: 'center',componentName:'table-operate',columnAlign:'center',isResize:true, isFrozen:true},
							{field: 'Effecttime', title: '生效日期', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'StockArea', title: '库区', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'Qty', title: '数量', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'OpType', title: '操作类型', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true,formatter:(rowData)=>{
								switch( rowData.OpType ){
									case 1:
										return '<span>完工入库</span>';
										break;
									case 2:
										return '<span>分纸入库</span>';
										break;
									case 3:
										return '<span>直接入库</span>';
										break;
									case 5:
										return '<span>其它分纸</span>';
										break;
									case 8:
										return '<span>工单分纸</span>';
										break;
									default:
										return '<span>无</span>';
								}
							}},
							{field: 'Remark', title: '备注', width: 150, titleAlign: 'center', columnAlign: 'center',isResize:true},
						],
						height : 0
					},
					button:{
						change:{
							disabled : true
						}
					}
				},
				validator:{},
				rules:{
					strOrderId : [
						{ type: 'string', required: true, message: '请输入订单号'},
					],
					ikey1 : [
						{ pattern : '^[1-9]+$', required: true, message: '请扫描有效的订单号或选择有效记录修改'},
					]
				},
				tableData:[],
			}
		},
		methods:{
			customCompFunc( params ){
				if( params.type === 'stockOperate' ){
					this.formData.strStockArea = params.rowData.StockArea;
					this.formData.strRemark    = params.rowData.Remark;
					this.formData.ikey1        = params.rowData.key1;
	                this.formData.ikey2        = params.rowData.key2;
	                this.formData.ikey3        = params.rowData.key3;
	                this.formData.iQty         = params.rowData.Qty;
	                this.formData.iOpType      = params.rowData.OpType;
	                if( this.pageConfig.bMStockArea && this.pageConfig.stockAreaOpt.length != 0 ){
	                	for (var i = this.pageConfig.stockAreaOpt.length - 1; i >= 0; i--) {
	                		if(this.pageConfig.stockAreaOpt[i].value === params.rowData.StockArea){
	                			this.pageConfig.defaultIndex = i;
	                			break;
	                		}
	                	}
	                }
				}
			},
			getConfig(){
				let self = this;
				this.$request.staff.stock.mStockDetailR().then(res=>{
					self.pageConfig.bMStockArea   = res.result.page_config.bMStockArea;
					res.result.area_select.forEach((item,index)=>{
						self.pageConfig.stockAreaOpt.push({text:item.StockArea,value:item.StockArea});
					});
				}).then(()=>{
					this.getUserInfo();
				});
			},
			getUserInfo(){
				let self = this;
				this.$request.staff.user.getUserInfo().then(res=>{
					self.formData.strFactoryId = res.result.factory_id;
					self.formData.strUserId    = res.result.erp_id;
				});
			},
			stockAreaConfirm( value, index ){
				this.formData.strStockArea = value.value;
				this.config.popup.show     = false;
			},
			onResetClick(){
				this.formData.strOrderId = '';
				this.packInfoReset();
			},
			onChangeClick(){
				let self = this;
				this.validator.validate(this.formData).then(()=>{
					self.erpModify( self.formData  );
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message);
				});
			},
			erpModify( data ){
				let self = this;
				this.$request.staff.connecterp.erpModify( data ).then(res=>{
					if( res.data.result[1] == false ){
						Dialog.alert({
							title   : '修改出错',
							message : res.data.result[0]
						}).then(()=>{
							Dialog.close();
						});
					}else{
						Toast.success('修改成功');
					}
				}).then(()=>{
					this.getStockDetailReload( this.formData.strOrderId );
				});
			},
			getStockDetailReload( strOrderId ){
				let self = this;
				this.$request.staff.stock.getStockDetail( strOrderId ).then(res=>{
					self.tableData = res.result;
				}).then(()=>{
					this.afterModifyReset();
				});
			},
			getStockDetailSearch( strOrderId ){
				let self = this;
				this.$request.staff.stock.getStockDetail( strOrderId ).then(res=>{
					self.tableData = res.result;
					if( res.result.length == 0 ){
						Toast.fail('该订单没有入库记录');
						self.afterModifyReset();
					}else if( res.result.length == 1 ){
						self.formData.strStockArea   = res.result[0].StockArea;
						self.pageConfig.defaultIndex = 0;
						self.formData.strRemark      = res.result[0].Remark;
						self.formData.ikey1          = res.result[0].key1;
	                    self.formData.ikey2          = res.result[0].key2;
	                    self.formData.ikey3          = res.result[0].key3;
	                    self.formData.iQty           = res.result[0].Qty;
	                    self.formData.iOpType        = res.result[0].OpType;
					}else{
						Toast.success('该订单有多条入库记录，请点击明细修改');
						self.afterModifyReset();
					}
				});
			},
			afterModifyReset(){
				this.formData.strStockArea = '';
				this.formData.strRemark    = '';
                this.formData.ikey1        = 0;
                this.formData.ikey2        = 0;
                this.formData.ikey3        = 0;
                this.formData.iQty         = 0;
                this.formData.iOpType      = 0;
			},
			packInfoReset(){
				this.formData.strOrderInfo = '';
                this.tableData             = [];
                this.afterModifyReset();
			},
			getOrdPackInfoWatch( strOrderId ){
				let self = this;
				this.$request.staff.stow.getOrdPackInfo( strOrderId ).then(res=>{
					if( res.errorCode != '00000' ){
						Toast.fail('修改错误');
						self.packInfoReset();
						return ;
					}
					self.formData.strOrderInfo = '订单客户:' + res.result.CusId + ' ' + res.result.CusShortName + ' 材质编号:' + res.result.BoardId + ' 长宽:' + res.result.Length + 'x' + res.result.Width;
					if( res.result.BoxL > 0 ){
						self.formData.strOrderInfo += '长宽高:' + res.result.BoxL + 'x' + res.result.BoxW + 'x' + res.result.BoxH
					}
					self.formData.strOrderInfo += ' 订单数:' + res.result.OrdQty;
					self.formData.areaQty = res.result.StockQty;
					if( res.result.DNHint !== '' ){
						self.formData.areaQty += ' 客户备注:' + res.result.DNHint;
					}
					if( res.result.MatName !== '' && res.result.OrderType === 'x' ){
						self.formData.strOrderInfo += ' 货品名称:' + res.result.MatName;
					}
					this.config.button.change.disabled = false;
					self.getStockDetailSearch( this.formData.strOrderId );	
				});
			},
			init(){
				if( typeof(this.$route.query.scanRes) == 'string' ){
					this.formData.strOrderId = this.$route.query.scanRes;
				}
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','库存修改');
			this.init();
		},
		mounted(){
			this.getConfig();
			this.validator = new schema( this.rules );
			this.config.table.height = window.screen.height - 316;
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			strOrderIdChange(){
				return this.formData.strOrderId;
			}
		},
		watch:{
			strOrderIdChange( newV,oldV ){
				if( newV !== null && newV.length === 11 ){
					this.getOrdPackInfoWatch( newV );
				}
			}
		}
	}
</script>