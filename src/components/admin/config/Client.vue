<template>
	<div>
		<van-collapse v-model="activeName" accordion>
			<van-collapse-item title="用户权限" name="0">
				<van-switch-cell v-model="formData.Wap1Right" title="用户权限" />
			</van-collapse-item>
			<van-collapse-item title="客户每日订单" name="1">
				<van-row justify="center">
					<van-col span="5">默认日期</van-col>
					<van-col span="9">
						<input v-model="formData.WGetCusOrderBeginDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.WGetCusOrderEndDate" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="5">日期范围</van-col>
					<van-col span="9">
						<input v-model="formData.WGetCusOrderMinDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.WGetCusOrderMaxDate" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="ERP订单" name="2">
				<van-row justify="center">
					<van-col span="5">默认日期</van-col>
					<van-col span="9">
						<input v-model="formData.Wap1GetOrdersBeginDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.Wap1GetOrdersEndDate" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="5">日期范围</van-col>
					<van-col span="9">
						<input v-model="formData.Wap1GetOrdersMinDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.Wap1GetOrdersMaxDate" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="统计下的ERP订单" name="3">
				<van-row justify="center">
					<van-col span="5">日期范围</van-col>
					<van-col span="9">
						<input v-model="formData.StatisGetOrdersMinDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.StatisGetOrdersMaxDate" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="订单统计" name="4">
				<van-row justify="center">
					<van-col span="5">默认日期</van-col>
					<van-col span="9">
						<input v-model="formData.GetOrderSumBeginDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.GetOrderSumEndDate" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="5">日期范围</van-col>
					<van-col span="9">
						<input v-model="formData.GetOrderSumMinDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.GetOrderSumMaxDate" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="退货统计" name="5">
				<van-row justify="center">
					<van-col span="5">默认日期</van-col>
					<van-col span="9">
						<input v-model="formData.GetOrdReturnSumBeginDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.GetOrdReturnSumEndDate" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="5">日期范围</van-col>
					<van-col span="9">
						<input v-model="formData.GetOrdReturnSumMinDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.GetOrdReturnSumMaxDate" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="传单统计" name="6">
				<van-row justify="center">
					<van-col span="5">默认日期</van-col>
					<van-col span="9">
						<input v-model="formData.GetSchSumBeginDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.GetSchSumEndDate" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="5">日期范围</van-col>
					<van-col span="9">
						<input v-model="formData.GetSchSumMinDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.GetSchSumMaxDate" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="库存统计" name="7">
				<van-row justify="center">
					<van-col span="5">默认日期</van-col>
					<van-col span="9">
						<input v-model="formData.GetOrdStockBeginDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.GetOrdStockEndDate" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="5">日期范围</van-col>
					<van-col span="9">
						<input v-model="formData.GetOrdStockMinDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.GetOrdStockMaxDate" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="7">在库超期天数</van-col>
					<van-col span="9">
						<input v-model="formData.GetOrdStockiRemainDay" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="7">交货超期天数</van-col>
					<van-col span="9">
						<input v-model="formData.GetOrdStockiDiffDDay" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="生产分析总计" name="8">
				<van-row justify="center">
					<van-col span="5">默认日期</van-col>
					<van-col span="9">
						<input v-model="formData.GetProInfoBeginDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.GetProInfoEndDate" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="5">日期范围</van-col>
					<van-col span="9">
						<input v-model="formData.GetProInfoMinDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.GetProInfoMaxDate" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="原纸采购" name="9">
				<van-row justify="center">
					<van-col span="5">默认日期</van-col>
					<van-col span="9">
						<input v-model="formData.WGetPOMainBeginDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.WGetPOMainEndDate" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="5">日期范围</van-col>
					<van-col span="9">
						<input v-model="formData.WGetPOMainMinDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.WGetPOMainMaxDate" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="扫码功能" name="wxScan">
				<van-row justify="center">
					<van-switch-cell v-model="formData.UseScan" title="扫码功能" />
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="原纸出库" name="10">
				<van-row justify="center">
					<van-col span="7">默认出库日期</van-col>
					<van-col span="8">
						<input v-model="formData.DoStockOutOpTime" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="7">出库日期范围</van-col>
					<van-col span="8">
						<input v-model="formData.DoStockOutMinDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="8">
						<input v-model="formData.DoStockOutMaxDate" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="原纸入库" name="11">
				<van-row justify="center">
					<van-col span="7">默认入库日期</van-col>
					<van-col span="8">
						<input v-model="formData.DoRStockInOpTime" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="7">入库日期范围</van-col>
					<van-col span="8">
						<input v-model="formData.DoRStockInMinDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="8">
						<input v-model="formData.DoRStockInMaxDate" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="库区控制" name="13">
				<van-switch-cell v-model="formData.bMStockArea" title="是否显示库区" />
				<van-switch-cell v-model="formData.bSAreaControl" title="库区控制" />
			</van-collapse-item>
			<van-collapse-item title="直接入库" name="14">
				<van-row justify="center">
					<van-col span="7">默认入库日期</van-col>
					<van-col span="8">
						<input v-model="formData.DirectInStockDate" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="7">入库日期范围</van-col>
					<van-col span="8">
						<input v-model="formData.DirectInStockMinDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="8">
						<input v-model="formData.DirectInStockMaxDate" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="扫描装货（列表）" name="15">
				<van-row justify="center">
					<van-col span="5">默认日期</van-col>
					<van-col span="9">
						<input v-model="formData.StowBeginDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.StowEndDate" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="5">日期范围</van-col>
					<van-col span="9">
						<input v-model="formData.StowMinDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.StowMaxDate" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="扫描装货（详情）" name="16">
				<van-switch-cell v-model="formData.bPackAddODefSQ" title="订单号装货默认带出库存数" />
			</van-collapse-item>
			<van-collapse-item title="订单试算" name="17">
				<van-switch-cell v-model="formData.CalcAutoGetTrimAndAreaByCus" title="自动获取客户是否默认加修边＆加面积" />
				<van-switch-cell v-model="formData.CalcAutoGetTonLenAndULen" title="自动获取默认的箱舌＆封箱调整" />
				<van-switch-cell v-model="formData.CalcAutoGetdOriPrice" title="自动获取平方报价" />
			</van-collapse-item>
			<van-collapse-item title="收款调账" name="18">
				<van-row justify="center">
					<van-col span="5">默认日期</van-col>
					<van-col span="9">
						<input v-model="formData.RecAdjustBeginDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.RecAdjustEndDate" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="5">日期范围</van-col>
					<van-col span="9">
						<input v-model="formData.RecAdjustMinDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.RecAdjustMaxDate" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
		</van-collapse>
		<div style="width:100%;height:3.125rem;"></div>
		<div style="width:100%;position:fixed;bottom:3.125rem;">
			<van-button round type="primary" style="width:50%;" @click="saveConfig()">
				保存
			</van-button>
			<van-button round type="info" style="width:50%;" @click="getConfig()">
				重置
			</van-button>
		</div>
	</div>
