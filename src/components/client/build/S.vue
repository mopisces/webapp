<template>
	<div>
		<van-field v-model="formData.cusOrderId" input-align="center" label="客订单号" placeholder="未填写则系统自动生成"/>
		<popup-select :selectValue.sync="formData.materialType" :fieldConfig="config.fieldConfig.material" :radioData="config.radioData.material" selectType="material"></popup-select>
		</van-field>
		<div class="van-cell" style="display: flex;align-items: center;">
			<div class="van-cell__title van-field__label">纸板规格(mm)</div>
			<input type="number" class="karry-input" placeholder="长" v-model="formData.boardLength" @blur=" calcArea() "/>
			<div style="margin-left:0.2rem;margin-right:0.2rem;">x</div>
			<input type="number" class="karry-input" placeholder="宽" v-model="formData.boardWidth" @blur=" calcArea() "/>
			<div class="van-field__right-icon">
				<van-icon name="question-o" @click="$toast('板长范围:' + pageConfig.minLength + 'mm~' + pageConfig.maxLength + 'mm\n板宽范围:' + pageConfig.minWidth +'mm~' + pageConfig.maxWidth + 'mm' )"/>
			</div>
		</div>
		<template v-if="formData.isCalc == 1 ">
			<build-calc :lineInfo="config.lineInfo" :calcDefault="config.calcDefault" @buildCalc="buildCalc"></build-calc>
		</template>
		<template v-else>
			<popup-select :selectValue.sync="formData.lineBallInfo" :fieldConfig="config.fieldConfig.lineBall" :radioData="config.radioData.lineBall" selectType="lineBall"></popup-select>
		</template>
		<van-field v-model="formData.lineBallFormula" input-align="center" label="压线信息" placeholder="压线和=板宽(格式:x+x+x)" @blur=" checkFormula() "/>
		<!-- <van-field v-model="formData.orderQuantities" input-align="center" type="number" label="订单数" placeholder="输入订单数" @blur=" calcArea() "/> -->
		<div class="van-cell van-field">
			<div class="van-cell__title van-field__label" >
				<span>订单数</span>
			</div>
			<div class="van-cell__value">
				<div class="van-field__body">
					<input type="text" placeholder="输入订单数" v-model="formData.orderQuantities" class="van-field__control van-field__control--center karry-input" style="background-color:#f0f0f0;" v-on:blur="calcArea()"/>
				</div>
			</div>
		</div>
		<van-field v-model="formData.area" clearable readonly input-align="center" label="下单面积(㎡)" placeholder="待计算" right-icon="question-o" @click-right-icon="$toast('下单面积范围:' + pageConfig.minArea + '㎡~' + pageConfig.maxArea + '㎡' ) ">
		</van-field>
		<template v-if=" formData.isCalc == 1 ">
			<field-label-variable :value.sync="formData.dOrdPrice" label="计价价格" placeholder="待计算" type="number" readonly="readonly"></field-label-variable>
			<field-label-variable :value.sync="formData.dAmt" label="金额" placeholder="待计算" type="number" readonly="readonly"></field-label-variable>
		</template>
		<popup-select :selectValue.sync="formData.address" :fieldConfig="config.fieldConfig.cusInfo" :radioData="config.radioData.cusInfo" selectType="cusInfo"></popup-select>
		<new-time-picker :dateTime.sync="formData.date" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="交货日期" v-if="config.popup.timeFilter.isFinishLoad"></new-time-picker>
		<van-field v-if="config.showDeliveryRemark == 1" v-model="formData.deliveryRemark" rows="1" autosize label="送货备注" type="textarea"  maxlength="50" placeholder="填写送货备注" :rows="1"/>
		<van-field v-model="formData.productionRemark" rows="1" autosize label="生产备注" type="textarea"  maxlength="50" placeholder="填写生产备注" :rows="1"/>
		<div style="width:100%;height:3.125rem;"></div>
		<template  v-if="formData.isCalc == 1 ">
			<van-button  type="warning" size="normal" style="width:50%;position:fixed;bottom:3.125rem;" @click="calcPriceInfo()" :disabled=" config.button.calcBtnDis ">试算</van-button>
			<van-button  type="primary" size="normal" style="width:50%;position:fixed;bottom:3.125rem;left:50%;" @click="buildOrder()" :disabled=" config.button.disabled ">下单</van-button>
		</template>
		<template v-else>
			<van-button  type="primary" size="normal" style="width:100%;position:fixed;bottom:3.125rem;" @click="buildOrder()" :disabled=" config.button.disabled ">下单</van-button>
		</template>
		<build-sku :skuShow.sync="config.popup.sku.show" :orderInfo="formData" orderType="s" @saveOrder="saveOrder" :isGroup="false"></build-sku>
		<build-result :resultShow.sync="config.result.show" :isGroup="false" :isSuccess="config.result.isSuccess" @clearFormData="clearFormData()" v-if="config.result.show" :cusOrderId="config.result.cusOrderId" :failMsg="config.result.failMsg"></build-result>
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
			FieldLabelVariable
		},
		data(){
			return {
				config:{
					fieldConfig : {
						material : {
							label       : '材质',
							placeholder : '选择材质'
						},
						lineBall : {
							label       : '压型名称',    //压线名称
							placeholder : '选择压型名称'  //选择压线名称
						},
						cusInfo : {
							label       : '送货公司',
							placeholder : '选择送货公司'
						}
					},
					radioData:{
						material : [],
						lineBall : [],
						cusInfo  : []
					},
					popup:{
						timeFilter: {
							isFinishLoad : false
						},
						sku: {
							show : false
						}
					},
					result : {
						show       : false,
						isSuccess  : false,
						cusOrderId :'',
						failMsg:'下单失败'
					},
					isFastBuild : false,
					button:{
						disabled : true,
						calcBtnDis:true,
					},
					lineInfo:[],
					calcDefault:{
						edgeType:'净片',
						index:null,
						name :null
					},
					showDeliveryRemark:0
				},
 				pageConfig : {
					maxDate   : '',
					maxArea   : '',
					maxLength : '',
					maxWidth  : '',
					minArea   : '',
					minDate   : '',
					minLength : '',
					minWidth  : '',
					IsAddTrimArea: 0
				},
				formData : {
					cusOrderId       : '',    //客订单号
					materialType     : '',    //材质
					boardLength      : '',    //板长
					boardWidth       : '',    //板宽
					lineBallInfo     : '',    //压型名称
					lineBallFormula  : '',    //压线信息
					orderQuantities  : '',    //订单数
					area             : '',    //下单面积
					address          : '',    //送货地址
					date             : '',    //送货时间
					deliveryRemark   : '',    //送货备注
					productionRemark : '',    //生产备注
					isEdge           : '净片', //是否毛片 
					isCalc           : 0,      //是否开启始算参数
					factoryId        : null,   
					saAreaAddArea    : null,
					saAreaAddTrim    : null,
					dOrdPrice        : null,   //计价价格 
					dAmt             : null,   //金额
				},
				rules : {
					cusOrderId : [
						{ validator: (rule, value, callback, source, options)=>{
							let errors;
							if( value != '' && (value.length > 56 || value.length <= 0) ){
								errors = '客订单号长度超过长度';
							}
							callback(errors);
						} }
					],
					materialType : [
						{ required : true, message : '请选择材质' }
					],
					boardLength : [
						{ required : true, message : '请输入板长' },
						{ validator: (rule, value, callback, source, options)=>{
							let errors;
							if( Number(value) > this.pageConfig.maxLength || Number(value) < this.pageConfig.minLength){
								errors = '板长范围:' + this.pageConfig.minLength + 'mm~' + this.pageConfig.maxLength + 'mm';
							}
							callback(errors);
						}}
					],
					boardWidth : [
						{ required : true, message : '请输入板宽' },
						{ validator: (rule, value, callback, source, options)=>{
							let errors;
							if( Number(value) > this.pageConfig.maxWidth || Number(value) < this.pageConfig.minWidth){
								errors = '板宽范围:' + this.pageConfig.minWidth + 'mm~' + this.pageConfig.maxWidth + 'mm';
							}
							callback(errors);
						}}
					],
					lineBallInfo : [
						{ required  : true, message : '请选择压线名称' },
					],
					lineBallFormula : [
						{ pattern   : '^\\\d+([.]{1}[5]{1}){0,1}(\\\+\\\d+([.]{1}[5]{1}){0,1})+$', message : '压线信息错误' },
						{ validator : (rule, value, callback, source, options)=>{
							let errors;
							if( this.formData.lineBallInfo != '无压线' &&  Number( this.formData.boardWidth ) !=  eval(value) ){
								errors = '压线和不等于板宽';
							}
							callback(errors);
						}}
					],
					orderQuantities : [
						{ required : true, message : '请填写订单数' },
						{ validator : (rule, value, callback, source, options)=>{
							let errors;
							if( ! /^[1-9][0-9]{0,6}$/.test(value) ){
								errors = '订单数格式错误';
							}
							callback(errors);
						}}
					],
					area : [
						{ required : true, message : '面积超过范围无法提交数据' },
						{ validator : (rule, value, callback, source, options)=>{
							let errors;
							if( Number( value ) >  Number(this.pageConfig.maxArea) || Number(value) < Number(this.pageConfig.minArea) ){
								errors = '下单面积范围:' + this.pageConfig.minArea + '~\n' + this.pageConfig.maxArea;
							}
							callback(errors);
						}}
					],
					address : [
						{ required : true, message : '请选择送货公司' }
					],
					date : [
						{ required : true, message : '请选择交货日期' }
					],
					dOrdPrice:[
						{ validator:(rule, value, callback, source, options)=>{
							let errors;
							if( this.formData.isCalc == 1 && Number(value) <= 0 ){
								errors = '请先试算获取计价价格';
							}
							callback(errors);
						}}
					],
					dAmt:[
						{ validator:(rule, value, callback, source, options)=>{
							let errors;
							if( this.formData.isCalc == 1 && Number(value) <= 0 ){
								errors = '请先试算获取金额';
							}
							callback(errors);
						}}
					]
				},
				validator : {}
			}
		},
		methods:{
			getConfig( fastOrderId ){
				this.config.button.calcBtnDis = true;
				this.config.button.disabled = true;

				this.config.radioData.material = [];
				this.config.radioData.lineBall = [];
				this.config.radioData.cusInfo = [];
				let self = this;
				this.$request.client.orderBooking.sBuildConfig( fastOrderId ).then(res=>{
					if( res.result.board_select_list.length == 0 ){
						Dialog.alert({
							title   : '没有可选择的材质',
							message : '请先选择常用材质'
						}).then(()=>{
							self.$router.push('/client/usedboard/lists')
						});
					}
					self.config.radioData.material = [];
					res.result.board_select_list.forEach((item,index)=>{
						if( item.BoardName == null ){
							self.config.radioData.material.push({ value : item.BoardId , text: '', tag:item.IsUsedBoard });
						}else{
							self.config.radioData.material.push({ value : item.BoardId , text: item.BoardName, tag:item.IsUsedBoard });
						}
					});
					
					res.result.cus_info.forEach((item,index)=>{
						if( item.DefAddress == 1 ){
							self.formData.address = item.CusSubNo;
						}
						self.config.radioData.cusInfo.push( { value : item.CusSubNo, text:item.SubDNAddress, tag : ''} );
					});
					self.formData.date = res.result.page_config.BuildDeliveryDate

					self.pageConfig.maxDate   = res.result.page_config.BuildMaxDate;
					self.pageConfig.minDate   = res.result.page_config.BuildMinDate;
					self.pageConfig.maxArea   = res.result.page_config.BuildMaxArea;
					self.pageConfig.minArea   = res.result.page_config.BuildMinArea;
					self.pageConfig.maxLength = res.result.page_config.BuildMaxLength;
					self.pageConfig.minLength = res.result.page_config.BuildMinLength;
					self.pageConfig.maxWidth  = res.result.page_config.BuildMaxWidth;
					self.pageConfig.minWidth  = res.result.page_config.BuildMinWidth;
					self.pageConfig.IsAddTrimArea = res.result.page_config.IsAddTrimArea;
					self.formData.isCalc = res.result.page_config.BuildAddCalc;
					self.formData.factoryId = res.result.page_config.FactoryId;
					self.formData.cusId = res.result.page_config.CusId;
					self.formData.saAreaAddArea = res.result.page_config.SaAreaAddArea == 1 ? true : false;
					self.formData.saAreaAddTrim = res.result.page_config.SaAreaAddTrim == 1 ? true : false;
					//是否显示送货备注
					self.config.showDeliveryRemark = res.result.page_config.ShowDeliveryRemark

					if( self.formData.isCalc == 1 ){
						const jp = [];
						res.result.line_ball_config.forEach((item,index)=>{
							if( !self.config.isFastBuild && res.result.page_config.DefaultScoreName && res.result.page_config.DefaultScoreName == item ){
								self.config.calcDefault.index = index;
								self.config.calcDefault.name = item;
							}
							if( self.config.isFastBuild && index == res.result.fast_order_booking.ScoreType){
								self.config.calcDefault.index = index;
								self.config.calcDefault.name = item;
								self.config.calcDefault.edgeType = res.result.fast_order_booking.WebEdgeType == 1 ? '毛片': '净片';
							}
							jp.push( item );
						});

						if( !res.result.page_config.DefaultScoreName ){
							self.config.calcDefault.index = 0;
							self.config.calcDefault.name = jp[0];
						}

						self.config.lineInfo = {
							'净片':jp,
							'毛片':['无压线']
						};
						if( !self.config.isFastBuild ){
							self.formData.lineBallInfo = res.result.page_config.DefaultScoreName ? res.result.page_config.DefaultScoreName : jp[0].value;
						}else{
							self.formData.lineBallInfo = self.config.calcDefault.name;
							self.formData.isEdge = self.config.calcDefault.edgeType;
						}
					}else{
						res.result.line_ball_config.forEach((item,index)=>{
							self.config.radioData.lineBall.push( { value:item, text:'', tag:'' } );
						});
						self.formData.lineBallInfo = res.result.page_config.DefaultScoreName ? res.result.page_config.DefaultScoreName : self.config.radioData.lineBall[0].value;
					}

					if( self.config.isFastBuild ){
						self.formData.materialType    = res.result.fast_order_booking.BoardId;
						self.formData.boardLength     = res.result.fast_order_booking.Length;
						self.formData.boardWidth      = res.result.fast_order_booking.Width;
						self.formData.lineBallFormula = res.result.fast_order_booking.ScoreInfo;
						self.formData.address         = res.result.fast_order_booking.CusSubNo;
						self.formData.deliveryRemark  = self.config.showDeliveryRemark == 1 ? res.result.fast_order_booking.DNRemark : '';
						self.formData.productionRemark= res.result.fast_order_booking.ProRemark;
					}
				}).then(()=>{
					if( this.formData.isCalc == 0 ){
						delete this.rules.dOrdPrice
						delete this.rules.dAmt
							this.validator = new schema(this.rules);
					}
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.timeFilter.isFinishLoad = true;
					})
				});

			},
			buildOrder(){
				let self = this;
				this.validator.validate(this.formData).then(()=>{
					if( this.formData.isCalc == 1 ){
						this.calcPriceInfo(false, true);
					}
				}).then(()=>{
					if( this.formData.isCalc == 0 ){
						this.checkData();
					}
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message);
				});
			},
			checkData(){
				let self = this;
				this.$request.client.orderBooking.sBuildCheck(this.formData).then(res=>{
					if( res.errorCode == '00000' ){
						self.config.popup.sku.show = true;
					}
				});
			},
			calcArea(){
				if( this.formData.boardLength && ( Number(this.formData.boardLength) < Number(this.pageConfig.minLength) || Number(this.formData.boardLength) > Number(this.pageConfig.maxLength) ) ){
					this.formData.boardLength = '';
					Toast.fail( '板长范围:' + this.pageConfig.minLength + 'mm~\n' + this.pageConfig.maxLength + 'mm' );
					return ;
				}
				if( this.formData.boardWidth && ( Number(this.formData.boardWidth) < Number(this.pageConfig.minWidth || Number(this.formData.boardWidth) > Number(this.pageConfig.maxWidth) ) ) ){
					this.formData.boardWidth = '';
					Toast.fail( '板宽范围:' + this.pageConfig.minWidth + 'mm~\n' + this.pageConfig.maxWidth + 'mm' );
					return ;
				}
				if( this.formData.orderQuantities && !(/(^[1-9]\d*$)/.test(this.formData.orderQuantities)) ){
					this.formData.orderQuantities = 0;
					Toast.fail('订单数错误');
					return ;
				}
				if( this.formData.boardLength && this.formData.boardWidth && this.formData.orderQuantities ){
					let postData = {
						areaLength : this.formData.boardLength,
						areaWidth  : this.formData.boardWidth,
						areaOrdQty : this.formData.orderQuantities,
						areaBdQty  : 0
					};
					let self = this;
					this.$request.client.orderBooking.getCalcArea( postData ).then(res=>{
						if( res.errorCode == '00000' ){
							self.formData.area = res.result.area;
							if( res.result.valid_area == '0' ){
								Toast.fail({
									message: '下单面积范围:' + self.pageConfig.minArea + '㎡\n' + self.pageConfig.maxArea + '㎡',
									onClose:()=>{
										self.formData.area            = '';
										self.formData.orderQuantities = '';
										//self.config.button.disabled   = true;
										self.config.button.calcBtnDis = true;
										self.checkFormula();
									}
								});
							}else{
								//self.config.button.disabled   = false;
								self.config.button.calcBtnDis = false;
								self.checkFormula();
							}
						}
					});
				}
			},
			saveOrder( data ){
				if( this.formData.isCalc == 0 ){
					this.buildSave( data );
					return ;
				}
				let postData = {
					strFactoryId : data.factoryId,
                    strCusId     : data.cusId,
                    strBoardId   : data.materialType,
                    bAddTrim     : data.saAreaAddTrim,
                    bAddArea     : data.saAreaAddArea,
                    bEdge        : data.isEdge == '毛片' ? 1 : 0,
                    iLength      : data.boardLength,
                    iWidth       : data.boardWidth,
                    strScoreInfo : data.lineBallInfo,
                    iQty         : data.orderQuantities,
                    strBoxId     : null,
                    iBoxL        : null,
                    iBoxW        : null,
                    iBoxH        : null,
                    iTonLen      : null,
                    iULen        : null
				};
				if( this.formData.isEdge == '毛片' && this.pageConfig.IsAddTrimArea == 1 ){
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
			clearFormData(){
				let formDataInit = Object.assign({},this.$options.data().formData,{
					materialType: this.formData.materialType
				});
				this.formData = formDataInit;
				this.getConfig();
			},
			fastBuild( orderId ){
				this.getConfig( orderId );
				this.config.isFastBuild = true;
			},
			buildCalc( data ){
				this.formData.isEdge = data[0];
				this.formData.lineBallInfo = data[1];
			},
			calcPriceInfo( showToast = true, isCheck = false ){
				if( this.formData.isCalc == 0 ) return true;
				delete this.rules.dOrdPrice
				delete this.rules.dAmt
				let calc = new schema(this.rules);
				new schema(this.rules).validate(this.formData).then(()=>{
					let data = {
						strFactoryId : this.formData.factoryId,
	                    strCusId     : this.formData.cusId,
	                    strBoardId   : this.formData.materialType,
	                    bAddTrim     : this.formData.saAreaAddTrim,
	                    bAddArea     : this.formData.saAreaAddArea,
	                    bEdge        : this.formData.isEdge == '毛片' ? 1 : 0,
	                    iLength      : this.formData.boardLength,
	                    iWidth       : this.formData.boardWidth,
	                    strScoreInfo : this.formData.lineBallInfo,
	                    iQty         : this.formData.orderQuantities,
	                    strBoxId     : null,
	                    iBoxL        : null,
	                    iBoxW        : null,
	                    iBoxH        : null,
	                    iTonLen      : null,
	                    iULen        : null
					}
					if( this.formData.isEdge == '毛片' && this.pageConfig.IsAddTrimArea == 1 ){
						data.bAddTrim = false;
						data.bAddArea = false;
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
					this.config.button.disabled = false;
				}).catch(({ errors, fields })=>{
					this.config.button.disabled = true;
					Toast.fail(errors[0].message);
				});
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','简单纸板下单');
		},
		mounted(){
			if( typeof( this.$route.params.orderId ) != 'undefined' && this.$route.params.orderId != null ){
				this.fastBuild( this.$route.params.orderId );
			}else{
				this.getConfig( '' );
			}
			this.validator = new schema(this.rules);
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