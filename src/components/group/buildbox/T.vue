<template>
	<div>
		<van-card>
			<div slot="title">
				{{ cardInfo.matNo }}
				<span style="color:#000;" v-if="cardInfo.title">,{{ cardInfo.title }}</span>
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
			<div slot="price">¥{{ cardInfo.productPrice }}/㎡</div>
			<div slot="origin-price">¥{{ cardInfo.marketPrice }}/㎡</div>
			<van-image :src="cardInfo.pic" slot="thumb"/>
		</van-card>
		<van-field v-model="formData.cusOrderId" label="客订单号" input-align="center" placeholder="未填写则系统自动生成"></van-field>
		<van-field v-model="formData.poN" label="PO号" input-align="center" placeholder="输入PO号"></van-field>
		<van-field v-model="formData.orderQuantities" input-align="center" type="number" label="订单数" placeholder="输入订单数" right-icon="question-o" @click-right-icon="$toast('订单数范围:' + pageConfig.minQty + '~' + pageConfig.maxQty )" ref="orderQuantitiesField" @blur="getBoxCost()"></van-field>
		<popup-select :selectValue.sync="formData.address" :fieldConfig="config.fieldConfig.address" :radioData="config.radioData.address" selectType="cusInfo"></popup-select>
		<new-time-picker :dateTime.sync="formData.date" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="交货日期" v-if="config.popup.timeFilter.isFinishLoad"></new-time-picker>
		<van-field v-model="formData.deliveryRemark" rows="1" autosize label="送货备注" type="textarea"  maxlength="50" placeholder="填写送货备注" show-word-limit/>
		<van-field v-model="formData.productionRemark" rows="1" autosize label="生产备注" type="textarea"  maxlength="50" placeholder="填写生产备注" show-word-limit/>
		<div style="height:3.5rem;width:100%;"></div>
		<van-submit-bar :price=" formData.cost * 100 " button-text="提交订单" @submit="checkFormData()">
			<div slot="top" style="font-size:1rem;text-align:center;" >
				<template v-if="formData.isRangePrice">
				当前价格:<span style="color: rgb(224, 24, 53);">¥{{ formData.price }}/个</span>
					<van-tag mark type="danger">最低价</van-tag><br/>
					<template v-for="(item,index) in helpInfo">
						订单数满<span style="color: rgb(68, 187, 0); text-decoration: underline; cursor: pointer;font-size:1rem;" @click="maxOrderQty( item.qty )">{{ item.qty }}</span>价格减至 <span style="color: rgb(224, 24, 53);">¥{{ item.price }}/个</span><br/>
					</template>
				</template>
				<template>
					节省金额：<span style="color:rgb(224, 24, 53);">¥{{ formData.saveCost }}</span>
				</template>
			</div>
		</van-submit-bar>
		<build-sku :skuShow.sync="config.popup.sku.show" :orderInfo="formData" orderType="t" @saveOrder="saveOrder" :isGroup="true"></build-sku>
		<build-result :resultShow.sync="config.result.show" :isGroup.sync="config.result.isGroup" :isSuccess="config.result.isSuccess" @clearFormData="clearFormData()" v-if="config.result.show" :cusOrderId="config.result.cusOrderId" :failMsg="config.result.failMsg"></build-result>
	</div>
