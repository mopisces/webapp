<template>
	<div>
		<van-field 
			v-model="formData.cusOrderId" 
			input-align="center" 
			label="客订单号" 
			placeholder="未填写则系统自动生成"
		/>
		<popup-select 
			:selectValue.sync="formData.materialType" 
			:fieldConfig="config.fieldConfig.material" 
			:radioData="config.radioData.material"
			selectType="material" 
			@valueChange="materialTypeChange"
		>
		</popup-select>
		<div style="width: 100%;height: 1rem;"></div>
		<uni-check-box
			label="箱型"
			:localdata="config.radioData.boxType"
			:radioData.sync="formData.boxType" 
			:map="{text: 'BoxName', value: 'BoxId'}"
			@change="boxTypeChange"
		>
		</uni-check-box>
		<div style="width: 100%;height: 1rem;"></div>
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
				<van-icon name="question-o" @click="clickQuestion(1)"/>
			</div>
		</div>
		<div style="width: 100%;height: 1rem;"></div>
		<uni-check-box
			label="箱舌(T)"
			:localdata="config.radioData.tonLen"
			:radioData.sync="formData.tonLen" 
			:map="{text: 'text', value: 'value'}"
			@change="tonLenChange"
		>
		</uni-check-box>
		<div style="width: 100%;height: 1rem;"></div>
		<uni-check-box
			label="封箱调整(U)"
			:localdata="config.radioData.uLen"
			:radioData.sync="formData.uLen" 
			:map="{text: 'text', value: 'value'}"
			@change="lenChange"
		>
		</uni-check-box>
		<van-field 
			v-if="!boxInfo.isWeb"
			v-model="formData.lengthF" 
			input-align="center" 
			label="横向公式" 
			placeholder="待选择箱型" 
			readonly
			:error-message="boxInfo.lengthFDesc"
			error-message-align="center"
		/>
		<van-field 
			v-if="!boxInfo.isWeb"
			v-model="formData.widthF" 
			input-align="center" 
			label="纵向公式" 
			placeholder="待选择箱型" 
			readonly
			:error-message="boxInfo.widthFDesc"
			error-message-align="center"
		/>
		<div class="van-cell" style="display: flex;align-items: center;">
			<div class="van-cell__title van-field__label">纸板(mm)</div>
			<input 
				type="number" 
				class="karry-input" 
				placeholder="板长" 
				readonly
				v-model="formData.length" 
				:readonly="!boxInfo.isWeb"
				@focus="inputFocus('length')" 
				@blur="inputBlur('length')"
			/>
			<div style="margin-left:0.2rem;margin-right:0.2rem;">x</div>
			<input 
				type="number" 
				class="karry-input" 
				placeholder="板宽" 
				readonly
				v-model="formData.width" 
				:readonly="!boxInfo.isWeb"
				@focus="inputFocus('width')" 
				@blur="inputBlur('width')"
			/>
		</div>
		<div style="width: 100%;height: 1rem;"></div>
		<template v-if="formData.isCalc == 1">
			<uni-check-box
				label="压线压型"
				:localdata="config.radioData.lineInfo"
				:radioData.sync="formData.scoreEdge" 
				:map="{text: 'text', value: 'value'}"
				@change="scoreEdgeChange"
			>
			</uni-check-box>
		</template>
		<template v-else>
			<uni-check-box
				label="压线压型"
				:localdata="config.radioData.lineBall"
				:radioData.sync="formData.lineBallInfo" 
				:map="{text: 'text', value: 'value'}"
				@change="lineBallChange"
			>
			</uni-check-box>
		</template>
		<van-field 
			v-model="formData.lineBallFormula" 
			input-align="center" 
			:label="buildConfig.buildScoreInfoChiText" 
			placeholder="由ERP系统自动计算" 
			:readonly="!boxInfo.isWeb"
			@focus="inputFocus('lineBallFormula')" 
			@blur="inputBlur('lineBallFormula')"
		/>
		<van-field 
			v-model="formData.bdMultiple" 
			input-align="center" 
			label="张数" 
			placeholder="待选择箱型" 
			readonly 
			right-icon="question-o" 
			@click-right-icon="clickQuestion(2)"
		/>
		<div class="van-cell van-field">
			<div class="van-cell__title van-field__label" >
				<span>订单数</span>
			</div>
			<div class="van-cell__value">
				<div class="van-field__body">
					<input 
						id="ordQty" 
						type="text" 
						placeholder="输入订单数" 
						v-model="formData.ordQty" 
						class="van-field__control van-field__control--center karry-input" 
						style="background-color:#f0f0f0;" 
						v-on:focus="inputFocus('ordQty')" 
						v-on:blur="inputBlur('ordQty')"
					/>
				</div>
			</div>
		</div>
		<van-field 
			v-model="formData.bdQty" 
			input-align="center" 
			label="纸板数" 
			placeholder="待计算" 
			readonly 
			:disabled=" true "
		/>
		<van-field 
			v-model="formData.unitArea" 
			input-align="center" 
			label="单片面积(㎡)" 
			placeholder="待计算" 
			readonly 
			:disabled=" true "
		/>
		<van-field 
			v-model="formData.area" 
			input-align="center" 
			label="下单面积(㎡)" 
			placeholder="待计算" 
			readonly 
			:disabled=" true "
			right-icon="question-o"
			@click-right-icon="clickQuestion(3)"
		/>
		<template v-if=" formData.isCalc == 1 ">
			<field-label-variable 
				:value.sync="formData.dOrdPrice" 
				label="计价价格" 
				placeholder="待计算" 
				type="number" 
				readonly="readonly"
			>
			</field-label-variable>
			<field-label-variable 
				:value.sync="formData.dAmt" 
				label="金额" 
				placeholder="待计算" 
				type="number" 
				readonly="readonly"
			>
			</field-label-variable>
		</template>
		<popup-select 
			v-if="buildConfig.showBuildCAddress == 1"
			:selectValue.sync="formData.address" 
			:fieldConfig="config.fieldConfig.address" 
			:radioData="config.radioData.address" 
			selectType="cusInfo" 
			@valueChange="addressChange"
		>
		</popup-select>
		<new-time-picker 
			v-if="config.popup.timeFilter.isFinishLoad"
			:dateTime.sync="formData.date" 
			:minDate="buildConfig.buildMinDate" 
			:maxDate="buildConfig.buildMaxDate" 
			label="交货日期" 
		></new-time-picker>
		<van-field 
			v-if="buildConfig.showDeliveryRemark == 1" 
			v-model="formData.deliveryRemark" 
			autosize 
			label="送货备注" 
			type="textarea"  
			maxlength="50" 
			placeholder="填写送货备注" 
			:rows="1"
		/>
		<van-field 
			v-model="formData.productionRemark" 
			autosize 
			label="生产备注" 
			type="textarea"  
			maxlength="50" 
			placeholder="填写生产备注" 
			:rows="1"
		/>
		<div style="width:100%;height:50px;"></div>
		<template v-if="formData.isCalc == 1 ">
			<van-button  
				:disabled=" config.button.calcBtnDis "
				type="warning" 
				size="normal" 
				style="width:50%;position:fixed;bottom:3.125rem;" 
				@click="calcPriceInfo()"
			>
				试算
			</van-button>
			<van-button  
				:disabled=" config.button.disabled "
				type="primary" 
				size="normal" 
				style="width:50%;position:fixed;bottom:3.125rem;left:50%;"
				@click="buildOrder()"
			>
				下单
			</van-button>
		</template>
		<template v-else>
			<van-button  
				:disabled=" config.button.disabled "
				type="primary" 
				size="normal" 
				style="width:100%;position:fixed;bottom:3.125rem;" 
				@click="buildOrder()"
			>
				下单
			</van-button>
		</template>
		<build-sku 
			:skuShow.sync="config.popup.sku.show" 
			:orderInfo="formData" 
			orderType="c" 
			:isGroup="false" 
			:showULen="config.showULen" 
			:showTonLen="config.showTonLen"
			@saveOrder="saveOrder" 
		></build-sku>
		<build-result 
			v-if="config.result.show" 
			:cusOrderId="config.result.cusOrderId" 
			:failMsg="config.result.failMsg"
			:resultShow.sync="config.result.show" 
			:isGroup="false" 
			:isSuccess="config.result.isSuccess" 
			@clearFormData="clearFormData()" 
		>
		</build-result>
	</div>
