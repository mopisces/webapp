<template>
	<div>
		<div v-if=" config.isEdit == 1 ">
			<van-field v-model="fieldData.strOrderId" placeholder="请输入订单号" label="订单号" input-align="center" :disabled=" !config.button.showLoadButton ">
			 	<van-icon class-prefix="iconfont" size="18" name="saomiao4" slot="right-icon" color="#0bf147" />
			</van-field>
			<van-field readonly clickable label="库区" v-model="fieldData.strStockArea" placeholder="选择库区" input-align="center" v-if="false">
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
			<van-field v-model="fieldData.strDNRemark" placeholder="送货备注" label="送货备注" input-align="center"  type="textarea" autosize rows="2"  maxlength="50" show-word-limit>
			</van-field>
			<div class="van-row van-row--flex van-row--justify-end" v-if=" config.button.showLoadButton ">
				<div class="van-col van-col--6">
					<van-button type="primary" style="width:90%">装货</van-button>
				</div>
				<div class="van-col van-col--6">
					<van-button plain type="primary" style="width:90%">重置</van-button>
				</div>
			</div>
			<div class="van-row van-row--flex van-row--justify-end" v-else>
				<div class="van-col van-col--6">
					<van-button type="primary" style="width:90%">修改</van-button>
				</div>
				<div class="van-col van-col--6">
					<van-button plain type="primary" style="width:100%" @click="cancelClick()">取消修改</van-button>
				</div>
			</div>
		</div>
		<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;" v-else>
			明细
		</div>
		<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;height:500px;" :columns="config.table.columns" :table-data="table.data" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc">
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
					<div role="button" tabindex="0" class="van-cell van-cell--clickable"  v-for="(item,index) in deliveryAddress.fit">
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
	</div>
</template>
<script>
	import { VTable, VPagination } from 'vue-easytable';
	import { Button, Cell, CellGroup, Popup, Icon, Field, RadioGroup, Radio } from 'vant';
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
		},
		data(){
			return {
				config:{
					popup:{
						deliAreaShow:false
					},
					button:{
						showLoadButton:true
					},
					table:{
						columns:[
							{field: 'OrderId', title: '订单编号', width: 100, titleAlign: 'center', titleCellClassName:'table-title-class',columnAlign: 'center',isResize:true,isFrozen: true},
							{field: 'CusSubName', title: '子公司', width: 100, titleAlign: 'center',titleCellClassName:'table-title-class', columnAlign: 'center',isResize:true},
							{field: 'DeliQty', title: '送货数', width: 80, titleAlign: 'center', titleCellClassName:'table-title-class',columnAlign: 'center',isResize:true},
							{field: 'StockArea', title: '库区', width: 80, titleAlign: 'center',titleCellClassName:'table-title-class', columnAlign: 'center',isResize:true},
							{field: 'Length', title: '板长', width: 80, titleAlign: 'center', titleCellClassName:'table-title-class',columnAlign: 'center',isResize:true},
							{field: 'Width', title: '板宽', width: 80, titleAlign: 'center',titleCellClassName:'table-title-class', columnAlign: 'center',isResize:true},
						]
					},
					isEdit:0,
				},
				table:{
					data:[]
				},
				filterForm:{
					listNo:'',
					orderType:'',
				},
				fieldData:{
					strOrderId:'',      //订单号
					strStockArea:'',	//库区
					strOrderInfo:'',    //订单信息
					dOtherFee:'',		//附加费
					iDeliQty:'',        //送货数
					iFreeQty:'',		//赠品数
					strDNRemark:'',		//送货备注,
					orderType:'',		//订单类型
					areaQty:'',			//库存数
					deliArea:''			//送货公司
				},
				deliveryAddress:{
					all:[],
					fit:[]
				},
			}
		},
		methods:{
			detailConfig(){
				let self = this;
				this.$request.staff.stow.detailConfig().then(res=>{
					self.deliveryAddress.all  = res.result.cus_dn_select;
				}).then(()=>{
					this.getPDNDetail( this.filterForm );
				});
			},
			getPDNDetail( data ){
				let self = this;
				this.$request.staff.stow.getPDNDetail( data ).then(res=>{
					self.table.data = res.result;
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
				this.config.button.showLoadButton = false;
				this.fieldData.strOrderId = rowData.strOrderId;
				let orderInfo = '订单客户:' + rowData.CusId + ' ' + rowData.CusShortName + ' 材质编号:' + rowData.BoardId + ' 长宽:' + rowData.Length + 'x' + rowData.Width;
				if( rowData.BoxL > 0 ){
					orderInfo += '长宽高:' + rowData.BoxL + 'x' + rowData.BoxW + 'x' + rowData.BoxH;
				}
				orderInfo += ' 订单数:' + rowData.OrdQty;
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

			},
			rowDelete( index, rowData ){

			},
			cancelClick(){
				this.fieldData.strOrderInfo = '';
				this.fieldData.iDeliQty     = '';
				this.fieldData.iFreeQty     = '';
				this.fieldData.dOtherFee    = '';
				this.fieldData.strDNRemark  = '';
				this.fieldData.strCusSubNo  = '';
				this.fieldData.deliArea     = '';
				this.deliveryAddress.fit    = [];
				this.config.popup.deliAreaShow = false;
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','扫描装货详情');
			if( this.$route.query.listNo !== undefined && this.$route.query.orderType !== undefined && this.$route.query.isEdit !== undefined ){
				this.filterForm.listNo = this.$route.query.listNo;
				this.filterForm.orderType = this.$route.query.orderType;
				this.config.isEdit = this.$route.query.isEdit;
				if( this.config.isEdit == 1 ){
					this.config.table.columns.push({field: 'custome-adv', title: '操作', width: 150, titleAlign: 'center',titleCellClassName:'table-title-class',componentName:'stow-detail-handle', columnAlign: 'center',isResize:true})
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
			
		},
		watch:{

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