</template>
<script>
	import { Button, Row, Col, Field, SwitchCell, Dialog, Collapse, CollapseItem } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[Row.name]: Row,
			[Col.name]: Col,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[Collapse.name]: Collapse,
			[CollapseItem.name]: CollapseItem,
		},
		data(){
			return {
				formData : {
					Wap1Right                : '',  //用户权限
					WGetCusOrderBeginDate    : '',  //客户每日订单(默认日期)
					WGetCusOrderEndDate      : '',  //客户每日订单
					WGetCusOrderMinDate      : '',  //客户每日订单(日期范围)
					WGetCusOrderMaxDate      : '',  //客户每日订单
					Wap1GetOrdersBeginDate   : '',  //ERP订单(默认日期)
					Wap1GetOrdersEndDate     : '',  //ERP订单
					Wap1GetOrdersMinDate     : '',  //ERP订单(日期范围)
					Wap1GetOrdersMaxDate     : '',  //ERP订单
					StatisGetOrdersMinDate   : '',  //统计下的ERP订单(日期范围)
					StatisGetOrdersMaxDate   : '',  //统计下的ERP订单
					GetOrderSumBeginDate     : '',  //订单统计(默认日期)
					GetOrderSumEndDate       : '',  //订单统计
					GetOrderSumMinDate       : '',  //订单统计(日期范围)
					GetOrderSumMaxDate       : '',  //订单统计
					GetOrdReturnSumBeginDate : '',  //退货统计(默认日期)
					GetOrdReturnSumEndDate   : '',  //退货统计
					GetOrdReturnSumMinDate   : '',  //退货统计(日期范围)
					GetOrdReturnSumMaxDate   : '',  //退货统计
					GetSchSumBeginDate       : '',  //传单统计(默认日期)
					GetSchSumEndDate         : '',  //传单统计
					GetSchSumMinDate         : '',  //传单统计(日期范围)
					GetSchSumMaxDate         : '',  //传单统计
					GetOrdStockBeginDate     : '',  //库存统计(默认日期)
					GetOrdStockEndDate       : '',  //库存统计
					GetOrdStockMinDate       : '',  //库存统计(日期范围)
					GetOrdStockMaxDate       : '',  //库存统计
					GetOrdStockiRemainDay    : '',  //库存统计(在库超期天数)
					GetOrdStockiDiffDDay     : '',  //库存统计(交货超期天数)
					GetProInfoBeginDate      : '',  //生产分析总计(默认日期)
					GetProInfoEndDate        : '',  //生产分析总计
					GetProInfoMinDate        : '',  //生产分析总计(日期范围)
					GetProInfoMaxDate        : '',  //生产分析总计
					WGetPOMainBeginDate      : '',  //原纸采购(默认日期)
					WGetPOMainEndDate        : '',  //原纸采购
					WGetPOMainMinDate        : '',  //原纸采购(日期范围)
					WGetPOMainMaxDate        : '',  //原纸采购
					UseScan                  : '',  //扫码功能
					DoStockOutOpTime         : '',  //原纸出库(默认日期)
					DoStockOutMinDate        : '',  //原纸出库(日期范围)
					DoStockOutMaxDate        : '',  //原纸出库
					DoRStockInOpTime         : '',  //原纸入库(默认日期)
					DoRStockInMinDate        : '',  //原纸入库(日期范围)
					DoRStockInMaxDate        : '',  //原纸入库
					bMStockArea              : '',  //是否显示库区
					bSAreaControl            : '',  //库区控制
					DirectInStockDate        : '',  //直接入库(默认日期)
					DirectInStockMinDate     : '',  //直接入库(日期范围)
					DirectInStockMaxDate     : '',  //直接入库
					StowBeginDate            : '',  //扫描装货-列表(默认日期)
					StowEndDate              : '',  //扫描装货-列表
					StowMinDate              : '',  //扫描装货-列表(日期范围)
					StowMaxDate              : '',  //扫描装货-列表
					bPackAddODefSQ           : '',  //扫描装货-详情(订单号装货默认带出库存数)
					CalcAutoGetTrimAndAreaByCus : '',  //订单试算(自动获取客户是否默认加修边＆加面积)
					CalcAutoGetTonLenAndULen : '',  //订单试算(自动获取默认的箱舌＆封箱调整)
					CalcAutoGetdOriPrice     : '',  //订单试算(自动获取平方报价)
					RecAdjustBeginDate       : '',  //收款调账(默认日期)
					RecAdjustEndDate         : '',  //收款调账
					RecAdjustMinDate         : '',  //收款调账(日期范围)
					RecAdjustMaxDate         : '',  //收款调账
				},
				activeName : '',
			}
		},
		methods:{
			getConfig(){
				let self = this;
				this.$request.admin.config.getConfig().then((res)=>{
					Object.assign(self.formData,res.result);
				}).then(()=>{
					if( this.formData.Wap1Right == 1 ){
						this.formData.Wap1Right = true;
					}else{
						this.formData.Wap1Right = false;
					}
					if( this.formData.UseScan == 1 ){
						this.formData.UseScan = true;
					}else{
						this.formData.UseScan = false;
					}
					if( this.formData.bMStockArea == 1 ){
						this.formData.bMStockArea = true;
					}else{
						this.formData.bMStockArea = false;
					}
					if( this.formData.bSAreaControl == 1 ){
						this.formData.bSAreaControl = true;
					}else{
						this.formData.bSAreaControl = false;
					}
					if( this.formData.bPackAddODefSQ == 1 ){
						this.formData.bPackAddODefSQ = true;
					}else{
						this.formData.bPackAddODefSQ = false;
					}
					if( this.formData.CalcAutoGetTrimAndAreaByCus == 1 ){
						this.formData.CalcAutoGetTrimAndAreaByCus = true;
					}else{
						this.formData.CalcAutoGetTrimAndAreaByCus = false;
					}
					if( this.formData.CalcAutoGetTonLenAndULen == 1 ){
						this.formData.CalcAutoGetTonLenAndULen = true;
					}else{
						this.formData.CalcAutoGetTonLenAndULen = false;
					}
					if( this.formData.CalcAutoGetdOriPrice == 1 ){
						this.formData.CalcAutoGetdOriPrice = true;
					}else{
						this.formData.CalcAutoGetdOriPrice = false;
					}
				});
			},
			saveConfig(){
				let postData = Object.assign({},this.formData);
				postData.Wap1Right      = this.formData.Wap1Right ? 1 : 0;
				postData.UseScan        = this.formData.UseScan ? 1 : 0;
				postData.bMStockArea    = this.formData.bMStockArea ? 1 : 0;
				postData.bSAreaControl  = this.formData.bSAreaControl ? 1 : 0;
				postData.bPackAddODefSQ = this.formData.bPackAddODefSQ ? 1 : 0;
				postData.CalcAutoGetTrimAndAreaByCus = this.formData.CalcAutoGetTrimAndAreaByCus ? 1 : 0;
				postData.CalcAutoGetTonLenAndULen = this.formData.CalcAutoGetTonLenAndULen ? 1 : 0;
				postData.CalcAutoGetdOriPrice = this.formData.CalcAutoGetdOriPrice ? 1 : 0;
				this.$request.admin.config.saveConfig( JSON.stringify( postData ) ).then((res)=>{
					let message = ''
					if( res.errorCode == '00000' ){
						message = '修改成功!';
					}else{
						message = '修改失败!';
					}
					Dialog.alert({
						message : message
					}).then(()=>{
						Dialog.close();
					});
				});
			}
		},
		created(){
			this.$store.commit('admin/setHeaderTitle','内部参数修改');
			this.getConfig();
		},
		mounted(){

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