</template>
<script>
	import { Button, Icon, Field, Dialog, Toast } from 'vant';
	import PopupSelect from '@/components/subject/build/PopupSelect.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import BuildSku from '@/components/subject/build/BuildSku.vue';
	import BuildResult from '@/components/subject/build/BuildResult.vue';
	import schema from 'async-validator';
	//import BuildCalc from '@/components/subject/client/BuildCalc.vue';
	import FieldLabelVariable from '@/components/subject/staff/FieldLabelVariable.vue';
	import { checkBuildTime } from '@/util';

	import UniCheckBox from '@/components/subject/checkbox/UniCheckBox.vue'
	/*api接口*/
	import { getBuildOrdConfig } from "@/api/common/webConfig"

	export default {
		components:{
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Field.name]: Field,
			[Toast.name]: Toast,

			PopupSelect,
			NewTimePicker,
			BuildSku,
			BuildResult,
			//BuildCalc,
			FieldLabelVariable,
			UniCheckBox
		},
		data(){
			return {
				config : {
					fieldConfig : {
						material : {
							label       : '材质',
							placeholder : '选择材质'
						},
						boxType : {
							label       : '箱型',
							placeholder : '选择箱型'
						},
						tonLen : {
							label       : '箱舌(T)',
							placeholder : '选择箱舌'
						},
						uLen : {
							label       : '封箱调整(U)',
							placeholder : '选择封箱调整'
						},
						lineBall:{
							label       : '压型名称',    //压线名称
							placeholder : '选择压型名称'  //选择压线名称
						},
						address : {
							label       : '送货公司',
							placeholder : '选择送货公司'
						}
					},
					radioData : {
						material: [],
						boxType: [],
						tonLen: [],
						uLen: [],
						lineBall: [],
						address: [],
						lineInfo: [
							{
								text: '净片-无压线',
								value: '00'
							},
							{
								text: '净片-普通压线',
								value: '01'
							},
							{
								text: '净片-平压线',
								value: '02'
							},
							{
								text: '毛片-无压线',
								value: '10'
							}
						]
					},
					popup : {
						timeFilter : {
							isFinishLoad : false
						},
						sku : {
							show : false
						}
					},
					result : {
						show       : false,
						isSuccess  : false,
						cusOrderId : '',
						failMsg    : '下单失败'
					},
					isFastBuild: false,
					button:{
						disabled: true,
						calcBtnDis: true
					},
					showTonLen:true,
					showULen:true,
					lineInfo:[],
					calcDefault:{
						index:null,
						name :null,
						edgeType:'净片'
					},
					showDeliveryRemark:0,
					lastToLen: null,
					lastULen:null,
					build:{
						lenNeedToast:false,
						widthNeedToast:false,
						heightNeedToast:false,
						lenToastDefault:null,
						widthToastDefault:null,
						heightToastDefault:null,
					},
					initClientHeight: document.documentElement.clientHeight,
					buildTime:{
						NeedSetBuildTime: false,
						BuildInTime1:[],
						BuildInTime2:[]
					}
				},
				formData:{
					cusOrderId: '',   //客订单号
					materialType: '',	 //材质
					boxType: '',	 //箱型
					boxLength: '',	 //箱长
					boxWidth: '',	 //箱宽
					boxHeight: '',   //箱高
					tonLen: '',   //箱舌
					uLen: '',   //封箱调整
					length: '',   //板长
					width: '',   //板宽
					bdMultiple: '',   //张数
					ordQty: null,    //订单数
					bdQty: '',   //纸板数
					lineBallInfo: '',   //压型名称
					lineBallFormula: null, //压线信息
					area: '',   //下单面积
					unitArea: null, //单片面积
					address: '',   //送货地址
					date: '',   //交货日期
					deliveryRemark: '',   //送货备注
					productionRemark: '',   //生产备注
					lengthF: '',   //横向公式
					widthF: '',   //纵向公式
					isEdge: '净片', //是否毛片 
					isCalc: 0,      //是否开启始算参数
					factoryId: null,   
					subFacId: null,
					erpId: null,
					saAreaAddArea: null,
					saAreaAddTrim: null,
					dOrdPrice: null,   //计价价格 
					dAmt: null,   //金额
					buildType: 0,      //0新增 1修改 2快速下单
					scoreEdge: null,
					//上次下单箱舌
					lastToLen: null,
					//上次下单封箱调整
					lastULen: null,
					//上次下单材质
					lastBoardId: null
				},
				buildConfig: {
					buildTonLen: null,
					buildULen: null,
					buildMinBoxL: null,
					buildMaxBoxL: null,
					buildMinBoxW: null,
					buildMaxBoxW: null,
					buildMinBoxH: null,
					buildMaxBoxH: null,
					buildAutoGetTonLenAndULen: null,
					buildLenNeedToast: null,
					buildLenToastDefault: null,
					buildWidthNeedToast: null,
					buildWidthToastDefault: null,
					buildHeightNeedToast: null,
					buildHeightToastDefault: null,
					buildDeliveryDate: null,
					buildMinDate: null,
					buildMaxDate: null,
					buildMinLength: null,
					buildMaxLength: null,
					buildMinWidth: null,
					buildMaxWidth: null,
					buildMinArea: null,
					buildMaxArea: null,
					defaultScoreName: null,
					buildAddCalc: null,
					isAddTrimArea: null,
					showDeliveryRemark: null,
					buildInTime1: [],
					buildInTime2: [],
					needSetBuildTime: 0,
					buildScoreInfoChiText: null,
					showBuildCAddress: 0,
					/*erp计算压线是否成功*/
					erpCalcScoreInfoSuccess: true,
					/*erp计算的压线*/
					erpCalcScoreInfo: null,
					/*请求压线是否可用*/
					inProgress: false
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
					//备注
					remark: null,
					/*自由输入板长板宽压线*/
					isWeb: false,
				},
				rules:{
					calcBdLW : {
						boxLength : [
							{ validator: (rule, value, callback, source, options)=>{
									let errors
									if( value && ( Number(value) > this.buildConfig.buildMaxBoxL || Number(value) < this.buildConfig.buildMinBoxL ) ){
										errors = '板宽范围:\n' + this.buildConfig.buildMinBoxL + 'mm~' + this.buildConfig.buildMaxBoxL + 'mm'
										this.formData.boxLength = null
									}
									callback(errors)
								}
							}
						],
						boxWidth : [
							{ validator: (rule, value, callback, source, options)=>{
									let errors
									if( value && ( Number(value) > this.buildConfig.buildMaxBoxW || Number(value) < this.buildConfig.buildMinBoxW ) ){
										errors = '板宽范围:\n' + this.buildConfig.buildMinBoxW + 'mm~' + this.buildConfig.buildMaxBoxW + 'mm'
										this.formData.boxWidth = null
									}
									callback(errors)
								}
							}
						],
						boxHeight : [
							{ validator: (rule, value, callback, source, options)=>{
									let errors;
									if(  value && ( Number(value) > this.buildConfig.buildMaxBoxH || Number(value) < this.buildConfig.buildMinBoxH ) ){
										errors = '板宽范围:\n' + this.buildConfig.buildMinBoxH + 'mm~' + this.buildConfig.buildMaxBoxH + 'mm'
										this.formData.boxHeight = null
									}
									callback(errors)
								}
							}
						]
					},
					buildOrder:{
						cusOrderId : [
							{ validator: (rule, value, callback, source, options)=>{
									let errors
									if( value && (value.length > 56 || value.length <= 0) ){
										errors = '客订单号长度超过长度'
									}
									callback(errors)
								} 
							}
						],
						materialType : [
							{ required : true , message:'请选择材质' }
						],
						length : [
							{ required : true , message:'请填写相关信息获取板长' }
						],
						width  : [
							{ required : true , message:'请填写相关信息获取板宽' }
						],
						ordQty : [
							{ required : true , message:'请填写订单数' },
							{ validator: (rule, value, callback, source, options)=>{
									let errors
									if( !/^[1-9]\d*$/.test(value) ){
										errors = '请填写正确的订单数'
									}
									callback(errors)
								}
							}
						],
						bdQty  : [
							{ required : true , message:'请填写相关信息获取纸板数' },
							{
								validator: ( rule, value, callback, source, options )=> {
									let errors
									if( !/^[1-9]\d*$/.test(value) ) {
										errors = '请获取纸板数'
									}
									callback(errors)
								}
							}
						],
						lineBallInfo:[
							{ required : true , message:'请选择压型' },
							{
								validator: (rule, value, callback, source, options)=> {
									let errors
									if( value == "无压线" && this.formData.lineBallFormula ) {
										errors = "无法选择无压线"
									}
									if( value != "无压线" && !this.formData.lineBallFormula ) {
										errors = "无法选择当前压型"
									}
									callback(errors)
								}
							}
						],
						lineBallFormula: [
							{ 
								validator: (rule, value, callback, source, options)=>{
									let errors
									try {
										if( this.formData.lineBallInfo != "无压线" && Math.round(eval(value)) != this.formData.width ) {
											errors = "当前压型与压线不匹配1"
										}
									} catch( err ) {
										errors = "当前压型与压线不匹配2"
									}
									callback(errors)
								}
							}
						],
						area : [
							{ validator: (rule, value, callback, source, options)=>{
									let errors
									if( Number(value) > this.buildConfig.buildMaxArea || Number(value) < this.buildConfig.buildMinArea){
										errors = '下单面积范围:' + this.buildConfig.buildMinArea + '㎡~' + this.buildConfig.buildMaxArea + '㎡'
									}
									callback(errors)
								} 
							}
						],
						address : [
							{ required : true , message:'请选择送货公司' }
						],
						date : [
							{ required : true , message:'请填写交货日期' }
						],
						tonLen : [
							{ required : true , message:'请选择箱舌' },
							{ validator: (rule, value, callback, source, options)=>{
									let errors
									if( !this.inArray( 'tonLen', value ) ){
										errors = '非法箱舌'
									}
									callback(errors)
								}
							}
						],
						uLen :  [
							{ required : true , message:'请选择封箱调整' },
							{ validator: (rule, value, callback, source, options)=>{
								let errors
								if( !this.inArray( 'uLen', value ) ){
									errors = '非法封箱调整'
								}
								callback(errors)
							}}
						],
						dOrdPrice:[
							{ validator:(rule, value, callback, source, options)=>{
									let errors
									if( this.formData.isCalc == 1 && Number(value) <= 0 ){
										errors = '请先试算获取计价价格'
									}
									callback(errors)
								}
							}
						],
						dAmt:[
							{ validator:(rule, value, callback, source, options)=>{
									let errors
									if( this.formData.isCalc == 1 && Number(value) <= 0 ){
										errors = '请先试算获取金额'
									}
									callback(errors)
								}
							}
						]
					}
				},
				validator:{
					calcBdLW: {},
					buildOrder: {}
				}
			}
		},
		methods:{
			clickQuestion( type ){
				let info = ''
				if( type == 1 ){
					info = '箱长范围:' + this.buildConfig.buildMinBoxL + '~' + this.buildConfig.buildMaxBoxL + '\n'
					info += '箱宽范围:' + this.buildConfig.buildMinBoxW + '~' + this.buildConfig.buildMaxBoxW + '\n'
					info += '箱高范围:' + this.buildConfig.buildMinBoxH + '~' + this.buildConfig.buildMaxBoxH
				}
				if( type == 2 ){
					info = '正数:几个纸板=>1个纸箱\n负数:1个纸板=>几个纸箱'
				}
				if( type == 3 ){
					info = '下单面积:\n' + this.buildConfig.buildMinArea + '㎡~' + this.buildConfig.buildMaxArea + '㎡';
				}
				Dialog.alert({
					message: info
				}).then(()=>{
					Dialog.close()
				})
			},
			buildOrder(){
				this.validator.buildOrder.validate(this.formData).then(()=>{
					if( this.formData.isCalc == 1 ){
						this.calcPriceInfo(false, true)
					}
				}).then(()=>{
					if( this.formData.isCalc == 0 ){
						this.checkData()
					}
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message)
				});
			},
			checkData(){
				let self = this;
				this.$request.client.orderBooking.cBuildCheck(this.formData).then(res=>{
					if( res.errorCode == '00000' ){
						self.config.popup.sku.show = true;
					}
				});
			},
			async getConfig( fastOrdId, isRebuild = false ){
				this.config.radioData = this.$options.data().config.radioData
				this.config.button = this.$options.data().config.button

				const  { result } = await getBuildOrdConfig({fastOrdId: fastOrdId})
				//设置页面参数
				this.buildConfig = result.buildConfig
				//设置提交表格必要参数
				this.formData.date = result.buildConfig.buildDeliveryDate
				this.formData.isCalc = result.buildConfig.buildAddCalc
				this.formData.factoryId = result.buildConfig.factoryId
				this.formData.cusId = result.buildConfig.cusId
				this.formData.subFacId = result.buildConfig.subFacId
				this.formData.saAreaAddArea = result.buildConfig.saAreaAddArea == 1 ? true : false
				this.formData.saAreaAddTrim = result.buildConfig.saAreaAddTrim == 1 ? true : false
				this.formData.lastToLen = result.userBuild.lastTonLen
				this.formData.lastULen = result.userBuild.lastULen
				this.formData.materialType = result.userBuild.lastBoardId || ''

				//检查是否在下单时间内
				if( !this.checkTime() ) return 

				//设置材质选择组件
				if( result.bdList.length == 0 ) {
					Dialog.alert({
						title: '没有可选择的材质',
						message: '请先选择常用材质'
					}).then(()=>{
						this.$router.push('/client/usedboard/lists')
					})
				} else {
					result.bdList.forEach((row, idx)=> {
						if( row.BoardName ) {
							this.config.radioData.material.push({ 
								value: row.BoardId, 
								text: row.BoardName, 
								tag: row.IsUsedBoard 
							})
						} else {
							this.config.radioData.material.push({ 
								value: row.BoardId, 
								text: row.BoardName, 
								tag: row.IsUsedBoard 
							})
						}
					})
				}

				//设置箱型组件
				this.config.radioData.boxType = JSON.parse(JSON.stringify(result.boxList))

				//设置箱舌
				result.buildConfig.buildTonLen.forEach((item,index)=>{
					this.config.radioData.tonLen.push({ value: item, text: item })
				});
				
				//设置封箱调整
				result.buildConfig.buildULen.forEach((item,index)=>{
					this.config.radioData.uLen.push({ value: item, text: item })
				});

				//设置送货地址组件
				let defaultAddr = result.custDN.find((row)=>row.DefAddress==1)
				this.formData.address = defaultAddr.value
				this.config.radioData.cusInfo = result.custDN

				//设置压线压型组件
				if( this.formData.isCalc == 1 ) {
					this.formData.scoreEdge = result.userBuild.edgeType + result.userBuild.scoreType
					
					

				} else {
					result.buildConfig.buildScoreName.forEach((row,index)=>{
						this.config.radioData.lineBall.push( { value: row, text: row } )
					})
					this.formData.lineBallInfo = result.buildConfig.defaultScoreName
				}

				//新增或者修改
				if( this.formData.buildType == 1 || this.formData.buildType == 2 ) {
					this.formData.materialType = result.fastOrdInfo.BoardId
					this.formData.boxType = result.fastOrdInfo.BoxId
					this.formData.boxLength = result.fastOrdInfo.BoxL
					this.formData.boxWidth = result.fastOrdInfo.BoxW
					this.formData.boxHeight = result.fastOrdInfo.BoxH
						
					this.formData.lastToLen = result.fastOrdInfo.TonLen
					this.formData.lastULen = result.fastOrdInfo.ULen

					this.formData.ordQty = result.fastOrdInfo.OrdQty
					this.formData.bdQty = result.fastOrdInfo.BdQty

					this.formData.bdMultiple = Number(res.fastOrdInfo.BdMultiple) ? Number(result.fastOrdInfo.BdMultiple) : 0
					this.formData.address = result.fastOrdInfo.CusSubNo
					this.formData.productionRemark = result.fastOrdInfo.ProRemark
					this.formData.cusOrderId = this.formData.buildType == 1 ? result.fastOrdInfo.CusPoNo : ''
					this.formData.deliveryRemark =  this.buildConfig.showDeliveryRemark == 1 ? result.fastOrdInfo.DNRemark : ''
					this.formData.scoreEdge = result.fastOrdInfo.WebEdgeType + result.fastOrdInfo.ScoreType
				}

				if( this.formData.isCalc == 1 || this.formData.buildType == 1 || this.formData.buildType == 2 ) {
					let scoreItem = this.config.radioData.lineInfo.find(item=> item.value == this.formData.scoreEdge)
					this.formData.isEdge = scoreItem.text.slice(0, 2) 
					this.formData.lineBallInfo = scoreItem.text.slice(3)
				}

				this.formData.tonLen = this.inArray('tonLen', this.formData.lastToLen ) ? this.formData.lastToLen : this.config.radioData.tonLen[0].value
				this.formData.uLen = this.inArray('uLen', this.formData.lastULen ) ? this.formData.lastULen : this.config.radioData.uLen[0].value

				if( this.formData.isCalc == 0 ) {
					delete this.rules.buildOrder.dOrdPrice
					delete this.rules.buildOrder.dAmt
					this.validator.buildOrder = new schema(this.rules.buildOrder)
				}

				this.config.popup.timeFilter.isFinishLoad = true

				if( this.formData.buildType == 1 || this.formData.buildType == 2 ){
					await this.getBoxFormula( this.formData.boxType )
				}

				if( isRebuild ) {
					await this.getClackAdjust(this.formData.materialType)
				}
			},
			saveOrder( data ){
				if( !this.checkTime() ) return 
				this.$request.client.orderBooking.cBuildSave( data ).then(res=>{
					if( res.errorCode == '00000' ){
						this.config.result.isSuccess  = true
						this.config.result.cusOrderId = res.result.order_id
					}else{
						this.config.result.failMsg = res.msg
						this.config.result.isSuccess = false
					}
					this.config.result.show = true
				});
			},
			calcBdLW(){
				if( this.boxInfo.isWeb ) return false
				if( !this.boxInfo.lengthFCalc || !this.boxInfo.lengthFCalc ) return false
				this.validator.calcBdLW.validate(this.formData).then(()=>{
					let lengthExp = this.boxInfo.lengthFCalc
					let widthExp = this.boxInfo.widthFCalc
					if( this.formData.boxLength ){
						lengthExp = lengthExp.replace(/L/g,this.formData.boxLength)
						widthExp = widthExp.replace(/L/g,this.formData.boxLength)
					}
					if( this.formData.boxWidth ){
						lengthExp = lengthExp.replace(/W/g,this.formData.boxWidth)
						widthExp = widthExp.replace(/W/g,this.formData.boxWidth)
					}
					if( this.formData.boxHeight ){
						lengthExp = lengthExp.replace(/H/g,this.formData.boxHeight)
						widthExp = widthExp.replace(/H/g,this.formData.boxHeight)
					}
					if( this.formData.tonLen ){
						lengthExp = lengthExp.replace(/T/g, this.formData.tonLen )
						widthExp = widthExp.replace(/T/g,  this.formData.tonLen )
					}
					if( this.formData.uLen ){
						lengthExp = lengthExp.replace(/U/g,this.formData.uLen)
						widthExp = widthExp.replace(/U/g,this.formData.uLen)
					}
					this.formData.lengthF = lengthExp
					this.formData.widthF = widthExp
					if( lengthExp && lengthExp.indexOf('L') === -1 && lengthExp.indexOf('W') === -1 && lengthExp.indexOf('H') === -1 && lengthExp.indexOf('T') === -1 && lengthExp.indexOf('U') === -1 ){
						this.formData.length = Math.round(eval(lengthExp.replace(/<\/?.+?>/g,'')))
					}else{
						this.formData.length = ''
					}
					if( widthExp && widthExp.indexOf('L') === -1 && widthExp.indexOf('W') === -1 && widthExp.indexOf('H') === -1 && widthExp.indexOf('T') === -1 && widthExp.indexOf('U') === -1 ){
						this.formData.width = Math.round(eval(widthExp.replace(/<\/?.+?>/g,'')))
					}else{
						this.formData.width = ''
					}
					/*计算压线*/
	                if( this.formData.length && this.formData.width && !this.boxInfo.isWeb && !this.formData.isCalc ) {
	                	this.fetchScoreInfo()
	                }
					this.calcArea()
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message)
				});
			},
			async calcBdQty( needCalcArea = true ){
				if( typeof( this.formData.bdMultiple ) === 'number' && this.formData.ordQty ){
					if( this.formData.bdMultiple > 0 ){
						this.formData.bdQty = this.formData.ordQty * this.formData.bdMultiple;
					}else if( this.formData.bdMultiple < 0 ){
						this.formData.bdQty = this.formData.ordQty / this.formData.bdMultiple * -1;
					}else{
						this.formData.bdQty = null
					}
				}else{
					this.formData.bdQty = null
				}
				if( needCalcArea ){
					await this.calcArea()
				}
			},
			calcArea(){
				if( !this.formData.ordQty || !this.formData.bdQty || !this.formData.length || !this.formData.width ) return
				const calcArea = new schema({
					ordQty: this.rules.buildOrder.ordQty,
					bdQty: this.rules.buildOrder.bdQty,
					length: this.rules.buildOrder.length,
					width: this.rules.buildOrder.width
				})
				calcArea.validate( this.formData ).then(()=> {
					this.formData.area = Math.round( this.formData.length *  this.formData.width * this.formData.bdQty / 1000000 * 100) /100
					this.formData.unitArea = parseFloat( (this.formData.area / this.formData.bdQty).toFixed(3) )
					if( this.formData.area>this.buildConfig.buildMaxArea||this.formData.area<this.buildConfig.buildMinArea ) {
						Toast.fail({
							message: '下单面积范围:'+this.buildConfig.mibuildMinAreanArea+'㎡\n'+this.buildConfig.buildMaxArea + '㎡',
							onClose:()=>{
								this.formData.ordQty = ''
								this.formData.area = ''
								this.config.button.calcBtnDis = true
								this.checkFormula()
							}
						})
					} else {
						this.config.button.calcBtnDis = false
						this.checkFormula()
					}
				}).catch(({ errors, fields })=> {
					Toast.fail(errors[0].message)
				})
			},
			async getBoxFormula( boxType ){
				this.boxInfo = this.$options.data().boxInfo
				let arr = this.config.radioData.boxType.find(item => item.BoxId === boxType)
				this.formData.bdMultiple = 0
				if( arr ) {
					this.boxInfo.remark = arr.Remark
					this.boxInfo.isWeb = arr.Remark.includes('WEB') ? true : false
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
					await this.calcBdQty(false)
					await this.calcBdLW()
					
				}
			},
			getClackAdjust( materialType ){
				if( this.buildConfig.buildAutoGetTonLenAndULen == 0 ){
					this.formData.tonLen = this.inArray('tonLen', this.formData.lastToLen ) ? this.formData.lastToLen : this.config.radioData.tonLen[0].value
					this.formData.uLen = this.inArray('uLen', this.formData.lastULen ) ? this.formData.lastULen : this.formData.radioData.uLen[0].value
					this.calcBdLW()
					return true
				}
				this.$request.client.orderBooking.getClackAdjust( materialType ).then(res=>{
					let string = '';
					if( res.result.TonLen === null ){
						if( this.formData.tonLen !== '' ){
							string += '箱舌(T) => 不选择'
						}
						this.formData.tonLen = ''
					}else{
						if( this.formData.tonLen !== res.result.TonLen ){
							string += '箱舌(T) => ' + res.result.TonLen
						}
						this.formData.tonLen = res.result.TonLen
					}
					if( res.result.ULen === null  ){
						if( this.formData.uLen !== '' ){
							if( string !== '' ){
								string += '\n'
							}
							string += '封箱调整(U) => 不选择'
						}
						this.formData.uLen = '';
					}else{
						if( this.formData.uLen !== res.result.ULen ){
							if( string !== '' ){
								string += '\n';
							}
							string += '封箱调整(U) => ' + res.result.ULen
						}
						this.formData.uLen = res.result.ULen
					}
					if( string != '' ){
						Toast.fail(string)
					}
					this.calcBdLW()
				});
			},
			async clearFormData(){
				if( this.config.result.isSuccess ){
					let material = Object.assign({},{ materialType: this.formData.materialType })
					this.formData =  this.$options.data().formData
					this.buildConfig = this.$options.data().buildConfig
					this.formData.materialType = material.materialType
					await this.getConfig( '', true )
				}
				
			},
			fastBuild( orderId ){
				this.getConfig( orderId )
			},
			inArray( type, neddle ){
				let list = type == 'tonLen'?this.config.radioData.tonLen:this.config.radioData.uLen
				let res = list.find(item=> item.value == neddle)
				if(!res) return false 
				this.formData[type] = res.value
				return true
			},
			buildCalc( data ){
				this.formData.isEdge = data[0];
				this.formData.lineBallInfo = data[1];
			},
			calcPriceInfo( showToast = true, isCheck = false ){
				if( this.formData.isCalc == 0 ) return true
				delete this.rules.buildOrder.lineBallInfo
				delete this.rules.buildOrder.dOrdPrice
				delete this.rules.buildOrder.dAmt
				let calc = new schema(this.rules.buildOrder)
				new schema(this.rules.buildOrder).validate(this.formData).then(()=>{
					let data = {
						strFactoryId : this.formData.factoryId,
	                    strCusId     : this.formData.cusId,
	                    strBoardId   : this.formData.materialType,
	                    bAddTrim     : this.formData.saAreaAddTrim,
	                    bAddArea     : this.formData.saAreaAddArea,
	                    bEdge        : this.formData.isEdge == '毛片' ? 1 : 0,
	                    iLength      : null,
	                    iWidth       : null,
	                    strScoreInfo : null,
	                    iQty         : this.formData.bdQty,//this.formData.ordQty,
	                    strBoxId     : this.formData.boxType,
	                    iBoxL        : this.formData.boxLength,
	                    iBoxW        : this.formData.boxWidth,
	                    iBoxH        : this.formData.boxHeight,
	                    iTonLen      : this.formData.tonLen,
	                    iULen        : this.formData.uLen,
					}
					if( this.formData.isEdge == '毛片' && this.buildConfig.IsAddTrimArea == 1 ){
						data.bAddTrim = false
						data.bAddArea = false
					}
					let self = this;
					this.$request.staff.connecterp.calBdPriceInfo( data, 1 ).then((res)=>{
						if( res.data.result[2] === false ){
							Dialog.alert({
								title: '计算失败',
								message: res.data.result[1]
							}).then(()=>{
								Dialog.close()
							});
							this.config.button.disabled = true
						}else{
							let erpResult = JSON.parse( res.data.result[0] )[0]
							self.buildConfig.erpCalcScoreInfoSuccess = true
							self.buildConfig.erpCalcScoreInfo = erpResult.strScoreInfo
							if( !isCheck ){
								self.formData.dOrdPrice = erpResult.dOrdPrice
								self.formData.dAmt = erpResult.dAmt
								if( !self.boxInfo.isWeb ) {
									self.formData.lineBallFormula = erpResult.strScoreInfo
								}
								self.config.button.disabled = false
							}else{
								if( self.formData.dOrdPrice != erpResult.dOrdPrice || self.formData.dAmt != erpResult.dAmt || self.formData.lineBallFormula != erpResult.strScoreInfo ){
									let message = '计价价格：' + self.formData.dOrdPrice + '=>' + erpResult.dOrdPrice + '\n' + '金额：' + self.formData.dAmt + '=>' + erpResult.dAmt  + '\n'
									if( !self.boxInfo.isWeb ) {
										message += '压线：' + self.formData.lineBallFormula + '=>' + erpResult.strScoreInfo
									}
									Dialog.alert({
										title: '订单变化是否继续下单',
										message: message 
									}).then(()=>{
										self.formData.dOrdPrice = erpResult.dOrdPrice
										self.formData.dAmt = erpResult.dAmt
										if( !self.boxInfo.isWeb ) {
											self.formData.lineBallFormula = erpResult.strScoreInfo
										}
										self.checkData()
									});
								}else{
									self.checkData()
								}
							}
							
						}
					});
				}).catch(({ errors, fields })=>{
					this.config.button.disabled = true;
					if( showToast ) Toast.fail(errors[0].message);
				});
			},
			checkFormula(){
				delete this.rules.buildOrder.lineBallInfo
				delete this.rules.buildOrder.lineBallFormula
				let formula = new schema(this.rules.buildOrder)
				formula.validate(this.formData).then(()=>{
					this.config.button.disabled = false
				}).catch(({ errors, fields })=>{
					this.config.button.disabled = true
					Toast.fail(errors[0].message)
				});
			},
			materialTypeChange( newValue ){
				this.formData.materialType = newValue
				this.getClackAdjust( this.formData.materialType )
			},
			boxTypeChange(e) {
				this.boxInfo.isWeb = this.$options.data().boxInfo.isWeb
				this.buildConfig.erpCalcScoreInfoSuccess = this.$options.data().buildConfig.erpCalcScoreInfoSuccess 
				this.buildConfig.erpCalcScoreInfo = this.$options.data().buildConfig.erpCalcScoreInfo
				
				this.formData.length = this.$options.data().formData.length
				this.formData.width = this.$options.data().formData.width

				this.formData.lineBallFormula = this.$options.data().formData.lineBallFormula
				this.formData.dOrdPrice = null
				this.formData.dAmt = null
				this.formData.lineBallFormula = null

				this.config.button.calcBtnDis = true
				this.config.button.disabled = true
				this.getBoxFormula(e.detail.value)
			},
			/*箱舌*/
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
			scoreEdgeChange(e) {
				this.formData.lineBallInfo = ['无压线', '普通压线', '平压线'][e.detail.value[1]]
				this.formData.edgeType = e.detail.value[0]
				this.formData.isEdge = ['净片', '毛片'][e.detail.value[0]]
			},
			addressChange( newValue ){
				this.formData.address = newValue;
			},
			lineBallChange( e ){
				this.formData.lineBallInfo = e.detail.value
			},
			sizeBlur( id ){
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
					Toast({
						message: tips,
						icon:'warning-o',
					})
				}
				this.calcBdLW()
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
							if( (id == 'lineBallFormula' || id == 'width')  && that.boxInfo.isWeb && that.formData.lineBallInfo != "无压线" && that.formData.width ) {
								try {
									if (that.formData.width != Math.round(eval(that.formData.lineBallFormula))) {
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
					this.calcBdQty()
				}
				if( id == 'boxLength' || id == 'boxWidth' || id == 'boxHeight'){
					this.sizeBlur(id)
				}
				if( (id == 'lineBallFormula' || id == 'width') && this.boxInfo.isWeb && this.formData.lineBallInfo != "无压线" && this.formData.width ) {
					try {
						if ( this.formData.width != Math.round(eval(this.formData.lineBallFormula))) {
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
			checkTime(){
				if( this.buildConfig.needSetBuildTime == 0 ) return true
				let timeRes1 = checkBuildTime(this.buildConfig.buildInTime1[0], this.buildConfig.buildInTime1[1])
				let timeRes2 = checkBuildTime(this.buildConfig.buildInTime2[0], this.buildConfig.buildInTime2[1])
				if( !timeRes1 && !timeRes2 ){
					let that = this;
					Dialog.alert({
						title: '目前不在下单时间',
						message:'下单时间段为:' + that.buildConfig.buildInTime1[0] + '~' + that.buildConfig.buildInTime1[1] + '\n' + that.buildConfig.buildInTime2[0] + '~' + that.buildConfig.buildInTime2[1]
					}).then(()=>{
						Dialog.close()
						that.$router.push('/client/index/menu')
					})
				} else {
					return true
				}
			
			},
			fetchBuildType( params ){
				let orderId = '';
				if( typeof( params.orderId ) != 'undefined' && params.orderId != null ){
					orderId = params.orderId;
					if( typeof( params.buildType ) != 'undefined' && params.buildType != null ){
						this.formData.buildType = params.buildType == 1 ? 1 : 2;
					}else{
						this.formData.buildType = 2;
					}
				}else{
					this.formData.buildType = 0;
				}
				this.getConfig( orderId )
			},
			fetchScoreInfo() {
				if( !this.buildConfig.inProgress ) {
					this.buildConfig.inProgress = true
					this.$request.staff.connecterp.formulaCalcScore({
						strFactoryId: this.formData.factoryId,
						strSubFacId: this.formData.subFacId,
						strCusId: this.formData.cusId || '',
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
								this.formData.lineBallFormula = dataRow.data.ScoreInfo.includes('noscoreinfo') ? this.$options.data().formData.lineBallFormula : dataRow.data.ScoreInfo
								this.buildConfig.erpCalcScoreInfo = dataRow.data.ScoreInfo
								this.buildConfig.erpCalcScoreInfoSuccess = true
							}else {
								this.buildConfig.erpCalcScoreInfoSuccess = false
								Toast({
									type: "fail",
									message: "ERP压线计算失败",
									duration: 2000
								})
							}
						} else {
							this.buildConfig.erpCalcScoreInfoSuccess = false
							Toast({
								type: "fail",
								message: "ERP压线计算失败",
								duration: 2000
							})
						}
					}).catch((err)=> {
						this.buildConfig.erpCalcScoreInfoSuccess = false
						Toast.fail('ERP压线计算失败')
					}).finally(()=>{
						this.buildConfig.inProgress = false 
					})
				}
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','纸箱纸板下单')
		},
		mounted(){
			this.fetchBuildType( this.$route.params )
			this.validator.calcBdLW = new schema(this.rules.calcBdLW)
			this.validator.buildOrder = new schema(this.rules.buildOrder)

		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			
		},
		watch:{
			'config.result.show': {
				handler( nVal, oVal ) {
					if( nVal ) {
						window.scrollTo(0,0)
					}
				}
			},
		}
	}
</script>