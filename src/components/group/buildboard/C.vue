<template>
	<div>
		<van-card>
			<div slot="title">
				{{ cardInfo.boardId }}
				<span style="color:#000;" v-if="cardInfo.title">,{{ cardInfo.title }}</span>
			</div>
			<van-count-down :time="cardInfo.countDown.time" slot="desc" v-if="cardInfo.countDown.show">
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
			<div slot="price">¥{{ cardInfo.productPrice }}/㎡</div>
			<div slot="origin-price">¥{{ cardInfo.marketPrice }}/㎡</div>
			<van-image :src="cardInfo.pic" slot="thumb"/>
		</van-card>
		<van-field v-model="formData.cusOrderId" label="客订单号" input-align="center" placeholder="未填写则系统自动生成"></van-field>
		<popup-select :selectValue.sync="formData.boxType" :fieldConfig="config.fieldConfig.boxType" :radioData="config.radioData.boxType" selectType="boxType" @boxTypeConfirm="getBoxFormula( formData.boxType )"></popup-select>
		<van-field label="纸箱规格(mm)" right-icon="question-o" @click-right-icon="$toast('箱长范围:' + pageConfig.minBoxL + 'mm~'+ pageConfig.maxBoxL  + 'mm\n箱宽范围:' + pageConfig.minBoxW + 'mm~' + pageConfig.maxBoxW + 'mm\n' + '箱高范围:' + pageConfig.minBoxH + 'mm~' + pageConfig.maxBoxH + 'mm'  )">
			<div class="van-row van-row--flex van-row--justify-center" slot="input">
				<div class="van-col van-col--7" >
					<input placeholder="箱长(L)" v-model="formData.boxLength" style="width:100%;" @blur="calcBdLW()"/>
				</div>
				<div class="van-col van-col--1">
					x
				</div>
				<div class="van-col van-col--7">
					<input placeholder="箱宽(W)" v-model="formData.boxWidth" style="width:100%;" @blur="calcBdLW()"/>
				</div>
				<div class="van-col van-col--1">
					x
				</div>
				<div class="van-col van-col--8">
					<input placeholder="箱高(H)" v-model="formData.boxHeight" style="width:100%;" @blur="calcBdLW()"/>
				</div>
			</div>	
		</van-field>
		<popup-select :selectValue.sync="formData.tonLen" :fieldConfig="config.fieldConfig.tonLen" :radioData="config.radioData.tonLen" selectType="tonLen" @lenConfirm="calcBdLW()"></popup-select>
		<popup-select :selectValue.sync="formData.uLen" :fieldConfig="config.fieldConfig.uLen" :radioData="config.radioData.uLen" selectType="uLen" @lenConfirm="calcBdLW()"></popup-select>
		<van-field v-model="formData.lengthF" input-align="center" label="横向公式" placeholder="待选择箱型" readonly/>
		<van-field v-model="formData.widthF" input-align="center" label="纵向公式" placeholder="待选择箱型" readonly/>
		<van-field label="纸板规格(mm)">
			<div class="van-row van-row--flex van-row--justify-center" slot="input">
				<div class="van-col van-col--8" >
					<input placeholder="板长" v-model="formData.length" style="width:100%;" disabled/>
				</div>
				<div class="van-col van-col--1">
					x
				</div>
				<div class="van-col van-col--8" >
					<input placeholder="板宽" v-model="formData.width" style="width:100%;" disabled/>
				</div>
			</div>
		</van-field>
		<van-field input-align="center" label="压线信息" placeholder="由ERP系统自动计算" readonly/>
		<van-field v-model="formData.bdMultiple" input-align="center" label="张数" placeholder="待选择箱型" readonly right-icon="question-o" @click-right-icon="$toast('正数:几个纸板=>1个纸箱\n负数:1个纸板=>几个纸箱' )"/>
		<van-field v-model="formData.ordQty" input-align="center" label="订单数" placeholder="输入订单数" @blur="calcBdQty()" ref="orderQuantitiesField"/>
		<van-field v-model="formData.bdQty" input-align="center" label="纸板数" placeholder="待计算" readonly/>
		<van-field v-model="formData.area" input-align="center" label="下单面积(㎡)" placeholder="待计算" readonly right-icon="question-o" @click-right-icon="$toast('下单面积范围:' + pageConfig.minArea + '㎡~' + pageConfig.maxArea + '㎡')" />
		<popup-select :selectValue.sync="formData.address" :fieldConfig="config.fieldConfig.address" :radioData="config.radioData.address" selectType="cusInfo"></popup-select>
		<new-time-picker :dateTime.sync="formData.date" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="交货日期" v-if="config.popup.timeFilter.isFinishLoad"></new-time-picker>
		<van-field v-model="formData.deliveryRemark" rows="1" autosize label="送货备注" type="textarea"  maxlength="50" placeholder="填写送货备注" show-word-limit/>
		<van-field v-model="formData.productionRemark" rows="1" autosize label="生产备注" type="textarea"  maxlength="50" placeholder="填写生产备注" show-word-limit/>
		<div style="height:3.5rem;width:100%;"></div>
		<van-submit-bar :price=" formData.cost * 100 " button-text="提交订单" @submit="checkFormData()">
			<div slot="top" style="font-size:1rem;text-align:center;" v-if="formData.isRangePrice">
				当前价格:<span style="color: rgb(224, 24, 53);">¥{{ formData.price }}/㎡</span>
				<van-tag mark type="danger" v-if=" helpInfo.sheetQuantities == 0 && helpInfo.price == 0 ">最低价</van-tag><br/>
				<template  v-if=" helpInfo.sheetQuantities != 0 && helpInfo.price != 0 ">
					订单数满<span style="color: rgb(68, 187, 0); text-decoration: underline; cursor: pointer;font-size:1rem;" @click="maxOrderQty()">{{ helpInfo.sheetQuantities }}</span>价格减至 <span style="color: rgb(224, 24, 53);">¥{{ helpInfo.price }}/㎡</span><br/>
				</template>
				<template>
					节省金额：<span style="color:rgb(224, 24, 53);">¥{{ formData.saveCost }}</span>
				</template>
			</div>
		</van-submit-bar>
		<build-sku :skuShow.sync="config.popup.sku.show" :orderInfo="formData" orderType="c" @saveOrder="saveOrder" :isGroup="true"></build-sku>
		<build-result :resultShow.sync="config.result.show" :isGroup="false" :isSuccess="config.result.isSuccess" @clearFormData="clearFormData()" v-if="config.result.show" :cusOrderId="config.result.cusOrderId"></build-result>
	</div>
