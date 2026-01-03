<template>
	<div>
		<van-field 
			v-model="formData.cusOrderId" 
			:disabled="config.custIDField.disabled" 
			input-align="center" 
			label="客订单号" 
			placeholder="未填写则系统自动生成"
		/>
		<popup-select 
			:selectValue.sync="formData.materialType" 
			:fieldConfig="config.fieldConfig.material" 
			:radioData="config.radioData.material" 
			selectType="material" 
			@valueChange="materialTypeChange">
		</popup-select>
		</van-field>
		<div class="van-cell" style="display: flex;align-items: center;">
			<div class="van-cell__title van-field__label">纸板(mm)</div>
			<input 
				id="boardLength" 
				type="number" 
				class="karry-input" 
				placeholder="长" 
				v-model="formData.boardLength" 
				@focus="inputFocus('boardLength')" 
				@blur=" inputBlur('boardLength') "
			/>
			<div style="margin-left:0.2rem;margin-right:0.2rem;">x</div>
			<input 
				id="boardWidth" 
				type="number" 
				class="karry-input" 
				placeholder="宽" 
				v-model="formData.boardWidth" 
				@focus="inputFocus('boardWidth')" 
				@blur=" inputBlur('boardWidth') "
			/>
			<div class="van-field__right-icon">
				<van-icon 
					name="question-o" 
					@click="$toast('板长范围:' + buildConfig.buildMinLength + 'mm~' + buildConfig.buildMaxLength + 'mm\n板宽范围:' + buildConfig.buildMinWidth +'mm~' + buildConfig.buildMaxWidth + 'mm' )"
				/>
			</div>
		</div>
		<div style="width: 100%;height: 1rem;"></div>
		<template v-if="formData.isCalc == 1 ">
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
		<div style="width: 100%;height: 1rem;"></div>
		<van-field 
			id="lineBallFormula" 
			v-model="formData.lineBallFormula" 
			input-align="center" 
			label="压线信息" 
			placeholder="压线和=板宽(格式:x+x+x)" 
			@focus="inputFocus('lineBallFormula')" 
			@blur=" inputBlur('lineBallFormula') "
		/>
		<div class="van-cell van-field">
			<div class="van-cell__title van-field__label" >
				<span>订单数</span>
			</div>
			<div class="van-cell__value">
				<div class="van-field__body">
					<input id="orderQuantities" type="text" placeholder="输入订单数" v-model="formData.orderQuantities" class="van-field__control van-field__control--center karry-input" style="background-color:#f0f0f0;" v-on:focus="inputFocus('orderQuantities')" v-on:blur="inputBlur('orderQuantities')"/>
				</div>
			</div>
		</div>
		<van-field 
			v-model="formData.area" 
			clearable 
			readonly 
			input-align="center" 
			label="下单面积(㎡)" 
			placeholder="待计算" 
			right-icon="question-o" 
			@click-right-icon="$toast('下单面积范围:' + buildConfig.buildMinArea + '㎡~' + buildConfig.buildMaxArea+ '㎡' ) "
		></van-field>
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
			:selectValue.sync="formData.address" 
			:fieldConfig="config.fieldConfig.cusInfo" 
			:radioData="config.radioData.cusInfo" 
			selectType="cusInfo" 
			@valueChange="addressChange"
		>
		</popup-select>
		<new-time-picker 
			:dateTime.sync="formData.date" 
			:minDate="buildConfig.buildMinDate" 
			:maxDate="buildConfig.buildMaxDate" 
			label="交货日期" 
		>
		</new-time-picker>
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
		<div style="width:100%;height:5.7rem;"></div>
		<template v-if="formData.isCalc == 1 ">
			<van-button  
				type="warning" 
				size="normal" 
				:disabled=" config.button.calcBtnDis "
				style="width:50%;position:fixed;bottom:3.125rem;" 
				@click="calcPriceInfo()" 
			>
				试算
			</van-button>
			<van-button  
				type="primary" 
				size="normal" 
				style="width:50%;position:fixed;bottom:3.125rem;left:50%;" 
				:disabled=" config.button.disabled "
				@click="buildOrder()" 
			>
				下单
			</van-button>
		</template>
		<template v-else>
			<van-button  
				type="primary" 
				size="normal" 
				style="width:100%;position:fixed;bottom:3.125rem;" 
				:disabled=" config.button.disabled "
				@click="buildOrder()" 
			>
				下单
			</van-button>
		</template>
		<build-sku 
			:skuShow.sync="config.popup.sku.show" 
			:orderInfo="formData" 
			orderType="s" 
			:isGroup="false"
			@saveOrder="saveOrder"
		>
		</build-sku>
		<build-result 
			v-if="config.result.show"
			:resultShow.sync="config.result.show" 
			:isGroup="false" 
			:isSuccess="config.result.isSuccess" 
			:cusOrderId="config.result.cusOrderId" 
			:failMsg="config.result.failMsg"
			@clearFormData="clearFormData()" 
		>
		</build-result>
	</div>
