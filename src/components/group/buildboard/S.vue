<template>
	<div>
		<van-card>
			<div slot="title">
				{{ pageConfig.boardId }}
				<span style="color:#000;" v-if="pageConfig.title">,{{ pageConfig.title }}</span>
			</div>
			<van-count-down :time="config.countDown.time" slot="desc" v-if="config.countDown.show">
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
				<span class="group-card-price-text">¥{{ pageConfig.productPrice }}</span>
				/㎡
			</div>
			<div slot="origin-price">¥{{ pageConfig.marketPrice }}/㎡</div>
			<van-image 
				:src="pageConfig.pic" 
				slot="thumb" 
				width="85" 
				height="85"
			/>
		</van-card>
		<van-field v-model="formData.cusOrderId" label="客订单号" input-align="center" placeholder="未填写则系统自动生成"></van-field>
		<div class="van-cell" style="display: flex;align-items: center;">
			<div class="van-cell__title van-field__label">纸板(mm)</div>
			<input id="boardLength" type="number" class="karry-input" placeholder="长" v-model="formData.boardLength" @focus="inputFocus('boardLength')" @blur=" inputBlur('boardLength') "/>
			<div style="margin-left:0.2rem;margin-right:0.2rem;">x</div>
			<input id="boardWidth" type="number" class="karry-input" placeholder="宽" v-model="formData.boardWidth" @focus="inputFocus('boardWidth')" @blur=" inputBlur('boardWidth') "/>
			<div class="van-field__right-icon">
				<van-icon name="question-o" @click="$toast('板长范围:' + pageConfig.minLength + 'mm~' + pageConfig.maxLength + 'mm\n板宽范围:' + pageConfig.minWidth + 'mm~' + pageConfig.maxWidth + 'mm')"/>
			</div>
		</div>
		<uni-check-box
			label="压线压型"
			:localdata="config.radioData.lineBall"
			:radioData.sync="formData.lineBallInfo" 
			:map="{text: 'text', value: 'value'}"
			@change="lineBallChange"
		>
		</uni-check-box>
		<!-- <popup-select :selectValue.sync="formData.lineBallInfo" :fieldConfig="config.fieldConfig.lineBall" :radioData="config.radioData.lineBall" selectType="lineBall" @valueChange="lineBallChange"></popup-select> -->
		<van-field v-model="formData.lineBallFormula" input-align="center" label="压线信息" placeholder="压线和=板宽(格式:x+x+x)"/>
		<van-field v-model="formData.orderQuantities" input-align="center" type="number" label="订单数" placeholder="输入订单数"  @focus="inputFocus()" @blur=" inputBlur() " ref="orderQuantitiesField"/>
		<van-field v-model="formData.area" clearable readonly input-align="center" label="下单面积(㎡)" placeholder="待计算" right-icon="question-o" @click-right-icon="$toast('下单面积范围:' + pageConfig.minArea + '㎡~' + pageConfig.maxArea + '㎡')">
		</van-field>
		<popup-select :selectValue.sync="formData.address" :fieldConfig="config.fieldConfig.cusInfo" :radioData="config.radioData.cusInfo" selectType="cusInfo" @valueChange="addressChange"></popup-select>
		<new-time-picker :dateTime.sync="formData.date" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="交货日期" v-if="config.popup.timeFilter.isFinishLoad"></new-time-picker>
		<van-field v-if="config.showDeliveryRemark == 1" v-model="formData.deliveryRemark" rows="1" autosize label="送货备注" type="textarea"  maxlength="50" placeholder="填写送货备注" show-word-limit/>
		<van-field v-model="formData.productionRemark" rows="1" autosize label="生产备注" type="textarea"  maxlength="50" placeholder="填写生产备注" show-word-limit/>
		<div style="height:5.5rem;width:100%;"></div>
		<van-submit-bar :price=" formData.cost * 100 " button-text="提交订单" @submit="checkFormData()">
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
			<!-- <div slot="top" style="font-size:1rem;text-align:center;">
				<template v-if="formData.isRangePrice">
					当前价格:<span style="color: rgb(224, 24, 53);">¥{{ formData.price }}/㎡</span>
					<van-tag mark type="danger" v-if=" helpInfo.sheetQuantities == 0 && helpInfo.price == 0 ">最低价</van-tag><br/>
					<template  v-if=" helpInfo.sheetQuantities != 0 && helpInfo.price != 0 ">
						订单数满<span style="color: rgb(68, 187, 0); text-decoration: underline; cursor: pointer;font-size:1rem;" @click="maxOrderQty()">{{ helpInfo.sheetQuantities }}</span>价格减至 <span style="color: rgb(224, 24, 53);">¥{{ helpInfo.price }}/㎡</span><br/>
					</template>
				</template>
				<template>
					节省金额：<span style="color:rgb(224, 24, 53);">¥{{ formData.saveCost }}</span>
				</template>
			</div> -->
		</van-submit-bar>
		<build-sku :skuShow.sync="config.popup.sku.show" :orderInfo="formData" orderType="s" @saveOrder="saveOrder" :isGroup="true"></build-sku>
		<build-result 
			v-if="config.result.show" 
			:resultShow.sync="config.result.show" 
			:isGroup.sync="config.result.isGroup" 
			:isSuccess="config.result.isSuccess" 
			:isPay="pageConfig.directCreditPay == 1 && pageConfig.useCreditPay == 1"
			:cusOrderId="config.result.cusOrderId" 
			:failMsg="config.result.failMsg"
			@clearFormData="clearFormData()"
		>
		</build-result>
	</div>
