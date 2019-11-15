<template>
	<div>
		<wx-scan :scanResult.sync="formData.stockInNo" urlType="1"></wx-scan>
		<van-field readonly label="门幅(mm)" v-model="autoData.paperWidth" :placeholder="config.field.placeholder" input-align="center" :error="config.field.error" ></van-field>
		<van-field readonly label="纸质" v-model="autoData.paperCode" input-align="center" :placeholder="config.field.placeholder" :error="config.field.error"></van-field>
		<van-field readonly label="克重(g)" v-model="autoData.paperWt" input-align="center" :placeholder="config.field.placeholder" :error="config.field.error"></van-field>
		<van-field readonly label="重量(kg)" v-model="autoData.oriWt" input-align="center" :placeholder="config.field.placeholder" :error="config.field.error"></van-field>
		<van-field label="回仓重量" type="number" v-model="formData.inWeight" input-align="center" :placeholder="config.field.placeholder" :error="config.field.error"></van-field>
		<van-field readonly clickable label="入库日期" v-model="formData.inOpTime" input-align="center"  @click="config.popup.timePicker.show = true "></van-field>
		<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTimeShow.sync="config.popup.timePicker.show" :dateTime.sync="formData.inOpTime" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate">
		</new-time-picker>
		<van-button type="primary" size="normal" style="width:100%;position:fixed;bottom:100px;" @click="stockInConfirm()" :disabled="config.button.disabled">入库</van-button>
	</div>
</template>
<script>
	import { Button, Field, Dialog, Toast } from 'vant';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import WxScan from '@/components/subject/WxScan.vue';
	import { dateTimeFormat } from '@/util/index';
	import schema from 'async-validator';
	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,
			[Dialog.name]: Dialog,
			[Toast.name]: Toast,

			NewTimePicker,
			WxScan
		},
		data(){
			return {
				config:{
					field:{
						error       : false,
						placeholder : '自动查询'
					},
					button:{
						disabled : true
					},
					popup:{
						timePicker:{
							show : false,
							isFinishLoad:false
						}
					}
				},
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
				},
				rules:{
					stockInNo : [],
					inOpTime  : [],
					inWeight  : []
				},
				validator:{}
			}
		},
		methods:{
			getPageConfig(){
				let self = this;
				this.$request.staff.paper.paperConfig().then(res=>{
					self.pageConfig.maxDate = res.result.DoRStockInMaxDate;
					self.pageConfig.minDate = res.result.DoRStockInMinDate;

					self.formData.inOpTime = res.result.DoRStockInOpTime;
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.timePicker.isFinishLoad = true;
					})
				});
			},
			paperGetInInfo( data ){
				let self = this;
				this.$request.staff.paper.paperGetInInfo( data ).then(res=>{
					if( res.errorCode == '00000' ){
						self.autoData.paperWidth = Math.round(res.result.PaperWidth);
						self.autoData.paperCode  = res.result.PaperCode;
						self.autoData.paperWt    = res.result.PaperWt;
						self.autoData.oriWt      = Math.round(res.result.OriWt);
					}else{
						self.config.field.placeholder = '自动查询失败';
						self.config.field.error       = true;
						self.config.button.disabled   = false; 
					}
				});
			},
			stockInConfirm(){
				Dialog.confirm({
					message: '确认入库?'
				}).then(()=>{
					this.validateField( this.formData );
				}).catch(()=>{
					Dialog.close();
				});
			},
			validateField(){
				let self = this;
				this.validator.validate(this.formData).then(()=>{
					self.doStockIn( self.formData );
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message);
				});
			},
			doStockIn( data ){
				let self = this;
				this.$request.staff.paper.paperDoRStockIn( data ).then(res=>{
					if( res.errorCode === '00000' ){
						Toast.success('入库成功！');
					}else{
						Toast.fail('入库失败！');
					}
				});
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','原纸入库');
		},
		mounted(){
			this.validator = new schema(this.rules);
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
					this.paperGetInInfo( newV );
				}
			}
		}
	}
</script>
