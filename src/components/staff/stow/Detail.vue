<template>
	<div>
		<div v-if=" config.isEdit == 1 ">
			<van-field v-model="fieldData.strOrderId" disabled label="订单号" input-align="center" v-if=" fieldData.bModDetail "></van-field>
			<wx-scan :scanResult.sync="fieldData.strOrderId" urlType="3" v-else></wx-scan>
			<!-- <van-field readonly clickable label="库区" v-model="fieldData.strStockArea" placeholder="选择库区" input-align="center" v-if="pageConfig.bMStockArea" @click=" config.popup.stockAreaShow = true ">
				<van-icon slot="right-icon" size="16" name="arrow"/>
			</van-field> -->
			<uni-check-box
				label="库区"
				:localdata="strStockAreaAll"
				:radioData.sync="fieldData.strStockArea" 
				:map="{text: 'StockArea', value: 'StockArea'}"
				@change="stockAreaChange"
			>
			</uni-check-box>
			<van-field readonly v-model="fieldData.strOrderInfo" placeholder="订单信息" label="订单信息" input-align="left" type="textarea" autosize :rows="1" class="field-readonly">
			</van-field>
			<div class="van-row" style="text-align:left;">
				<div class="van-col van-col--12">
					<field-label-variable :value.sync="fieldData.dOtherFee" label="附加费" placeholder="附加费" maxlength="8" type="number"></field-label-variable>
				</div>
				<div class="van-col van-col--12">
					<field-label-variable :value.sync="fieldData.areaQty" label="库存数" placeholder="库存数" maxlength="10" type="number" readonly="readonly"></field-label-variable>
				</div>
			</div>
			<div class="van-row" style="text-align:left;">
				<div class="van-col van-col--12">
					<field-label-variable :value.sync="fieldData.iDeliQty" label="送货数" placeholder="送货数" maxlength="8" type="number" :onFocus.sync="config.field.iDeliQtyOnFocus"></field-label-variable>
				</div>
				<div class="van-col van-col--12">
					<field-label-variable :value.sync="fieldData.iFreeQty" label="赠品数" placeholder="赠品数" maxlength="10" type="number"></field-label-variable>
				</div>
			</div>
			<template v-if="fieldData.orderType == 'x'">
				<cus-picker :cusName.sync="fieldData.strCusId" ref="cusPicker"></cus-picker>
			</template>
			<van-field readonly label="送货公司" v-model="fieldData.deliArea" placeholder="选择送货公司" input-align="center" @click="config.popup.deliAreaShow = true">
				<van-icon slot="right-icon" size="16" name="arrow"/>
			</van-field>
			<van-field v-model="fieldData.strDNRemark" placeholder="送货备注" label="送货备注" input-align="center" type="textarea" autosize maxlength="50" :rows="1">
			</van-field>
			<div class="van-row van-row--flex van-row--justify-end" style=" padding:0.625rem; ">
				<template v-if=" fieldData.bModDetail ">
					<div class="van-col van-col--8">
						<van-button type="primary" style="width:90%" size="small" @click="onLoadClick()">修改</van-button>
					</div>
					<div class="van-col van-col--8">
						<van-button plain type="primary"  size="small" style="width:100%" @click="cancelClick()">取消修改</van-button>
					</div>
				</template>
				<template v-else>
					<div class="van-col van-col--8">
						<van-button type="primary"  size="small" style="width:90%" @click="onLoadClick()">装货</van-button>
					</div>
					<div class="van-col van-col--8">
						<van-button plain type="primary"  size="small" style="width:90%" @click="resetClick()">重置</van-button>
					</div>
				</template>
			</div>
		</div>
		<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0rem 1rem;" v-else>
			明细
		</div>
		<v-table 
			is-horizontal-resize 
			:is-vertical-resize="true" 
			style="width:100%;" 
			:height="config.table.height" 
			:columns="config.table.columns" 
			:table-data="table.data" 
			row-hover-color="#eee" 
			row-click-color="#edf7ff" 
			even-bg-color="#fafafa"
			@on-custom-comp="customCompFunc">
		</v-table>
		<van-popup v-model="config.popup.deliAreaShow" position="top" :style="{ height: '100%', width:'100%' }">
			<div class="header" style="width:100%;position:fixed;height:2.875rem;top:0rem;text-align:center;">
				<div class="van-nav-bar van-nav-bar--fixed van-hairline--bottom">
					<div class="van-nav-bar__title van-ellipsis">
						请选择送货地区
					</div>
				</div>
			</div>
			<div style="width:100%;margin-top:2.875rem;"></div>
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
			<van-button type="primary" size="normal" style="width:100%;position:fixed;bottom:0rem;" @click="config.popup.deliAreaShow = false">确定</van-button>
		</van-popup>
		<!-- <van-popup v-model="config.popup.stockAreaShow" position="top" :style="{ height: '100%', width:'100%' }">
			<div class="header" style="width:100%;position:fixed;height:2.875rem;top:0rem;text-align:center;">
				<div class="van-nav-bar van-nav-bar--fixed van-hairline--bottom">
					<div class="van-nav-bar__title van-ellipsis">
						请选择库区
					</div>
				</div>
			</div>
			<div style="width:100%;margin-top:2.875rem;"></div>
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
			<van-button type="primary" size="normal" style="width:100%;position:fixed;bottom:0rem;" @click="config.popup.stockAreaShow = false">确定</van-button>
		</van-popup> -->
	</div>
