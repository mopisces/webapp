<template>
	<div>
		<el-form ref="form" :model="form" :rules="rules" label-width="150px" style="width1000px;">
			<table>
				<el-tabs v-model="config.tabPane.activeName" type="card">
					<el-tab-pane label="公共" name="common">
						<tr>
							<el-form-item label="厂商Id" prop="FactoryId">
								<el-input style="width: 140px;" v-model="form.FactoryId"></el-input>
								<el-tag type="success" style="margin-left:10px;">2代不填写/3代填写</el-tag>
							</el-form-item>
						</tr>
						<tr>
							<el-form-item label="厂商名称" prop="FactoryName">
								<el-input style="width: 140px;" v-model="form.FactoryName"></el-input>
							</el-form-item>
						</tr>
						<tr>
							<el-form-item label="外部80端口" prop="Open80Port">
								<el-checkbox v-model="form.Open80Port" label="是否开放" border true-label="1" false-label="0"></el-checkbox>
							</el-form-item>
						</tr>
						<template v-if="!Number(form.Open80Port) && (Number(form.UseScan) || Number(form.UseWxPay))">
							<tr>
								<el-form-item label="FRP80端口的域名" prop="Open80Port">
									<el-input style="width: 240px;" v-model="form.Frp80PortDomain"></el-input>
									<el-tag type="success" style="margin-left:10px;">
										作用于：内部扫码，团购微信支付
									</el-tag>
								</el-form-item>
							</tr>
						</template>
					</el-tab-pane>
					<el-tab-pane label="内部" name="client">
					</el-tab-pane>
					<el-tab-pane label="外部" name="staff">
					</el-tab-pane>
					<el-tab-pane label="下单" name="build">
					</el-tab-pane>
					<el-tab-pane label="团购" name="group">
					</el-tab-pane>
				</el-tabs>
			</table>
		</el-form>
	</div>
</template>
<script>
	import { Field } from 'vant';
	export default {
		components:{
			[Field.name]: Field,
		},
		data(){
			return {
				config:{
					tabPane : {
						activeName : 'common'
					}
				},
				form:{
					//公共参数
					FactoryId       : '',
					FactoryName     : '',
					ErpPort         : '',
					Open80Port      : '',
					WxAppId         : '',
					Frp80PortDomain : '',
					OriDomain       : '',
					OriPort         : '',
					//内部参数
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
					WGetPOInRecDate          : '',  //原纸采购(默认起始范围)
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
					//外部参数
					Wap0Right                : '',  //用户权限
					WeborderBeginDate        : '',  //微信订单(默认日期)
					WeborderEndDate          : '',  //微信订单
					WeborderMinDate          : '',  //微信订单(日期范围)
					WeborderMaxDate          : '',  //微信订单
					WeborderDefaultDelRemark : '',  //微信订单(默认删除原因)
					Wap0GetOrdersBeginDate   : '',  //ERP订单(默认日期)
					Wap0GetOrdersEndDate     : '',  //ERP订单
					Wap0GetOrdersMinDate     : '',  //ERP订单(日期范围)
					Wap0GetOrdersMaxDate     : '',  //ERP订单
					GetOrdersPBeginDate      : '',  //每日订单(默认日期)
					GetOrdersPEndDate        : '',  //每日订单
					GetOrdersPMinDate        : '',  //每日订单(日期范围)
					GetOrdersPMaxDate        : '',  //每日订单
					GetCusFreeMBBeginDate    : '',  //对账单(默认日期)
					GetCusFreeMBEndDate      : '',  //对账单
					GetCusFreeMBMinDate      : '',  //对账单(日期范围)
					GetCusFreeMBMaxDate      : '',  //对账单
					//下单参数
					UseQuoBoard               : '',  //常用材质使用报价价格材质
					BuildMinLength            : '',  //板长范围
					BuildMaxLength            : '',  //板长范围
					BuildMinWidth             : '',  //板宽范围
					BuildMaxWidth             : '',  //板宽范围
					BuildMinBoxL              : '',  //箱长范围
					BuildMaxBoxL              : '',  //箱长范围
					BuildMinBoxW              : '',  //箱宽范围
					BuildMaxBoxW              : '',  //箱宽范围
					BuildMinBoxH              : '',  //箱高范围
					BuildMaxBoxH              : '',  //箱高范围
					BuildAutoGetTonLenAndULen : '',  //自动获取默认的箱舌＆封箱调整
					BuildScoreName            : '',  //压线名称
					BuildMinArea              : '',  //纸板下单面积范围
					BuildMaxArea              : '',  //纸板下单面积范围
					BuildMinOrdQty            : '',  //纸箱下单订单数范围
					BuildMaxOrdQty            : '',  //纸箱下单订单数范围
					BuildDeliveryDate         : '',  //交货日期(默认)
					BuildMinDate              : '',  //交货日期(范围)
					BuildMaxDate              : '',  //交货日期
					IsAddTrimArea             : '',  //是否开启加面积加修边
					//团购参数
					WebSalesWidth    : '',  //团购纸板销售宽默认值
					MaxOverTimeOrder : '',  //最大超时未支付订单数量
					MaxUnPaidOrder   : '',  //最大未支付订单数量
					UseBoardGroup    : '',  //纸板团购功能
					ShowEdBoard      : '',  //展示团购已结束的纸板
					BoardFlag        : '',  //纸板特殊标识文字
					UseBoxGroup      : '',  //淘宝箱团购功能
					ShowEdBox        : '',  //展示团购已结束的淘宝箱
					BoxFlag          : '',  //淘宝箱特殊标识文字
					UseWxPay         : '',  //微信支付功能
					UseAliPay        : '',  //支付宝支付功能
					ValidPayTime     : '',  //有效支付时间(秒)
					/*//支付宝参数
					AliAppId         : '',
					AliPublicKey     : '',
					AliRsaPrivateKey : '',
					//微信支付参数
					WxAppSecret   : '',
					WxMchId       : '',
					WxKey         : '',
					WxSslcertPath : '',
					WxSslkeyPath  : '',*/
				},
				rules:{}
			}
		},
		methods:{
			getConfig(){
				let self = this;
				this.$request.admin.config.getConfig().then((res)=>{
					Object.assign(self.form,res.result);
				});
			},
		},
		created(){
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
<style>
	table tr:nth-child(2n){
		background:#F3F3F3;
	}
	table tr:nth-child(1){
		background:#FFF;
	}
</style>