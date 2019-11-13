<template>
	<div>
		<van-field v-model="formData.stockInNo" placeholder="请输入订单号" label="条形码编号" input-align="center">
		 	<van-icon class-prefix="iconfont" size="18" name="saomiao4" slot="right-icon" color="#0bf147" @click="scanQRCode()"/>
		</van-field>
		<van-field readonly label="门幅(mm)" v-model="autoData.paperWidth" placeholder="自动查询" input-align="center"></van-field>
		<van-field readonly label="纸质" v-model="autoData.paperCode" placeholder="自动查询" input-align="center" :error-message="pageConfig.errorMessage"></van-field>
		<van-field readonly label="克重(g)" v-model="autoData.paperWt" placeholder="自动查询" input-align="center" :error-message="pageConfig.errorMessage"></van-field>
		<van-field readonly label="重量(kg)" v-model="autoData.oriWt" placeholder="自动查询" input-align="center" :error-message="pageConfig.errorMessage"></van-field>
		<van-field label="回仓重量" type="number" v-model="formData.inWeight" placeholder="输入回仓重量" input-align="center" :error-message="pageConfig.errorMessage"></van-field>
		<van-field readonly clickable label="入库日期" v-model="formData.inOpTime" input-align="center"  @click="pageConfig.show = true "></van-field>
		<time-picker :dateTimeShow.sync="pageConfig.show" :dateTime.sync="pageConfig.pickerDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" @onCancel="timePickerCancel" @onConfirm="timePickerConfirm">
		</time-picker>
		<van-button type="primary" size="normal" style="width:100%;position:fixed;bottom:100px;">入库</van-button>
	</div>
</template>
<script>
	import wx from 'weixin-js-sdk';
	import { Button, Icon, Field, Toast } from 'vant';
	import TimePicker from '@/components/subject/TimePicker.vue';
	import { dateTimeFormat } from '@/util/index';
	export default {
		components:{
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Field.name]: Field,
			[Toast.name]: Toast,

			TimePicker
		},
		data(){
			return {
				value : '',
				formData:{
					stockInNo : '',
					inOpTime  : '',
					inWeight  : 0
				},
				autoData:{
					paperWidth : '',
					paperCode  : '',
					paperWt    : '',
					oriWt      : ''
				},
				pageConfig:{
					show         : false,
					maxDate      : new Date(),
					minDate      : new Date(),
					pickerDate   : new Date(),
					errorMessage : ''
				},
				wxConfig : {}
			}
		},
		methods:{
			getPageConfig(){
				let self = this;
				this.$request.staff.paper.paperWxConfig().then(res=>{
					self.pageConfig.maxDate    = new Date(res.result.time.DoRStockInMaxDate);
					self.pageConfig.minDate    = new Date(res.result.time.DoRStockInMinDate);
					self.pageConfig.pickerDate = new Date(res.result.time.DoRStockInOpTime);

					self.formData.inOpTime = res.result.time.DoRStockInOpTime;
					self.wxConfig = res.result.wx_config;
				}).then(()=>{
					wx.config({
		                debug     : false,
		                appId     : this.wxConfig.appId,
		                timestamp : this.wxConfig.timestamp,
		                nonceStr  : this.wxConfig.nonceStr,
		                signature : this.wxConfig.signature,
		                jsApiList : ['scanQRCode']
		            });
				});
			},
			timePickerConfirm( val ){
				this.formData.inOpTime = dateTimeFormat(val.value,'yyyy-MM-dd');
				this.timePickerCancel();
			},
			timePickerCancel(){
				this.pageConfig.show = false;
			},
			scanQRCode(){
				let self = this;
				wx.scanQRCode({
                    needResult: 1,
                    success: (res)=>{
                        self.formData.StockNo = res.resultStr.split(',')[1];
                    }
                });
                wx.error((err)=>{
                	Toast.fail(err.errMsg);
                });
			},
			paperGetInInfo( data ){
				let self = this;
				this.$request.staff.paper.paperGetInInfo( data ).then(res=>{
					if( res.result == null ){
						self.pageConfig.errorMessage = '自动查询失败';
						Toast.fail(res.result);
					}else{
						self.autoData.paperWidth = Math.round(res.result.PaperWidth);
						self.autoData.paperCode = res.result.PaperCode;
						self.autoData.paperWt = res.result.PaperWt;
						self.autoData.oriWt = res.result.OriWt;
					}
				});
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','原纸入库');
		},
		mounted(){
			this.getPageConfig();
		},
		computed:{
			stockInNoChange(){
				return this.formData.stockInNo;
			}
		},
		watch:{
			stockInNoChange( newV, oldV ){
				if( newV.length == 12 ){
					this.paperGetInInfo( this.formData );
				}
			}
		}
	}
</script>