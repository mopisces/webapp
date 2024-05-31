<template>
	<div>
		<van-card>
			<div slot="title">
				{{ cardInfo.boardId }}
				<span style="color:#000;" v-if="cardInfo.title">,{{ cardInfo.title }}</span>
			</div>
			<van-count-down 
				v-if="cardInfo.countDown.show" 
				:time="cardInfo.countDown.time" 
				slot="desc" 
				@finish="finish()"
			>
				<template v-slot="timeData">
					<span>距团购结束：</span>
					<span class="build-item">{{ timeData.days }}</span>
					<span>天</span>
					<span class="build-item">{{ timeData.hours }}</span>
					<span>:</span>
					<span class="build-item">{{ timeData.minutes }}</span>
					<span>:</span>
					<span class="build-item">{{ timeData.seconds }}</span>
				</template>
			</van-count-down>
			<div slot="price">
				<span class="group-card-price-text">¥{{ cardInfo.productPrice }}</span>
				/㎡
			</div>
			<div slot="origin-price">¥{{ cardInfo.marketPrice }}/㎡</div>
			<van-image 
				:src="cardInfo.pic" 
				slot="thumb" 
				width="85" 
				height="85"
			/>
		</van-card>
		<van-field 
			v-model="formData.cusOrderId" 
			label="客订单号" 
			input-align="center" 
			placeholder="未填写则系统自动生成"
		>
		</van-field>
		<uni-check-box	
			label="箱型"
			:localdata="config.radioData.boxType"
			:radioData.sync="formData.boxType" 
			:map="{text: 'BoxName', value: 'BoxId'}"
			@change="boxTypeChange"
		>
		</uni-check-box>
		<div class="van-cell" style="display: flex;align-items: center;">
			<div class="van-cell__title van-field__label">箱规(mm)</div>
			<input 
				id="boxLength" 
				type="number" 
				class="karry-input" 
				placeholder="长(L)" 
				v-model="formData.boxLength" 
				@focus="inputFocus('boxLength')" 
				@blur=" inputBlur('boxLength') "
			/>
			<div style="margin-left:0.2rem;margin-right:0.2rem;">x</div>
			<input 
				id="boxWidth" 
				type="number" 
				class="karry-input" 
				placeholder="宽(W)" 
				v-model="formData.boxWidth" 
				@focus="inputFocus('boxWidth')" 
				@blur=" inputBlur('boxWidth') "
			/>
			<div style="margin-left:0.2rem;margin-right:0.2rem;">x</div>
			<input 
				id="boxHeight" 
				type="number" 
				class="karry-input"
				placeholder="高(H)" 
				v-model="formData.boxHeight" 
				@focus="inputFocus('boxHeight')" 
				@blur=" inputBlur('boxHeight') "
			/>
			<div class="van-field__right-icon">
				<van-icon 
					name="question-o" 
					@click="$toast(
					'箱长范围:' + pageConfig.minBoxL + 'mm~'+ pageConfig.maxBoxL  + 'mm\n箱宽范围:' + pageConfig.minBoxW + 'mm~' + pageConfig.maxBoxW + 'mm\n' + '箱高范围:' + pageConfig.minBoxH + 'mm~' + pageConfig.maxBoxH + 'mm'  
					)"
				/>
			</div>
		</div>
		<uni-check-box
			label="箱舌(T)"
			:localdata="config.radioData.tonLen"
			:radioData.sync="formData.tonLen" 
			:map="{text: 'text', value: 'value'}"
			@change="tonLenChange"
		>
		</uni-check-box>
		<uni-check-box
			label="封箱调整(U)"
			:localdata="config.radioData.uLen"
			:radioData.sync="formData.uLen" 
			:map="{text: 'text', value: 'value'}"
			@change="lenChange"
		>
		</uni-check-box>
		<van-field 
			v-if="!pageConfig.isWeb"
			v-model="formData.lengthF" 
			input-align="center" 
			label="横向公式" 
			placeholder="待选择箱型" 
			readonly
		/>
		<van-field 
			v-if="!pageConfig.isWeb"
			v-model="formData.widthF" 
			input-align="center" 
			label="纵向公式" 
			placeholder="待选择箱型" 
			readonly
		/>
		<div class="van-cell" style="display: flex;align-items: center;">
			<div class="van-cell__title van-field__label">纸板(mm)</div>
			<input 
				type="number" 
				class="karry-input" 
				placeholder="板长" 
				v-model="formData.length" 
				:readonly="!pageConfig.isWeb"
				@focus="inputFocus('length')" 
				@blur="inputBlur('length')"
			/>
			<div style="margin-left:0.2rem;margin-right:0.2rem;">x</div>
			<input 
				type="number" 
				class="karry-input" 
				placeholder="板宽" 
				v-model="formData.width" 
				:readonly="!pageConfig.isWeb"
				@focus="inputFocus('width')" 
				@blur="inputBlur('width')"
			/>
		</div>
		<van-field 
			v-model="formData.scoreInfo"
			input-align="center" 
			:label="pageConfig.buildScoreInfoChiText" 
			:placeholder="!pageConfig.isWeb?'由ERP系统自动计算':'请输入压线'" 
			:readonly="!pageConfig.isWeb"
			@focus="inputFocus('scoreInfo')" 
			@blur="inputBlur('scoreInfo')"
		/>
		<uni-check-box
			label="压线压型"
			:localdata="config.radioData.lineBall"
			:radioData.sync="formData.lineBallInfo" 
			:map="{text: 'text', value: 'value'}"
			@change="lineBallChange"
		>
		</uni-check-box>
		<van-field 
			v-model="formData.bdMultiple" 
			input-align="center" 
			label="张数" 
			placeholder="待选择箱型" 
			readonly 
			right-icon="question-o" 
			@click-right-icon="$toast('正数:几个纸板=>1个纸箱\n负数:1个纸板=>几个纸箱' )"
		/>
		<van-field 
			id="ordQty" 
			ref="orderQuantitiesField" 
			v-model="formData.ordQty" 
			input-align="center" 
			label="订单数" 
			placeholder="输入订单数" 
			@focus="inputFocus('ordQty')" 
			@blur="inputBlur('ordQty')"
		/>
		<van-field 
			v-model="formData.bdQty" 
			input-align="center" 
			label="纸板数" 
			placeholder="待计算" 
			readonly
		/>
		<van-field 
			v-model="formData.unitArea" 
			input-align="center" 
			label="单片面积(㎡)" 
			placeholder="待计算" 
			readonly 
		/>
		<van-field 
			v-model="formData.area" 
			input-align="center" 
			label="下单面积(㎡)" 
			placeholder="待计算" 
			readonly 
			right-icon="question-o" 
			@click-right-icon="$toast('下单面积范围:'+pageConfig.minArea+'㎡~'+pageConfig.maxArea+'㎡')" 
		/>
		<popup-select 
			v-if="pageConfig.showBuildCAddress == 1"
			:selectValue.sync="formData.address" 
			:fieldConfig="config.fieldConfig.address" 
			:radioData="config.radioData.address" 
			selectType="cusInfo" 
			@valueChange="addressChange">
		</popup-select>
		<new-time-picker 
			v-if="config.popup.timeFilter.isFinishLoad"
			:dateTime.sync="formData.date" 
			:minDate="pageConfig.minDate" 
			:maxDate="pageConfig.maxDate" 
			label="交货日期" 
		></new-time-picker>
		<van-field 
			v-if="config.showDeliveryRemark == 1" 
			v-model="formData.deliveryRemark" 
			rows="1" 
			autosize 
			label="送货备注" 
			type="textarea"  
			maxlength="50" 
			placeholder="填写送货备注" 
			show-word-limit
		/>
		<van-field 
			v-model="formData.productionRemark" 
			rows="1" 
			autosize 
			label="生产备注" 
			type="textarea"  
			maxlength="50" 
			placeholder="填写生产备注" 
			show-word-limit
		/>
		<div style="height:2.5rem;width:100%;"></div>
		<van-submit-bar 
			:price=" formData.cost * 100 " 
			button-text="提交订单" 
			:disabled=" !(pageConfig.erpCalcScoreInfoSuccess && !config.submitBar.disabled)"
			@submit="checkFormData()"
		>
			<div slot="default">
				<div style="color: rgb(224, 24, 53);padding-left: 0.5rem;">
					<van-tag 
						mark 
						type="danger" 
						v-if=" formData.isRangePrice && helpInfo.sheetQuantities == 0 && helpInfo.price == 0 "
					>
						最低价
					</van-tag>
					¥
					<span v-if="formData.isRangePrice && formData.price">{{ formData.price }}</span>
					<span v-if="!formData.isRangePrice && cardInfo.productPrice">{{ cardInfo.productPrice }}</span>
					/㎡
				</div>
			</div>
			<div slot="tip" v-if="formData.saveCost || (formData.isRangePrice && helpInfo.sheetQuantities != 0 && helpInfo.price != 0)">
				<span v-if="formData.saveCost">
					节省:
					<span style="color:rgb(224, 24, 53);">¥{{ formData.saveCost }}</span>
				</span>
				<span v-if="formData.isRangePrice && helpInfo.sheetQuantities != 0 && helpInfo.price != 0">
					订单数满
					<span 
						style="color: rgb(68, 187, 0); text-decoration: underline; cursor: pointer;font-size:1rem;" 
						@click="maxOrderQty()"
					>
						{{ helpInfo.sheetQuantities }}
					</span>
					价格减至
					<span style="color: rgb(224, 24, 53);">
						¥{{ helpInfo.price }}/㎡
					</span>
				</span>
			</div>
			<!-- <div slot="top" style="font-size:0.75rem;text-align:center;">
				<template v-if="formData.isRangePrice">
					<van-tag 
						mark 
						type="danger" 
						v-if=" helpInfo.sheetQuantities == 0 && helpInfo.price == 0 "
					>
						最低价
					</van-tag>
					<br/>
					<template v-if=" helpInfo.sheetQuantities != 0 && helpInfo.price != 0 ">
						订单数满
						<span 
							style="color: rgb(68, 187, 0); text-decoration: underline; cursor: pointer;font-size:1rem;" 
							@click="maxOrderQty()"
						>
							{{ helpInfo.sheetQuantities }}
						</span>
						价格减至 
						<span style="color: rgb(224, 24, 53);">
							¥{{ helpInfo.price }}/㎡
						</span>
						<br/>
					</template>
				</template>
				<template>
					节省金额：<span style="color:rgb(224, 24, 53);">¥{{ formData.saveCost }}</span>
				</template>
			</div> -->
		</van-submit-bar>
		<build-sku 
			:skuShow.sync="config.popup.sku.show" 
			:orderInfo="formData" 
			orderType="c" 
			:isGroup="true" 
			:showULen="config.showULen" 
			:showTonLen="config.showTonLen"
			@saveOrder="saveOrder" 
		>
		</build-sku>
		<build-result 
			v-if="config.result.show" 
			:resultShow.sync="config.result.show" 
			:isGroup.sync="config.result.isGroup" 
			:isSuccess="config.result.isSuccess" 
			:cusOrderId="config.result.cusOrderId" 
			:failMsg="config.result.failMsg"
			:isPay="pageConfig.directCreditPay == 1 && pageConfig.useCreditPay == 1"
			@clearFormData="clearFormData()" 
		>
		</build-result>
	</div>
