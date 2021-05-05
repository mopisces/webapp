<template>
	<div>
		<van-field v-model="formData.cusOrderId" input-align="center" label="客订单号" placeholder="未填写则系统自动生成"/>
		<popup-select :selectValue.sync="formData.materialType" :fieldConfig="config.fieldConfig.material" :radioData="config.radioData.material" selectType="material" @materialConfirm="getClackAdjust( formData.materialType )"></popup-select>
		<popup-select :selectValue.sync="formData.boxType" :fieldConfig="config.fieldConfig.boxType" :radioData="config.radioData.boxType" selectType="boxType" @boxTypeConfirm="getBoxFormula( formData.boxType )"></popup-select>
		<!-- <van-field label="箱规(mm)" right-icon="question-o" @click-right-icon="clickQuestion(1)">
			<div class="van-row van-row--flex van-row--justify-center" slot="input">
				<div class="van-col van-col--7" >
					<input placeholder="长(L)" v-model="formData.boxLength" style="width:100%;" @blur="calcBdLW()"/>
				</div>
				<div class="van-col van-col--1">
					*
				</div>
				<div class="van-col van-col--7">
					<input placeholder="宽(W)" v-model="formData.boxWidth" style="width:100%;" @blur="calcBdLW()"/>
				</div>
				<div class="van-col van-col--1">
					*
				</div>
				<div class="van-col van-col--8">
					<input placeholder="高(H)" v-model="formData.boxHeight" style="width:100%;" @blur="calcBdLW()"/>
				</div>
			</div>
		</van-field> -->
		<div class="van-cell" style="display: flex;align-items: center;">
			<div class="van-cell__title van-field__label">箱规(mm)</div>
			<input type="number" class="karry-input" placeholder="长(L)" v-model="formData.boxLength" @blur=" calcBdLW() "/>
			<div style="margin-left:0.2rem;margin-right:0.2rem;">x</div>
			<input type="number" class="karry-input" placeholder="宽(W)" v-model="formData.boxWidth" @blur=" calcBdLW() "/>
			<div style="margin-left:0.2rem;margin-right:0.2rem;">x</div>
			<input type="number" class="karry-input" placeholder="高(H)" v-model="formData.boxHeight" @blur=" calcBdLW() "/>
			<div class="van-field__right-icon">
				<van-icon name="question-o" @click="clickQuestion(1)"/>
			</div>
		</div>
		<popup-select :selectValue.sync="formData.tonLen" :fieldConfig="config.fieldConfig.tonLen" :radioData="config.radioData.tonLen" selectType="tonLen" @lenConfirm="calcBdLW()"></popup-select>
		<popup-select :selectValue.sync="formData.uLen" :fieldConfig="config.fieldConfig.uLen" :radioData="config.radioData.uLen" selectType="uLen" @lenConfirm="calcBdLW()"></popup-select>
		<van-field v-model="formData.lengthF" input-align="center" label="横向公式" placeholder="待选择箱型" readonly/>
		<van-field v-model="formData.widthF" input-align="center" label="纵向公式" placeholder="待选择箱型" readonly/>
		<!-- <div class="van-cell van-field">
			<div class="van-cell__title" style="width:5.625rem;">
				<span>纸板规格(mm)</span>
			</div>
			<div class="van-cell__value">
				<div class="van-field__body">
					<div class="van-col van-col--12" >
						<input placeholder="板长" v-model="formData.length" style="width:100%;" disabled/>
					</div>
					<div class="van-col van-col--1">
						x
					</div>
					<div class="van-col van-col--11" >
						<input placeholder="板宽" v-model="formData.width" style="width:100%;" disabled/>
					</div>
				</div>
			</div>
		</div> -->
		<div class="van-cell" style="display: flex;align-items: center;">
			<div class="van-cell__title van-field__label">纸板规格(mm)</div>
			<input type="number" class="karry-input" placeholder="板长" v-model="formData.length" readonly/>
			<div style="margin-left:0.2rem;margin-right:0.2rem;">x</div>
			<input type="number" class="karry-input" placeholder="板宽" v-model="formData.width" readonly/>
		</div>
		<popup-select :selectValue.sync="formData.lineBallInfo" :fieldConfig="config.fieldConfig.lineBall" :radioData="config.radioData.lineBall" selectType="lineBall"></popup-select>
		<van-field input-align="center" label="压线信息" placeholder="由ERP系统自动计算" readonly/>
		<van-field v-model="formData.bdMultiple" input-align="center" label="张数" placeholder="待选择箱型" readonly right-icon="question-o" @click-right-icon="clickQuestion(2)"/>
		<van-field v-model="formData.ordQty" input-align="center" label="订单数" placeholder="输入订单数" @blur="calcBdQty()"/>
		<van-field v-model="formData.bdQty" input-align="center" label="纸板数" placeholder="待计算" readonly :disabled=" true " />
		<van-field v-model="formData.area" input-align="center" label="下单面积(㎡)" placeholder="待计算" readonly right-icon="question-o" @click-right-icon="clickQuestion(3)" :disabled=" true " />
		<popup-select :selectValue.sync="formData.address" :fieldConfig="config.fieldConfig.address" :radioData="config.radioData.address" selectType="cusInfo">
		</popup-select>
		<new-time-picker :dateTime.sync="formData.date" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="交货日期" v-if="config.popup.timeFilter.isFinishLoad"></new-time-picker>
		<van-field v-model="formData.deliveryRemark" rows="1" autosize label="送货备注" type="textarea"  maxlength="50" placeholder="填写送货备注" :rows="1"/>
		<van-field v-model="formData.productionRemark" rows="1" autosize label="生产备注" type="textarea"  maxlength="50" placeholder="填写生产备注" :rows="1"/>
		<van-button  type="primary" size="normal" style="width:100%;position:fixed;bottom:3.125rem;" @click="buildOrder()" :disabled=" config.button.disabled ">下单</van-button>
		<div style="width:100%;height:3.125rem;"></div>
		<build-sku :skuShow.sync="config.popup.sku.show" :orderInfo="formData" orderType="c" @saveOrder="saveOrder" :isGroup="false"></build-sku>
		<build-result :resultShow.sync="config.result.show" :isGroup="false" :isSuccess="config.result.isSuccess" @clearFormData="clearFormData()" v-if="config.result.show" :cusOrderId="config.result.cusOrderId"></build-result>
	</div>