</template>
<script>
	import { Image, Field, Toast, CountDown, Tag, Card, SubmitBar } from 'vant';
	import PopupSelect from '@/components/subject/build/PopupSelect.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import BuildSku from '@/components/subject/build/BuildSku.vue';
	import BuildResult from '@/components/subject/build/BuildResult.vue';
	import schema from 'async-validator';
	export default {
		components:{
			[Image.name]: Image,
			[Field.name]: Field,
			[Toast.name]: Toast,
			[CountDown.name]: CountDown,
			[Tag.name]: Tag,
			[Card.name]: Card,
			[SubmitBar.name]: SubmitBar,

			PopupSelect,
			NewTimePicker,
			BuildSku,
			BuildResult
		},
		data(){
			return {
				config : {
					fieldConfig:{
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
						address : {
							label       : '送货公司',
							placeholder : '选择送货公司'
						}
					},
					radioData : {
						boxType : [],
						tonLen  : [],
						uLen    : [],
						address : [],
					},
					popup:{
						timeFilter : {
							isFinishLoad : false
						},
						sku : {
							show : false,
						}
					},
					result : {
						show       : false,
						isSuccess  : false,
						cusOrderId : ''
					}
				},
				cardInfo:{
					boardId      : '',
					title        : '',
					productPrice : '',
					marketPrice  : '',
					pic          : this.$store.state.common.imgUrl + 'groupImg/zwtp.png',
					countDown    :{
						time : 0,
						show : false,
					}
				},
				formData : {
					productId        : '',
					cusOrderId       : '',
					boxType          : '',
					boxLength        : '',
					boxWidth         : '',
					boxHeight        : '',
					tonLen           : '',
					uLen             : '',
					lengthF          : '',
					widthF           : '',
					length           : '',
					width            : '',
					bdMultiple       : '',  //张数
					ordQty           : '',  //订单数
					bdQty            : '',  //纸板数
					area             : '',
					address          : '',
					date             : '',
					deliveryRemark   : '',
					productionRemark : '',
					isRangePrice     : false,
					isValidArea      : false,
					cost             : '',
					price            : '',
					saveCost         : '',
				},
				pageConfig : {
					minDate : '',
					maxDate : '',
					minBoxL : '',
					maxBoxL : '',
					minBoxW : '',
					maxBoxW : '',
					minBoxH : '',
					maxBoxH : '',
					minArea : '',
					maxArea : '',
					lengthF : '',
					widthF  : ''
				},
				helpInfo:{
					sheetQuantities : '',
					price           : '',
				},
				validator : {},
				rules : {
					productId : [
						{ required : true, message : '产品信息不能为空' }
					],
					boxType : [
						{ required:true, message : '请选择箱型' }
					],
					boxLength : [
						{ required:true, message : '请填写箱长' },
						{ validator: (rule, value, callback, source, options)=>{
							let errors;
							if( Number(value) > this.pageConfig.maxBoxL || Number(value) < this.pageConfig.minBoxL){
								errors = '箱长范围:' + this.pageConfig.minBoxL + 'mm~' + this.pageConfig.maxBoxL + 'mm';
							}
							callback(errors);
						} }
					],
					boxWidth : [
						{ required:true, message : '请填写箱宽' },
						{ validator: (rule, value, callback, source, options)=>{
							let errors;
							if( Number(value) > this.pageConfig.maxBoxW || Number(value) < this.pageConfig.minBoxW){
								errors = '箱宽范围:' + this.pageConfig.minBoxW + 'mm~' + this.pageConfig.maxBoxW + 'mm';
							}
							callback(errors);
						} }
					],
					boxHeight : [
						{ required:true, message : '请填写箱高' },
						{ validator: (rule, value, callback, source, options)=>{
							let errors;
							if( Number(value) > this.pageConfig.maxBoxH || Number(value) < this.pageConfig.minBoxH){
								errors = '箱高范围:' + this.pageConfig.minBoxH + 'mm~' + this.pageConfig.maxBoxH + 'mm';
							}
							callback(errors);
						} }
					],
					tonLen : [
						{ required:true, message : '请选择箱舌'  }
					],
					uLen : [
						{ required:true, message : '请选择封箱调整'  }
					],
					length : [
						{ required:true, message : '请填写相关信息获取板长'  }
					],
					width : [
						{ required:true, message : '请填写相关信息获取板宽'  }
					],
					bdQty : [
						{ required:true, message : '请填写相关信息获取纸板数'  }
					],
					area : [
						{ required:true, message : '请填写相关信息获取下单面积'  },
						{ validator: (rule, value, callback, source, options)=>{
							let errors;
							if( Number(value) > this.pageConfig.maxArea || Number(value) < this.pageConfig.minArea){
								errors = '下单面积范围:' + this.pageConfig.minArea + 'mm~' + this.pageConfig.maxArea + 'mm';
							}
							callback(errors);
						} }
					],
					address : [
						{ required:true, message : '请选择送货公司'  },
					],
					date : [
						{ required:true, message : '请选择送货日期'  },
					]
				}
			}
		},
		methods:{
			getConfig( goodsId ){
				let self = this;
				this.$request.client.groupBuying.getCConfig( goodsId ).then(res=>{
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

					self.cardInfo.boardId      = res.result.product_info.BoardId;
					self.cardInfo.title        = res.result.product_info.Title;
					self.cardInfo.productPrice = res.result.product_info.Price;
					self.cardInfo.marketPrice  = res.result.product_info.MarketPrice;

					self.formData.date    = res.result.page_config.BuildDeliveryDate;
					self.formData.address = res.result.ERPId;
					self.formData.tonLen  = res.result.adjust_info.TonLen;
					self.formData.uLen    = res.result.adjust_info.ULen;
					if( res.result.product_info.Pic[0] ){
						self.cardInfo.pic = this.$store.state.common.imgUrl + 'groupImg/' + res.result.product_info.Pic[0];
					}
					if( res.result.product_info.BeginTime * 1000 < (new Date()).valueOf()  ){
						self.cardInfo.countDown.time = res.result.product_info.EndTime * 1000 - (new Date()).valueOf();
					}else{
						self.cardInfo.countDown.time = ( res.result.product_info.EndTime - res.result.product_info.BeginTime ) * 1000;
					}
					res.result.page_config.BuildTonLen.forEach((item,index)=>{
						self.config.radioData.tonLen.push({ value:item, text:''});
					});
					res.result.page_config.BuildULen.forEach((item,index)=>{
						self.config.radioData.uLen.push({ value : item, text: '' })
					});
					res.result.box_type_available.forEach((item,index)=>{
						self.config.radioData.boxType.push({ value : item.BoxId, text:item.BoxName, lengthF:item.LengthF, widthF:item.WidthF });
					});
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
			getBoxFormula( boxType ){
				let self = this;
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
				});
			},
			checkFormData(){
				let self = this;
				this.validator.validate(this.formData).then(()=>{
					self.config.popup.sku.show = true;
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message);
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
					}
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.result.show = true;
					});
				});
			},
			clearFormData(){
				Object.keys( this.formData ).forEach((item,index)=>{
					if( item != 'productId' ){
						this.formData[item] = '';
					}
					if( item == 'isRangePrice' || item == 'isValidArea' ){
						this.formData[item] = false;
					}
				});
			},
			calcBdLW(){
				if(this.formData.boxLength && (this.formData.boxLength < this.pageConfig.minBoxL || this.formData.boxLength > this.pageConfig.maxBoxL)){
                    this.formData.boxLength = '';
                    Toast('箱长范围:' + this.pageConfig.minBoxL + 'mm~' + this.pageConfig.maxBoxL + 'mm');
                }
                if(this.formData.boxWidth && (this.formData.boxWidth < this.pageConfig.minBoxW || this.formData.boxWidth > this.pageConfig.maxBoxW)){
                    this.formData.boxWidth = '';
                    Toast('箱宽范围:' + this.pageConfig.minBoxW + 'mm~' + this.pageConfig.maxBoxW + 'mm');
                }
                if(this.formData.boxHeight && (this.formData.boxHeight < this.pageConfig.minBoxH || this.formData.boxHeight > this.pageConfig.maxBoxH)){
                    this.formData.boxHeight = '';
                    Toast('箱高范围:' + this.pageConfig.minBoxH + 'mm~' + this.pageConfig.maxBoxH + 'mm');
                }
                var LengthF_exp = this.pageConfig.lengthF;
                var WidthF_exp  = this.pageConfig.widthF;
                if(this.formData.boxLength){
                    LengthF_exp = LengthF_exp.replace(/L/g,this.formData.boxLength);
                    WidthF_exp  = WidthF_exp.replace(/L/g,this.formData.boxLength);
                }
                if(this.formData.boxWidth){
                    LengthF_exp = LengthF_exp.replace(/W/g,this.formData.boxWidth);
                    WidthF_exp  = WidthF_exp.replace(/W/g,this.formData.boxWidth);
                }
                if(this.formData.boxHeight){
                    LengthF_exp = LengthF_exp.replace(/H/g,this.formData.boxHeight);
                    WidthF_exp  = WidthF_exp.replace(/H/g,this.formData.boxHeight);
                }
                if(this.formData.tonLen){
                    LengthF_exp = LengthF_exp.replace(/T/g,this.formData.tonLen);
                    WidthF_exp  = WidthF_exp.replace(/T/g,this.formData.tonLen);
                }
                if(this.formData.uLen){
                    LengthF_exp = LengthF_exp.replace(/U/g,this.formData.uLen);
                    WidthF_exp  = WidthF_exp.replace(/U/g,this.formData.uLen);
                }
                this.formData.lengthF = LengthF_exp;
                this.formData.widthF  = WidthF_exp;
                if(LengthF_exp && LengthF_exp.indexOf('L') === -1 && LengthF_exp.indexOf('W') === -1 && LengthF_exp.indexOf('H') === -1 && LengthF_exp.indexOf('T') === -1 && LengthF_exp.indexOf('U') === -1){
                    this.formData.length = Math.round(eval(LengthF_exp.replace(/<\/?.+?>/g,'')));
                }else{
                    this.formData.length = '';
                }
                if(WidthF_exp && WidthF_exp.indexOf('L') === -1 && WidthF_exp.indexOf('W') === -1 && WidthF_exp.indexOf('H') === -1 && WidthF_exp.indexOf('T') === -1 && WidthF_exp.indexOf('U') === -1){
                    this.formData.width = Math.round(eval(WidthF_exp.replace(/<\/?.+?>/g,'')));
                }else{
                    this.formData.width = '';
                }
                this.calcAreaCost();
			},
			calcBdQty(){
				if( /^\d$/.test(this.formData.bdMultiple) && this.formData.ordQty ){
					if(this.formData.bdMultiple > 0){
                        this.formData.bdQty = this.formData.ordQty * this.formData.bdMultiple;
                    }else if(this.formData.bdMultiple < 0){
                        this.formData.bdQty = this.formData.ordQty / this.formData.bdMultiple * -1;
                    }else{
                        this.formData.bdQty = '';
                    }
				}else{
					this.formData.bdQty = '';
				}
				this.calcAreaCost();
			},
			beforeCalcAreaCost(){
				this.formData.isRangePrice    = false;
				this.formData.isValidArea     = false;
				this.formData.area            = '';
				this.formData.cost            = '';
				this.formData.saveCost        = '',
				this.formData.price           = '';
				this.helpInfo.price           = 0;
				this.helpInfo.sheetQuantities = 0;
			},
			calcAreaCost(){
				this.beforeCalcAreaCost();
				if( this.formData.ordQty && !( /(^[1-9]\d*$)/.test(this.formData.ordQty) ) ){
					Toast.fail('订单数错误');
					this.formData.ordQty = '';
					this.formData.bdQty  = '';
					return ;
				}
				if( this.formData.bdQty && !( /(^[1-9]\d*$)/.test(this.formData.bdQty) ) ){
					Toast.fail('纸板数错误');
					this.formData.ordQty = '';
					this.formData.bdQty  = '';
					return ;
				}
				if( typeof( this.formData.length ) === 'number' && typeof( this.formData.width ) === 'number' && this.formData.bdQty ){
					let data = {
						productId       : this.formData.productId,
						sheetQuantities : this.formData.bdQty,
						boardLength     : this.formData.length,
						boardWidth      : this.formData.width
					};
					let self = this;
					this.$request.client.groupBuying.getAreaCost( data ).then(res=>{
						if( res.errorCode != '00000' ){
							self.formData.isValidArea     = false;
							self.formData.isRangePrice    = false;
							self.formData.ordQty          = '';
							self.formData.bdQty           = '';
							self.helpInfo.price           = 0;
							self.helpInfo.sheetQuantities = 0;
							return ;
						}
						self.formData.area = res.result.area_size;
						if( res.result.valid_area == '1' ){
							self.formData.isValidArea = true;
							self.formData.cost        = res.result.cost;
							self.formData.saveCost    = res.result.save_cost;
							if( res.result.is_range_price == '1' ){
								self.formData.isRangePrice    = true;
								self.formData.price           = res.result.price;
								if( res.result.help_info.length != 0 ){
									self.helpInfo.price           = res.result.help_info.price;
									self.helpInfo.sheetQuantities = res.result.help_info.sheet_quantities;
								}
							}else{
								self.formData.isRangePrice    = false;
								self.formData.price           = '';
								self.helpInfo.price           = 0;
								self.helpInfo.sheetQuantities = 0;
							}
						}else{
  							Toast.fail('下单面积范围：' + self.pageConfig.minArea + '㎡~' + self.pageConfig.maxArea + '㎡');
  							self.formData.isValidArea     = false;
  							self.formData.orderQuantities = 0;
  							self.formData.area            = 0
						}
					});
				}
			},
			maxOrderQty(){
				this.formData.orderQuantities = this.getOrdQtyByBdQty( this.helpInfo.sheetQuantities );
				this.$refs.orderQuantitiesField.focus();
			},
			getOrdQtyByBdQty( bdQty ){
				if(this.formData.bdMultiple > 0){
                    return bdQty / this.formData.bdMultiple;
                }else if(this.formData.bdMultiple < 0){
                    return bdQty * this.formData.bdMultiple * -1;
                }
			}
		},
		created(){
			this.$store.commit('common/setTitle','纸箱纸板下单');
		},
		mounted(){
			if( typeof(this.$route.params.productId) != 'undefined' ){
				this.formData.productId = this.$route.params.productId ;
			}else if( sessionStorage.getItem('group-product-id') != null ){
				this.formData.productId = sessionStorage.getItem('group-product-id');
			}else{
				this.$router.go(-1);
			}
			this.getConfig( this.formData.productId );
			this.validator = new schema( this.rules );
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