<template>
	<div>
		<div v-if=" config.isEdit == 1 ">
			<van-field v-model="fieldData.strOrderId" disabled label="订单号" input-align="center" v-if=" fieldData.bModDetail "></van-field>
			<wx-scan :scanResult.sync="fieldData.strOrderId" urlType="3" v-else></wx-scan>
			<van-field readonly clickable label="库区" v-model="fieldData.strStockArea" placeholder="选择库区" input-align="center" v-if="pageConfig.bMStockArea" @click=" config.popup.stockAreaShow = true ">
				<van-icon slot="right-icon" size="16" name="arrow"/>
			</van-field>
			<van-field readonly v-model="fieldData.strOrderInfo" placeholder="订单信息" label="订单信息" input-align="left" type="textarea" autosize rows="2">
			</van-field>
			<div class="van-row" style="text-align:left;">
				<div class="van-col van-col--12">
					<van-field v-model="fieldData.dOtherFee" placeholder="附加费" label="附加费" input-align="center" type="number" :maxlength="8">
					</van-field>
				</div>
				<div class="van-col van-col--12">
					<van-field v-model="fieldData.areaQty" placeholder="库存数" label="库存数" input-align="center" type="number" :maxlength="10" readonly>
					</van-field>
				</div>
			</div>
			<div class="van-row" style="text-align:left;">
				<div class="van-col van-col--12">
					<van-field v-model="fieldData.iDeliQty" placeholder="送货数" label="送货数" input-align="center" type="number" :maxlength="8">
					</van-field>
				</div>
				<div class="van-col van-col--12">
					<van-field v-model="fieldData.iFreeQty" placeholder="赠品数" label="赠品数" input-align="center" type="number" :maxlength="10">
					</van-field>
				</div>
			</div>
			<van-field readonly label="送货公司" v-model="fieldData.deliArea" placeholder="选择送货公司" input-align="center" @click="config.popup.deliAreaShow = true">
				<van-icon slot="right-icon" size="16" name="arrow"/>
			</van-field>
			<van-field v-model="fieldData.strDNRemark" placeholder="送货备注" label="送货备注" input-align="center"  type="textarea" autosize maxlength="50" show-word-limit>
			</van-field>
			<div class="van-row van-row--flex van-row--justify-end" v-if=" fieldData.bModDetail ">
				<div class="van-col van-col--8">
					<van-button type="primary" style="width:90%" @click="onLoadClick()">修改</van-button>
				</div>
				<div class="van-col van-col--8">
					<van-button plain type="primary" style="width:100%" @click="cancelClick()">取消修改</van-button>
				</div>
			</div>
			<div class="van-row van-row--flex van-row--justify-end" v-else>
				<div class="van-col van-col--8">
					<van-button type="primary" style="width:90%" @click="onLoadClick()">装货</van-button>
				</div>
				<div class="van-col van-col--8">
					<van-button plain type="primary" style="width:90%" @click="resetClick()">重置</van-button>
				</div>
			</div>
		</div>
		<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;" v-else>
			明细
		</div>
		<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;height:500px;" :columns="config.table.columns" :table-data="table.data" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc" >
		</v-table>
		<van-popup v-model="config.popup.deliAreaShow" position="top" :style="{ height: '100%', width:'100%' }">
			<div class="header" style="width:100%;position:fixed;height:46px;top:0px;text-align:center;">
				<div class="van-nav-bar van-nav-bar--fixed van-hairline--bottom">
					<div class="van-nav-bar__title van-ellipsis">
						请选择送货地区
					</div>
				</div>
			</div>
			<div style="width:100%;margin-top:46px;"></div>
			<van-radio-group v-model="fieldData.deliArea" v-if="config.popup.deliAreaShow">
				<van-cell-group>
					<div role="button" tabindex="0" class="van-cell van-cell--clickable"  v-for="(item,index) in deliveryAddress.fit" :key=" 'address' + index ">
						<div class="van-cell__title">
							<span>{{ item.CusSubNo }}</span><br/>
							<span v-if="item.SubDNAddress">{{ item.SubDNAddress }}</span><br/>
						</div>
						<van-radio slot="right-icon" :name="item.CusSubNo" />
					</div>
				</van-cell-group>
			</van-radio-group>
			<van-button type="primary" size="normal" style="width:100%;position:fixed;bottom:0px;" @click="config.popup.deliAreaShow = false">确定</van-button>
		</van-popup>
		<van-popup v-model="config.popup.stockAreaShow" position="top" :style="{ height: '100%', width:'100%' }">
			<div class="header" style="width:100%;position:fixed;height:46px;top:0px;text-align:center;">
				<div class="van-nav-bar van-nav-bar--fixed van-hairline--bottom">
					<div class="van-nav-bar__title van-ellipsis">
						请选择库区
					</div>
				</div>
			</div>
			<div style="width:100%;margin-top:46px;"></div>
			<van-radio-group v-model="fieldData.strStockArea" v-if="config.popup.stockAreaShow">
				<van-cell-group>
					<div role="button" tabindex="0" class="van-cell van-cell--clickable"  v-for="(item,index) in strStockAreaAll" :key=" 'stock' + index ">
						<div class="van-cell__title">
							<span>{{ item.StockArea }}</span><br/>
						</div>
						<van-radio slot="right-icon" :name="item.StockArea" />
					</div>
				</van-cell-group>
			</van-radio-group>
			<van-button type="primary" size="normal" style="width:100%;position:fixed;bottom:0px;" @click="config.popup.stockAreaShow = false">确定</van-button>
		</van-popup>
	</div>
