<template>
	<div>
		<van-field v-model="formData.cusOrderId" input-align="center" label="客订单号" placeholder="未填写则系统自动生成"/>
		<van-field v-model="formData.pON" input-align="center" label="PO号" placeholder="输入PO号"/>
		<popup-select :selectValue.sync="formData.productId" :fieldConfig="config.fieldConfig.productId" :radioData="config.radioData.productId" selectType="productName" @valueChange="productIdChange"></popup-select>
		<van-field v-model="formData.orderQuantities" input-align="center" label="订单数" placeholder="输入订单数" type="number" right-icon="question-o" @click-right-icon="clickQuestion()" />
		<popup-select :selectValue.sync="formData.address" :fieldConfig="config.fieldConfig.address" :radioData="config.radioData.address" selectType="cusInfo"  @valueChange="addressChange"></popup-select>
		<new-time-picker :dateTime.sync="formData.date" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="交货日期" v-if="config.popup.timeFilter.isFinishLoad"></new-time-picker>
		<van-field v-if="config.showDeliveryRemark == 1" v-model="formData.deliveryRemark" rows="1" autosize label="送货备注" type="textarea"  maxlength="50" placeholder="填写送货备注" show-word-limit/>
		<van-field v-model="formData.productionRemark" rows="1" autosize label="生产备注" type="textarea"  maxlength="50" placeholder="填写生产备注" show-word-limit/>
		<van-button  type="primary" size="normal" style="width:100%;" @click="buildOrder()">下单</van-button>
		<build-sku :skuShow.sync="config.popup.sku.show" :orderInfo="formData" orderType="x" @saveOrder="saveOrder" :isGroup="false"></build-sku>
		<build-result :resultShow.sync="config.result.show" :isGroup="false" :isSuccess="config.result.isSuccess" @clearFormData="clearFormData()" v-if="config.result.show" :cusOrderId="config.result.cusOrderId" :failMsg="config.result.failMsg"></build-result>
	</div>
