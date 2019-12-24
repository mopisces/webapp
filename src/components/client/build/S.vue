<template>
	<div>
		<van-field v-model="formData.cusOrderId" input-align="center" label="客订单号" placeholder="未填写则系统自动生成"/>
		<popup-select :selectValue.sync="formData.materialType" :fieldConfig="config.fieldConfig.material" :radioData="config.radioData.material" selectType="material"></popup-select>
		<van-field clearable label="纸板规格(mm)" right-icon="question-o" @click-right-icon="$toast('板长范围:' + pageConfig.minLength + 'mm~' + pageConfig.maxLength + 'mm\n板宽范围:' + pageConfig.minWidth +'mm~' + pageConfig.maxWidth + 'mm' )">
			<div class="van-row van-row--flex van-row--justify-center" slot="input">
				<div class="van-col van-col--12">
					<input type="number" placeholder="板长" v-model="formData.boardLength" class="van-field__control van-field__control--center"/>
				</div>
				<div class="van-col van-col--1">
					x 
				</div>
				<div class="van-col van-col--11">
					<input type="number" placeholder="板宽" v-model="formData.boardWidth" class="van-field__control van-field__control--center"/>
				</div>
			</div>
		</van-field>
		<popup-select :selectValue.sync="formData.lineBallInfo" :fieldConfig="config.fieldConfig.lineBall" :radioData="config.radioData.lineBall" selectType="lineBall"></popup-select>
		<van-field v-model="formData.lineBallFormula" input-align="center" label="压线信息" placeholder="压线和=板宽(格式:x+x+x)"/>
		<van-field v-model="formData.orderQuantities" input-align="center" type="number" label="订单数" placeholder="输入订单数"/>
		<van-field v-model="formData.area" clearable readonly input-align="center" label="下单面积(㎡)" placeholder="待计算" right-icon="question-o" @click-right-icon="$toast('下单面积范围:' + pageConfig.minArea + '㎡~' + pageConfig.maxArea + '㎡' ) ">
		</van-field>
		<popup-select :selectValue.sync="formData.address" :fieldConfig="config.fieldConfig.cusInfo" :radioData="config.radioData.cusInfo" selectType="cusInfo"></popup-select>
		<new-time-picker :dateTime.sync="formData.date" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="交货日期" v-if="config.popup.timeFilter.isFinishLoad"></new-time-picker>
		<van-field v-model="formData.deliveryRemark" rows="1" autosize label="送货备注" type="textarea"  maxlength="50" placeholder="填写送货备注" show-word-limit/>
		<van-field v-model="formData.productionRemark" rows="1" autosize label="生产备注" type="textarea"  maxlength="50" placeholder="填写生产备注" show-word-limit/>
		<van-button  type="primary" size="normal" style="width:100%;" @click="buildOrder()">下单</van-button>
		<build-sku :skuShow.sync="config.popup.sku.show" :orderInfo="formData" orderType="s" @saveOrder="saveOrder" :isGroup="false"></build-sku>
		<build-result :resultShow.sync="config.result.show" :isGroup="false" :isSuccess="config.result.isSuccess" @clearFormData="clearFormData()" v-if="config.result.show" :cusOrderId="config.result.cusOrderId"></build-result>
	</div>
