<template>
	<div>
		<wx-scan :scanResult.sync="formData.stockInNo" urlType="1"></wx-scan>
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
	import { Button, Field, Toast } from 'vant';
	import TimePicker from '@/components/subject/TimePicker.vue';
	import WxScan from '@/components/subject/WxScan.vue';
	import { dateTimeFormat } from '@/util/index';
	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,
			[Toast.name]: Toast,

			TimePicker,
			WxScan
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
				}
			}
		},
		methods:{
			getPageConfig(){
				let self = this;
				this.$request.staff.paper.paperConfig().then(res=>{
					self.pageConfig.maxDate    = new Date(res.result.DoRStockInMaxDate);
					self.pageConfig.minDate    = new Date(res.result.DoRStockInMinDate);
					self.pageConfig.pickerDate = new Date(res.result.DoRStockInOpTime);

					self.formData.inOpTime = res.result.DoRStockInOpTime;
				});
			},
			timePickerConfirm( val ){
				this.formData.inOpTime = dateTimeFormat(val.value,'yyyy-MM-dd');
				this.timePickerCancel();
			},
			timePickerCancel(){
				this.pageConfig.show = false;
			},
			paperGetInInfo( data ){
				let self = this;
				this.$request.staff.paper.paperGetInInfo( data ).then(res=>{
					if( res.result == null ){
						self.pageConfig.errorMessage = '自动查询失败';
						Toast.fail(res.result);
					}else{
						self.autoData.paperWidth = Math.round(res.result.PaperWidth);
						self.autoData.paperCode  = res.result.PaperCode;
						self.autoData.paperWt    = res.result.PaperWt;
						self.autoData.oriWt      = res.result.OriWt;
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