</template>
<script>
	import { Button, Icon, Field, Dialog, Toast } from 'vant';
	import PopupSelect from '@/components/subject/build/PopupSelect.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import BuildSku from '@/components/subject/build/BuildSku.vue';
	import BuildResult from '@/components/subject/build/BuildResult.vue';
	import schema from 'async-validator';
	export default {
		components:{
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Field.name]: Field,
			[Toast.name]: Toast,

			PopupSelect,
			NewTimePicker,
			BuildSku,
			BuildResult
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
						material : [],
						boxType  : [],
						tonLen   : [],
						uLen     : [],
						lineBall : [],
						address  : []
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
						cusOrderId : ''
					},
					isFastBuild : false,
					button:{
						disabled : true
					}
				},
				formData:{
					cusOrderId       : '',   //客订单号
					materialType     : '',	 //材质
					boxType          : '',	 //箱型
					boxLength        : '',	 //箱长
					boxWidth         : '',	 //箱宽
					boxHeight        : '',   //箱高
					tonLen           : '',   //箱舌
					uLen             : '',   //封箱调整
					length           : '',   //板长
					width            : '',   //板宽
					bdMultiple       : '',   //张数
					ordQty           : 0,    //订单数
					bdQty            : '',   //纸板数
					lineBallInfo     : '',   //压型名称
					area             : '',   //下单面积
					address          : '',   //送货地址
					date             : '',   //交货日期
					deliveryRemark   : '',   //送货备注
					productionRemark : '',   //生产备注
					lengthF          : '',   //横向公式
					widthF           : '',   //纵向公式
				},
				pageConfig:{
					minDate     : '',
					maxDate     : '',
					minBoxH     : '',
					maxBoxH     : '',
					minBoxL     : '',
					maxBoxL     : '',
					minBoxW     : '',
					maxBoxW     : '',
					minArea     : '',
					maxArea     : '',
					lengthFCalc : '',
					widthFCalc  : ''
				},
				rules:{
					calcBdLW : {
						boxLength : [
							{ validator: (rule, value, callback, source, options)=>{
								let errors;
								if( value != '' && ( Number(value) > this.pageConfig.maxBoxL || Number(value) < this.pageConfig.minBoxL ) ){
									errors = '板宽范围:' + this.pageConfig.minBoxL + 'mm~' + this.pageConfig.maxBoxL + 'mm';
								}
								callback(errors);
							} }
						],
						boxWidth : [
							{ validator: (rule, value, callback, source, options)=>{
								let errors;
								if( value != '' && ( Number(value) > this.pageConfig.maxBoxW || Number(value) < this.pageConfig.minBoxW ) ){
									errors = '板宽范围:' + this.pageConfig.minBoxW + 'mm~' + this.pageConfig.maxBoxW + 'mm';
								}
								callback(errors);
							}  }
						],
						boxHeight : [
							{ validator: (rule, value, callback, source, options)=>{
								let errors;
								if(  value != '' && ( Number(value) > this.pageConfig.maxBoxH || Number(value) < this.pageConfig.minBoxH ) ){
									errors = '板宽范围:' + this.pageConfig.minBoxH + 'mm~' + this.pageConfig.maxBoxH + 'mm';
								}
								callback(errors);
							} }
						]
					},
					buildOrder:{
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
								let errors;
								if( value == 0 ){
									errors = '请填写订单数';
								}
								callback(errors);
							}}
						],
						bdQty  : [
							{ required : true , message:'请填写相关信息获取纸板数' }
						],
						lineBallInfo:[
							{ required : true , message:'请选择压型' }
						],
						area : [
							{ validator: (rule, value, callback, source, options)=>{
								let errors;
								if( Number(value) > this.pageConfig.maxArea || Number(value) < this.pageConfig.minArea){
									errors = '下单面积范围:' + this.pageConfig.minArea + '㎡~' + this.pageConfig.maxArea + '㎡';
								}
								callback(errors);
							} }
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
								let errors;
								if( !this.inArray( 'tonLen', value ) ){
									errors = '非法箱舌';
								}
								callback(errors);
							}}
						],
						uLen :  [
							{ required : true , message:'请选择封箱调整' },
							{ validator: (rule, value, callback, source, options)=>{
								let errors;
								if( !this.inArray( 'uLen', value ) ){
									errors = '非法封箱调整';
								}
								callback(errors);
							}}
						]
					}
				},
				validator:{
					calcBdLW   : {},
					buildOrder : {}
				}
			}
		},
		methods:{
			clickQuestion( type ){
				let info = '';
				if( type == 1 ){
					info = '箱长范围:' + this.pageConfig.minBoxL + '~' + this.pageConfig.maxBoxL + '\n'; 
					info += '箱宽范围:' + this.pageConfig.minBoxW + '~' + this.pageConfig.maxBoxW + '\n';
					info += '箱高范围:' + this.pageConfig.minBoxH + '~' + this.pageConfig.maxBoxW;
				}
				if( type == 2 ){
					info = '正数:几个纸板&nbsp;=>&nbsp;1个纸箱\n负数:1个纸板&nbsp;=>&nbsp;几个纸箱';
				}
				if( type == 3 ){
					info = '下单面积范围:' + this.pageConfig.minArea + '㎡~' + this.pageConfig.maxArea + '㎡';
				}
				Dialog.alert({
					message : info
				}).then(()=>{
					Dialog.close();
				});
			},
			buildOrder(){
				let self = this;
				this.validator.buildOrder.validate(this.formData).then(()=>{
					self.checkData();
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message);
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
			getConfig( fastOrderId ){
				let self = this;
				this.$request.client.orderBooking.cBuildConfig( fastOrderId ).then(res=>{
					self.pageConfig.minBoxH = res.result.config.BuildMinBoxH;
					self.pageConfig.maxBoxH = res.result.config.BuildMaxBoxH;
					self.pageConfig.minBoxL = res.result.config.BuildMinBoxL;
					self.pageConfig.maxBoxL = res.result.config.BuildMaxBoxL;
					self.pageConfig.minBoxW = res.result.config.BuildMinBoxW;
					self.pageConfig.maxBoxW = res.result.config.BuildMaxBoxW;
					self.pageConfig.minArea = res.result.config.BuildMinArea;
					self.pageConfig.maxArea = res.result.config.BuildMaxArea;
					self.pageConfig.minDate = res.result.config.BuildMinDate;
					self.pageConfig.maxDate = res.result.config.BuildMaxDate;
					self.formData.date      = res.result.config.BuildDeliveryDate;
					res.result.board_select_list.forEach((item,index)=>{
						if( item.BoardName == null ){
							self.config.radioData.material.push({ value : item.BoardId , text: '', tag:item.IsUsedBoard });
						}else{
							self.config.radioData.material.push({ value : item.BoardId , text: item.BoardName, tag:item.IsUsedBoard });
						}
					});
					res.result.line_ball_config.forEach((item,index)=>{
						self.config.radioData.lineBall.push( { value:item, text:'', tag:'' } );
					});
					self.formData.lineBallInfo = res.result.config.DefaultScoreName ? res.result.config.DefaultScoreName : self.config.radioData.lineBall[0].value;
					res.result.cus_info.forEach((item,index)=>{
						if( item.DefAddress == 1 ){
							self.formData.address = item.CusSubNo;
						}
						self.config.radioData.address.push( { value : item.CusSubNo, text:item.SubDNAddress, tag : ''} );
					});
					res.result.box_type_availabel.forEach((item,index)=>{
						self.config.radioData.boxType.push( { value : item.BoxId, text:item.BoxName, lengthF:item.LengthF, widthF:item.WidthF } )
					});
					res.result.config.BuildTonLen.forEach((item,index)=>{
						self.config.radioData.tonLen.push({ value: item, text: item });
					});
					res.result.config.BuildULen.forEach((item,index)=>{
						self.config.radioData.uLen.push({ value: item, text: item });
					});

					if( self.config.isFastBuild ){
						self.formData.materialType = res.result.fast_order_booking.BoardId;
						self.formData.boxType      = res.result.fast_order_booking.BoxId;
						self.formData.boxLength    = res.result.fast_order_booking.BoxL;
						self.formData.boxWidth     = res.result.fast_order_booking.BoxW;
						self.formData.boxHeight    = res.result.fast_order_booking.BoxH;
						self.formData.tonLen       = res.result.fast_order_booking.TonLen;
						self.formData.uLen         = res.result.fast_order_booking.ULen;
						self.formData.bdMultiple   = res.result.fast_order_booking.BdMultiple;
						self.formData.address      = res.result.fast_order_booking.CusSubNo;
						self.formData.deliveryRemark   = res.result.fast_order_booking.DNRemark;
						self.formData.productionRemark = res.result.fast_order_booking.ProRemark;
					}
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.timeFilter.isFinishLoad = true;
						if( self.config.isFastBuild ){
							this.getBoxFormula( this.formData.boxType );
						}
					});
				});
			},
			saveOrder( data ){
				let self = this;
				this.$request.client.orderBooking.cBuildSave( data ).then(res=>{
					if( res.errorCode == '00000' ){
						self.config.result.isSuccess  = true;
						self.config.result.cusOrderId = res.result.order_id;
					}else{
						self.config.result.isSuccess = false;
					}
					self.config.result.show = true;
				});
			},
			calcBdLW(){
				let self = this;
				this.validator.calcBdLW.validate(this.formData).then(()=>{
					let lengthExp = self.pageConfig.lengthFCalc;
					let widthExp  = self.pageConfig.widthFCalc;
					if( self.formData.boxLength ){
						lengthExp = lengthExp.replace(/L/g,self.formData.boxLength);
						widthExp  = widthExp.replace(/L/g,self.formData.boxLength);
					}
					if( self.formData.boxWidth ){
						lengthExp = lengthExp.replace(/W/g,self.formData.boxWidth);
						widthExp  = widthExp.replace(/W/g,self.formData.boxWidth);
					}
					if( self.formData.boxHeight ){
						lengthExp = lengthExp.replace(/H/g,self.formData.boxHeight);
						widthExp  = widthExp.replace(/H/g,self.formData.boxHeight);
					}
					if( self.formData.tonLen ){
						lengthExp = lengthExp.replace(/T/g, self.formData.tonLen );
						widthExp  = widthExp.replace(/T/g,  self.formData.tonLen );
					}
					if( self.formData.uLen ){
						lengthExp = lengthExp.replace(/U/g,self.formData.uLen);
						widthExp  = widthExp.replace(/U/g,self.formData.uLen);
					}
					self.formData.lengthF = lengthExp;
					self.formData.widthF  = widthExp;
					if( lengthExp && lengthExp.indexOf('L') === -1 && lengthExp.indexOf('W') === -1 && lengthExp.indexOf('H') === -1 && lengthExp.indexOf('T') === -1 && lengthExp.indexOf('U') === -1 ){
						self.formData.length = Math.round(eval(lengthExp.replace(/<\/?.+?>/g,'')));
					}else{
						self.formData.length = '';
					}
					if( widthExp && widthExp.indexOf('L') === -1 && widthExp.indexOf('W') === -1 && widthExp.indexOf('H') === -1 && widthExp.indexOf('T') === -1 && widthExp.indexOf('U') === -1 ){
						self.formData.width = Math.round(eval(widthExp.replace(/<\/?.+?>/g,'')));
					}else{
						self.formData.width = '';
					}
					self.calcArea();
				}).catch(({ errors, fields })=>{
					//Toast.fail(errors[0].message);
					console.log('fail')
				});
			},
			calcBdQty(){
				if( typeof( this.formData.bdMultiple ) === 'number' && this.formData.ordQty ){
					if( this.formData.bdMultiple > 0 ){
						this.formData.bdQty = this.formData.ordQty * this.formData.bdMultiple;
					}else if( this.formData.bdMultiple < 0 ){
						this.formData.bdQty = this.formData.ordQty / this.formData.bdMultiple * -1;
					}else{
						this.formData.bdQty = null;
					}
				}else{
					this.formData.bdQty = null;
				}
				this.calcArea();
			},
			calcArea(){
				if( this.formData.ordQty && !( /(^[1-9]\d*$)/.test(this.formData.ordQty) ) ){
					Toast.fail('订单数错误');
					this.formData.ordQty        = '';
					this.config.button.disabled = true;
					return ;
				}
				if( this.formData.bdQty && !( /(^[1-9]\d*$)/.test(this.formData.bdQty) ) ){
					Toast.fail('纸板数错误');
					this.formData.bdQty         = '';
					this.config.button.disabled = true;
					return ;
				}
				if( typeof(this.formData.length) === 'number' && typeof(this.formData.width) === 'number' && this.formData.bdQty != '' ){
					let postData = {
						areaLength : this.formData.length,
						areaWidth  : this.formData.width,
						areaOrdQty : 0,
						areaBdQty  : this.formData.bdQty
					};
					let self = this;
					this.$request.client.orderBooking.getCalcArea( postData ).then(res=>{
						if( res.errorCode == '00000' ){
							this.formData.area = res.result.area;
							if( res.result.valid_area == '0' ){
								Toast.fail('下单面积范围:' + self.pageConfig.minArea + '㎡~' + self.pageConfig.maxArea + '㎡');
								self.formData.ordQty        = '';
								self.formData.area          = '';
								self.config.button.disabled = true;
							}else{
								self.config.button.disabled = false;
							}
						}
					});
				}
			},
			getBoxFormula( boxType ){
				if( this.formData.boxType ){
					let self = this;
					this.$request.client.orderBooking.getBoxFormula( boxType ).then(res=>{
						self.pageConfig.lengthFCalc = res.result.LengthF;
						self.pageConfig.widthFCalc  = res.result.WidthF;
						self.formData.bdMultiple    = Number(res.result.Multiple);
					}).then(()=>{
						this.$nextTick(()=>{
							this.calcBdLW();
						})
					});
				}
			},
			getClackAdjust( materialType ){
				let self = this;
				this.$request.client.orderBooking.getClackAdjust( materialType ).then(res=>{
					let string = '';
					if( res.result.TonLen === null ){
						if( self.formData.tonLen !== '' ){
							string += '箱舌(T) => 不选择';
						}
						self.formData.tonLen = '';
					}else{
						if( self.formData.tonLen !== res.result.TonLen ){
							string += '箱舌(T) => ' + res.result.TonLen;
						}
						self.formData.tonLen = res.result.TonLen;
					}
					if( res.result.ULen === null  ){
						if( self.formData.uLen !== '' ){
							if( string !== '' ){
								string += '\n';
							}
							string += '封箱调整(U) => 不选择';
						}
						self.formData.uLen = '';
					}else{
						if( self.formData.uLen !== res.result.ULen ){
							if( string !== '' ){
								string += '\n';
							}
							string += '封箱调整(U) => ' + res.result.ULen;
						}
						self.formData.uLen = res.result.ULen;
					}
					if( string != '' ){
						Toast.fail(string);
					}
					self.calcBdLW();
				});
			},
			clearFormData(){
				Object.keys( this.formData ).forEach((item,index)=>{
					this.formData[item] = '';
				});
				this.pageConfig.lengthFCalc = '';
				this.pageConfig.widthFCalc  = '';
				this.getConfig( '' );
			},
			fastBuild( orderId ){
				this.config.isFastBuild = true;
				this.getConfig( orderId );
			},
			inArray( type, neddle ){
				if( type == 'tonLen' ){
					for (var i = this.config.radioData.tonLen.length - 1; i >= 0; i--) {
						if( this.config.radioData.tonLen[i].value == neddle ){
							return true;
							break;
						}
					}
					return false;
				}
				if( type == 'uLen' ){
					for (var i = this.config.radioData.uLen.length - 1; i >= 0; i--) {
						if( this.config.radioData.uLen[i].value == neddle ){
							return true;
							break;
						}
					}
					return false;
				}
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','纸箱纸板下单');
		},
		mounted(){
			if( typeof( this.$route.params.orderId ) != 'undefined' && this.$route.params.orderId != null ){
				this.fastBuild( this.$route.params.orderId ); 
			}else{
				this.getConfig( '' );
			}
			this.validator.calcBdLW   = new schema(this.rules.calcBdLW);
			this.validator.buildOrder = new schema(this.rules.buildOrder);

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