</template>
<script>
	import { Image, Field, Dialog, Toast, CountDown, Tag, Card, SubmitBar  } from 'vant';
	import PopupSelect from '@/components/subject/build/PopupSelect.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import BuildSku from '@/components/subject/build/BuildSku.vue';
	import BuildResult from '@/components/subject/build/BuildResult.vue';
	import schema from 'async-validator';

	import UniCheckBox from '@/components/subject/checkbox/UniCheckBox.vue'
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
					fieldConfig: {
						lineBall : {
							label       : '压型名称', //压线名称
							placeholder : '选择压型名称' //选择压线名称
						},
						cusInfo : {
							label       : '送货公司',
							placeholder : '选择送货公司'
						}
					},
					radioData : {
						lineBall : [],
						cusInfo  : []
					},
					popup:{
						timeFilter : {
							isFinishLoad : false
						},
						sku:{
							show : false
						}
					},
					countDown:{
						time : 0,              //倒计时
						show : false
					},
					result : {
						show       : false,
						isSuccess  : false,
						cusOrderId : '',
						isGroup    : false,
						failMsg    : '下单失败'
					},
					showDeliveryRemark:0
				},
				formData : {
					productId       : '',      //产品ID
					cusOrderId      : '',
					boardLength     : '',      //板长
					boardWidth      : '',	   //板宽
					lineBallInfo    : '',      //压线名称
					lineBallFormula : '',      //压线公式
					orderQuantities : '',      //订单数量
					area            : 0,       //下单面积
					address         : '',      //送货公司
					date            : '',      //送货时间
					deliveryRemark  : '',      //送货备注
					productionRemark: '',      //生产备注
					cost            : 0,       //订单金额
					saveCost        : 0,       //订单节省金额
					isRangePrice    : false,   //是否是区间价格
					isValidArea     : false,   //是否是可用面积
					price           : '',      //订单单价
				},
				pageConfig : {
					minDate   : '',
					maxDate   : '',
					minLength : 0,
					maxLength : 0,
					minWidth  : 0,
					maxWidth  : 0,
					minArea   : 0,
					maxArea   : 0,
					pic       : null,
					productPrice : '',
					marketPrice  : '',
					title        : '',
					boardId      : '',
					useCreditPay: 0,
					directCreditPay: 0,
				},
				helpInfo:{
					price           : 0,
					sheetQuantities : 0
				},
				cardInfo : {

				},
				validator : {},
				rules : {
					boardLength : [
						{ required : true, message:'请输入板长' },
						{ validator: (rule, value, callback, source, options)=>{
							let errors;
							if( Number(value) > this.pageConfig.maxLength || Number(value) < this.pageConfig.minLength){
								errors = '板长范围:' + this.pageConfig.minLength + 'mm~' + this.pageConfig.maxLength + 'mm';
								this.formData.boardLength = null;
							}
							callback(errors);
						}}
					],
					boardWidth : [
						{ required : true, message:'请输入板宽' },
						{ validator: (rule, value, callback, source, options)=>{
							let errors;
							if( Number(value) > this.pageConfig.maxWidth || Number(value) < this.pageConfig.minWidth){
								errors = '板宽范围:' + this.pageConfig.minWidth + 'mm~' + this.pageConfig.maxWidth + 'mm';
								this.formData.boardWidth = null;
							}
							callback(errors);
						}}
					],
					lineBallInfo : [
						{ required : true, message: '请选择压线名称' },
						{ validator: (rule, value, callback, source, options)=>{
							let errors;
							var checked = false;
							for (var i = this.config.radioData.lineBall.length - 1; i >= 0; i--) {
								if( this.config.radioData.lineBall[i].value == value ){
									checked = true;
									break;
								}
							}
							if( !checked ){
								errors = '非法压线名称';
							}
							callback(errors);
						} }
					],
					lineBallFormula : [
						{ pattern : '\\\d+([.]{1}[5]{1}){0,1}(\\\+\\\d+([.]{1}[5]{1}){0,1})+$', message : '压线信息错误' },
						{ validator : (rule, value, callback, source, options)=>{
							let errors;
							if( this.formData.lineBallInfo != '无压线' && value == '' ){
								errors = '请填写压线信息';
							}
							if( this.formData.lineBallInfo != '无压线' && ( Number( this.formData.boardWidth ) !=  eval(value) ) ){
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
				}
			}
		},
		methods:{
			getConfig( goodsId ){
				let self = this;
				
				this.config.radioData.lineBall = [];
				this.config.radioData.cusInfo = [];

				this.$request.client.groupBuying.getSConfig( goodsId ).then(res=>{
					if( res.errorCode == '20260' ){
						Dialog.alert({
							message:res.msg
						}).then(()=>{
							self.$router.push('/group/board/lists'); 
						});
						return ;
					}
					if( res.result.page_config.UseAliPay == 1 || res.result.page_config.UseWxPay == 1 ){
						self.config.result.isGroup =  true;
					}
					self.pageConfig.minDate   = res.result.page_config.BuildMinDate;
					self.pageConfig.maxDate   = res.result.page_config.BuildMaxDate;
					self.pageConfig.minLength = res.result.page_config.BuildMinLength;
					self.pageConfig.maxLength = res.result.page_config.BuildMaxLength;
					self.pageConfig.minWidth  = res.result.page_config.BuildMinWidth;
					self.pageConfig.maxWidth  = res.result.page_config.BuildMaxWidth;
					self.pageConfig.useCreditPay = res.result.page_config.UseCreditPay
					self.pageConfig.directCreditPay =  res.result.page_config.DirectCreditPay

					self.formData.date = res.result.page_config.BuildDeliveryDate;
					res.result.page_config.BuildScoreName.forEach((item,index)=>{
						self.config.radioData.lineBall.push( { value:item, text: item } );
					});
					self.formData.lineBallInfo = res.result.page_config.DefaultScoreName ? res.result.page_config.DefaultScoreName : self.config.radioData.lineBall[0].value;
					res.result.cus_info.forEach((item,index)=>{
						self.config.radioData.cusInfo.push( { value : item.CusSubNo, text:item.SubDNAddress} );
					});
					self.formData.address   = res.result.ERPId;
					self.pageConfig.minArea = res.result.product_info.BuildMin;
					self.pageConfig.maxArea = res.result.product_info.BuildMax;
					if( res.result.product_info.BeginTime * 1000 < (new Date()).valueOf()  ){
						self.config.countDown.time = res.result.product_info.EndTime * 1000 - (new Date()).valueOf();
					}else{
						self.config.countDown.time = ( res.result.product_info.EndTime - res.result.product_info.BeginTime ) * 1000;
					}
					self.pageConfig.pic = res.result.product_info.Pic
					self.pageConfig.productPrice = res.result.product_info.Price;
					self.pageConfig.marketPrice  = res.result.product_info.MarketPrice;
					self.pageConfig.title        = res.result.product_info.Title;
					self.pageConfig.boardId      = res.result.product_info.BoardId;

					self.config.showDeliveryRemark = res.result.page_config.ShowDeliveryRemark
				}).then(()=>{
					this.$nextTick(()=>{
						self.config.countDown.show = true;
						this.config.popup.timeFilter.isFinishLoad = true;
					});
				});
			},
			beforeGetAreaCost(){
				this.formData.area            = 0;
				this.formData.isValidArea     = false;
				this.formData.cost            = 0;
				this.formData.saveCost        = 0;
				this.formData.isRangePrice    = false;
				this.formData.price           = 0;
				this.helpInfo.price           = 0;
				this.helpInfo.sheetQuantities = 0;
			},
			getAreaCost(){
				this.beforeGetAreaCost();
				if( Number(this.formData.boardLength) && ( Number(this.formData.boardLength) < Number(this.pageConfig.minLength) || Number(this.formData.boardLength) > Number(this.pageConfig.maxLength) )){
					this.formData.boardLength = 0;
					Toast.fail('板长范围' + this.pageConfig.minLength + 'mm~' + this.pageConfig.maxLength + 'mm');
					return ;
				}
				if( Number(this.formData.boardWidth) && ( Number(this.formData.boardWidth) < Number(this.pageConfig.minWidth) || Number(this.formData.boardWidth) > Number(this.pageConfig.maxWidth) ) ){
					this.formData.boardWidth = 0;
					Toast.fail('板宽范围' + this.pageConfig.minWidth + 'mm~' + this.pageConfig.maxWidth + 'mm');
					return ;
				}
				if( this.formData.orderQuantities && !( /^[0-9]\d{0,6}$/.test(this.formData.orderQuantities) ) ){
					this.formData.area = 0;
					this.formData.orderQuantities = 0;
					Toast.fail('订单数错误');
					return ;
				}
				if( this.formData.boardLength && this.formData.boardWidth && this.formData.orderQuantities ){
					let data = {
						productId       : this.formData.productId,
						orderQuantities : this.formData.orderQuantities,
						boardLength     : this.formData.boardLength,
						boardWidth      : this.formData.boardWidth
					};
					let self = this;
					this.$request.client.groupBuying.getAreaCost( data ).then(res=>{
						if( res.errorCode != '00000' ){
							self.formData.orderQuantities = '';
							self.formData.isRangePrice    = false;
							self.formData.isValidArea     = false;
							self.formData.price           = 0;
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
								self.formData.price           = 0;
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
			getOrdQtyByBdQty( bdQty ){
				return bdQty;
			},
			maxOrderQty(){
				this.formData.orderQuantities = this.getOrdQtyByBdQty( this.helpInfo.sheetQuantities );
				this.$refs.orderQuantitiesField.focus();
			},
			checkFormData(){
				let self = this;
				this.validator.validate(this.formData).then(()=>{
					self.checkData(self.formData);
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message);
				});
			},
			checkData( postData ){
				let self = this;
				this.$request.client.groupBuying.sCheck( postData ).then(res=>{
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
				this.$request.client.groupBuying.sGroupBooking( postData ).then(res=>{
					if( res.errorCode == '00000' ){
						Toast.success(res.result.order_id);
						self.config.result.cusOrderId = res.result.order_id;
						self.config.result.isSuccess  = true;
					}else{
						self.config.result.isSuccess = false;
						self.config.result.failMsg = res.msg;
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
				this.getConfig( this.formData.productId );
			},
			lineBallChange(  e ){
				this.formData.lineBallInfo = e.detail.value
			},
			addressChange( newValue ){
				this.formData.address = newValue;
			},
			inputFocus(){
				const ua = window.navigator.userAgent.toLocaleLowerCase();
				const isAndroid = /android/.test(ua);
				let that = this;
				if( isAndroid ){
					window.onresize = () => {
						const curClientHeight = document.documentElement.clientHeight;
						//安卓键盘收起
						if (curClientHeight >= that.config.initClientHeight) {
							that.getAreaCost();
							window.onresize = null;
						}
					}
				}
			},
			inputBlur(){
				/*const ua = window.navigator.userAgent.toLocaleLowerCase();
				const isAndroid = /android/.test(ua);
				if (isAndroid)
					return */
				this.getAreaCost();
			}
		},
		async created(){
			await this.$store.commit('client/setHeaderTitle', '简单纸板下单')
			await this.$store.commit('client/setTabbarActive', 'group')
			document.documentElement.scrollTop = 0;
		},
		mounted(){
			if( this.$route.query ){
				this.formData.productId = this.$route.query.productId
				this.$store.commit('client/setBackPath', '/mall/product/detail?productId=' + this.$route.query.productId)
				this.$store.commit('client/setLoginRedirect', '/group/build/s?productId=' + this.$route.query.productId)
			}else if( sessionStorage.getItem('group-product-id') != null ){
				this.formData.productId = sessionStorage.getItem('group-product-id');
				this.$store.commit('client/setBackPath', '/mall/product/detail?productId=' + this.formData.productId)
				this.$store.commit('client/setLoginRedirect', '/group/build/s?productId=' + this.formData.productId)
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
<style>
	.build-item{
		width: 2.5625rem;
		color: #fff;
		font-size: 1rem;
		text-align: center;
		background-color: #ee0a24;
		border-radius: 0.1875rem;
	}

	.group-card-price-text {
    	font-size: 1.25rem;
    }
</style>
