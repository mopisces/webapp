<template>
	<div>
		<el-tabs v-model="config.tabPane.activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="公共" name="common">
				<table>
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
							<td style="width:150px;">ERP端口</td>
							<td>
								<el-input v-model="form.ErpPort" style="width: 160px;"></el-input>
								<p class="info">作用于：内部直接入库，内部库存修改，内部订单试算，内部扫描装货</p>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">外部80端口</td>
							<td>
								<el-checkbox v-model="form.Open80Port" label="是否开放" border true-label="1" false-label="0"></el-checkbox>
							</td>
						</tr>
						<tr v-if=" Number(form.UseScan) || Number(form.UseWxPay)">
							<td style="width:150px;">微信公众号AppId</td>
							<td>
								<el-input style="width: 200px;" v-model="form.WxAppId"></el-input>
								<p class="info">作用于：内部扫码，团购微信支付</p>
							</td>
						</tr>
						<template  v-if="!Number(form.Open80Port) && (Number(form.UseScan) || Number(form.UseWxPay))">
							<tr>
								<td style="width:150px;">FRP80端口的域名</td>
								<td>
									<el-input style="width: 200px;" v-model="form.Frp80PortDomain"></el-input>
									<p class="info">作用于：内部扫码，团购微信支付</p>
								</td>
							</tr>
							<tr>
								<td style="width:150px;">原来的域名</td>
								<td>
									<el-input style="width: 200px;" v-model="form.OriDomain"></el-input>
									<p class="info">作用于：内部扫码，团购微信支付</p>
								</td>
							</tr>
							<tr>
								<td style="width:150px;">原来的端口</td>
								<td>
									<el-input style="width: 100px;" v-model="form.OriPort"></el-input>
									<p class="info">作用于：内部扫码，团购微信支付</p>
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
						<tr v-if="!Number(form.Open80Port)">
							<td style="width:150px;">扫码功能</td>
							<td>
								<el-checkbox v-model="form.UseScan" label="是否开启" border></el-checkbox>
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
								<el-checkbox v-model="form.bMStockArea" label="是否开启" border></el-checkbox>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">库区控制</td>
							<td>
								<el-checkbox v-model="form.bSAreaControl" label="是否开启" border></el-checkbox>
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
				<table>
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
				<table>
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
							<td style="width:150px;">压线名称</td>
							<td>
								<el-input style="width: 300px;" v-model="form.BuildScoreName"></el-input>
								<p class="info">用,隔开</p>
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
				<table>
					<tbody>
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
			<el-tab-pane label="微信支付" name="wechat" v-if="(Number(form.UseBoardGroup) || Number(form.UseBoxGroup)) && Number(form.UseWxPay)">
				<table>
					<tbody>
						<tr>
							<td style="width:150px;">微信公众号AppSecret</td>
							<td>
								<el-input style="width: 300px;" v-model="form.WxAppSecret" ></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">微信商户号</td>
							<td>
								<el-input style="width: 300px;" v-model="form.WxMchId" ></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">微信商户支付密钥</td>
							<td>
								<el-input style="width: 300px;" v-model="form.WxKey" ></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">微信商户证书 apiclient_cert.pem 绝对路径</td>
							<td>
								<el-input style="width: 500px;" v-model="form.WxSslcertPath"></el-input>
								<p class="info">建议与 htdocs 文件夹平级</p>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">微信商户证书 apiclient_key.pem 绝对路径</td>
							<td>
								<el-input style="width: 500px;" v-model="form.WxSslkeyPath"></el-input>
								<p class="info">建议与 htdocs 文件夹平级</p>
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
			<el-tab-pane label="支付宝支付" name="ali" v-if="(Number(form.UseBoardGroup) || Number(form.UseBoxGroup)) && Number(form.UseAliPay)">
				<table>
					<tbody>
						<tr>
							<td style="width:150px;">支付宝AppId</td>
							<td>
								<el-input style="width: 200px;" v-model="form.AliAppId" ></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">支付宝公钥</td>
							<td>
								<el-input v-model="form.AliPublicKey" type="textarea" rows="5" style="width:500px;"></el-input>
							</td>
						</tr>
						<tr>
							<td style="width:150px;">支付宝商户私钥</td>
							<td>
								<el-input v-model="form.AliRsaPrivateKey" type="textarea" rows="15" style="width:500px;"></el-input>
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
					}
				},
				form : {
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
					//团购参数
					UseBoardGroup : '',  //纸板团购功能
					ShowEdBoard   : '',  //展示团购已结束的纸板
					BoardFlag     : '',  //纸板特殊标识文字
					UseBoxGroup   : '',  //淘宝箱团购功能
					ShowEdBox     : '',  //展示团购已结束的淘宝箱
					BoxFlag       : '',  //淘宝箱特殊标识文字
					UseWxPay      : '',  //微信支付功能
					UseAliPay     : '',  //支付宝支付功能
					ValidPayTime  : '',  //有效支付时间(秒)
					//支付宝参数
					AliAppId         : '',
					AliPublicKey     : '',
					AliRsaPrivateKey : '',
					//微信支付参数
					WxAppSecret   : '',
					WxMchId       : '',
					WxKey         : '',
					WxSslcertPath : '',
					WxSslkeyPath  : '',
				}
			}
		},
		methods:{
			handleClick(){
				console.log(1);
			},
			getConfig(){
				let self = this;
				this.$request.admin.config.getConfig().then((res)=>{
					Object.assign(self.form,res.result);
				});
			},
			saveConfig(){
				let self = this;
				this.$request.admin.config.saveConfig( JSON.stringify( this.form ) ).then((res)=>{
					let message = ''
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
			
		},
		watch:{

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
</style>