<template>
	<div>
		<van-card>
			<div slot="title">-323B/BA</div>
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
			<div slot="price">¥{{ pageConfig.productPrice }}/㎡</div>
			<div slot="origin-price">¥{{ pageConfig.marketPrice }}/㎡</div>
			<van-image :src="pageConfig.pic" slot="thumb"/>
		</van-card>
		<van-field v-model="formData.cusOrderId" label="客订单号" input-align="center" placeholder="未填写则系统自动生成"></van-field>
		<van-field clearable label="纸板规格(mm)" right-icon="question-o" @click-right-icon="$toast('板长范围:' + pageConfig.minLength + 'mm~' + pageConfig.maxLength + 'mm\n板宽范围:' + pageConfig.minWidth + 'mm~' + pageConfig.maxWidth + 'mm')">
			<div class="van-row van-row--flex van-row--justify-center" slot="input">
				<div class="van-col van-col--8">
					<input type="number" placeholder="板长" v-model="formData.boardLength" class="van-field__control van-field__control--center" style="border:1px solid #000;" @blur="getAreaCost()"/>
				</div>
				<div class="van-col van-col--3" style="text-align:center;">
					x 
				</div>
				<div class="van-col van-col--8">
					<input type="number" placeholder="板宽" v-model="formData.boardWidth" class="van-field__control van-field__control--center" style="border:1px solid #000;" @blur="getAreaCost()"/>
				</div>
			</div>
		</van-field>
		<popup-select :selectValue.sync="formData.lineBallInfo" :fieldConfig="config.fieldConfig.lineBall" :radioData="config.radioData.lineBall" selectType="lineBall"></popup-select>
		<van-field v-model="formData.lineBallFormula" input-align="center" label="压线信息" placeholder="压线和=板宽(格式:x+x+x)"/>
		<van-field v-model="formData.orderQuantities" input-align="center" type="number" label="订单数" placeholder="输入订单数" @blur="getAreaCost()" ref="orderQuantitiesField"/>
		<van-field v-model="formData.area" clearable readonly input-align="center" label="下单面积(㎡)" placeholder="待计算" right-icon="question-o" @click-right-icon="$toast('下单面积范围:' + pageConfig.minArea + '㎡~' + pageConfig.maxArea + '㎡')">
		</van-field>
		<popup-select :selectValue.sync="formData.address" :fieldConfig="config.fieldConfig.cusInfo" :radioData="config.radioData.cusInfo" selectType="cusInfo"></popup-select>
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
		<build-sku :skuShow.sync="config.popup.sku.show" :orderInfo="formData" orderType="s" @saveOrder="saveOrder" :isGroup="true"></build-sku>
		<build-result :resultShow.sync="config.result.show" :isGroup="true" :isSuccess="config.result.isSuccess" @clearFormData="clearFormData()" v-if="config.result.show" :cusOrderId="config.result.cusOrderId"></build-result>
	</div>
</template>
<script>
	import { Image, Field, Toast, CountDown, Tag, Card, SubmitBar  } from 'vant';
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
					fieldConfig: {
						lineBall : {
							label       : '压线名称',
							placeholder : '选择压线名称'
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
						cusOrderId : ''
					}
				},
				formData : {
					productId       : '',      //产品ID
					cusOrderId      : '',
					boardLength     : '1000',      //板长
					boardWidth      : '1000',	   //板宽
					lineBallInfo    : '压线1',      //压线名称
					lineBallFormula : '100+800+100',      //压线公式
					orderQuantities : '2000',      //订单数量
					area            : 0,       //下单面积
					address         : 'CGC',      //送货公司
					date            : '2019-12-25',      //送货时间
					deliveryRemark  : '123',      //送货备注
					productionRemark: '123',      //生产备注
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
					pic       : require('@/assets/groupImg/zwtp.png'),
					productPrice : '',
					marketPrice  : ''
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
						{ required : true, message: '请填写压线信息' },
						{ pattern : '\\\d+([.]{1}[5]{1}){0,1}(\\\+\\\d+([.]{1}[5]{1}){0,1})+$', message : '压线信息错误' },
						{ validator : (rule, value, callback, source, options)=>{
							let errors;
							if( Number( this.formData.boardWidth ) !=  eval(value) ){
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
				this.$request.client.groupBuying.getSConfig( goodsId ).then(res=>{
					console.log(res)
					self.pageConfig.minDate   = res.result.page_config.BuildMinDate;
					self.pageConfig.maxDate   = res.result.page_config.BuildMaxDate;
					self.pageConfig.minLength = res.result.page_config.BuildMinLength;
					self.pageConfig.maxLength = res.result.page_config.BuildMaxLength;
					self.pageConfig.minWidth  = res.result.page_config.BuildMinWidth;
					self.pageConfig.maxWidth  = res.result.page_config.BuildMaxWidth;
					self.formData.date = res.result.page_config.BuildDeliveryDate;
					res.result.page_config.BuildScoreName.forEach((item,index)=>{
						self.config.radioData.lineBall.push( { value:item, text:'' } );
					});
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
					if( res.result.product_info.Pic[0] ){
						self.pageConfig.pic = require('@/assets/groupImg/' + res.result.product_info.Pic[0]);
					}
					self.pageConfig.productPrice = res.result.product_info.Price;
					self.pageConfig.marketPrice  = res.result.product_info.MarketPrice;
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
				if( this.formData.boardLength && ( this.formData.boardLength < this.pageConfig.minLength || this.formData.boardLength > this.pageConfig.maxLength )){
					this.formData.boardLength = 0;
					Toast.fail('板长范围' + this.pageConfig.minLength + 'mm~' + this.pageConfig.maxLength + 'mm');
					return ;
				}
				if( this.formData.boardWidth && ( this.formData.boardWidth < this.pageConfig.minWidth || this.formData.boardWidth > this.pageConfig.maxWidth ) ){
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
						productId       : 5 ,
						orderQuantities : this.formData.orderQuantities,
						boardLength     : this.formData.boardLength,
						boardWidth      : this.formData.boardWidth
					};
					let self = this;
					this.$request.client.groupBuying.getAreaCost( data ).then(res=>{
						console.log(res)
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
					self.config.popup.sku.show = true;
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message);
				});;
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
					}
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.result.show = true;
					});
				});
			},
			clearFormData(){
				Object.keys( this.formData ).forEach((item,index)=>{
					this.formData[item] = '';
					if( item == 'isRangePrice' || item == 'isValidArea' ){
						this.formData[item] = false;
					}
				});
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','简单纸板下单');
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
<style>
	.build-item{
		width: 2.5625rem;
		color: #fff;
		font-size: 1rem;
		text-align: center;
		background-color: #ee0a24;
		border-radius: 0.1875rem;
		/* margin-right: 0.3125rem; */
	}
</style>