</template>
<script>
	import { Button, Icon, Popup, Field, Dialog, Toast } from 'vant';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import PopupSelect from '@/components/subject/build/PopupSelect.vue';
	import BuildSku from '@/components/subject/build/BuildSku.vue';
	import BuildResult from '@/components/subject/build/BuildResult.vue';
	import schema from 'async-validator';
	import BuildCalc from '@/components/subject/client/BuildCalc.vue';
	import FieldLabelVariable from '@/components/subject/staff/FieldLabelVariable.vue';
	import { checkBuildTime } from '@/util';

	import UniCheckBox from '@/components/subject/checkbox/UniCheckBox.vue'
	/*api接口*/
	import { getBuildOrdConfig } from "@/api/common/webConfig"
	export default {
		components:{
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Field.name]: Field,
			[Toast.name]: Toast,

			NewTimePicker,
			PopupSelect,
			BuildSku,
			BuildResult,
			BuildCalc,
			FieldLabelVariable,
			UniCheckBox
		},
		data(){
			return {
				config:{
					fieldConfig: {
						material: {
							label: '材质',
							placeholder: '选择材质'
						},
						cusInfo: {
							label: '送货公司',
							placeholder: '选择送货公司'
						}
					},
					radioData:{
						material: [],
						lineBall: [],
						cusInfo: [],
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
					popup: {
						timeFilter: {
							isFinishLoad: false
						},
						sku: {
							show: false
						}
					},
					result: {
						show: false,
						isSuccess: false,
						cusOrderId: '',
						failMsg: '下单失败'
					},
					button:{
						disabled: true,
						calcBtnDis: true,
					},
					initClientHeight: document.documentElement.clientHeight,
					custIDField: {
						disabled: false
					}
				},
				formData : {
					cusOrderId: '',    //客订单号
					materialType: '',    //材质
					boardLength: '',    //板长
					boardWidth: '',    //板宽
					lineBallInfo: '',    //压型名称
					lineBallFormula: '',    //压线信息
					orderQuantities: '',    //订单数
					area: '',           //下单面积
					address: '',    //送货地址
					date: '',           //送货时间
					deliveryRemark: '',  //送货备注
					productionRemark: '',//生产备注
					isEdge: '净片',      //是否毛片 
					isCalc: 0,          //是否开启始算参数
					factoryId: null,   
					saAreaAddArea: null,
					saAreaAddTrim: null,
					dOrdPrice: null,   //计价价格 
					dAmt: null,        //金额
					buildType: 0,      //0新增 1修改 2快速下单
					scoreEdge: null,
					//上次下单材质
					lastBoardId: null
				},
				/*页面必要参数*/
				buildConfig: {
					buildAddCalc: null,
					buildDeliveryDate: null,
					buildInTime1: [],
					buildInTime2: [],
					buildMaxArea: null,
					buildMaxDate: null,
					buildMaxLength: null,
					buildMinLength: null,
					buildMaxWidth: null,
					buildMinWidth: null,
					buildMinArea: null,
					buildMinDate: null,
					buildScoreName: null,
					defaultScoreName: null,
					factoryId: null,
					isAddTrimArea: null,
					needSetBuildTime: null,
					saAreaAddArea: null,
					saAreaAddTrim: null,
					showDeliveryRemark: null,
				},
				rules: {
					cusOrderId : [
						{ validator: (rule, value, callback, source, options)=>{
							let errors;
							if( value != '' && (value.length > 56 || value.length <= 0) ){
								errors = '客订单号长度超过长度'
							}
							callback(errors)
						} }
					],
					materialType : [
						{ required : true, message : '请选择材质' }
					],
					boardLength : [
						{ required : true, message : '请输入板长' },
						{ validator: (rule, value, callback, source, options)=>{
							let errors;
							if( Number(value) > this.buildConfig.buildMaxLength || Number(value) < this.buildConfig.buildMinLength){
								errors = '板长范围:' + this.buildConfig.buildMinLength + 'mm~' + this.this.buildConfig.buildMaxLength + 'mm'
								this.formData.boardLength = null
							}
							callback(errors)
						}}
					],
					boardWidth : [
						{ required : true, message : '请输入板宽' },
						{ validator: (rule, value, callback, source, options)=>{
							let errors;
							if( Number(value) > this.buildConfig.buildMaxWidth || Number(value) < this.buildConfig.buildMinWidth){
								errors = '板宽范围:' + this.buildConfig.buildMinWidth + 'mm~' + this.buildConfig.buildMaxWidth + 'mm'
								this.formData.boardWidth = null
							}
							callback(errors)
						}}
					],
					lineBallInfo : [
						{ required  : true, message : '请选择压线名称' },
					],
					lineBallFormula : [
						{ pattern   : '^\\\d+([.]{1}[5]{1}){0,1}(\\\+\\\d+([.]{1}[5]{1}){0,1})+$', message : '压线信息错误' },
						{ validator : (rule, value, callback, source, options)=>{
							let errors
							if( this.formData.lineBallInfo != '无压线' &&  Number( this.formData.boardWidth ) !=  eval(value) ){
								errors = '压线和不等于板宽'
							}
							callback(errors)
						}}
					],
					orderQuantities : [
						{ required : true, message : '请填写订单数' },
						{ validator : (rule, value, callback, source, options)=>{
							let errors
							if( ! /^[1-9][0-9]{0,6}$/.test(value) ){
								errors = '订单数格式错误'
							}
							callback(errors)
						}}
					],
					area : [
						{ required : true, message : '请先获取订单面积' },
						{ validator : (rule, value, callback, source, options)=>{
							let errors
							if( Number( value ) > Number(this.buildConfig.buildMaxArea) || Number(value) < Number(this.buildConfig.buildMinArea) ){
								errors = '下单面积范围:' + this.buildConfig.buildMinArea + '~\n' + this.buildConfig.buildMaxArea
							}
							callback(errors)
						}}
					],
					address : [
						{ required: true, message: '请选择送货公司' }
					],
					date : [
						{ required: true, message: '请选择交货日期' }
					],
					dOrdPrice:[
						{ required: true, message: '请先订单试算,获取价格' },
						{ validator: (rule, value, callback, source, options)=>{
							let errors
							if( this.formData.isCalc == 1 && Number(value) <= 0 ){
								errors = '请先试算获取计价价格'
							}
							callback(errors)
						}}
					],
					dAmt:[
						{ required: true, message: '请先订单试算,获取总价' },
						{ validator: (rule, value, callback, source, options)=> {
							let errors
							if( this.formData.isCalc == 1 && Number(value) <= 0 ){
								errors = '请先试算获取金额'
							}
							callback(errors)
						}}
					]
				},
				validator: {}
			}
		},
		methods:{
			async getConfig( fastOrdId ){
				this.config.radioData = this.$options.data().config.radioData
				this.config.button = this.$options.data().config.button
				const { result } = await getBuildOrdConfig({fastOrdId: fastOrdId})
				//设置页面参数
				this.buildConfig = result.buildConfig
				//设置提交表格必要参数
				this.formData.date = result.buildConfig.buildDeliveryDate
				this.formData.isCalc = result.buildConfig.buildAddCalc
				this.formData.factoryId = result.buildConfig.factoryId
				this.formData.cusId = result.buildConfig.cusId
				this.formData.saAreaAddArea = result.buildConfig.saAreaAddArea == 1 ? true : false
				this.formData.saAreaAddTrim = result.buildConfig.saAreaAddTrim == 1 ? true : false
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
				//设置送货地址组件
				let defaultAddr = result.custDN.find((row)=>row.DefAddress==1)
				this.formData.address = defaultAddr.value
				this.config.radioData.cusInfo = result.custDN
				
				//设置压线压型组件
				if( this.formData.isCalc == 1 ) {
					this.formData.scoreEdge = result.userBuild.edgeType + result.userBuild.scoreType
					this.formData.materialType = result.userBuild.lastBoardId || ''
					/*let scoreItem = this.config.radioData.lineInfo.find(item=> item.value == this.formData.scoreEdge)
					this.formData.isEdge = scoreItem.text.slice(0, 2) 
					this.formData.lineBallInfo = scoreItem.text.slice(3)*/
				} else {
					result.buildConfig.buildScoreName.forEach((row,index)=>{
						this.config.radioData.lineBall.push( { value: row, text: row } )
					})
					this.formData.lineBallInfo = result.buildConfig.defaultScoreName
				}

				//新增或者修改
				if( this.formData.buildType == 1 || this.formData.buildType == 2 ) {
					this.formData.materialType = result.fastOrdInfo.BoardId
					this.formData.boardLength = result.fastOrdInfo.Length
					this.formData.boardWidth =  result.fastOrdInfo.Width
					this.formData.lineBallFormula = result.fastOrdInfo.ScoreInfo
					this.formData.address = result.fastOrdInfo.CusSubNo
					this.formData.productionRemark = result.fastOrdInfo.ProRemark
					this.formData.orderQuantities = result.fastOrdInfo.OrdQty
					this.formData.cusOrderId = this.formData.buildType == 1 ? result.fastOrdInfo.CusPoNo : ''
					this.formData.deliveryRemark = this.buildConfig.showDeliveryRemark == 1 ? result.fastOrdInfo.DNRemark : ''

					this.formData.scoreEdge = result.fastOrdInfo.WebEdgeType + result.fastOrdInfo.ScoreType
				}

				if( this.formData.isCalc == 1 || this.formData.buildType == 1 || this.formData.buildType == 2 ) {
					let scoreItem = this.config.radioData.lineInfo.find(item=> item.value == this.formData.scoreEdge)
					this.formData.isEdge = scoreItem.text.slice(0, 2) 
					this.formData.lineBallInfo = scoreItem.text.slice(3)
				}

				if( this.formData.isCalc == 0 ) {
					delete this.rules.dOrdPrice
					delete this.rules.dAmt
					this.validator = new schema(this.rules)
				}

				this.config.popup.timeFilter.isFinishLoad = true

				if( this.formData.buildType == 1 || this.formData.buildType == 2 ) {
					this.calcArea()
				}

			},
			buildOrder(){
				let self = this;
				this.validator.validate(this.formData).then(()=>{
					if( this.formData.isCalc == 1 ){
						this.calcPriceInfo(false, true)
					}
				}).then(()=>{
					if( this.formData.isCalc == 0 ){
						this.checkData();
					}
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message)
				});
			},
			checkData(){
				this.$request.client.orderBooking.sBuildCheck(this.formData).then(res=>{
					if( res.errorCode == '00000' ){
						this.config.popup.sku.show = true
					}
				});
			},
			//计算面积
			calcArea() {
				if( !this.formData.boardLength || !this.formData.boardWidth || !this.formData.orderQuantities ) return
				const calcArea = new schema({
					boardLength: this.rules.boardLength,
					boardWidth: this.rules.boardWidth,
					orderQuantities: this.rules.orderQuantities
				})
				calcArea.validate( this.formData ).then(()=> {
					this.formData.area = Math.round( this.formData.boardLength *  this.formData.boardWidth * this.formData.orderQuantities / 1000000 * 100) /100
					if( this.formData.area>this.buildConfig.buildMaxArea||this.formData.area<this.buildConfig.buildMinArea ) {
						Toast.fail({
							message: '下单面积范围:'+this.buildConfig.mibuildMinAreanArea+'㎡\n'+this.buildConfig.buildMaxArea + '㎡',
							onClose:()=>{
								this.formData.area = ''
								this.formData.orderQuantities = ''
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
			saveOrder( data ){
				if( !this.checkTime() ) return 
				if( this.formData.isCalc == 0 ){
					this.buildSave( data )
					return 
				}
				let postData = {
					strFactoryId: data.factoryId,
                    strCusId: data.cusId,
                    strBoardId: data.materialType,
                    bAddTrim: data.saAreaAddTrim,
                    bAddArea: data.saAreaAddArea,
                    bEdge: data.isEdge == '毛片' ? 1 : 0,
                    iLength: data.boardLength,
                    iWidth: data.boardWidth,
                    strScoreInfo: data.lineBallInfo,
                    iQty: data.orderQuantities,
                    strBoxId: null,
                    iBoxL: null,
                    iBoxW: null,
                    iBoxH: null,
                    iTonLen: null,
                    iULen: null
				};
				if( this.formData.isEdge == '毛片' && this.buildConfig.isAddTrimArea == 1 ){
					data.bAddTrim = false;
					data.bAddArea = false;
				}
				let self = this;
				this.$request.staff.connecterp.calBdPriceInfo( postData, 0 ).then((res)=>{
					if( res.data.result[2] === false ){
						Dialog.alert({
							title   : '计算失败',
							message : res.data.result[1]
						}).then(()=>{
							Dialog.close();
						});
						this.config.popup.sku.show = false;
					}else{
						let erpResult = JSON.parse( res.data.result[0] )[0];
						data.dOrdPrice  = erpResult.dOrdPrice;
						data.dAmt  = erpResult.dAmt
					}
				}).then(()=>{
					this.buildSave( data );
				});
				
			},
			buildSave( data ){
				if( !this.checkTime() ) return 
				let self = this;
				this.$request.client.orderBooking.sBuildSave( data ).then(res=>{
					if( res.errorCode == '00000' ){
						self.config.result.isSuccess  = true;
						self.config.result.cusOrderId = res.result.order_id;
						self.config.result.show = true;
					}else{
						self.config.result.failMsg = res.msg;
						self.config.result.isSuccess = false;
					}
				});
			},
			async clearFormData(){
				let formDataInit = Object.assign({},this.$options.data().formData,{
					materialType: this.formData.materialType
				})
				this.formData = formDataInit
				await this.getConfig()
			},
			buildCalc( data ){
				this.formData.isEdge = data[0];
				this.formData.lineBallInfo = data[1];
			},
			calcPriceInfo( showToast = true, isCheck = false ){
				console.log(this.formData.isEdge )
				if( this.formData.isCalc == 0 ) return true
				delete this.rules.dOrdPrice
				delete this.rules.dAmt
				let calc = new schema(this.rules);
				new schema(this.rules).validate(this.formData).then(()=>{
					let data = {
						strFactoryId: this.formData.factoryId,
	                    strCusId: this.formData.cusId,
	                    strBoardId: this.formData.materialType,
	                    bAddTrim: this.formData.saAreaAddTrim,
	                    bAddArea: this.formData.saAreaAddArea,
	                    bEdge: this.formData.isEdge == '毛片' ? 1 : 0,
	                    iLength: this.formData.boardLength,
	                    iWidth: this.formData.boardWidth,
	                    strScoreInfo: this.formData.lineBallInfo,
	                    iQty: this.formData.orderQuantities,
	                    strBoxId: null,
	                    iBoxL: null,
	                    iBoxW: null,
	                    iBoxH: null,
	                    iTonLen: null,
	                    iULen: null
					}
					if( this.formData.isEdge == '毛片' && this.buildConfig.isAddTrimArea == 1 ){
						data.bAddTrim = false
						data.bAddArea = false
					}
					let self = this;
					this.$request.staff.connecterp.calBdPriceInfo( data, 0 ).then((res)=>{
						if( res.data.result[2] === false ){
							Dialog.alert({
								title   : '计算失败',
								message : res.data.result[1]
							}).then(()=>{
								Dialog.close();
							});
							this.config.button.disabled = true;
						}else{
							let erpResult = JSON.parse( res.data.result[0] )[0];
							if( !isCheck ){
								self.formData.dOrdPrice  = erpResult.dOrdPrice;
								self.formData.dAmt  = erpResult.dAmt;
								self.config.button.disabled = false;
							}else{
								if( self.formData.dOrdPrice != erpResult.dOrdPrice || self.formData.dAmt != erpResult.dAmt ){
									Dialog.alert({
										title:'金额变化是否继续下单',
										message:'计价价格：' + self.formData.dOrdPrice + '=>' + erpResult.dOrdPrice + '\n' + '金额：' + self.formData.dAmt + '=>' + erpResult.dAmt
									}).then(()=>{
										self.formData.dOrdPrice  = erpResult.dOrdPrice;
										self.formData.dAmt  = erpResult.dAmt;
										self.checkData();
									});
								}else{
									self.checkData();
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
				this.validator.validate(this.formData).then(()=>{
					this.config.button.disabled = false
				}).catch(({ errors, fields })=>{
					this.config.button.disabled = true
					Toast.fail(errors[0].message)
				});
			},
			materialTypeChange( newValue ){
				this.formData.materialType = newValue;
			},
			scoreEdgeChange(e) {
				this.formData.lineBallInfo = ['无压线', '普通压线', '平压线'][e.detail.value[1]]
				this.formData.edgeType = ['净片', '毛片'][e.detail.value[0]]
				this.formData.isEdge = ['净片', '毛片'][e.detail.value[0]]
			},
			lineBallChange(e){
				this.formData.lineBallInfo = e.detail.value
			},
			addressChange( newValue ){
				this.formData.address = newValue;
			},
			inputFocus( id ){
				const ua = window.navigator.userAgent.toLocaleLowerCase();
				const isAndroid = /android/.test(ua);
				let that = this;
				if( isAndroid ){
					window.onresize = () => {
						const curClientHeight = document.documentElement.clientHeight;
						//安卓键盘收起
						if (curClientHeight >= that.config.initClientHeight) {
							if( id == 'lineBallFormula' ){
								that.checkFormula()
							}
							if( id == 'boardLength' || id == 'boardWidth' || id == 'orderQuantities' ){
								that.calcArea()
							}
							window.onresize = null;
						}
					}
				}
			},
			inputBlur( id ){
				if( id == 'lineBallFormula' ){
					this.checkFormula()
				}
				if( id == 'boardLength' || id == 'boardWidth' || id == 'orderQuantities' ){
					this.calcArea()
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
			async fetchBuildType( params ){
				let orderId = ''
				if( typeof( params.orderId ) != 'undefined' && params.orderId != null ){
					orderId = params.orderId;
					if( typeof( params.buildType ) != 'undefined' && params.buildType != null ){
						this.formData.buildType = params.buildType == 1 ? 1 : 2
					}else{
						this.formData.buildType = 2
					}
				}else{
					this.formData.buildType = 0
				}
				await this.getConfig( orderId )
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','简单纸板下单');
			console.log("SBuild")
		},
		mounted(){
			this.fetchBuildType( this.$route.params );
			this.validator = new schema(this.rules);
			console.log("SBuild")
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			buildTypeChange(){
				return this.formData.buildType;
			}
		},
		watch:{
			buildTypeChange( newV, oldV ){
				if( newV == 1 ){
					this.config.custIDField.disabled = true;
				}else{
					this.config.custIDField.disabled = false;
				}
			},
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