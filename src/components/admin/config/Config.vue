<template>
	<div v-if="config.isAdmin">
		<el-tabs v-model="config.tabPane.activeName" type="card">
			<el-tab-pane label="公共" name="common">
				<table style="width:100%;">
					<tbody>
						<tr>
							<td style="width:150px;">厂商Id</td>
							<td>
								<el-input v-model="form.FactoryId" style="width: 160px;"></el-input>
								<p class="info">2代不填写/3代填写</p>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">厂商名称</td>
							<td>
								<el-input v-model="form.FactoryName" style="width: 300px;"></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">微信模板消息ID</td>
							<td>
								<el-input v-model="form.WxVerifyTempId" style="width: 400px;"></el-input>
								<p class="info">作用于：验证微信授权账号绑定</p>
								<div style="width:100%;height:10px;"></div>
								<el-input v-model="form.WxVerifyPassTempId" style="width: 400px;"></el-input>
								<p class="info">作用于：审核通过后发送给用户</p>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">外部80端口</td>
							<td>
								<el-checkbox v-model="form.Open80Port" label="是否开放" border true-label="1" false-label="0"></el-checkbox>
							</td>
						</tr>
						<template  v-if="!Number(form.Open80Port) && (Number(form.UseScan) || Number(form.UseWxPay))">
							<tr>
								<td style="width:150px;">wechat-jssdk域名</td>
								<td>
									<el-input style="width: 200px;" v-model="form.Frp80PortDomain"></el-input>
									<p class="info">作用于：内部扫码，团购微信支付</p>
								</td>
							</tr>
							<tr>
								<td style="width:150px;">项目域名</td>
								<td>
									<el-input style="width: 200px;" v-model="form.OriDomain"></el-input>
									<p class="info">作用于：内部扫码，团购微信支付( 不带http:// 及 / )</p>
								</td>
							</tr>
							<tr>
								<td style="width:150px;">项目前端端口</td>
								<td>
									<el-input style="width: 100px;" v-model="form.OriPagePort"></el-input>
									<p class="info">作用于：内部扫码，团购微信支付</p>
								</td>
							</tr>
							<tr>
								<td style="width:150px;">项目后台端口</td>
								<td>
									<el-input style="width: 100px;" v-model="form.OriPort"></el-input>
									<p class="info">作用于：内部扫码，团购微信支付</p>
								</td>
							</tr>
						</template>
						<tr>
							<td style="width:150px;">erp接口地址</td>
							<el-input style="width: 200px;" v-model="form.ErpApiPrefix"></el-input>
							<p class="info">调用ERP接口使用</p>
						</tr>
						<tr>
							<td style="width:150px;">多数据查询</td>
							<td >
								<el-checkbox v-model="form.OpenMultiQuery" label="多数据查询" border true-label="1" false-label="0"></el-checkbox>
								<p class="info">高性能服务可开启</p>
							</td>
						</tr>
						<tr>
							<td>
								<el-button type="primary" @click="saveConfig()">保存</el-button>
							</td>
							<td>
								<el-button type="success" @click="getConfig()">重置</el-button>
							</td>
						</tr>
					</tbody>
				</table>
			</el-tab-pane>
			<el-tab-pane label="内部" name="client">
				<table style="width:100%;">
					<tbody>
						<tr>
							<td style="width:150px;">用户权限</td>
							<td>
								<el-checkbox v-model="form.Wap1Right" label="是否开放" border true-label="1" false-label="0"></el-checkbox>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">客户每日订单</td>
							<td>
								默认日期&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.WGetCusOrderBeginDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.WGetCusOrderEndDate"></el-input>
								<div style="width:100%;height:10px;"></div>
								日期范围&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.WGetCusOrderMinDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.WGetCusOrderMaxDate"></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">客户每日送货</td>
							<td>
								默认日期&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.StaffDeliveryDailyBeginDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.StaffDeliveryDailyEndDate"></el-input>
								<div style="width:100%;height:10px;"></div>
								日期范围&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.StaffDeliveryDailyMinDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.StaffDeliveryDailyMaxDate"></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">ERP订单</td>
							<td>
								默认日期&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.Wap1GetOrdersBeginDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.Wap1GetOrdersEndDate"></el-input>
								<div style="width:100%;height:10px;"></div>
								日期范围&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.Wap1GetOrdersMinDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.Wap1GetOrdersMaxDate"></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">统计下的ERP订单</td>
							<td>
								默认日期&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.StatisGetOrdersMinDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.StatisGetOrdersMaxDate"></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">接单统计</td>
							<td>
								默认日期&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.OrderTakeBeginDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.OrderTakeEndDate"></el-input>
								<div style="width:100%;height:10px;"></div>
								日期范围&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.OrderTakeMinDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.OrderTakeMaxDate"></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">订单统计</td>
							<td>
								默认日期&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.GetOrderSumBeginDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.GetOrderSumEndDate"></el-input>
								<div style="width:100%;height:10px;"></div>
								日期范围&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.GetOrderSumMinDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.GetOrderSumMaxDate"></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">订单统计2</td>
							<td>
								下单金额（默认日期）&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.StaffAmountStatisDailyBeginDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.StaffAmountStatisDailyEndDate"></el-input>
								日期范围&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.StaffAmountStatisDailyMinDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.StaffAmountStatisDailyMaxDate"></el-input>
								<div style="width:100%;height:10px;"></div>
								送货金额（默认日期）&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.StaffAmountStatisDeliveryBeginDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.StaffAmountStatisDeliveryEndDate"></el-input>
								日期范围&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.StaffAmountStatisDeliveryMinDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.StaffAmountStatisDeliveryMaxDate"></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">退货统计</td>
							<td>
								默认日期&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.GetOrdReturnSumBeginDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.GetOrdReturnSumEndDate"></el-input>
								<div style="width:100%;height:10px;"></div>
								日期范围&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.GetOrdReturnSumMinDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.GetOrdReturnSumMaxDate"></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">传单统计</td>
							<td>
								默认日期&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.GetSchSumBeginDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.GetSchSumEndDate"></el-input>
								<div style="width:100%;height:10px;"></div>
								日期范围&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.GetSchSumMinDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.GetSchSumMaxDate"></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">库存统计</td>
							<td>
								默认日期&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.GetOrdStockBeginDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.GetOrdStockEndDate"></el-input>
								<div style="width:100%;height:10px;"></div>
								日期范围&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.GetOrdStockMinDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.GetOrdStockMaxDate"></el-input>
								<div style="width:100%;height:10px;"></div>
								在库超期天数&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.GetOrdStockiRemainDay"></el-input>
								<div style="width:100%;height:10px;"></div>
								交货超期天数&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.GetOrdStockiDiffDDay"></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">生产分析总计</td>
							<td>
								默认日期&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.GetProInfoBeginDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.GetProInfoEndDate"></el-input>
								<div style="width:100%;height:10px;"></div>
								日期范围&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.GetProInfoMinDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.GetProInfoMaxDate"></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">原纸采购</td>
							<td>
								默认日期&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.WGetPOMainBeginDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.WGetPOMainEndDate"></el-input>
								<div style="width:100%;height:10px;"></div>
								日期范围&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.WGetPOMainMinDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.WGetPOMainMaxDate"></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">原纸收货</td>
							<td>
								日期起始范围&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.WGetPOInRecDate"></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">原纸日用量</td>
							<td>
								默认日期&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.PaperDailyUsedBeginDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.PaperDailyUsedEndDate"></el-input>
								<div style="width:100%;height:10px;"></div>
								日期范围&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.PaperDailyUsedMinDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.PaperDailyUsedMaxDate"></el-input>
							</td>
						</tr>
						<tr v-if="!Number(form.Open80Port)">
							<td style="width:150px;">扫码功能</td>
							<td>
								<el-checkbox v-model="form.UseScan" label="是否开启" border true-label="1" false-label="0"></el-checkbox>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">原纸出库</td>
							<td>
								默认出库日期&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.DoStockOutOpTime"></el-input>
								<div style="width:100%;height:10px;"></div>
								出库日期范围&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.DoStockOutMinDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.DoStockOutMaxDate"></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">原纸入库</td>
							<td>
								默认入库日期&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.DoRStockInOpTime"></el-input>
								<div style="width:100%;height:10px;"></div>
								入库日期范围&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.DoRStockInMinDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.DoRStockInMaxDate"></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">显示库区</td>
							<td>
								<el-checkbox v-model="form.bMStockArea" label="是否开启" border true-label="1" false-label="0"></el-checkbox>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">库区控制</td>
							<td>
								<el-checkbox v-model="form.bSAreaControl" label="是否开启" border true-label="1" false-label="0"></el-checkbox>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">直接入库</td>
							<td>
								默认入库日期&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.DirectInStockDate"></el-input>
								<div style="width:100%;height:10px;"></div>
								入库日期范围&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.DirectInStockMinDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.DirectInStockMaxDate"></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">扫描装货（列表）</td>
							<td>
								默认日期&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.StowBeginDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.StowEndDate"></el-input>
								<div style="width:100%;height:10px;"></div>
								日期范围&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.StowMinDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.StowMaxDate"></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">扫描装货（详情）</td>
							<td>
								<el-checkbox v-model="form.bPackAddODefSQ" label="订单号装货默认带出库存数" border true-label="1" false-label="0"></el-checkbox>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">扫描装货（新增装货单）</td>
							<td>
								最大日期&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.StowAddMaxDate"></el-input>
								<div style="width:100%;height:10px;"></div>
								最小日期&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.StowAddMinDate"></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">订单试算</td>
							<td>
								<el-checkbox v-model="form.CalcAutoGetTrimAndAreaByCus" label="自动获取客户是否默认加修边＆加面积" border true-label="1" false-label="0"></el-checkbox>
								<div style="width:100%;height:10px;"></div>
								<el-checkbox v-model="form.CalcAutoGetTonLenAndULen" label="自动获取默认的箱舌＆封箱调整" border true-label="1" false-label="0"></el-checkbox>
								<div style="width:100%;height:10px;"></div>
								<el-checkbox v-model="form.CalcAutoGetdOriPrice" label="自动获取平方报价" border true-label="1" false-label="0"></el-checkbox>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">收款调账</td>
							<td>
								默认日期&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.RecAdjustBeginDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.RecAdjustEndDate"></el-input>
								<div style="width:100%;height:10px;"></div>
								日期范围&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.RecAdjustMinDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.RecAdjustMaxDate"></el-input>
							</td>
						</tr>
						<tr>
							<td>
								<el-button type="primary" @click="saveConfig()">保存</el-button>
							</td>
							<td>
								<el-button type="success" @click="getConfig()">重置</el-button>
							</td>
						</tr>
					</tbody>
				</table>
			</el-tab-pane>
			<el-tab-pane label="外部" name="staff">
				<table style="width:100%;">
					<tbody>
						<tr>
							<td style="width:150px;">用户权限</td>
							<td>
								<el-checkbox v-model="form.Wap0Right" label="是否开放" border true-label="1" false-label="0"></el-checkbox>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">微信订单</td>
							<td>
								默认日期&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.WeborderBeginDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.WeborderEndDate"></el-input>
								<div style="width:100%;height:10px;"></div>
								日期范围&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.WeborderMinDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.WeborderMaxDate"></el-input>
								<div style="width:100%;height:10px;"></div>
								默认删除原因&nbsp;&nbsp;&nbsp;
								<el-input style="width: 300px;" v-model="form.WeborderDefaultDelRemark"></el-input><p>用,隔开</p>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">ERP订单</td>
							<td>
								默认日期&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.Wap0GetOrdersBeginDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.Wap0GetOrdersEndDate"></el-input>
								<div style="width:100%;height:10px;"></div>
								日期范围&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.Wap0GetOrdersMinDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.Wap0GetOrdersMaxDate"></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">每日订单</td>
							<td>
								默认日期&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.GetOrdersPBeginDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.GetOrdersPEndDate"></el-input>
								<div style="width:100%;height:10px;"></div>
								日期范围&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.GetOrdersPMinDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.GetOrdersPMaxDate"></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">每日送货</td>
							<td>
								默认日期&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.ClientDeliveryDailyBeginDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.ClientDeliveryDailyEndDate"></el-input>
								<div style="width:100%;height:10px;"></div>
								日期范围&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.ClientDeliveryDailyMinDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.ClientDeliveryDailyMaxDate"></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">对账单</td>
							<td>
								默认日期&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.GetCusFreeMBBeginDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.GetCusFreeMBEndDate"></el-input>
								<div style="width:100%;height:10px;"></div>
								日期范围&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.GetCusFreeMBMinDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.GetCusFreeMBMaxDate"></el-input>
							</td>
						</tr>
						<tr v-if="form.OpenMultiQuery == 1">
							<td style="width:150px;">对账单2</td>
							<td>
								默认日期&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.CusFreeMBTableBeginDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.CusFreeMBTableEndDate"></el-input>
								<div style="width:100%;height:10px;"></div>
								日期范围&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.CusFreeMBTableMinDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.CusFreeMBTableMaxDate"></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">客户信用余额明细</td>
							<td>
								默认日期&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.GetCusFreeMBDetailBeginDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.GetCusFreeMBDetailEndDate"></el-input>
								<p class="info">默认开始时间是上次月结日期</p>
								<div style="width:100%;height:10px;"></div>
								日期范围&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.GetCusFreeMBDetailMinDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.GetCusFreeMBDetailMaxDate"></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">开票信息</td>
							默认日期&nbsp;&nbsp;&nbsp;
							<el-input style="width: 100px;" v-model="form.GetCusBillCenterBeginDate"></el-input>
							&nbsp;~&nbsp;
							<el-input style="width: 100px;" v-model="form.GetCusBillCenterEndDate"></el-input>
							<p class="info">默认开始时间是上次月结日期</p>
							<div style="width:100%;height:10px;"></div>
							日期范围&nbsp;&nbsp;&nbsp;
							<el-input style="width: 100px;" v-model="form.GetCusBillCenterMinDate"></el-input>
							&nbsp;~&nbsp;
							<el-input style="width: 100px;" v-model="form.GetCusBillCenterMaxDate"></el-input>
						</tr>
						<tr>
							<td style="width:150px;">往来统计</td>
							<td>
								默认日期&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.Wap0StatisContactBeginDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.Wap0StatisContactEndDate"></el-input>
								<div style="width:100%;height:10px;"></div>
								日期范围&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.Wap0StatisContactMinDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.Wap0StatisContactMaxDate"></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">每日订单是否显示金额</td>
							<td>
								<el-checkbox v-model="form.WGetCusOrderShowAmt" label="是否使用" border true-label="1" false-label="0"></el-checkbox>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">订单统计</td>
							<td>
								下单金额（默认日期）&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.ClientAmountStatisDailyBeginDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.ClientAmountStatisDailyEndDate"></el-input>
								日期范围&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.ClientAmountStatisDailyMinDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.ClientAmountStatisDailyMaxDate"></el-input>
								<div style="width:100%;height:10px;"></div>
								送货金额（默认日期）&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.ClientAmountStatisDeliveryBeginDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.ClientAmountStatisDeliveryEndDate"></el-input>
								日期范围&nbsp;&nbsp;&nbsp;
								<el-input style="width: 100px;" v-model="form.ClientAmountStatisDeliveryMinDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.ClientAmountStatisDeliveryMaxDate"></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">是否需要设置下单时间段</td>
							<td>
								<el-checkbox v-model="form.NeedSetBuildTime" label="是否设置" border true-label="1" false-label="0"></el-checkbox>
							</td>
						</tr>
						<template v-if="form.NeedSetBuildTime == 1">
							<tr>
								<td style="width:150px;">下单时间段</td>
								<td>
									时间段1&nbsp;&nbsp;&nbsp;
									<el-input style="width: 150px;" v-model="form.BuildInTime1"></el-input>
									<p class="info">
										用-隔开
									</p>
									<div style="width:100%;height:10px;"></div>
									时间段2&nbsp;&nbsp;&nbsp;
									<el-input style="width: 150px;" v-model="form.BuildInTime2"></el-input>
									<p class="info">
										用-隔开
									</p> 
								</td>
							</tr>
						</template>
						<tr>
							<td>
								<el-button type="primary" @click="saveConfig()">保存</el-button>
							</td>
							<td>
								<el-button type="success" @click="getConfig()">重置</el-button>
							</td>
						</tr>
					</tbody>
				</table>
			</el-tab-pane>
			<el-tab-pane label="下单" name="build">
				<table style="width:100%;">
					<tbody>
						<tr>
							<td style="width:150px;">常用材质使用报价价格材质</td>
							<td>
								<el-checkbox v-model="form.UseQuoBoard" label="是否使用" border true-label="1" false-label="0"></el-checkbox>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">板长范围</td>
							<td>
								<el-input style="width: 100px;" v-model="form.BuildMinLength"></el-input>
								&nbsp;&nbsp;mm&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.BuildMaxLength"></el-input>
								&nbsp;&nbsp;mm
							</td>
						</tr>
						<tr>
							<td style="width:150px;">板宽范围</td>
							<td>
								<el-input style="width: 100px;" v-model="form.BuildMinWidth"></el-input>
								&nbsp;&nbsp;mm&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.BuildMaxWidth"></el-input>
								&nbsp;&nbsp;mm
							</td>
						</tr>
						<tr>
							<td style="width:150px;">箱长范围</td>
							<td>
								<el-input style="width: 100px;" v-model="form.BuildMinBoxL"></el-input>
								&nbsp;&nbsp;mm&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.BuildMaxBoxL"></el-input>
								&nbsp;&nbsp;mm
							</td>
						</tr>
						<tr>
							<td style="width:150px;">箱宽范围</td>
							<td>
								<el-input style="width: 100px;" v-model="form.BuildMinBoxW"></el-input>
								&nbsp;&nbsp;mm&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.BuildMaxBoxW"></el-input>
								&nbsp;&nbsp;mm
							</td>
						</tr>
						<tr>
							<td style="width:150px;">箱高范围</td>
							<td>
								<el-input style="width: 100px;" v-model="form.BuildMinBoxH"></el-input>
								&nbsp;&nbsp;mm&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.BuildMaxBoxH"></el-input>
								&nbsp;&nbsp;mm
							</td>
						</tr>
						<tr>
							<td style="width:150px;">箱舌(mm)</td>
							<td>
								<el-input style="width: 300px;" v-model="form.BuildTonLen"></el-input>
								<p class="info">用,隔开</p>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">封箱调整(mm)</td>
							<td>
								<el-input style="width: 300px;" v-model="form.BuildULen"></el-input>
								<p class="info">用,隔开</p>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">箱舌＆封箱调整</td>
							<td>
								<el-checkbox v-model="form.BuildAutoGetTonLenAndULen" label="自动获取默认" border true-label="1" false-label="0"></el-checkbox>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">压型名称</td>
							<td>
								<el-input style="width: 300px;" v-model="form.BuildScoreName"></el-input>
								<p class="info">用,隔开</p>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">默认名称</td>
							<td>
								<el-input style="width: 300px;" v-model="form.DefaultScoreName"></el-input>
								<p class="info">必须是压型名称中的一个</p>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">订单试算</td>
							<td>
								<el-checkbox v-model="form.BuildAddCalc" label="是否开启" border true-label="1" false-label="0"></el-checkbox>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">订单试算毛片加面积加修边</td>
							<td>
								<el-checkbox v-model="form.IsAddTrimArea" label="是否开启" border true-label="1" false-label="0"></el-checkbox>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">纸板下单面积范围</td>
							<td>
								<el-input style="width: 100px;" v-model="form.BuildMinArea"></el-input>
								&nbsp;&nbsp;㎡&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.BuildMaxArea"></el-input>
								&nbsp;&nbsp;㎡
							</td>
						</tr>
						<tr>
							<td style="width:150px;">纸箱下单订单数范围</td>
							<td>
								<el-input style="width: 100px;" v-model="form.BuildMinOrdQty"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.BuildMaxOrdQty"></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">默认交货日期</td>
							<td>
								<el-input style="width: 100px;" v-model="form.BuildDeliveryDate"></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">交货日期范围</td>
							<td>
								<el-input style="width: 100px;" v-model="form.BuildMinDate"></el-input>
								&nbsp;~&nbsp;
								<el-input style="width: 100px;" v-model="form.BuildMaxDate"></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">是否显示送货备注</td>
							<td>
								<el-checkbox v-model="form.ShowDeliveryRemark" label="是否开启" border true-label="1" false-label="0"></el-checkbox>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">弹出层是否需要确认按钮</td>
							<td>
								<el-checkbox v-model="form.BuildRadioNeedConfirm" label="是否开启" border true-label="1" false-label="0"></el-checkbox>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">下单长度不满指定长度是否需要提示</td>
							<td>
								<el-checkbox v-model="form.BuildLenNeedToast" label="是否需要提示" border true-label="1" false-label="0"></el-checkbox>
							</td>
						</tr>
						<template v-if="form.BuildLenNeedToast == 1 ">
							<tr>
								<td style="width:150px;">指定下单长度</td>
								<td>
									<el-input style="width: 100px;" type="number" v-model="form.BuildLenToastDefault"></el-input>
									<p class="info">
										单位:mm
									</p>
								</td>
							</tr>
						</template>
						<tr>
							<td style="width:150px;">下单宽度不满指定宽度是否需要提示</td>
							<td>
								<el-checkbox v-model="form.BuildWidthNeedToast" label="是否需要提示" border true-label="1" false-label="0"></el-checkbox>
							</td>
						</tr>
						<template v-if="form.BuildWidthNeedToast == 1 ">
							<tr>
								<td style="width:150px;">指定下单宽度</td>
								<td>
									<el-input style="width: 100px;" type="number" v-model="form.BuildWidthToastDefault"></el-input>
									<p class="info">
										单位:mm
									</p>
								</td>
							</tr>
						</template>
						<tr>
							<td style="width:150px;">下单高度不满指定高度是否需要提示</td>
							<td>
								<el-checkbox v-model="form.BuildHeightNeedToast" label="是否需要提示" border true-label="1" false-label="0"></el-checkbox>
							</td>
						</tr>
						<template v-if="form.BuildHeightNeedToast == 1 ">
							<tr>
								<td style="width:150px;">指定下单高度</td>
								<td>
									<el-input style="width: 100px;" type="number" v-model="form.BuildHeightToastDefault"></el-input>
									<p class="info">
										单位:mm
									</p>
								</td>
							</tr>
						</template>
						<tr>
							<td>
								<el-button type="primary" @click="saveConfig()">保存</el-button>
							</td>
							<td>
								<el-button type="success" @click="getConfig()">重置</el-button>
							</td>
						</tr>
					</tbody>
				</table>
			</el-tab-pane>
			<el-tab-pane label="团购" name="group">
				<table style="width:100%;">
					<tbody>
						<tr>
							<td style="150px;">是否开启信用额度付款</td>
							<td>
								<el-checkbox v-model="form.UseCreditPay" label="是否开启" border true-label="1" false-label="0"></el-checkbox>
							</td>
						</tr>
						<tr>
							<td style="150px;">团购纸板销售宽默认值</td>
							<td>
								<el-input style="width: 100px;" type="number" v-model="form.WebSalesWidth"></el-input>
							</td>
						</tr>
						<tr>
							<td style="150px;">最大超时未支付订单数量</td>
							<td>
								<el-input style="width: 100px;" v-model="form.MaxOverTimeOrder"></el-input>
							</td>
						</tr>
						<tr>
							<td style="150px;">最大未支付订单数量</td>
							<td>
								<el-input style="width: 100px;" v-model="form.MaxUnPaidOrder"></el-input>
							</td>
						</tr>
						<tr>
							<td style="150px;">纸板团购功能</td>
							<td>
								<el-checkbox v-model="form.UseBoardGroup" label="是否开启" border true-label="1" false-label="0"></el-checkbox>
							</td>
						</tr>
						<template v-if="Number(form.UseBoardGroup)">
							<tr>
								<td style="150px;">团购已结束的纸板</td>
								<td>
									<el-checkbox v-model="form.ShowEdBoard" label="是否展示" border true-label="1" false-label="0"></el-checkbox>
								</td>
							</tr>
							<tr>
								<td style="150px;">纸板特殊标识文字</td>
								<td>
									<el-input style="width: 150px;" v-model="form.BoardFlag" ></el-input>
									<p class="info">建议2个汉字</p>
								</td>
							</tr>
						</template>
						<tr>
							<td style="150px;">淘宝箱团购功能</td>
							<td>
								<el-checkbox v-model="form.UseBoxGroup" label="是否开启" border true-label="1" false-label="0"></el-checkbox>
							</td>
						</tr>
						<template v-if="Number(form.UseBoxGroup)">
							<tr>
								<td style="150px;">淘宝箱材质报价</td>
								<td>
									<el-checkbox v-model="form.OpenBoxForArea" label="是否按面积报价" border true-label="1" false-label="0"></el-checkbox>
								</td>
							</tr>
							<tr v-if="config.openBoxForAreaShow">
								<td style="150px;">淘宝箱材质报价换算保留小数位</td>
								<td>
									<el-input style="width: 100px;" type="number" v-model="form.BoxForAreaDecimals"></el-input>
								</td>
							</tr>
							<tr>
								<td style="150px;">团购已结束的淘宝箱</td>
								<td>
									<el-checkbox v-model="form.ShowEdBox" label="是否展示" border true-label="1" false-label="0"></el-checkbox>
								</td>
							</tr>
							<tr>
								<td style="150px;">淘宝箱特殊标识文字</td>
								<td>
									<el-input style="width: 150px;" v-model="form.BoxFlag" ></el-input>
									<p class="info">建议2个汉字</p>
								</td>
							</tr>
						</template>
						<template v-if="Number(form.UseBoardGroup) || Number(form.UseBoxGroup)">
							<tr>
								<td style="150px;">微信支付功能</td>
								<td>
									<el-checkbox v-model="form.UseWxPay" label="是否开启" border true-label="1" false-label="0"></el-checkbox>
								</td>
							</tr>
							<tr>
								<td style="150px;">支付宝支付功能</td>
								<td>
									<el-checkbox v-model="form.UseAliPay" label="是否开启" border true-label="1" false-label="0"></el-checkbox>
								</td>
							</tr>
							<tr>
								<td style="150px;">易收宝支付功能</td>
								<td>
									<el-checkbox v-model="form.UseYSBPay" label="是否开启" border true-label="1" false-label="0"></el-checkbox>
								</td>
							</tr>
						</template>
						<tr v-if="(Number(form.UseBoardGroup) || Number(form.UseBoxGroup)) && (Number(form.UseWxPay) || Number(form.UseAliPay))">
							<td style="150px;">有效支付时间（秒）</td>
							<td>
								<el-input style="width: 150px;" v-model="form.ValidPayTime" ></el-input>
							</td>
						</tr>
						<tr>
							<td>
								<el-button type="primary" @click="saveConfig()">保存</el-button>
							</td>
							<td>
								<el-button type="success" @click="getConfig()">重置</el-button>
							</td>
						</tr>
					</tbody>
				</table>
			</el-tab-pane>
		</el-tabs>
		<el-dialog title="提示" :visible="config.dialog.show" width="30%">
			<span>{{ config.dialog.value }}</span>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="config.dialog.show = false">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	export default {
		data(){
			return {
				config : {
					tabPane:{
						activeName : 'common'
					},
					dialog : {
						value : '',
						show : false
					},
					openBoxForAreaShow : false,
					isAdmin:false
				},
				form : {
					//公共参数
					FactoryId       : '',
					FactoryName     : '',
					WxVerifyTempId  : '',
					WxVerifyPassTempId:'',
					Open80Port      : 0,
					WxAppId         : '',
					Frp80PortDomain : '',
					OriDomain       : '',  //项目域名(不带http:// 及 / )
					OriPagePort     : '',  //项目前端页面端口
					OriPort         : '',  //项目后台端口
					ErpApiPrefix    : '',  //erp接口地址
					OpenMultiQuery  : '',  //是否开启多数据查询
					//内部参数
					Wap1Right                : '',  //用户权限
					WGetCusOrderBeginDate    : '',  //客户每日订单(默认日期)
					WGetCusOrderEndDate      : '',  //客户每日订单
					WGetCusOrderMinDate      : '',  //客户每日订单(日期范围)
					WGetCusOrderMaxDate      : '',  //客户每日订单
					StaffDeliveryDailyBeginDate : '', //客户每日送货(默认日期)
					StaffDeliveryDailyEndDate   : '', //客户每日送货
					StaffDeliveryDailyMinDate   : '', //客户每日送货(日期范围)
					StaffDeliveryDailyMaxDate   : '', //客户每日送货
					Wap1GetOrdersBeginDate   : '',  //ERP订单(默认日期)
					Wap1GetOrdersEndDate     : '',  //ERP订单
					Wap1GetOrdersMinDate     : '',  //ERP订单(日期范围)
					Wap1GetOrdersMaxDate     : '',  //ERP订单
					StatisGetOrdersMinDate   : '',  //统计下的ERP订单(日期范围)
					StatisGetOrdersMaxDate   : '',  //统计下的ERP订单
					OrderTakeBeginDate       : '',  //接单统计默认开始日期
					OrderTakeEndDate         : '',  //接单统计默认结束日期
					OrderTakeMinDate         : '',  //接单统计开始日期
					OrderTakeMaxDate         : '',  //接单统计结束日期
					GetOrderSumBeginDate     : '',  //订单统计(默认日期)
					GetOrderSumEndDate       : '',  //订单统计
					GetOrderSumMinDate       : '',  //订单统计(日期范围)
					GetOrderSumMaxDate       : '',  //订单统计
					StaffAmountStatisDailyBeginDate: '', //订单统计2 下单金额(默认日期)
					StaffAmountStatisDailyEndDate: '',   //订单统计2 下单金额
					StaffAmountStatisDailyMinDate: '',   //订单统计2 下单金额(日期范围)
					StaffAmountStatisDailyMaxDate: '',   //订单统计2 下单金额
					StaffAmountStatisDeliveryBeginDate: '', //订单统计2 送货(默认日期)
					StaffAmountStatisDeliveryEndDate: '',
					StaffAmountStatisDeliveryMinDate: '', //订单统计2 送货(日期范围)
					StaffAmountStatisDeliveryMaxDate: '',
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
					PaperDailyUsedBeginDate  : '',  //原纸日用量(默认日期)
					PaperDailyUsedEndDate    : '',  //原纸日用量
					PaperDailyUsedMinDate    : '',  //原纸日用量(日期范围)
					PaperDailyUsedMaxDate    : '',  //原纸日用量
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
					StowAddMaxDate           : '',  //扫描装货-新增装货单最大日期
					StowAddMinDate           : '',  //扫描装货-新增装货单最小日期
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
					GetOrdersPMaxDate        : '',  //每日订单,
					WGetCusOrderShowAmt      : '',  //每日订单是否显示金额
					ClientDeliveryDailyBeginDate: '', //每日送货(默认日期)
					ClientDeliveryDailyEndDate  :'',  //每日送货
					ClientDeliveryDailyMinDate  : '', //每日送货(日期范围)
					ClientDeliveryDailyMaxDate  : '', //每日送货
					GetCusFreeMBBeginDate    : '',  //对账单(默认日期)
					GetCusFreeMBEndDate      : '',  //对账单
					GetCusFreeMBMinDate      : '',  //对账单(日期范围)
					GetCusFreeMBMaxDate      : '',  //对账单
					CusFreeMBTableBeginDate  : '',  //对账单2(默认日期)
					CusFreeMBTableEndDate    : '',  //对账单2
					CusFreeMBTableMinDate    : '',  //对账单2(日期范围)
					CusFreeMBTableMaxDate    : '',  //对账单2
					GetCusFreeMBDetailBeginDate: '', //客户信用余额明细(默认日期)
					GetCusFreeMBDetailEndDate  : '', //客户信用余额明细
					GetCusFreeMBDetailMinDate  : '', //客户信用余额明细(日期范围)
					GetCusFreeMBDetailMaxDate  : '', //客户信用余额明细
					GetCusBillCenterBeginDate  : '', //开票信息(默认日期)
					GetCusBillCenterEndDate    : '', //开票信息
					GetCusBillCenterMinDate    : '', //开票信息(日期范围)
					GetCusBillCenterMaxDate    : '', //开票信息
					Wap0StatisContactBeginDate : '', //往来统计(默认日期)
					Wap0StatisContactEndDate   : '', //往来统计
					Wap0StatisContactMinDate   : '', //往来统计(日期范围)
					Wap0StatisContactMaxDate   : '', //往来统计
					ClientAmountStatisDailyBeginDate: '', //订单统计(下单金额)(默认日期)
					ClientAmountStatisDailyEndDate: '',   //订单统计
					ClientAmountStatisDailyMinDate: '',   //订单统计(日期范围)
					ClientAmountStatisDailyMaxDate: '',   //订单统计
					ClientAmountStatisDeliveryBeginDate: '', //订单统计(送货)(默认日期)
					ClientAmountStatisDeliveryEndDate: '',   //订单统计
					ClientAmountStatisDeliveryMinDate: '',   //订单统计(送货)(日期范围)
					ClientAmountStatisDeliveryMaxDate: '',   //订单统计(送货)
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
					BuildScoreName            : '',  //压型名称
					DefaultScoreName          : '',  //默认压型名称
					BuildMinArea              : '',  //纸板下单面积范围
					BuildMaxArea              : '',  //纸板下单面积范围
					BuildMinOrdQty            : '',  //纸箱下单订单数范围
					BuildMaxOrdQty            : '',  //纸箱下单订单数范围
					BuildDeliveryDate         : '',  //交货日期(默认)
					BuildMinDate              : '',  //交货日期(范围)
					BuildMaxDate              : '',  //交货日期,
					BuildTonLen               : '',  //箱舌
					BuildULen                 : '',  //封箱调整
					BuildAddCalc              : 0,   //是否开启订单试算
					IsAddTrimArea             : 0,   //是否开启订单试算毛片不加面积修边
					ShowDeliveryRemark        : 0,   //是否显示送货备注
					BuildRadioNeedConfirm     : 1,   //选择弹出层时是否需要点击确认
					BuildLenNeedToast         : 0,   //下单长度不满指定长度是否需要提示
					BuildLenToastDefault      : '',  //下单长度提示指定长度
					BuildWidthNeedToast       : 0,   //下单宽度不满指定宽度是否需要提示
					BuildWidthToastDefault    : '',  //下单宽度提示指定宽度
					BuildHeightNeedToast      : 0,   //下单高度不满指定高度是否需要提示
					BuildHeightToastDefault   : '',  //下单高度提示指定高度
					NeedSetBuildTime          : 0,   //是否需要设置下单时间范围
					BuildInTime1              : '',  //下单时间范围1
					BuildInTime2              : '',  //下单时间范围2
					//团购参数
					UseCreditPay     : '',  //是否开启信用额度付款
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
					UseYSBPay        : '',  //易收宝支付功能
					ValidPayTime     : '',  //有效支付时间(秒)
					//淘宝箱按面积报价
					OpenBoxForArea   : '',  //淘宝箱是否按面积报价
					BoxForAreaDecimals : ''  //保留小数位数
				}
			}
		},
		methods:{
			getConfig(){
				let self = this;
				this.$request.admin.config.getConfig().then((res)=>{
					Object.assign(self.form,res.result);
					self.form.Open80Port = 0;
					self.config.isAdmin  = res.result.IsAdmin == 1 ? true : false;
				});
			},
			saveConfig(){
				let self = this;
				this.$request.admin.config.saveConfig( JSON.stringify( this.form ) ).then((res)=>{
					if( res.errorCode == '00000' ){
						self.config.dialog.value = '修改成功!';
					}else{
						self.config.dialog.value = '修改失败!';
					}
					self.config.dialog.show = true;
				}).then(()=>{
					this.getConfig();
				});
			}
		},
		created(){
			
		},
		mounted(){
			this.getConfig();
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			openBoxForAreaChange(){
				return this.form.OpenBoxForArea;
			}
		},
		watch:{
			openBoxForAreaChange( newV, oldV ){
				this.config.openBoxForAreaShow =  1 == newV ? true : false;
			}
		}
	}
</script>
<style>
	.info {
		margin-left: 1rem;
		display: inline;
		color: #57a000;
	}
	table td p {
    	display: inline;
    	margin-left: 10px;
    	color: #57a000;
	}
	table td {
		padding: 10px;
	}
	table tr:nth-child(2n){
		background:#F3F3F3;
	}
	table tr:nth-child(1){
		background:#FFF;
	}
</style>