</template>
<script>
	import { Button, Field, Dialog, Toast } from 'vant';
	import PopupSelect from '@/components/subject/build/PopupSelect.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import BuildSku from '@/components/subject/build/BuildSku.vue';
	import BuildResult from '@/components/subject/build/BuildResult.vue';
	import schema from 'async-validator';
	import { checkBuildTime } from '@/util';
	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,
			[Toast.name]: Toast,

			PopupSelect,
			NewTimePicker,
			BuildSku,
			BuildResult
		},
		data(){
			return {
				config:{
					fieldConfig : {
						productId : {
							label       : '套件',
							placeholder : '选择套件'
						},
						address : {
							label       : '送货公司',
							placeholder : '选择送货公司'
						}
					},
					radioData : {
						productId : [],
						address   : [],
					},
					popup:{
						timeFilter : {
							isFinishLoad : false
						},
						sku:{
							show:false
						}
					},
					result : {
						show       : false,
						isSuccess  : false,
						cusOrderId : '',
						failMsg:'下单失败'
					},
					isFastBuild : false,
					showDeliveryRemark:0,
					buildTime:{
						NeedSetBuildTime: false,
						BuildInTime1:[],
						BuildInTime2:[]
					}
				},
				formData:{
					cusOrderId       : '',   //客订单号
					pON              : '',   //PO号
					productId        : '',   //套件
					orderQuantities  : '',   //订单数
					address          : '',   //送货地址
					date             : '',   //交货日期
					deliveryRemark   : '',   //送货备注
					productionRemark : '',   //生产备注
				},
				pageConfig : {
					minDate : '',
					maxDate : '',
					minQty  : '',
					maxQty  : '',
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
					productId : [
						{ required : true, message : '请选择套件' }
					],
					orderQuantities : [
						{ required : true, message : '请填写订单数' },
						{ validator : (rule, value, callback, source, options)=>{
							let errors;
							if( Number( value ) >  Number(this.pageConfig.maxQty) || Number(value) < Number(this.pageConfig.minQty) ){
								errors = '订单数范围:' + this.pageConfig.minQty + '~' + this.pageConfig.maxQty;
							}
							callback(errors);
						} }
					],
					address : [
						{ required : true, message : '请选择送货公司' }
					],
					date : [
						{ required : true, message : '请填写交货日期' }
					]
				}
			}
		},
		methods:{
			getConfig( fastOrderId ){
				this.config.radioData.address = [];
				this.config.radioData.productId = [];
				let self = this;
				this.$request.client.orderBooking.xBuildConfig( fastOrderId ).then(res=>{
					res.result.cus_info.forEach((item,index)=>{
						if( item.DefAddress == 1 ){
							self.formData.address = item.CusSubNo
						}
						self.config.radioData.address.push( { value : item.CusSubNo, text:item.SubDNAddress} );
					});
					res.result.box_type.forEach((item,index)=>{
						self.config.radioData.productId.push( { value : item.ProductId, text:item.ProductName} );
					});
					self.pageConfig.minDate = res.result.page_config.BuildMinDate;
					self.pageConfig.maxDate = res.result.page_config.BuildMaxDate;
					self.formData.date      = res.result.page_config.BuildDeliveryDate;

					self.pageConfig.minQty  = res.result.page_config.BuildMinOrdQty;
					self.pageConfig.maxQty  = res.result.page_config.BuildMaxOrdQty;
					//是否显示送货备注
					self.config.showDeliveryRemark = res.result.page_config.ShowDeliveryRemark;
					//下单时间段
					self.config.buildTime.NeedSetBuildTime = res.result.page_config.NeedSetBuildTime == 1 ? true : false;
					self.config.buildTime.BuildInTime1 = res.result.page_config.BuildInTime1;
					self.config.buildTime.BuildInTime2 = res.result.page_config.BuildInTime2;
					self.checkTime();

					if( this.config.isFastBuild ){
						self.formData.pON       = res.result.fast_order_booking.PON;
						self.formData.productId = res.result.fast_order_booking.ProductId;
						self.formData.address   = res.result.fast_order_booking.CusSubNo;
						self.formData.deliveryRemark   = self.config.showDeliveryRemark == 1 ?  res.result.fast_order_booking.DNRemark : '';
						self.formData.productionRemark = res.result.fast_order_booking.ProRemark; 
					}

				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.timeFilter.isFinishLoad = true;
					})
				});
			},
			clickQuestion(){
				Dialog.alert({
					message : '订单数范围:' + this.pageConfig.minQty + '~' + this.pageConfig.maxQty,
				}).then(()=>{
					Dialog.close();
				});
			},
			buildOrder(){
				let self = this;
				this.validator.validate( this.formData ).then(()=>{
					self.checkData();
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message);
				});
			},
			checkData(){
				let self = this;
				this.$request.client.orderBooking.xBuildCheck(this.formData).then(res=>{
					if( res.errorCode == '00000' ){
						self.config.popup.sku.show = true;
					}
				});
			},
			saveOrder( data ){
				this.checkTime();
				let self = this;
				this.$request.client.orderBooking.xBuildSave( data ).then(res=>{
					if( res.errorCode === '00000' ){
						self.config.result.isSuccess  = true;
						self.config.result.cusOrderId = res.result.order_id;
					}else{
						self.config.result.isSuccess = false;
						self.config.result.failMsg = res.msg;
					}
					self.config.result.show = true;
				});
			},
			clearFormData(){
				Object.keys( this.formData ).forEach((item,index)=>{
					this.formData[item] = '';
				});
				this.getConfig('');
			},
			fastBuild( orderId ){
				this.getConfig( orderId );
				this.config.isFastBuild = true;
			},
			productIdChange( newValue ){
				this.formData.productId = newValue;
			},
			addressChange( newValue ){
				this.formData.address = newValue;
			},
			checkTime(){
				if( !this.config.buildTime.NeedSetBuildTime ){
					return true;
				}
				let timeRes1 = checkBuildTime(this.config.buildTime.BuildInTime1[0],this.config.buildTime.BuildInTime1[1]);
				let timeRes2 = checkBuildTime(this.config.buildTime.BuildInTime2[0],this.config.buildTime.BuildInTime2[1]);
				if( timeRes1 || timeRes2 ){
					return true;
				}else{
					let that = this;
					Dialog.alert({
						title: '目前不在下单时间',
						message:'下单时间段为:' + that.config.buildTime.BuildInTime1[0] + '~' + that.config.buildTime.BuildInTime1[1] + '\n' + that.config.buildTime.BuildInTime2[0] + '~' + that.config.buildTime.BuildInTime2[1]
					}).then(()=>{
						Dialog.close();
						that.$router.push('/client/index/menu');
					});
				}
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','纸箱下单');
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