</template>
<script>
	import { VTable, VPagination } from 'vue-easytable';
	import { Button, Cell, CellGroup, Popup, Icon, Field, RadioGroup, Radio } from 'vant';
	import { Dialog, Toast  } from 'vant';
	import WxScan from '@/components/subject/WxScan.vue';
	import schema from 'async-validator';
	export default {
		components:{
			[VTable.name]: VTable,
			[VPagination.name]: VPagination,

			[Button.name]: Button,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Popup.name]: Popup,
			[Icon.name]: Icon,
			[Field.name]: Field,
			[RadioGroup.name]: RadioGroup,
			[Radio.name]: Radio,

			WxScan
		},
		data(){
			return {
				config:{
					popup:{
						deliAreaShow  : false,
						stockAreaShow : false
					},
					button:{
						showLoadButton : true
					},
					table:{
						columns:[
							{field: 'OrderId', title: '订单编号', width: 100, titleAlign: 'center', titleCellClassName:'table-title-class',columnAlign: 'center',isResize:true,isFrozen: true},
							{field: 'CusSubName', title: '子公司', width: 100, titleAlign: 'center',titleCellClassName:'table-title-class', columnAlign: 'center',isResize:true},
							{field: 'DeliQty', title: '送货数', width: 80, titleAlign: 'center', titleCellClassName:'table-title-class',columnAlign: 'center',isResize:true},
							{field: 'StockArea', title: '库区', width: 80, titleAlign: 'center',titleCellClassName:'table-title-class', columnAlign: 'center',isResize:true},
							{field: 'Length', title: '板长', width: 80, titleAlign: 'center', titleCellClassName:'table-title-class',columnAlign: 'center',isResize:true},
							{field: 'Width', title: '板宽', width: 80, titleAlign: 'center',titleCellClassName:'table-title-class', columnAlign: 'center',isResize:true},
							{field: 'BoardId', title: '材质编号', width: 100, titleAlign: 'center',titleCellClassName:'table-title-class', columnAlign: 'center',isResize:true},
						]
					},
					isEdit : 0,
				},
				table:{
					data : []
				},
				filterForm:{
					listNo    : '',
					orderType : '',
				},
				fieldData:{
					strOrderId   : '',  //订单号
					strStockArea : '',	//库区
					strOrderInfo : '',  //订单信息
					dOtherFee    : '',	//附加费
					iDeliQty     : '',  //送货数
					iFreeQty     : '',	//赠品数
					strDNRemark  : '',	//送货备注,
					orderType    : '',	//订单类型
					areaQty      : '',	//库存数
					deliArea     : '',	//送货公司
					iDNId        : '',
					strCusSubNo  : '',
					bModDetail   : false //是否是修改模式
				},
				strStockAreaAll:[],
				deliveryAddress:{
					all:[],
					fit:[]
				},
				erpDelForm:{
					iPListNo     : '',
					iDNId        : '',
					strFactoryId : '',
					strUserId    : ''
				},
				rules:{
					strOrderId : [
						{ required : true , message : '请输入有效订单号' },
					],
					iDeliQty : [
						{ required : true, message : '请输入有效的装货数' },
						{ iDeliQty(rule, value, callback, source, options){
							let errors = [];
							if( value <= 0 ){
								errors.push(new Error('请输入有效的装货数'));
							}
							return errors;
						} },
					],
					OrderType : [
						{ required : true , message : '订单类型非法' }
					]
				},
				validator:{},
				pageConfig:{
					bMStockArea    : false,
					bPackAddODefSQ : false
				}
			}
		},
		methods:{
			erpAddDNDetail( data ){
				let self = this;
				this.$request.staff.stow.erpAddDNDetail( data ).then(res=>{
					if( res.result[1] === false  ){
						Toast.fail('装货出错');
					}else{
						Toast.success('装货成功');
						self.cancelClick();
						self.getPDNDetail( this.filterForm );
					}
				});
			},
			erpDelDNDetail( data ){
				let self = this;
				this.$request.staff.stow.erpDelDNDetail( data ).then(res=>{
					if( res.result[1] === false ){
						Toast.fail('装货出错');
					}else{
						for (var i = self.table.data.length - 1; i >= 0; i--) {
							if( self.table.data[i].DNId === data.iDNId){
								break;
							}
						}
						self.table.data.splice(i,1);
					}
				});
			},
			getStockArea( strOrderId ){
				let self = this;
				this.$request.staff.stow.getStockArea( strOrderId ).then(res=>{
					res.result.forEach((item,index)=>{
						self.strStockAreaAll.push(item);
					});
				}).then(()=>{
					if( this.fieldData.strStockArea != '' ){
						return ;
					}
					this.$nextTick(()=>{
						this.fieldData.strStockArea = this.strStockAreaAll[0].StockArea;
						this.fieldData.areaQty      = this.strStockAreaAll[0].Qty;
					})
				});
			},
			detailConfig(){
				let self = this;
				this.$request.staff.stow.detailConfig().then(res=>{
					self.deliveryAddress.all       = res.result.cus_dn_select;
					self.pageConfig.bMStockArea    = res.result.config_info.bMStockArea == 1 ? true : false;
					self.pageConfig.bPackAddODefSQ = res.result.config_info.bPackAddODefSQ == 1 ? true : false;
				}).then(()=>{
					this.getUserInfo();
				}).then(()=>{
					this.$nextTick(()=>{
						this.getPDNDetail( this.filterForm );
					})
				});
			},
			getPDNDetail( data ){
				let self = this;
				this.$request.staff.stow.getPDNDetail( data ).then(res=>{
					self.table.data = res.result;
				});
			},
			getOrdPackInfo( strOrderId ){
				let self = this;
				this.$request.staff.stow.getOrdPackInfo( strOrderId ).then(res=>{
					if( res.errorCode != '00000' ){
						Toast.fail('请输入有效订单号');
						return ;
					}
					self.fieldData.orderType    = res.result.OrderType;
					self.fieldData.strOrderInfo = '订单客户:' + res.result.CusId + ' ' + res.result.CusShortName + ' 材质编号:' + res.result.BoardId + ' 长宽:' + res.result.Length + 'x' + res.result.Width;
					if( res.result.BoxL > 0 ){
						self.fieldData.strOrderInfo += '长宽高:' + res.result.BoxL + 'x' + res.result.BoxW + 'x' + res.result.BoxH;
					}
					self.fieldData.strOrderInfo += ' 订单数:' + res.result.OrdQty;
					self.fieldData.areaQty       = res.result.StockQty;
					if( res.result.DNHint !== '' ){
						self.fieldData.strOrderInfo += ' 客户备注:' + res.result.DNHint;
					}
					if( res.result.MatName !== '' && res.result.OrderType === 'x' ){
						self.fieldData.strOrderInfo += ' 货品名称:' + res.result.MatName
					}
					self.fieldData.iFreeQty    = 0;
					self.fieldData.strDNRemark = res.result.DNRemark;
					self.fieldData.deliArea    = res.result.CusSubNo;
					self.deliveryAddress.fit   = [];

					for (var i = self.deliveryAddress.all.length - 1; i >= 0; i--) {
						if( self.deliveryAddress.all[i].CusId === res.result.CusId){
							self.deliveryAddress.fit.push(this.deliveryAddress.all[i]);
						}
					}
					if( self.pageConfig.bPackAddODefSQ ){
						self.fieldData.iDeliQty = self.fieldData.areaQty;
					}else{
						self.fieldData.iDeliQty = res.result.OrdQty - res.result.PackQty;
					}
				}).then(()=>{
					this.$nextTick(()=>{
						this.getStockArea( this.fieldData.strOrderId );
					})
				});
			},
			customCompFunc( params ){
				if( params.type === 'edit' ){
					this.rowEdit( params.index, params.rowData );
				}else if( params.type === 'delete' ){
					this.rowDelete( params.index, params.rowData );
				}
			},
			rowEdit( index, rowData ){
				this.fieldData.bModDetail = true;
				this.fieldData.strOrderId = rowData.OrderType +  rowData.OrderId;
				let orderInfo = '订单客户:' + rowData.CusId + ' ' + rowData.CusShortName + ' 材质编号:' + rowData.BoardId + ' 长宽:' + rowData.Length + 'x' + rowData.Width;
				if( rowData.BoxL > 0 ){
					orderInfo += '长宽高:' + rowData.BoxL + 'x' + rowData.BoxW + 'x' + rowData.BoxH;
				}
				orderInfo += ' 订单数:' + rowData.OrdQty;
				this.fieldData.areaQty = rowData.StockQty;
				if( rowData.MatName !== '' && rowData.OrderType === 'x' ){
					orderInfo += ' 货品名称:' + rowData.MatName;
				}
				this.fieldData.strOrderInfo = orderInfo;
				this.fieldData.iDeliQty     = rowData.DeliQty;
				this.fieldData.iFreeQty     = rowData.FreeQty;
				this.fieldData.dOtherFee    = rowData.OtherFee;
				this.fieldData.strDNRemark  = rowData.DNRemark;
				this.fieldData.strCusSubNo  = rowData.CusSubNo;
				this.deliveryAddress.fit    = [];
				this.fieldData.deliArea     = rowData.CusSubNo
				for (var i = this.deliveryAddress.all.length - 1; i >= 0; i--) {
					if( this.deliveryAddress.all[i].CusId === rowData.CusId  ){
						this.deliveryAddress.fit.push(this.deliveryAddress.all[i]);
					}
				}
				this.fieldData.strStockArea = rowData.StockArea;
				this.getStockArea( this.fieldData.strOrderId );
			},
			rowDelete( index, rowData ){
				this.erpDelForm.iPListNo     = rowData.PListNo;
				this.erpDelForm.iDNId        = rowData.DNId;
				Dialog.confirm({
					title:'erp删除暂缺',
					message:'确定删除订单' + rowData.OrderType +  rowData.OrderId + '?',
				}).then(()=>{
					this.erpDelDNDetail( this.erpDelForm );
				}).catch(()=>{
					Dialog.close();
				});
			},
			cancelClick(){

				this.fieldData.bModDetail      = false;
				this.config.popup.deliAreaShow = false;
				this.resetClick();
			},
			resetClick(){
				this.fieldData.areaQty      = '';
				this.fieldData.strOrderId   = '';
				this.fieldData.strOrderInfo = '';
				this.fieldData.iDeliQty     = '';
				this.fieldData.iFreeQty     = '';
				this.fieldData.dOtherFee    = '';
				this.fieldData.strDNRemark  = '';
				this.fieldData.strCusSubNo  = '';
				this.fieldData.deliArea     = '';
				this.deliveryAddress.fit    = [];
			},
			onLoadClick(){
				if( this.fieldData.strOrderId === '' ){
					Toast.fail('请输入订单号');
					return ;
				}
				if( this.fieldData.iDeliQty <= 0 ){
					Toast.fail('请输入有效的装货数');
					return ;
				}
				if( this.fieldData.orderType === '' ){
					Toast.fail('订单类型非法');
					return ;
				}
				let postData = {
					iDNId        : this.fieldData.bModDetail ? this.fieldData.iDNId : 0,
                    iPListNo     : this.erpDelForm.PListNo,
                    iDeliQty     : this.fieldData.iDeliQty,
                    iFreeQty     : this.fieldData.iFreeQty,
                    dOtherFee    : this.fieldData.dOtherFee,
                    strOrderId   : this.fieldData.strOrderId,
                    strStockArea : this.fieldData.strStockArea,
                    strDNRemark  : this.fieldData.strDNRemark,
                    strCusSubNo  : this.fieldData.strCusSubNo,
                    OrderType    : this.fieldData.orderType,
                    bModify      : this.fieldData.bModDetail,
                    strFactoryId : this.erpDelForm.strFactoryId,
                    strUserId    : this.erpDelForm.strUserId,
				};
				if(JSON.stringify( this.validator ) == "{}"){
					this.validator = new schema( this.rules );
				}
				let self = this;
				this.validator.validate(postData).then(()=>{
					self.erpAddDNDetail( postData );
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message);
				});
			},
			getUserInfo(){
				let self = this;
				this.$request.staff.user.getUserInfo().then(res=>{
					self.erpDelForm.strFactoryId = res.result.factory_id;
					self.erpDelForm.strUserId    = res.result.erp_id 
				});
			}
		},
		created(){
			Toast.success(this.$route.query.scanRes);
			this.$store.commit('staff/setHeaderTitle','扫描装货详情');
			if( this.$route.query.listNo !== undefined && this.$route.query.orderType !== undefined && this.$route.query.isEdit !== undefined ){
				this.filterForm.listNo    = this.$route.query.listNo;
				this.filterForm.orderType = this.$route.query.orderType;
				this.erpDelForm.PListNo   = this.$route.query.listNo;
				this.fieldData.orderType  = this.$route.query.orderType;
				this.config.isEdit        = this.$route.query.isEdit;
				if( this.config.isEdit == 1 ){
					this.config.table.columns.push({field: 'stowDetailHandle', title: '操作', width: 150, titleAlign: 'center',titleCellClassName:'table-title-class',componentName:'table-operate', columnAlign: 'center',isResize:true})
				}
			}else{
				this.$router.go(-1);
			}
		},
		mounted(){
			this.detailConfig();
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			strOrderIdChange(){
				return this.fieldData.strOrderId;
			},
			strStockAreaChange(){
				return this.fieldData.strStockArea;
			}
		},
		watch:{
			strOrderIdChange( newV, oldV ){
				if( newV === undefined ){
					return ;
				}
				if( newV.length === 11 && !this.fieldData.bModDetail ){
					this.getOrdPackInfo( newV );
				}
			},
			strStockAreaChange( newV, oldV ){
				if( newV !== '' ){
					for (var i = this.strStockAreaAll.length - 1; i >= 0; i--) {
						if( this.strStockAreaAll[i].StockArea === newV ){
							this.fieldData.areaQty = this.strStockAreaAll[i].Qty;
						}
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
	.table-title-class{
		color:#0bf147;
	}
</style>