</template>
<script>
	import { Button, Cell, CellGroup, Popup, Icon, Field, RadioGroup, Radio } from 'vant';
	import { Dialog, Toast  } from 'vant';
	import FieldLabelVariable from '@/components/subject/staff/FieldLabelVariable.vue';
	import CusPicker from '@/components/subject/picker/CusPicker.vue';
	import WxScan from '@/components/subject/WxScan.vue';
	import schema from 'async-validator';

	import UniCheckBox from '@/components/subject/checkbox/UniCheckBox.vue'
	/*api接口*/
	import { getWebConfig } from '@/api/common/webConfig.js'
	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Popup.name]: Popup,
			[Icon.name]: Icon,
			[Field.name]: Field,
			[RadioGroup.name]: RadioGroup,
			[Radio.name]: Radio,

			FieldLabelVariable,
			WxScan,
			CusPicker,
			UniCheckBox
		},
		data(){
			return {
				config:{
					table: {
						height: 0
					},
					popup: {
						deliAreaShow: false,
						stockAreaShow: false
					},
					button: {
						showLoadButton: true
					},
					table: {
						columns: [
							{field: 'OrderId', title: '订单编号', width: 100, titleAlign: 'center',columnAlign: 'center',isResize:true,isFrozen: true},
							{field: 'CusSubName', title: '子公司', width: 100, titleAlign: 'center',columnAlign: 'center',isResize:true},
							{field: 'DeliQty', title: '送货数', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'StockArea', title: '库区', width: 80, titleAlign: 'center',columnAlign: 'center',isResize:true},
							{field: 'Length', title: '板长', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'Width', title: '板宽', width: 80, titleAlign: 'center',columnAlign: 'center',isResize:true},
							{field: 'BoardId', title: '材质编号', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
						]
					},
					isEdit: 0,
					field: {
						iDeliQtyOnFocus : false
					},
					cusPicker: {
						isInit: false
					}
				},
				table: {
					data: []
				},
				filterForm: {
					listNo: '',
					orderType: '',
				},
				fieldData:{
					strCusId     : '',  //客户编号
					strOrderId   : '',  //订单号
					strStockArea : '',	//库区
					strOrderInfo : '',  //订单信息
					dOtherFee    : 0,	//附加费
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
				strStockAreaAll: [],
				deliveryAddress: {
					all: [],
					fit: []
				},
				erpDelForm: {
					iPListNo     : '',
					iDNId        : '',
					strFactoryId : '',
					strUserId    : ''
				},
				rules: {
					strOrderId : [
						{ required : true , message : '请输入有效订单号' },
					],
					iDeliQty : [
						{ required : true, message : '请输入有效的装货数' },
						{ validator:(rule, value, callback, source, options)=>{
							let errors;
							if( value <= 0 ){
								errors = '请输入有效的装货数';
							}
							callback(errors)
						} },
					],
					OrderType : [
						{ required : true , message : '订单类型非法' },
						{
							validator:(rule, value, callback, source, options)=>{
								let errors;
								if( value === 'x' && !this.fieldData.strCusId ){
									errors = '请选择客户';
								}
								callback(errors)
							}
						}
					],
					strCusSubNo: [
						{ required : true , message : '请选择送货地区' },
					],
					dOtherFee : [
						{ required : true , message : '请填写附加费' },
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
				this.$request.staff.connecterp.erpAddDNDetail( data ).then(res=>{
					if( res.data.result[1] === false  ){
						Dialog.alert({
							title   : '装货出错',
							message : res.data.result[0]
						}).then(()=>{
							Dialog.close()
						});
					}else{
						Dialog.alert({
							message:'装货成功'
						}).then(()=>{
							Dialog.close()
						});
						self.cancelClick();
						self.getPDNDetail( this.filterForm );
					}
				});
			},
			erpDelDNDetail( data ){
				let self = this;
				this.$request.staff.connecterp.erpDelDNDetail( data ).then(res=>{
					if( res.data.result[1] === false ){
						Toast.fail('装货出错');
					}else{
						for (var i = self.table.data.length - 1; i >= 0; i--) {
							if( self.table.data[i].DNId === data.iDNId){
								break;
							}
						}
						self.table.data.splice(i,1);
						self.cancelClick();
					}
				});
			},
			getStockArea( strOrderId, needReset = true ){
				let self = this;
				self.strStockAreaAll = [];
				this.$request.staff.stow.getStockArea( strOrderId ).then(res=>{
					self.config.field.iDeliQtyOnFocus = true;
					if( res.result.length <= 0 ){
						return ;
					}
					res.result.forEach((item,index)=>{
						self.strStockAreaAll.push(item);
					});
				}).then(()=>{
					if( this.strStockAreaAll.length <= 0){
						return ;
					}
					this.$nextTick(()=>{
						if( needReset ){
							this.fieldData.strStockArea = this.strStockAreaAll[0].StockArea;
							this.fieldData.areaQty      = this.strStockAreaAll[0].Qty;
						}
					})
				});
			},
			async detailConfig(){
				const { result } = await getWebConfig({paramType: 'staffStow'})
				this.deliveryAddress.all = result.customerDN
				this.pageConfig.bMStockArea = result.bMStockArea == 1 ? true : false
				this.pageConfig.bPackAddODefSQ = result.bPackAddODefSQ == 1 ? true : false
				await this.getUserInfo()
				if( this.pageConfig.bMStockArea ) {
					this.config.table.height -=  50
				}
				if( this.fieldData.orderType == 'x' ) {
					this.config.table.height  -= 50
				}
				await this.getPDNDetail( this.filterForm )
			},
			getPDNDetail( data ){
				let self = this;
				this.$request.staff.stow.getPDNDetail( data ).then(res=>{
					self.table.data = res.result;
				});
			},
			getOrdPackInfo( strOrderId ){
				if( this.fieldData.bModDetail ) return 
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
						self.fieldData.strOrderInfo += ' 货品名称:' + res.result.MatName;
					}
					self.fieldData.iFreeQty    = 0;
					self.fieldData.strDNRemark = res.result.DNRemark;
					self.fieldData.deliArea    = res.result.CusSubNo;
					self.deliveryAddress.fit   = [];
					if( this.fieldData.orderType == 'x' ){
						if( this.fieldData.strCusId == res.result.CusId ){
							this.setCustomerDN( res.result.CusId );
						}
						this.config.cusPicker.isInit = true;
						this.fieldData.strCusId = res.result.CusId;
					}else{
						this.setCustomerDN( res.result.CusId );
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
				this.config.field.iDeliQtyOnFocus = false;
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
				this.fieldData.iDNId        = rowData.DNId;
				this.fieldData.strOrderInfo = orderInfo;
				this.fieldData.iDeliQty     = rowData.DeliQty;
				this.fieldData.iFreeQty     = rowData.FreeQty;
				this.fieldData.dOtherFee    = rowData.OtherFee;
				this.fieldData.strDNRemark  = rowData.DNRemark;
				this.fieldData.strCusSubNo  = rowData.CusSubNo;
				this.deliveryAddress.fit    = [];
				this.fieldData.deliArea     = rowData.CusSubNo;
				if( this.fieldData.orderType == 'x' ){
					if( this.fieldData.strCusId == rowData.CusId ){
						this.setCustomerDN( rowData.CusId );
					}
					this.config.cusPicker.isInit = true;
					this.fieldData.strCusId = rowData.CusId;
				}else{
					this.setCustomerDN( rowData.CusId );
				}
				this.fieldData.strStockArea = rowData.StockArea;
				this.getStockArea( this.fieldData.strOrderId , false);
			},
			rowDelete( index, rowData ){
				this.erpDelForm.iPListNo     = rowData.PListNo;
				this.erpDelForm.iDNId        = rowData.DNId;
				Dialog.confirm({
					title   : 'erp删除提示',
					message : '确定删除订单' + rowData.OrderType +  rowData.OrderId + '?',
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
				this.fieldData.strCusId     = '';
				this.fieldData.strStockArea = '';
				this.fieldData.areaQty      = '';
				this.fieldData.strOrderId   = '';
				this.fieldData.strOrderInfo = '';
				this.fieldData.iDeliQty     = '';
				this.fieldData.iFreeQty     = '';
				this.fieldData.dOtherFee    = 0;
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
                    strCusSubNo  : this.fieldData.deliArea,
                    OrderType    : this.fieldData.orderType,
                    bModify      : this.fieldData.bModDetail,
                    strFactoryId : this.erpDelForm.strFactoryId,
                    strUserId    : this.erpDelForm.strUserId,
                    strCusId     : this.fieldData.orderType == 'x' ? this.fieldData.strCusId : '',
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
			},
			init(){
				if( typeof(this.$route.query.scanRes) == 'string' ){
					this.fieldData.strOrderId = this.$route.query.scanRes;
				}
				if( this.$route.query.listNo !== undefined && this.$route.query.orderType !== undefined && this.$route.query.isEdit !== undefined ){
					this.filterForm.listNo    = this.$route.query.listNo;
					this.filterForm.orderType = this.$route.query.orderType;
					this.erpDelForm.PListNo   = this.$route.query.listNo;
					this.fieldData.orderType  = this.$route.query.orderType;
					this.config.isEdit        = this.$route.query.isEdit;
					if( this.config.isEdit == 1 ){
						this.config.table.columns.push({field: 'stowDetailHandle', title: '操作', width: 150, titleAlign: 'center',componentName:'table-operate', columnAlign: 'center',isResize:true})
					}
				}else{
					this.$router.push( this.$store.state.staff.backPath );
				}
			},
			setCustomerDN( custId ){
				this.deliveryAddress.fit = [];
				for (var i = this.deliveryAddress.all.length - 1; i >= 0; i--) {
					if( this.deliveryAddress.all[i].CusId === custId  ){
						this.deliveryAddress.fit.push(this.deliveryAddress.all[i]);
					}
				}
			},
			stockAreaChange( e ) {
				this.fieldData.areaQty = e.detail.data.Qty
				//this.fieldData.areaQty = e.detail.data.Qty
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','扫描装货详情');
			this.$store.commit('staff/setBackPath','/staff/stow/Lists');
			this.init();
		},
		mounted(){
			this.config.table.height  = window.screen.height - 425;
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
			/*strStockAreaChange(){
				return this.fieldData.strStockArea;
			},*/
			cusNameChange(){
				return this.fieldData.strCusId;
			}
		},
		watch:{
			strOrderIdChange( newV, oldV ){
				if( newV === undefined ){
					return ;
				}
				if( newV.length === 11 && !this.fieldData.bModDetail ){
					this.config.field.iDeliQtyOnFocus = false;
					this.getOrdPackInfo( newV );
				}
			},
			/*strStockAreaChange( newV, oldV ){
				if( newV !== '' ){
					this.strStockAreaAll.forEach((item,index)=>{
						if( item.StockArea === newV ){
							this.fieldData.areaQty = item.Qty;
						}
					});
				}
			},*/
			cusNameChange( newV, oldV ){
				this.deliveryAddress.fit = [];
				if( !this.config.cusPicker.isInit ){
					this.fieldData.deliArea = '';
				}
				this.config.cusPicker.isInit = false;
				if( !newV ) return
				this.setCustomerDN( newV );
			}
		}
	}
</script>