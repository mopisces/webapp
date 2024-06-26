<template>
	<div>
		<wx-scan :scanResult.sync="formData.stockInNo" urlType="1"></wx-scan>
		<van-field readonly label="门幅(mm)" v-model="autoData.paperWidth" :placeholder="config.field.placeholder" input-align="center" :error="config.field.error" class="field-readonly"></van-field>
		<van-field readonly label="纸质" v-model="autoData.paperCode" input-align="center" :placeholder="config.field.placeholder" :error="config.field.error" class="field-readonly"></van-field>
		<van-field readonly label="克重(g)" v-model="autoData.paperWt" input-align="center" :placeholder="config.field.placeholder" :error="config.field.error" class="field-readonly"></van-field>
		<van-field readonly label="重量(kg)" v-model="autoData.oriWt" input-align="center" :placeholder="config.field.placeholder" :error="config.field.error" class="field-readonly"></van-field>
		<van-field label="回仓重量" type="number" v-model="formData.inWeight" input-align="center" :placeholder="config.field.placeholder" :error="config.field.error"></van-field>
		<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="formData.inOpTime" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="入库日期">
		</new-time-picker>
		<van-button type="primary" size="normal" style="width:100%;" @click="stockInConfirm()" :disabled="config.button.disabled">入库</van-button>
	</div>
</template>
<script>
	import { Button, Field, Dialog, Toast } from 'vant';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import WxScan from '@/components/subject/WxScan.vue';
	import schema from 'async-validator';

	/*api接口*/
	import { getWebConfig } from '@/api/common/webConfig.js'

	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,
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
				rules:{
					stockInNo : [
						{  required: true, message: '请输入订单号'},
					],
					inOpTime  : [
						{ required : true, message : '请选择入库日期' },
						{ type: 'string' ,pattern : '^[1-2][0-9]{3}-[0-1][0-9]-[0-3][0-9]$' ,message : '入库日期格式错误'}
					],
					inWeight  : [
						{ validator: (rule, value, callback, source, options)=>{
							let errors;
							if( value > Number( this.autoData.oriWt ) ){
								errors = '回仓重量超过重量';
							}
							callback(errors);
						} }
					]
				},
				pageConfig:{
					maxDate:'',
					minDate:''
				},
				validator:{}
			}
		},
		methods:{
			async getPageConfig(){
				const { result } = await getWebConfig({paramType: 'staffPaper'})
				this.pageConfig.maxDate = result.DoRStockInMaxDate
				this.pageConfig.minDate = result.DoRStockInMinDate
				this.formData.inOpTime  = result.DoRStockInOpTime
				this.config.popup.timePicker.isFinishLoad = true
			},
			paperGetInInfo( data ){
				let self = this;
				this.config.field.error = false;
				this.autoData = {
					paperWidth : '',
					paperCode  : '',
					paperWt    : '',
					oriWt      : ''
				};
				this.$request.staff.paper.paperGetInInfo( data ).then(res=>{
					if( res.errorCode == '00000' ){
						self.autoData.paperWidth      = Math.round(res.result.PaperWidth);
						self.autoData.paperCode       = res.result.PaperCode;
						self.autoData.paperWt         = res.result.PaperWt;
						self.autoData.oriWt           = Math.round(res.result.OriWt);
						self.config.button.disabled   = false; 
					}else{
						self.config.field.placeholder = '自动查询失败';
						self.config.field.error       = true;
						
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
						Dialog.alert({
							message   : '入库成功!',
						}).then(()=>{
							Dialog.close();
						});
						this.clearData();
					}else{
						Dialog.alert({
							title   : '入库失败!',
							message : res.msg
						}).then(()=>{
							self.config.button.disabled   = true; 
							Dialog.close();
						});
					}
				});
			},
			clearData(){
				Object.keys( this.autoData ).forEach((item,index)=>{
					this.autoData[item] = '';
				});
				Object.keys( this.formData ).forEach((item,index)=>{
					if( item == 'inWeight' ){
						this.formData[item] = 0;
					}
					if( item == 'stockInNo' ){
						this.formData[item] = '';
					}
				});
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','原纸入库');
			if( typeof(this.$route.query.scanRes) == 'string' ){
				this.formData.stockInNo = this.$route.query.scanRes;
			}
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
				}else{
					this.config.field.error       = false;
					this.config.field.placeholder = '自动查询';
				}
			}
		}
	}
</script>
