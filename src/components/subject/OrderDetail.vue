<template>
	<van-popup v-model="detailShow" :style="{ width: '100%',height:'100%' }" position="top">
		<div class="van-nav-bar van-hairline--bottom" style="z-index: 1;">
			<div class="van-nav-bar__left">
				<span class="van-nav-bar__text">订单详情</span>
			</div>
			<div class="van-nav-bar__title van-ellipsis"></div>
			<div class="van-nav-bar__right" @click="closeClick">
				<i class="van-icon van-icon-cross" style="font-size: 16px;"><!----></i>
			</div>
		</div>
		<div v-if=" info.orderDNRe != null ">
			<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;">
      		退货明细
  			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>单号</span></div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDNRe.DNStr">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>生效日期</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDNRe.IssueDate">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>订单编号</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDNRe.OrderId">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>送货数</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDNRe.DeliQty">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>销售面积(㎡)</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDNRe.TSalesArea">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>送货金额(元)</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDNRe.DeliAmt">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>价格(元)</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDNRe.Price">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>平方价(元/㎡)</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDNRe.SquarePrice">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>退货原因</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDNRe.ReturnCause">
					</div>
				</div>
			</div>
		</div>
		<div v-if=" info.orderDN != null ">
			<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;">
      		送货明细
  			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>单号</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDN.DNStr">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>回签</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDN.Signed">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>装货日期</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDN.PackDate">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>送货日期</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDN.DNDate">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>生效日期</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDN.IssueDate">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>订单编号</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDN.OrderId">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>送货数</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDN.DeliQty">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>销售面积(㎡)</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDN.TSalesArea">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>送货金额(元)</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDN.DeliAmt">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>价格(元)</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDN.Price">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>平方价(元/㎡)</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDN.SquarePrice">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>送货备注</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDN.DNRemark">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>送货公司</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDN.CusSubNo">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>子公司简称</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDN.CusSubName">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>送货地址</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDN.SubDNAddress">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>联系人</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDN.SubContactPerson">
					</div>
				</div>
			</div>
			<div class="van-cell van-field" @click="phoneClick(info.orderDN.SubTelNo)">
				<div class="van-cell__title van-field__label">
					<span>联系电话</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDN.SubTelNo">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>车牌号</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDN.CarNo">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>司机名称</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDN.CarPName">
					</div>
				</div>
			</div>
			<div class="van-cell van-field" @click="phoneClick(info.orderDN.Phone)">
				<div class="van-cell__title van-field__label">
					<span>电话</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDN.Phone">
					</div>
				</div>
			</div>
		</div>
		<div v-if=" info.orderSch != null ">
			<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;">
      		传单明细
  			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>工单状态</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderSch.SState">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>门幅(mm)</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderSch.SPaperWidth">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>数量</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderSch.SQty">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>添加时间</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderSch.AddTime">
					</div>
				</div>
			</div>
		</div>
		<div v-if=" info.orderDetail != null ">
			<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;">
      		订单详情
  			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>客户编号</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDetail.CusId">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>客户简称</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDetail.CusShortName">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>送货备注</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDetail.DNRemark">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>订单编号</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDetail.strOrderId">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>客订单号</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDetail.CusPoNo">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>客订单号</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDetail.CusPoNo">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>客订单号</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDetail.CusPoNo">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>客订单号</span></div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDetail.CusPoNo">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>订单材质</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDetail.BoardId">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>材质名称</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDetail.BoardName">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>压线信息</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDetail.ScoreInfo">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>压型</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDetail.ScoreType">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>货品名称</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDetail.MatName">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>箱型</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDetail.BoxName">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>箱长(mm)</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDetail.BoxL">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>箱宽(mm)</span></div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDetail.BoxW">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>箱高(mm)</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDetail.BoxH">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>板长(mm)</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDetail.Length">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>板宽(mm)</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDetail.Width">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>工艺流程</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDetail.ProFlow">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>订单数</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDetail.OrdQty">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>传单数</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDetail.SchQty">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>完工数</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDetail.FinishedQty">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>送货数</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDetail.DeliQty">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>退货数</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDetail.ReturnQty">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>销售面积(㎡)</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDetail.TSalesArea">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>价格(元)</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDetail.Price">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>平方价(元/㎡)</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDetail.SquarePrice">
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title van-field__label">
					<span>金额(元)</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" readonly="readonly" class="van-field__control van-field__control--center" :value="info.orderDetail.Amt">
					</div>
				</div>
			</div>
		</div>
	</van-popup>
</template>
<script>
	import { Popup } from 'vant';
	export default {
		components:{
			[Popup.name]: Popup,
		},
		props:['orderId','orderType','detailShow'],
		data(){
			return {
				info:{
					orderDNRe:null,
					orderDN:null,
					orderSch:null,
					orderDetail:null
				},
				show:this.detailShow,
			}
		},
		methods:{
			getDetail( data ){
				let self = this;
				if( data.orderId == '' ){
					return 
				}
				this.$request.staff.erp.ordersDetail( data ).then(res=>{
					if( res.result.get_order_DNRe !== undefined ){
						self.info.orderDNRe = res.result.get_order_DNRe;
					}
					if( res.result.get_order_DN !== undefined ){
						self.info.orderDN = res.result.get_order_DN;
					}
					if( res.result.get_order_sch !== undefined ){
						self.info.orderSch = res.result.get_order_sch;
					}
					if( res.result.get_order_detail !== undefined ){
						self.info.orderDetail = res.result.get_order_detail;
					}
				});
			},
			phoneClick( tel ){
				window.location.tel = 'tel://' + tel;
			},
			closeClick(){
				this.show = false;
			}
		},
		mounted(){
			this.getDetail({orderId:this.orderId,orderType:this.orderType});
		},
		created(){

		},
		computed:{
			strId(){
				return this.orderType + this.orderId;
			}
		},
		watch:{
			strId( newVal, oldVal ){
				this.orderId = newVal.substring(1);
				this.orderType = newVal[0];
				this.getDetail({orderId:this.orderId,orderType:this.orderType});
			},
			detailShow(newV,oldV){
				this.show = newV;
			},
			show(newV,oldV){
				this.$emit("update:detailShow", newV);
			},
		}
	}
</script>