</template>
<script>
	import { Image, Field, Dialog, Toast, CountDown, Tag, Card, SubmitBar } from 'vant';
	import PopupSelect from '@/components/subject/build/PopupSelect.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import BuildSku from '@/components/subject/build/BuildSku.vue';
	import BuildResult from '@/components/subject/build/BuildResult.vue';
	import schema from 'async-validator';

	import UniCheckBox from '@/components/subject/checkbox/UniCheckBox.vue'
	/*api接口*/
	import { getBuildOrdConfig } from "@/api/common/webConfig"

	export default {
		components:{
			[Image.name]: Image,
			[Field.name]: Field,
			[Dialog.name]: Dialog,
			[Toast.name]: Toast,
			[CountDown.name]: CountDown,
			[Tag.name]: Tag,
			[Card.name]: Card,
			[SubmitBar.name]: SubmitBar,

			PopupSelect,
			NewTimePicker,
			BuildSku,
			BuildResult,
			UniCheckBox
		},
		data(){
			return {
				config : {
					submitBar: {
						disabled: false
					},
					fieldConfig: {
						boxType: {
							label: '箱型',
							placeholder: '选择箱型'
						},
						tonLen: {
							label: '箱舌(T)',
							placeholder: '选择箱舌'
						},
						uLen: {
							label: '封箱调整(U)',
							placeholder: '选择封箱调整'
						},
						lineBall: {
							label: '压型名称',    //压线名称
							placeholder: '选择压型名称'  //选择压线名称
						},
						address: {
							label: '送货公司',
							placeholder: '选择送货公司'
						},
					},
					radioData: {
						boxType: [],
						tonLen: [],
						uLen: [],
						lineBall: [],
						address: [],
					},
					popup: {
						timeFilter: {
							isFinishLoad : false
						},
						sku: {
							show: false,
						}
					},
					result: {
						show: false,
						isSuccess: false,
						cusOrderId: '',
						isGroup: false,
						failMsg: '下单失败'
					},
					showTonLen: true,
					showULen: true,
					showDeliveryRemark: 0,
					lastToLen: null,
					lastULen: null,
					build: {
						lenNeedToast: false,
						widthNeedToast: false,
						heightNeedToast: false,
						lenToastDefault: null,
						widthToastDefault: null,
						heightToastDefault: null,
					},
					initClientHeight: document.documentElement.clientHeight
				},
				cardInfo: {
					boardId: '',
					title: '',
					productPrice : '',
					marketPrice: '',
					pic: null,
					countDown: {
						time: 0,
						show: false,
					}
				},
				formData: {
					productId: '',
					cusOrderId: '',
					boxType: '',
					boxLength: '',
					boxWidth: '',
					boxHeight: null,
					tonLen: '',
					uLen: '',
					lengthF: '',
					widthF: '',
					length: '',
					width: '',
					bdMultiple: '',  //张数
					ordQty: '',  //订单数
					bdQty: '',  //纸板数
					lineBallInfo: '',  //压型名称
					scoreInfo: '', //压线信息
					area: '',
					unitArea: null,
					address: '',
					date: '',
					deliveryRemark: '',
					productionRemark: '',
					isRangePrice: false,
					isValidArea: false,
					cost: '',
					price: '',
					saveCost: '',
				},
				//箱型对应信息
				boxInfo: {
					//长度公式
					lengthFCalc: null,
					//宽度公式
					widthFCalc: null,
					//长度提示信息
					lengthFDesc: null,
					//宽度提示信息
					widthFDesc: null,
					//备注信息
					remark: null,
				},
				pageConfig: {
					minDate: '',
					maxDate: '',
					minBoxL: '',
					maxBoxL: '',
					minBoxW: '',
					maxBoxW: '',
					minBoxH: '',
					maxBoxH: '',
					minArea: '',
					maxArea: '',
					lengthF: '',
					widthF: '',
					buildAutoGetTonLenAndULen: true,
					buildScoreInfoChiText: null,
					showBuildCAddress: 0,

					useCreditPay: 0,
					directCreditPay: 0,
					factoryId: null,
					erpId: null,
					subFacId: null,
					/*请求压线是否可用*/
					inProgress: false,
					/*自由输入板长板宽压线*/
					isWeb: false,
					/*erp计算压线是否成功*/
					erpCalcScoreInfoSuccess: true,
					/*erp计算的压线*/
					erpCalcScoreInfo: null
				},
				helpInfo: {
					sheetQuantities: 0,
					price: 0,
				},
				validator: {},
				rules: {
					productId: [
						{ required: true, message: '产品信息不能为空' }
					],
					boxType: [
						{ required: true, message: '请选择箱型' }
					],
					boxLength: [
						{ required: true, message : '请填写箱长' },
						{ validator: (rule, value, callback, source, options)=>{
							let errors;
							if( Number(value) > this.pageConfig.maxBoxL || Number(value) < this.pageConfig.minBoxL){
								errors = '箱长范围:' + this.pageConfig.minBoxL + 'mm~' + this.pageConfig.maxBoxL + 'mm';
								this.formData.boxLength = null;
							}
							callback(errors);
						} }
					],
					boxWidth: [
						{ required: true, message: '请填写箱宽' },
						{ validator: (rule, value, callback, source, options)=>{
							let errors;
							if( Number(value) > this.pageConfig.maxBoxW || Number(value) < this.pageConfig.minBoxW){
								errors = '箱宽范围:' + this.pageConfig.minBoxW + 'mm~' + this.pageConfig.maxBoxW + 'mm';
								this.formData.boxWidth = null;
							}
							callback(errors);
						} }
					],
					boxHeight: [
						{ required: true, message: '请填写箱高' },
						{ validator: (rule, value, callback, source, options)=>{
							let errors
							if( /^\d+$/.test(value ) ) {
								if( Number(value) != 0) {
									if( Number(value) > this.pageConfig.maxBoxH || Number(value) < this.pageConfig.minBoxH){
										errors = '箱高范围:' + this.pageConfig.minBoxH + 'mm~' + this.pageConfig.maxBoxH + 'mm'
										this.formData.boxHeight = null
									}
								}
							} else {
								errors = "请输入箱高"
							}
							callback(errors)
						} }
					],
					tonLen: [
						{ required: true, message: '请选择箱舌'  }
					],
					uLen: [
						{ required: true, message: '请选择封箱调整'  }
					],
					length: [
						{ required: true, message: '板长不能为空'  },
						{
							validator: (rule, value, callback, source, options)=> {
								let errors
								if( !( /^\d+$/.test(value )) ) {
									errors = "板长格式错误"
								}
								callback(errors)
							}
						}
					],
					width: [
						{ required: true, message: '板宽不能为空'  },
						{
							validator: (rule, value, callback, source, options)=> {
								let errors
								if( !( /^\d+$/.test(value )) ) {
									errors = "板宽格式错误"
								}
								callback(errors)
							}
						}
					],
					bdQty: [
						{ required: true, message: '请填写相关信息获取纸板数'  },
						{
							validator: (rule, value, callback, source, options)=> {
								let errors
								if( !( /(^[1-9]\d*$)/.test( value )) ) {
									errors = "纸板数格式错误"
								}
								callback(errors)
							}
						}
					],
					ordQty: [
						{ required: true, message: '请输入订单数量' },
						{
							validator: (rule, value, callback, source, options)=> {
								let errors
								if( !( /(^[1-9]\d*$)/.test( value )) ) {
									errors = "请输入正确的订单数量"
								}
								callback(errors)
							}
						}
					],
					lineBallInfo: [
						{ required: true , message: '请选择压型' },
						{
							validator: (rule, value, callback, source, options)=> {
								let errors
								if( value == "无压线" && this.formData.scoreInfo ) {
									errors = "无法选择无压线"
								}
								if( value != "无压线" && !this.formData.scoreInfo ) {
									errors = "无法选择当前压型"
								}
								callback(errors)
							}
						}
					],
					scoreInfo: [
						{ 
							validator: (rule, value, callback, source, options)=>{
								let errors
								console.log(this.formData.lineBallInfo)
								try {
									if( this.formData.lineBallInfo != "无压线" && Math.round(eval(value)) != this.formData.width ) {
										errors = this.pageConfig.isWeb ? "当前压型与压线不匹配" : "当前压型与压线不匹配"
									}
								} catch( err ) {
									errors = this.pageConfig.isWeb ? "当前压型与压线不匹配" : "当前压型与压线不匹配"
								}
								callback(errors)
							}
						}
					],
					area: [
						{ required: true, message: '请填写相关信息获取下单面积'  },
						{ validator: (rule, value, callback, source, options)=>{
							let errors;
							if( Number(value) > this.pageConfig.maxArea || Number(value) < this.pageConfig.minArea){
								errors = '下单面积范围:' + this.pageConfig.minArea + 'mm~' + this.pageConfig.maxArea + 'mm';
							}
							callback(errors);
						} }
					],
					address: [
						{ required: true, message: '请选择送货公司'  },
					],
					date: [
						{ required: true, message: '请选择送货日期'  },
					]
				}
			}
		},
		methods:{
			getConfig( goodsId ){
				let self = this;
				this.$request.client.groupBuying.getCConfig( goodsId ).then(res=>{
					if( res.errorCode == '20260' ){
						Dialog.alert({
							message:res.msg
						}).then(()=>{
							self.$router.push('/group/board/lists'); 
						});
						return ;
					}
					if( res.result.page_config.UseAliPay == 1 || res.result.page_config.UseWxPay == 1 ){
						self.config.result.isGroup = true;
					}
					self.pageConfig.buildAutoGetTonLenAndULen = res.result.page_config.BuildAutoGetTonLenAndULen == 1 ? true : false;
					
					self.config.lastToLen = res.result.last_tolen;
					self.config.lastULen  = res.result.last_ulen;
					self.pageConfig.minDate = res.result.page_config.BuildMinDate;
					self.pageConfig.maxDate = res.result.page_config.BuildMaxDate;
					self.pageConfig.minBoxL = res.result.page_config.BuildMinBoxL;
					self.pageConfig.maxBoxL = res.result.page_config.BuildMaxBoxL;
					self.pageConfig.minBoxW = res.result.page_config.BuildMinBoxW;
					self.pageConfig.maxBoxW = res.result.page_config.BuildMaxBoxW;
					self.pageConfig.minBoxH = res.result.page_config.BuildMinBoxH;
					self.pageConfig.maxBoxH = res.result.page_config.BuildMaxBoxH;
					self.pageConfig.minArea = res.result.product_info.BuildMin;
					self.pageConfig.maxArea = res.result.product_info.BuildMax;
					self.pageConfig.buildScoreInfoChiText = res.result.page_config.BuildScoreInfoChiText
					self.pageConfig.showBuildCAddress = res.result.page_config.ShowBuildCAddress

					self.pageConfig.useCreditPay = res.result.page_config.UseCreditPay
					self.pageConfig.directCreditPay =  res.result.page_config.DirectCreditPay
					//用户信息
					self.pageConfig.erpId = res.result.userInfo.ERPId
					self.pageConfig.factoryId = res.result.userInfo.FactoryId
					self.pageConfig.subFacId = res.result.userInfo.SubFacId

					self.cardInfo.boardId      = res.result.product_info.BoardId;
					self.cardInfo.title        = res.result.product_info.Title;
					self.cardInfo.productPrice = res.result.product_info.Price;
					self.cardInfo.marketPrice  = res.result.product_info.MarketPrice;

					self.formData.date    = res.result.page_config.BuildDeliveryDate;

					self.formData.address = res.result.userInfo.ERPId;
					self.formData.tonLen  = res.result.adjust_info.TonLen;
					self.formData.uLen    = res.result.adjust_info.ULen;

					self.config.showDeliveryRemark = res.result.page_config.ShowDeliveryRemark;

					self.config.build.lenNeedToast = res.result.page_config.BuildLenNeedToast == 1 ? true : false;
					self.config.build.lenToastDefault = Number(res.result.page_config.BuildLenToastDefault);
					self.config.build.widthNeedToast = res.result.page_config.BuildWidthNeedToast == 1 ? true : false;
					self.config.build.widthToastDefault = Number(res.result.page_config.BuildWidthToastDefault);
					self.config.build.heightNeedToast = res.result.page_config.BuildHeightNeedToast == 1 ? true : false;
					self.config.build.heightToastDefault = Number(res.result.page_config.BuildWidthToastDefault);

					self.cardInfo.pic = res.result.product_info.Pic
					if( res.result.product_info.BeginTime * 1000 < (new Date()).valueOf()  ){
						self.cardInfo.countDown.time = res.result.product_info.EndTime * 1000 - (new Date()).valueOf();
					}else{
						self.cardInfo.countDown.time = ( res.result.product_info.EndTime - res.result.product_info.BeginTime ) * 1000;
					}
					res.result.page_config.BuildTonLen.forEach((item,index)=>{
						self.config.radioData.tonLen.push({ value: item, text: item });
					});
					res.result.page_config.BuildULen.forEach((item,index)=>{
						self.config.radioData.uLen.push({ value: item, text: item })
					});
					self.config.radioData.boxType = JSON.parse(JSON.stringify(res.result.box_type_available))

					if( res.result.page_config.BuildTonLen.length == 1 && res.result.page_config.BuildTonLen[0] == 0 ){
						self.config.showTonLen = false;
					}
					if( res.result.page_config.BuildULen.length == 1 && res.result.page_config.BuildULen[0] == 0 ){
						self.config.showULen = false;
					}
					
					res.result.page_config.line_ball_config.forEach((item,index)=>{
						self.config.radioData.lineBall.push( { value: item, text: item } );
					});
					self.formData.lineBallInfo = res.result.page_config.DefaultScoreName ? res.result.page_config.DefaultScoreName : self.config.radioData.lineBall[0].value;
					res.result.cus_info.forEach((item,index)=>{
						self.config.radioData.address.push({ value : item.CusSubNo, text:item.SubDNAddress})
					});
				}).then(()=>{
					this.$nextTick(()=>{
						this.cardInfo.countDown.show = true;
						this.config.popup.timeFilter.isFinishLoad = true;
					})
				});
			},
			async getBoxFormula( boxType ){
				this.boxInfo = this.$options.data().boxInfo
				let arr = this.config.radioData.boxType.find(item => item.BoxId === boxType)
				this.formData.bdMultiple = 0
				if( arr ) {
					this.boxInfo.remark = arr.Remark
					this.pageConfig.isWeb = arr.Remark.includes('WEB') ? true : false
					this.boxInfo.lengthFCalc = arr.LengthF
					this.boxInfo.lengthFDesc = arr.LengthFDesc || ''
					this.boxInfo.widthFCalc = arr.WidthF
					this.boxInfo.widthFDesc = arr.WidthFDesc || ''
					this.formData.bdMultiple = Number(arr.Multiple)
					if( !this.boxInfo.lengthFCalc.includes('L') && !this.boxInfo.widthFCalc.includes('L') ) {
						this.formData.boxLength = 0
					}
					if( !this.boxInfo.lengthFCalc.includes('W') && !this.boxInfo.widthFCalc.includes('W') ) {
						this.formData.boxWidth = 0
					}
					if( !this.boxInfo.lengthFCalc.includes('H') && !this.boxInfo.widthFCalc.includes('H') ) {
						this.formData.boxHeight = 0
					}

					await this.calcBdLW(false)
					await this.calcBdQty()
				}
				/*let self = this;
				this.$request.client.groupBuying.getBoxFormula( boxType ).then(res=>{
					self.formData.lengthF    = res.result.LengthF;
					self.formData.widthF     = res.result.WidthF;
					self.pageConfig.lengthF  = res.result.LengthF;
					self.pageConfig.widthF   = res.result.WidthF;
					self.formData.bdMultiple = res.result.Multiple;
				}).then(()=>{
					this.$nextTick(()=>{
						this.calcBdLW();
						this.calcBdQty();
					});
				});*/
			},
			checkFormData(){
				let validator = new schema( this.rules )
				validator.validate(this.formData).then(()=>{
					this.checkData(this.formData)
				}).then(()=> {
					if( !this.pageConfig.isWeb )  this.fetchScoreInfo()
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message)
				})
			},
			checkData( postData ){
				let self = this;
				this.$request.client.groupBuying.cCheck( postData ).then(res=>{
					if( res.errorCode == '00000' ){
						self.config.popup.sku.show = true;
					}
				});
			},
			saveOrder( postData ){
				if( !this.formData.isValidArea ){
					Toast.fail('面积不可用');
					return ;
				}
				let self = this;
				this.$request.client.groupBuying.cGroupBooking( postData ).then(res=>{
					if( res.errorCode == '00000' ){
						Toast.success(res.result.order_id);
						self.config.result.cusOrderId = res.result.order_id;
						self.config.result.isSuccess  = true;
					}else{
						self.config.result.isSuccess = false;
						self.config.result.failMsg = res.msg;
					}
					this.config.result.show = true;
				});
			},
			async clearFormData(){
				if( this.config.result.isSuccess ){
					window.location.reload()
				}
			},
			async calcBdLW( needCalcArea = true ){
				if( this.pageConfig.isWeb ) return false
				if( Number(this.formData.boxLength) && ( Number(this.formData.boxLength) <  Number(this.pageConfig.minBoxL) ||  Number(this.formData.boxLength) >  Number(this.pageConfig.maxBoxL)) ){
                    this.formData.boxLength = ''
                    Toast('箱长范围:' + this.pageConfig.minBoxL + 'mm~' + this.pageConfig.maxBoxL + 'mm')
                }
                if(  Number(this.formData.boxWidth) && (  Number(this.formData.boxWidth) <  Number(this.pageConfig.minBoxW) ||  Number(this.formData.boxWidth) >  Number(this.pageConfig.maxBoxW) )){
                    this.formData.boxWidth = ''
                    Toast('箱宽范围:' + this.pageConfig.minBoxW + 'mm~' + this.pageConfig.maxBoxW + 'mm')
                }
                if( Number(this.formData.boxHeight) && ( Number(this.formData.boxHeight) <  Number(this.pageConfig.minBoxH) ||  Number(this.formData.boxHeight) >  Number(this.pageConfig.maxBoxH ) )){
                    this.formData.boxHeight = ''
                    Toast('箱高范围:' + this.pageConfig.minBoxH + 'mm~' + this.pageConfig.maxBoxH + 'mm')
                }
                var lengthExp = this.boxInfo.lengthFCalc
                var widthExp  = this.boxInfo.widthFCalc
                if( !lengthExp || !widthExp ) return false
                if(this.formData.boxLength){
                    lengthExp = lengthExp.replace(/L/g,this.formData.boxLength);
                    widthExp  = widthExp.replace(/L/g,this.formData.boxLength);
                }
                if(this.formData.boxWidth){
                    lengthExp = lengthExp.replace(/W/g,this.formData.boxWidth)
                    widthExp  = widthExp.replace(/W/g,this.formData.boxWidth)
                }
                if(this.formData.boxHeight){
                    lengthExp = lengthExp.replace(/H/g,this.formData.boxHeight)
                    widthExp  = widthExp.replace(/H/g,this.formData.boxHeight)
                }

                if(this.formData.tonLen){
                    lengthExp = lengthExp.replace(/T/g,this.formData.tonLen)
                    widthExp  = widthExp.replace(/T/g,this.formData.tonLen)
                }
                if(this.formData.uLen){
                    lengthExp = lengthExp.replace(/U/g,this.formData.uLen)
                    widthExp  = widthExp.replace(/U/g,this.formData.uLen)
                }
                this.formData.lengthF = lengthExp
                this.formData.widthF  = widthExp
                if(lengthExp && lengthExp.indexOf('L') === -1 && lengthExp.indexOf('W') === -1 && lengthExp.indexOf('H') === -1 && lengthExp.indexOf('T') === -1 && lengthExp.indexOf('U') === -1){
                    this.formData.length = Math.round(eval(lengthExp.replace(/<\/?.+?>/g,'')))
                }else{
                    this.formData.length = this.$options.data().formData.length
                }
                if(widthExp && widthExp.indexOf('L') === -1 && widthExp.indexOf('W') === -1 && widthExp.indexOf('H') === -1 && widthExp.indexOf('T') === -1 && widthExp.indexOf('U') === -1){
                    this.formData.width = Math.round(eval(widthExp.replace(/<\/?.+?>/g,'')))
                }else{
                    this.formData.width = this.$options.data().formData.width
                }
                /*计算压线*/
                if( this.formData.length && this.formData.width && !this.pageConfig.isWeb ) {
                	await this.fetchScoreInfo()
                }
                if( needCalcArea ) await this.calcAreaCost()
			},
			async calcBdQty(){
				if( /^\d$/.test(this.formData.bdMultiple) && this.formData.ordQty ){
					if(this.formData.bdMultiple > 0){
                        this.formData.bdQty = this.formData.ordQty * this.formData.bdMultiple
                    }else if(this.formData.bdMultiple < 0){
                        this.formData.bdQty = this.formData.ordQty / this.formData.bdMultiple * -1
                    }else{
                        this.formData.bdQty = ''
                    }
				}else{
					this.formData.bdQty = ''
				}
				await this.calcAreaCost()
			},
			beforeCalcAreaCost(){
				this.config.submitBar.disabled = true
				
				this.formData.isRangePrice = false
				this.formData.isValidArea = false
				this.formData.area = this.$options.data().formData.area
				this.formData.cost = ''
				this.formData.saveCost = ''
				this.formData.price = ''
				this.helpInfo = this.$options.data().helpInfo
				this.formData.unitArea = this.$options.data().formData.unitArea
			},
			calcAreaCost(){
				this.beforeCalcAreaCost();
				if( this.formData.ordQty && !( /(^[1-9]\d*$)/.test(this.formData.ordQty) ) ){
					Toast.fail('订单数错误')
					this.formData.ordQty = ''
					this.formData.bdQty  = ''
					return 
				}
				if( this.formData.bdQty && !( /(^[1-9]\d*$)/.test(this.formData.bdQty) ) ){
					Toast.fail('纸板数错误')
					this.formData.ordQty = ''
					this.formData.bdQty  = ''
					return 
				}
				if( /^\d+$/.test(this.formData.length) && /^\d+$/.test(this.formData.width) && this.formData.bdQty ){
					if( this.formData.lineBallInfo != "无压线" && this.pageConfig.isWeb ) {
						try {
							if ( this.formData.width != Math.round(eval(this.formData.scoreInfo))) {
								Toast.fail("请填写正确压线")
								return false
							}
						} catch(err) {
							Toast.fail("请填写正确压线")
							return false
						}
					}
					this.$request.client.groupBuying.getAreaCost({
						productId: this.formData.productId,
						sheetQuantities: this.formData.bdQty,
						boardLength: this.formData.length,
						boardWidth: this.formData.width
					}).then(res=>{
						if( res.errorCode != '00000' ){
							this.formData.isValidArea     = false;
							this.formData.isRangePrice    = false;
							this.formData.ordQty          = '';
							this.formData.bdQty           = '';
							this.helpInfo = this.$options.data().helpInfo
							return ;
						}
						this.formData.area = res.result.area_size;
						this.formData.unitArea = res.result.unitArea
						if( res.result.valid_area == '1' ){
							this.formData.isValidArea = true;
							this.formData.cost        = res.result.cost;
							this.formData.saveCost    = res.result.save_cost;
							if( res.result.is_range_price == '1' ){
								this.formData.isRangePrice = true;
								this.formData.price = res.result.price;
								if( res.result.help_info.length != 0 ){
									this.helpInfo.price = res.result.help_info.price;
									this.helpInfo.sheetQuantities = res.result.help_info.sheet_quantities;
								}
							}else{
								this.formData.isRangePrice = false;
								this.formData.price = '';
								this.helpInfo = this.$options.data().helpInfo
							}
							this.config.submitBar.disabled = false
						}else{
  							Toast.fail('下单面积范围：' + this.pageConfig.minArea + '㎡~' + this.pageConfig.maxArea + '㎡');
  							this.formData.isValidArea = false
  							this.formData.orderQuantities = 0
  							this.formData.area = 0
  							this.formData.unitArea = null
  							this.config.submitBar.disabled = true
						}
					});
				}
			},
			maxOrderQty(){
				this.formData.ordQty = this.getOrdQtyByBdQty( this.helpInfo.sheetQuantities )
				this.$refs.orderQuantitiesField.focus()
			},
			getOrdQtyByBdQty( bdQty ){
				if(this.formData.bdMultiple > 0){
                    return Math.ceil(bdQty / this.formData.bdMultiple)
                }else if(this.formData.bdMultiple < 0){
                    return bdQty * this.formData.bdMultiple * -1;
                }
			},
			boxTypeChange(e) {
				this.formData.scoreInfo = this.$options.data().formData.scoreInfo
				this.pageConfig.isWeb = this.$options.data().pageConfig.isWeb
				this.pageConfig.erpCalcScoreInfoSuccess = this.$options.data().pageConfig.erpCalcScoreInfoSuccess 
				this.pageConfig.erpCalcScoreInfo = this.$options.data().pageConfig.erpCalcScoreInfo
				this.formData.length = this.$options.data().formData.length
				this.formData.width = this.$options.data().formData.width
				this.getBoxFormula(e.detail.value)
			},
			tonLenChange( e ) {
				if( this.boxInfo.lengthFCalc && this.boxInfo.widthFCalc ) {
					this.calcBdLW()
				}
			},
			lenChange( e ) {
				if( this.boxInfo.lengthFCalc && this.boxInfo.widthFCalc ) {
					this.calcBdLW()
				}
			},
			addressChange( newValue ){
				this.formData.address = newValue;
			},
			lineBallChange( e ){
				this.formData.lineBallInfo = e.detail.value
			},
			async sizeBlur( id ){
				let tips = '';
				if( id == 'boxLength' && this.config.build.lenNeedToast ){
					if( this.config.build.lenToastDefault > this.formData.boxLength )
						tips = '下单长度小于' + this.config.build.lenToastDefault + 'mm';
				}
				if( id == 'boxWidth' && this.config.build.widthNeedToast ){
					if( this.config.build.widthToastDefault > this.formData.boxWidth )
						tips = '下单宽度小于' + this.config.build.widthToastDefault + 'mm';
				}
				if( id == 'boxHeight' && this.config.build.heightNeedToast ){
					if( this.config.build.heightToastDefault > this.formData.boxHeight )
						tips = '下单高度度小于' + this.config.build.heightToastDefault + 'mm';
				}
				if( tips.length > 0 ){
					var that = this;
					Toast({
						message: tips,
						icon:'warning-o',
					});
				}
				await this.calcBdLW()
			},
			inputFocus( id ){
				const ua = window.navigator.userAgent.toLocaleLowerCase();
				const isAndroid = /android/.test(ua);
				let that = this;
				if( isAndroid ){
					window.onresize = async () => {
						const curClientHeight = document.documentElement.clientHeight;
						//安卓键盘收起
						if (curClientHeight >= that.config.initClientHeight) {
							if( id == 'boxLength' || id == 'boxWidth' || id == 'boxHeight' ){
								that.sizeBlur(id);
							}
							if( id == 'ordQty' ){
								await that.calcBdQty();
							}
							if( (id == 'scoreInfo' || id == 'width')  && that.pageConfig.isWeb && that.formData.lineBallInfo != "无压线" && that.formData.width ) {
								try {
									if (that.formData.width != Math.round(eval(that.formData.scoreInfo))) {
										Toast.fail("请填写正确压线")
									}
									await that.calcBdQty()
								} catch(err) {
									Toast.fail("请填写正确压线")
								}
							}
							if( id == 'length'  ) {
								await that.calcBdQty()
							}
							window.onresize = null;
						}
					}
				}
			},
			async inputBlur( id ){
				if( id == 'ordQty' ){
					await this.calcBdQty()
				}
				if( id == 'boxLength' || id == 'boxWidth' || id == 'boxHeight'){
					await this.sizeBlur(id)
				}
				if( (id == 'scoreInfo' || id == 'width') && this.pageConfig.isWeb && this.formData.lineBallInfo != "无压线" && this.formData.width ) {
					try {
						if ( this.formData.width != Math.round(eval(this.formData.scoreInfo))) {
							Toast.fail("请填写正确压线")
						}
						await this.calcBdQty()
					} catch(err) {
						Toast.fail("请填写正确压线")
					}
				}
				if( id == 'length'  ) {
					await this.calcBdQty()
				}
			},
			/*倒计时结束*/
			finish() {
				this.config.submitBar.disabled = true
			},
			/*获取压线*/
			async fetchScoreInfo() {
				if( !this.pageConfig.inProgress ) {
					this.pageConfig.inProgress = true
					this.$request.staff.connecterp.formulaCalcScore({
						strFactoryId: this.pageConfig.factoryId,
						strSubFacId: this.pageConfig.subFacId,
						strCusId: this.pageConfig.erpId || '',
						strBoxId: this.formData.boxType,
						iBoxL: this.formData.boxLength,
						iBoxW: this.formData.boxWidth,
						iBoxH: this.formData.boxHeight,
						iLength: this.formData.length,
						iWidth: this.formData.width,
						iTonLen: this.formData.tonLen,
						iULen: this.formData.uLen
					}).then((res)=>{
						let dataRow = res.data.result[0] || null
						if( dataRow ) {
							dataRow = JSON.parse(dataRow)
							if ( dataRow.code == 200   ) {
								this.formData.scoreInfo = dataRow.data.ScoreInfo.includes('noscoreinfo') ? this.$options.data().formData.scoreInfo : dataRow.data.ScoreInfo
								this.pageConfig.erpCalcScoreInfo = dataRow.data.ScoreInfo
								this.pageConfig.erpCalcScoreInfoSuccess = true
							}else {
								this.pageConfig.erpCalcScoreInfoSuccess = false
								Toast({
									type: "fail",
									message: "ERP压线计算失败",
									duration: 2000
								})
							}
						} else {
							this.pageConfig.erpCalcScoreInfoSuccess = false
							Toast({
								type: "fail",
								message: "ERP压线计算失败",
								duration: 2000
							})
						}
					}).catch((err)=> {
						this.pageConfig.erpCalcScoreInfoSuccess = false
						Toast.fail('ERP压线计算失败')
					}).finally(()=>{
						this.pageConfig.inProgress = false 
					})
				}
				
			}
		},
		async created(){
			await this.$store.commit('client/setHeaderTitle', '纸箱纸板下单')
			await this.$store.commit('client/setTabbarActive', 'group')
		},
		mounted(){
			if( this.$route.query ){
				this.formData.productId = this.$route.query.productId;
				this.$store.commit('client/setBackPath', '/mall/product/detail?productId=' + this.$route.query.productId)
				this.$store.commit('client/setLoginRedirect', '/group/build/c?productId=' + this.$route.query.productId)
			}else if( sessionStorage.getItem('group-product-id') != null ){
				this.formData.productId = sessionStorage.getItem('group-product-id');
				this.$store.commit('client/setBackPath', '/mall/product/detail?productId=' + this.formData.productId)
				this.$store.commit('client/setLoginRedirect', '/group/build/c?productId=' + this.formData.productId)
			}else{
				this.$router.go(-1);
			}
			this.getConfig( this.formData.productId );
			
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			calcAreaKey() {
				return {
					productId: this.formData.productId,
					sheetQuantities: this.formData.bdQty,
					boardLength: this.formData.length,
					boardWidth: this.formData.width
				}
			}
		},
		watch:{
			calcAreaKey(nVal, oVal) {
				this.beforeCalcAreaCost()
			}
			/*'config.result.show': {
				handler( nVal, oVal ) {
					if( nVal ) {
						window.scrollTo(0,0)
					}
				}
			},*/
		}
	}
</script>
<style>
	.van-submit-bar {
		background-color: #f1f1f1 !important;
	}
</style>