</template>
<script>
	import { Image, Field, Dialog, Toast, CountDown, Tag, Card, SubmitBar } from 'vant';
	import PopupSelect from '@/components/subject/build/PopupSelect.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import BuildSku from '@/components/subject/build/BuildSku.vue';
	import BuildResult from '@/components/subject/build/BuildResult.vue';
	import schema from 'async-validator';
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
			BuildResult
		},
		data(){
			return {
				config:{
					countDown : {
						time : 0,
						show : false
					},
					fieldConfig :{
						address : {
							label       : '送货公司',
							placeholder : '选择送货公司'
						}
					},
					radioData : {
						address : []
					},
					popup : {
						timeFilter : {
							isFinishLoad : false
						},
						sku : {
							show : false
						},
					},
					result : {
						show    : false,
						isGroup :false,
						failMsg :'下单失败'
					}
				},
				formData:{
					cusOrderId      : '',
					productId       : '',
					poN             : '',
					orderQuantities : 0,
					address         : '',
					date            : '',
					deliveryRemark  : '',
					productionRemark: '',
					cost            : 0,
					price           : 0,
					saveCost        : 0,
					isRangePrice    : false
				},
				cardInfo : {
					matNo        : '',
					title        : '',
					productPrice : '',
					marketPrice  : '',
					pic          : window.jpdn_domain_imgDomain + 'zwtp.png',
				},
				pageConfig : {
					minQty  : 0,
					maxQty  : 0,
					minDate : '',
					maxDate : ''
				},
				helpInfo:{},
				result : {
					cusOrderId : '',
					isSuccess  : false
				},
				validator : {},
				rules:{
					productId : [
						{ required : true, message : '产品信息不能为空' }
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

				this.config.radioData.address = [];

				this.$request.client.groupBuying.getTConfig( goodsId ).then(res=>{
					if( res.errorCode == '20260' ){
						Dialog.alert({
							message:res.msg
						}).then(()=>{
							self.$router.push('/group/box/lists'); 
						});
						return ;
					}
					if( res.errorCode == '00000' ){
						self.cardInfo.matNo        = res.result.product_info.MatNo;
						self.cardInfo.title        = res.result.product_info.Title;
						self.cardInfo.productPrice = res.result.product_info.Price;
						self.cardInfo.marketPrice  = res.result.product_info.MarketPrice;
						if( res.result.product_info.Pic[0] ){
							self.cardInfo.pic = window.jpdn_domain_imgDomain + res.result.product_info.Pic[0];
						}
						self.pageConfig.minQty = parseInt(res.result.product_info.BuildMin);
						self.pageConfig.maxQty = parseInt(res.result.product_info.BuildMax);
						if( res.result.page_config.UseAliPay == 1 || res.result.page_config.UseWxPay == 1 ){
							self.config.result.isGroup = true;
						}
						self.pageConfig.minDate = res.result.page_config.BuildMinDate;
						self.pageConfig.maxDate = res.result.page_config.BuildMaxDate;
						self.formData.date      = res.result.page_config.BuildDeliveryDate;
						if( res.result.product_info.BeginTime * 1000 < (new Date()).valueOf()  ){
							self.config.countDown.time = res.result.product_info.EndTime * 1000 - (new Date()).valueOf();
						}else{
							self.config.countDown.time = ( res.result.product_info.EndTime - res.result.product_info.BeginTime ) * 1000;
						}
						res.result.cus_info.forEach((item,index)=>{
							self.config.radioData.address.push({ value : item.CusSubNo, text:item.SubDNAddress})
						});
						self.formData.address = res.result.ERPId;
					}
				}).then(()=>{
					this.$nextTick(()=>{
						self.config.countDown.show = true;
						this.config.popup.timeFilter.isFinishLoad = true;
					});
				});
			},
			getBoxCost(){
				if( !(/(^[1-9]\d*$)/.test(this.formData.orderQuantities)) ){
					Toast.fail('订单数错误' );
					this.$refs.orderQuantitiesField.focus();
					this.formData.orderQuantities = 0;
					return ;
				}
				if( this.formData.orderQuantities > Number(this.pageConfig.maxQty) || this.formData.orderQuantities < Number(this.pageConfig.minQty) ){
					Toast.fail('订单数范围:' + this.pageConfig.minQty + '~' + this.pageConfig.maxQty );
					this.$refs.orderQuantitiesField.focus();
					this.formData.orderQuantities = 0;
					return ;
				}
				let self = this;
				this.$request.client.groupBuying.getBoxCost( this.formData ).then(res=>{
					if( res.errorCode == '00000' ){
						if( res.result.valid_qty == '1' ){
							self.formData.cost     = res.result.cost;
							self.formData.price    = res.result.price;
							self.formData.saveCost = res.result.save_cost
							if( res.result.is_range_price == '1' ){
								self.formData.isRangePrice = true;
							}
							if( res.result.help_info.length != 0 ){
								self.helpInfo = res.result.help_info;
							}
						}
					}
				});
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
				this.$request.client.groupBuying.tCheck( postData ).then(res=>{
					if( res.errorCode == '00000' ){
						self.config.popup.sku.show = true;
					}
				});
			},
			maxOrderQty( qty ){
				this.formData.orderQuantities = qty;
				this.getBoxCost();
			},
			saveOrder( postData ){
				let self = this;
				this.$request.client.groupBuying.tGroupBooking( postData ).then(res=>{
					if( res.errorCode == '00000' ){
						Toast.success(res.result.order_id);
						self.config.result.cusOrderId = res.result.order_id;
						self.config.result.isSuccess  = true;
					}else{
						self.config.result.isSuccess  = false;
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
					if( item == 'isRangePrice' ){
						this.formData[item] = false;
					}
					if( item == 'orderQuantities' || item == 'cost' || item == 'saveCost' || item == 'price' ){
						this.formData[item] = 0;
					}
				});
				this.getConfig( this.formData.productId );
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','淘宝箱下单');
			document.documentElement.scrollTop = 0;
		},
		mounted(){
			if( typeof(this.$route.params.productId) != 'undefined' ){
				this.formData.productId = this.$route.params.productId ;
			}else if( sessionStorage.getItem('group-product-id') != null ){
				this.formData.productId = sessionStorage.getItem('group-product-id');
			}else{
				this.$router.go(-1);
			}
			if( !this.$store.state.client.isLogin ){
				this.$store.commit('client/setLoginRedirect','/group/box/detail')
				this.$router.replace('/group/client/login');
				return 
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