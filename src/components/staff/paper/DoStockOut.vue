<template>
	<div>
		<wx-scan :scanResult.sync="formData.stockOutNo" urlType="0"></wx-scan>
		<van-field readonly label="门幅(mm)" v-model="infoData.paperWidth" :placeholder="config.field.placeholder" :error="config.field.error" input-align="center" class="field-readonly"></van-field>
		<van-field readonly label="纸质" v-model="infoData.paperCode" :placeholder="config.field.placeholder" :error="config.field.error" input-align="center" class="field-readonly"></van-field>
		<van-field readonly label="克重(g)" v-model="infoData.paperWt" :placeholder="config.field.placeholder" :error="config.field.error" input-align="center" class="field-readonly"></van-field>
		<van-field readonly label="重量(kg)" v-model="infoData.curWt" :placeholder="config.field.placeholder" :error="config.field.error" input-align="center" class="field-readonly"></van-field>
		<op-class-field :opClass.sync="formData.stockOutOpClass"></op-class-field>
		<s-flute-select :sFlute.sync="formData.stockOutSFlute"></s-flute-select>
		<van-field label="剥纸重量" v-model="formData.stockOutBzwt" type="number" input-align="center"></van-field>
		<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="formData.stockOutOpTime" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="出库日期">
		</new-time-picker>
		<van-button type="primary" size="normal" style="width:100%;" @click="stockOutConfirm()" :disabled="config.button.disabled">
			出库
		</van-button>
	</div>
</template>
<script>
	import { Button, Field, Dialog, Toast } from 'vant';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import WxScan from '@/components/subject/WxScan.vue';
	import SFluteSelect from '@/components/subject/staff/SFluteSelect.vue';
	import OpClassField from '@/components/subject/staff/OpClassField.vue';
	import FieldLabelVariable from '@/components/subject/staff/FieldLabelVariable.vue';
	import schema from 'async-validator';

	/*api接口*/
	import { getWebConfig } from '@/api/common/webConfig.js'

	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,
			[Dialog.name]: Dialog,
			[Toast.name]: Toast ,

			NewTimePicker,
			WxScan,
			SFluteSelect,
			OpClassField,
			FieldLabelVariable
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
					},
					popup:{
						timePicker:{
							show:false,
							isFinishLoad:false
						}
					}
				},
				pageConfig:{
					maxDate:'',
					minDate:''
				},
				formData:{
					stockOutNo      : '',  //编号
					stockOutOpClass : '',  //班次
					stockOutOpTime  : '',  //出库日期
					stockOutSFlute  : '',  //机台
					stockOutBzwt    : 0    //剥纸重量
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
						{ pattern:'^[a-zA-Z0-9]{12}$', message: '订单号格式错误' } 
					],
					stockOutOpClass : [],
					stockOutSFlute  : [],
					stockOutBzwt    : [
						{ validator: (rule, value, callback, source, options)=>{
								let errors;
								if( value > Number( this.infoData.curWt ) ){
									errors = '剥纸重量超过重量';
								}
								callback(errors);
							} }
					],
				},
				validator:{}
			}
		},
		methods:{
			async getPageConfig(){
				const { result } = await getWebConfig({paramType: 'staffPaper'})
				this.pageConfig.maxDate = result.DoStockOutMaxDate
				this.pageConfig.minDate = result.DoStockOutMinDate
				this.formData.stockOutOpTime = result.DoStockOutOpTime
				this.config.popup.timePicker.isFinishLoad = true
			},
			getOutInfo( outNo ){
				let self = this;
				this.config.field.error = false;
				this.infoData = {
					paperWidth : '',
					paperCode  : '',
					paperWt    : '',
					curWt      : ''
				};
				this.$request.staff.paper.paperGetOutInfo( outNo ).then(res=>{
					if( res.errorCode == '00000' ){
						self.infoData.paperWidth = Math.round(res.result.PaperWidth);
						self.infoData.paperCode  = res.result.PaperCode;
						self.infoData.paperWt    = res.result.PaperWt;
						self.infoData.curWt      = Math.round(res.result.CurWt);
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
						Dialog.alert({
							message : '出库成功!',
						}).then(()=>{
							Dialog.close();
						});
						self.doSuccess();
					}else{
						Dialog.alert({
							title   : '出库失败!',
							message : res.msg
						}).then(()=>{
							Dialog.close();
						});
					}
				});
			},
			doSuccess(){
				Object.keys( this.formData ).forEach((item,index)=>{
					if( item == 'stockOutBzwt' ){
						this.formData[item] = 0;
					}
					if( item == 'stockOutNo' ){
						this.formData[item] = '';
					}
				});
				Object.keys( this.infoData ).forEach((item,index)=>{
					this.infoData[item] = '';
				});
				/*this.getPageConfig();*/
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','原纸出库');
			if( typeof(this.$route.query.scanRes) == 'string' ){
				this.formData.stockOutNo = this.$route.query.scanRes;
			}
		},
		mounted(){
			this.validator = new schema(this.rules);
			this.getPageConfig();
		},
		computed:{
			outNo(){
				return this.formData.stockOutNo;
			},
		},
		watch:{
			outNo( newVal,oldVal ){
				if( newVal.length === 12 ){
					this.getOutInfo( newVal );
				}else{
					this.config.field.error       = false;
					this.config.field.placeholder = '自动查询';
				}
			},
		}
	}
</script>