</template>
<script>
	import { Button, Icon, Popup, Field, Toast } from 'vant';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import PopupSelect from '@/components/subject/build/PopupSelect.vue';
	import BuildSku from '@/components/subject/build/BuildSku.vue';
	import BuildResult from '@/components/subject/build/BuildResult.vue';
	import schema from 'async-validator';
	export default {
		components:{
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Field.name]: Field,
			/*[Dialog.Component.name]: Dialog.Component,*/
			[Toast.name]: Toast,

			NewTimePicker,
			PopupSelect,
			BuildSku,
			BuildResult
		},
		data(){
			return {
				config:{
					fieldConfig : {
						material : {
							label       : '材质',
							placeholder : '选择材质'
						},
						lineBall : {
							label       : '压线名称',
							placeholder : '选择压线名称'
						},
						cusInfo : {
							label       : '送货公司',
							placeholder : '选择送货公司'
						}
					},
					radioData:{
						material : [],
						lineBall : [],
						cusInfo  : []
					},
					popup:{
						timeFilter: {
							isFinishLoad : false
						},
						sku: {
							show : false
						}
					},
					result : {
						show       : false,
						isSuccess  : false,
						cusOrderId :''
					}
				},
 				pageConfig : {
					maxDate   : '',
					maxArea   : '',
					maxLength : '',
					maxWidth  : '',
					minArea   : '',
					minDate   : '',
					minLength : '',
					minWidth  : ''
				},
				formData : {
					cusOrderId       : '',    //客订单号
					materialType     : '',    //材质
					boardLength      : '',    //板长
					boardWidth       : '',    //板宽
					lineBallInfo     : '',    //压线名称
					lineBallFormula  : '',    //压线信息
					orderQuantities  : '',    //订单数
					area             : '',    //下单面积
					address          : '',    //送货地址
					date             : '',    //送货时间
					deliveryRemark   : '',    //送货备注
					productionRemark : '',    //生产备注
				},
				rules : {
					cusOrderId : [
						{ pattern : '[0-9a-zA-Z]{12}' , message : '客订单号格式错误' }
					],
					materialType : [
						{ required : true, message : '请选择材质' }
					],
					boardLength : [
						{ required : true, message : '请输入板长' },
						{ pattern  : '^[1-9][0-9]{1,5}$', message : '板长格式错误' },
						{ validator: (rule, value, callback, source, options)=>{
							let errors;
							if( Number(value) > this.pageConfig.maxLength || Number(value) < this.pageConfig.minLength){
								errors = '板长范围:' + this.pageConfig.minLength + 'mm~' + this.pageConfig.maxLength + 'mm';
							}
							callback(errors);
						}}
					],
					boardWidth : [
						{ required : true, message : '请输入板宽' },
						{ pattern  : '^[1-9][0-9]{1,2}$', message : '板宽格式错误' },
						{ validator: (rule, value, callback, source, options)=>{
							let errors;
							if( Number(value) > this.pageConfig.maxWidth || Number(value) < this.pageConfig.minWidth){
								errors = '板宽范围:' + this.pageConfig.minWidth + 'mm~' + this.pageConfig.maxWidth + 'mm';
							}
							callback(errors);
						}}
					],
					lineBallInfo : [
						{ required  : true, message : '请选择压线名称' },
					],
					lineBallFormula : [
						{ pattern   : '^\\\d+([.]{1}[5]{1}){0,1}(\\\+\\\d+([.]{1}[5]{1}){0,1})+$', message : '压线信息错误' },
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
				},
				validator : {}
			}
		},
		methods:{
			getConfig( fastOrderId ){
				let self = this;
				this.$request.client.orderBooking.sBuildConfig( fastOrderId ).then(res=>{
					if( res.msg == '没有可用的BoardId' ){
						Dialog.alert({
							title   : '没有可选择的材质',
							message : '请先选择常用材质'
						}).then(()=>{
							self.$router.push('/client/usedboard/lists')
						});
					}
					res.result.board_select_list.forEach((item,index)=>{
						if( item.BoardName == null ){
							self.config.radioData.material.push({ value : item.BoardId , text: '', tag:item.IsUsedBoard });
						}else{
							self.config.radioData.material.push({ value : item.BoardId , text: item.BoardName, tag:item.IsUsedBoard });
						}
					});
					res.result.line_ball_config.forEach((item,index)=>{
						self.config.radioData.lineBall.push( { value:item, text:'', tag:'' } );
					});
					res.result.cus_info.forEach((item,index)=>{
						self.config.radioData.cusInfo.push( { value : item.CusSubNo, text:item.SubDNAddress, tag : ''} );
					});
					self.pageConfig.maxDate   = res.result.page_config.BuildMaxDate;
					self.pageConfig.minDate   = res.result.page_config.BuildMinDate;
					self.pageConfig.maxArea   = res.result.page_config.BuildMaxArea;
					self.pageConfig.minArea   = res.result.page_config.BuildMinArea;
					self.pageConfig.maxLength = res.result.page_config.BuildMaxLength;
					self.pageConfig.minLength = res.result.page_config.BuildMinLength;
					self.pageConfig.maxWidth  = res.result.page_config.BuildMaxWidth;
					self.pageConfig.minWidth  = res.result.page_config.BuildMinWidth;
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.timeFilter.isFinishLoad = true;
					})
				});

			},
			buildOrder(){
				if( !this.calc() ){
					return ;
				}
				let self = this;
				this.validator.validate(this.formData).then(()=>{
					self.config.popup.sku.show = true;
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message);
				});
			},
			calc(){
				this.formData.area = this.formData.boardLength * this.formData.boardWidth * this.formData.orderQuantities / 1000000;
				if( this.formData.area > this.pageConfig.maxArea || this.formData.area < this.pageConfig.minArea ){
					Toast.fail('下单面积范围:' + this.pageConfig.minArea + '㎡~' + this.pageConfig.maxArea + '㎡');
					this.formData.area            = '';
					this.formData.orderQuantities = '';
					return false;
				}
				return true;
			},
			saveOrder( data ){
				let self = this;
				this.$request.client.orderBooking.sBuildSave( data ).then(res=>{
					if( res.errorCode == '00000' ){
						self.config.result.isSuccess  = true;
						self.config.result.cusOrderId = res.result.order_id;
					}else{
						self.config.result.isSuccess = false;
					}
					self.config.result.show = true;
				});
			},
			clearFormData(){
				Object.keys( this.formData ).forEach((item,index)=>{
					this.formData[item] = '';
				});
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','简单纸板下单');
		},
		mounted(){
			if( typeof( this.$route.params.orderId ) != 'undefined' && this.$route.params.orderId != null ){
				this.getConfig( this.$route.params.orderId )
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
			
		}
	}
</script>