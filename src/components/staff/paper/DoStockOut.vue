<template>
	<div>
		<wx-scan :scanResult.sync="formData.stockOutNo" urlType="0"></wx-scan>
		<van-field readonly label="门幅(mm)" v-model="infoData.paperWidth" :placeholder="config.field.placeholder" :error="config.field.error" input-align="center"></van-field>
		<van-field readonly label="纸质" v-model="infoData.paperCode" :placeholder="config.field.placeholder" :error="config.field.error" input-align="center"></van-field>
		<van-field readonly label="克重(g)" v-model="infoData.paperWt" :placeholder="config.field.placeholder" :error="config.field.error" input-align="center"></van-field>
		<van-field readonly label="重量(kg)" v-model="infoData.curWt" :placeholder="config.field.placeholder" :error="config.field.error" input-align="center" ></van-field>
		<van-field label="班次" v-model="formData.stockOutOpClass" :placeholder="config.field.placeholder" :error="config.field.error" input-align="center"></van-field>
		<van-field label="机台" v-model="formData.stockOutSFlute" placeholder="输入班次" input-align="center"></van-field>
		<van-field label="剥纸重量" v-model="formData.stockOutBzwt" type="number" input-align="center"></van-field>
		<van-field readonly clickable label="出库日期" v-model="formData.stockOutOpTime" input-align="center"  @click="pageConfig.show = true "></van-field>
		<time-picker :dateTimeShow.sync="pageConfig.show" :dateTime.sync="pageConfig.pickerDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" @onCancel="timePickerCancel" @onConfirm="timePickerConfirm">
		</time-picker>
		<van-button type="primary" size="normal" style="width:100%;position:fixed;bottom:55px;" @click="stockOutConfirm()" :disabled="config.button.disabled">
			出库
		</van-button>
	</div>
</template>
<script>
	import { Button, Field, Dialog, Toast } from 'vant';
	import TimePicker from '@/components/subject/TimePicker.vue';
	import WxScan from '@/components/subject/WxScan.vue';
	import { dateTimeFormat } from '@/util/index';
	import schema from 'async-validator';
	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,
			[Dialog.name]: Dialog,
			[Toast.name]: Toast ,

			TimePicker,
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
						disabled:true
					}
				},
				pageConfig:{
					minDate    : new Date(),
					maxDate    : new Date(),
					pickerDate : new Date(),
					show       : false
				},
				formData:{
					stockOutNo      : '',
					stockOutOpClass : '',
					stockOutOpTime  : '',
					stockOutSFlute  : '',
					stockOutBzwt    : 0
				},
				infoData:{
					paperWidth : '',
					paperCode  : '',
					paperWt    : '',
					curWt      : ''
				},
				rules:{
					stockOutNo : [ 
						{ type: 'string', required: true, message: '请输入订单号'},
						{ pattern:'/^[a-zA-Z1-9][a-zA-Z0-9]{11}$/', message: '订单号格式错误' } 
					],
					stockOutOpClass : [],
					stockOutSFlute  : [],
					stockOutBzwt    : [
						{ pattern: '/^\d{1,14}(\.\d{1,2})?$/' , required: true, message: '请输入剥纸重量' },
					],
					stockOutOpTime  : [],
					/*前端数据验证规则与后台要一致*/
				},
				validator:{}
			}
		},
		methods:{
			timePickerCancel(){
				this.pageConfig.show = false;
			},
			timePickerConfirm(val){
				this.pageConfig.beginDate = val.value;
				this.timePickerCancel();
			},
			getPageConfig(){
				let self = this;
				this.$request.staff.paper.paperConfig().then(res=>{
					/*返回数据填充未完成*/
					self.pageConfig.maxDate      = new Date(res.result.DoStockOutMaxDate);
					self.pageConfig.minDate      = new Date(res.result.DoStockOutMinDate);
					self.pageConfig.pickerDate   = new Date(res.result.DoStockOutOpTime);
					self.formData.stockOutOpTime = res.result.DoStockOutOpTime;
				});
			},
			getOutInfo( outNo ){
				let self = this;
				this.$request.staff.paper.paperGetOutInfo( outNo ).then(res=>{
					if( res.errorCode == '00000' ){
						self.infoData.paperWidth = res.result
						self.infoData.paperCode  = res.result
						self.infoData.paperWt    = res.result
						self.infoData.curWt      = res.result
						self.config.button.disabled = false;
					}else{
						self.config.field.placeholder = '查询失败';
						self.config.field.error       = true;
						self.config.button.disabled   = true;
					}
				});
			},
			stockOutConfirm(){
				let self = this
				Dialog.confirm({
					message: '确定出库?'
				}).then(() => {
					self.validateField();
				}).catch(()=>{
					Dialog.close();
				});
			},
			validateField(){
				let self = this;
				this.validator.validate(this.formData).then(()=>{
					self.doStockOut( self.formData );
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message);
				});
			},
			doStockOut( data ){
				let self = this;
				this.$request.staff.paper.paperOutMain( data ).then(res=>{
					if( res.errorCode === '00000' ){
						Toast.success('出库成功！');
					}else{
						Toast.fail('出库失败！');
					}
				});
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','原纸出库');
		},
		mounted(){
			this.validator = new schema(this.rules);
			this.getPageConfig();
		},
		computed:{
			opTime(){
				return this.pageConfig.beginDate;
			},
			outNo(){
				return this.formData.stockOutNo;
			}
		},
		watch:{
			opTime( newVal,oldVal ){
				this.formData.stockOutOpTime = dateTimeFormat(newVal,'yyyy-MM-dd');
			},
			outNo( newVal,oldVal ){
				if( newVal.length === 12 ){
					this.getOutInfo( newVal );
				}
			}
		}
	}
</script>