<template>
	<div>
		<van-field v-model="formData.cusOrderId" input-align="center" label="客订单号" placeholder="未填写则系统自动生成"/>
		<popup-select :selectValue.sync="formData.materialType" :fieldConfig="config.fieldConfig.material" :radioData="config.radioData.material" selectType="material"></popup-select>
		<popup-select :selectValue.sync="formData.boxType" :fieldConfig="config.fieldConfig.boxType" :radioData="config.radioData.boxType" selectType="boxType"></popup-select>
		<van-field label="纸箱规格(mm)" right-icon="question-o" @click-right-icon="clickQuestion(1)">
			<div class="van-row van-row--flex van-row--justify-center" slot="input">
				<div class="van-col van-col--7" >
					<input placeholder="箱长(L)" v-model="formData.boxLength" style="width:100%;"/>
				</div>
				<div class="van-col van-col--1">
					x
				</div>
				<div class="van-col van-col--7">
					<input placeholder="箱宽(W)" v-model="formData.boxWidth" style="width:100%;"/>
				</div>
				<div class="van-col van-col--1">
					x
				</div>
				<div class="van-col van-col--8">
					<input placeholder="箱高(H)" v-model="formData.boxHeight" style="width:100%;"/>
				</div>
			</div>	
		</van-field>
		<popup-select :selectValue.sync="formData.tonLen" :fieldConfig="config.fieldConfig.tonLen" :radioData="config.radioData.tonLen"></popup-select>
		<popup-select :selectValue.sync="formData.uLen" :fieldConfig="config.fieldConfig.uLen" :radioData="config.radioData.uLen"></popup-select>
		<van-field v-model="formData.lengthF" input-align="center" label="横向公式" placeholder="待选择箱型" readonly/>
		<van-field v-model="formData.widthF" input-align="center" label="纵向公式" placeholder="待选择箱型" readonly/>
		<van-field label="纸板规格(mm)">
			<div class="van-row van-row--flex van-row--justify-center" slot="input">
				<div class="van-col van-col--8" >
					<input placeholder="板长" v-model="formData.length" style="width:100%;" disabled/>
				</div>
				<div class="van-col van-col--1">
					x
				</div>
				<div class="van-col van-col--8" >
					<input placeholder="板宽" v-model="formData.width" style="width:100%;" disabled/>
				</div>
			</div>
		</van-field>
		<van-field input-align="center" label="压线信息" placeholder="由ERP系统自动计算" readonly/>
		<van-field v-model="formData.bdMultiple" input-align="center" label="张数" placeholder="待选择箱型" readonly right-icon="question-o" @click-right-icon="clickQuestion(2)"/>
		<van-field v-model="formData.ordQty" input-align="center" label="订单数" placeholder="输入订单数"/>
		<van-field v-model="formData.bdQty" input-align="center" label="纸板数" placeholder="待计算" readonly/>
		<van-field v-model="formData.bdQty" input-align="center" label="下单面积(㎡)" placeholder="待计算" readonly right-icon="question-o" @click-right-icon="clickQuestion(3)" />
		<popup-select :selectValue.sync="formData.address" :fieldConfig="config.fieldConfig.address" :radioData="config.radioData.address" selectType="cusInfo"></popup-select>
		<new-time-picker :dateTime.sync="formData.date" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="交货日期" v-if="config.popup.timeFilter.isFinishLoad"></new-time-picker>
		<van-field v-model="formData.deliveryRemark" rows="1" autosize label="送货备注" type="textarea"  maxlength="50" placeholder="填写送货备注" show-word-limit/>
		<van-field v-model="formData.productionRemark" rows="1" autosize label="生产备注" type="textarea"  maxlength="50" placeholder="填写生产备注" show-word-limit/>
		<van-button  type="primary" size="normal" style="width:100%;" @click="buildOrder()">下单</van-button>
		<build-sku :skuShow.sync="config.popup.sku.show" :orderInfo="formData" orderType="c" @saveOrder="saveOrder"></build-sku>
	</div>
</template>
<script>
	import { Button, Field, Dialog, Toast } from 'vant';
	import PopupSelect from '@/components/subject/build/PopupSelect.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import BuildSku from '@/components/subject/build/BuildSku.vue';
	import schema from 'async-validator';
	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,
			[Toast.name]: Toast,

			PopupSelect,
			NewTimePicker,
			BuildSku
		},
		data(){
			return {
				config : {
					fieldConfig : {
						material : {
							label       : '材质',
							placeholder : '选择材质'
						},
						boxType : {
							label       : '箱型',
							placeholder : '选择箱型'
						},
						tonLen : {
							label       : '箱舌(T)',
							placeholder : '选择箱舌'
						},
						uLen : {
							label       : '封箱调整(U)',
							placeholder : '选择封箱调整'
						},
						address : {
							label       : '送货公司',
							placeholder : '选择送货公司'
						}
					},
					radioData : {
						material : [],
						boxType  : [],
						tonLen   : [],
						uLen     : [],
						address  : []
					},
					popup : {
						timeFilter : {
							isFinishLoad : false
						},
						sku : {
							show : false
						}
					}
				},
				formData:{
					cusOrderId       : '',   //客订单号
					materialType     : '',	 //材质
					boxType          : '',	 //箱型
					boxLength        : '',	 //箱长
					boxWidth         : '',	 //箱宽
					boxHeight        : '',   //箱高
					tonLen           : '',   //箱舌
					uLen             : '',   //封箱调整
					length           : '',   //板长
					width            : '',   //板宽
					bdMultiple       : '',   //张数
					ordQty           : 0,    //订单数
					bdQty            : '',   //纸板数
					area             : '',   //下单面积
					address          : '',   //送货地址
					date             : '',   //交货日期
					deliveryRemark   : '',   //送货备注
					productionRemark : '',   //生产备注
					lengthF          : '',   //横向公式
					widthF           : '',   //纵向公式
				},
				pageConfig:{
					minDate : '',
					maxDate : '',
					minBoxH : '',
					maxBoxH : '',
					minBoxL : '',
					maxBoxL : '',
					minBoxW : '',
					maxBoxW : '',
					minArea : '',
					maxArea : '',
				},
				rules:{
					calcBdLW : {
						boxLength : [
							{ validator: (rule, value, callback, source, options)=>{
								let errors;
								if( Number(value) > this.pageConfig.maxBoxL || Number(value) < this.pageConfig.minBoxL){
									errors = '板宽范围:' + this.pageConfig.minBoxL + 'mm~' + this.pageConfig.maxBoxL + 'mm';
								}
								callback(errors);
							} }
						],
						boxWidth : [
							{ validator: (rule, value, callback, source, options)=>{
								let errors;
								if( Number(value) > this.pageConfig.maxBoxW || Number(value) < this.pageConfig.minBoxW){
									errors = '板宽范围:' + this.pageConfig.minBoxW + 'mm~' + this.pageConfig.maxBoxW + 'mm';
								}
								callback(errors);
							}  }
						],
						boxHeight : [
							{ validator: (rule, value, callback, source, options)=>{
								let errors;
								if( Number(value) > this.pageConfig.maxBoxH || Number(value) < this.pageConfig.minBoxH){
									errors = '板宽范围:' + this.pageConfig.minBoxH + 'mm~' + this.pageConfig.maxBoxH + 'mm';
								}
								callback(errors);
							} }
						]
					},
					buildOrder:{
						cusOrderId : [
							{ required : true , message:'客订单号不能为空' }
						],
						materialType : [
							{ required : true , message:'请选择材质' }
						],
						length : [
							{ required : true , message:'请填写相关信息获取板长' }
						],
						width  : [
							{ required : true , message:'请填写相关信息获取板宽' }
						],
						bdQty  : [
							{ required : true , message:'请填写相关信息获取纸板数' }
						],
						area : [
							{ validator: (rule, value, callback, source, options)=>{
								let errors;
								if( Number(value) > this.pageConfig.maxArea || Number(value) < this.pageConfig.minArea){
									errors = '下单面积范围:' + this.pageConfig.minArea + '㎡~' + this.pageConfig.maxArea + '㎡';
								}
								callback(errors);
							} }
						],
						address : [
							{ required : true , message:'请选择送货公司' }
						],
						date : [
							{ required : true , message:'请填写交货日期' }
						],

					}
				},
				validator:{
					calcBdLW   : {},
					buildOrder : {}
				}
			}
		},
		methods:{
			clickQuestion( type ){
				let info = '';
				if( type == 1 ){
					info = '箱长范围:' + this.pageConfig.minBoxL + '~' + this.pageConfig.maxBoxL + '\n'; 
					info += '箱宽范围:' + this.pageConfig.minBoxW + '~' + this.pageConfig.maxBoxW + '\n';
					info += '箱高范围:' + this.pageConfig.minBoxH + '~' + this.pageConfig.maxBoxW;
				}
				if( type == 2 ){
					info = '正数:几个纸板&nbsp;=>&nbsp;1个纸箱\n负数:1个纸板&nbsp;=>&nbsp;几个纸箱';
				}
				if( type == 3 ){
					info = '下单面积范围:' + this.pageConfig.minArea + '~' + this.pageConfig.maxArea;
				}
				Dialog.alert({
					message : info
				}).then(()=>{
					Dialog.close();
				});
			},
			buildOrder(){
				let self = this;
				this.validator.validate(this.formData).then(()=>{
					self.config.popup.sku.show = true;
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message);
				});
			},
			getConfig( fastOrderId ){
				let self = this;
				this.$request.client.orderBooking.cBuildConfig( fastOrderId ).then(res=>{
					console.log(res)
					self.pageConfig.minBoxH = res.result.config.BuildMinBoxH;
					self.pageConfig.maxBoxH = res.result.config.BuildMaxBoxH;
					self.pageConfig.minBoxL = res.result.config.BuildMinBoxL;
					self.pageConfig.maxBoxL = res.result.config.BuildMaxBoxL;
					self.pageConfig.minBoxW = res.result.config.BuildMinBoxW;
					self.pageConfig.maxBoxW = res.result.config.BuildMaxBoxW;
					self.pageConfig.minArea = res.result.config.BuildMinArea;
					self.pageConfig.maxArea = res.result.config.BuildMaxArea;
					self.pageConfig.minDate = res.result.config.BuildMinDate;
					self.pageConfig.maxDate = res.result.config.BuildMaxDate;

					res.result.board_select_list.forEach((item,index)=>{
						if( item.BoardName == null ){
							self.config.radioData.material.push({ value : item.BoardId , text: '', tag:item.IsUsedBoard });
						}else{
							self.config.radioData.material.push({ value : item.BoardId , text: item.BoardName, tag:item.IsUsedBoard });
						}
					});
					res.result.cus_info.forEach((item,index)=>{
						self.config.radioData.address.push( { value : item.CusSubNo, text:item.SubDNAddress, tag : ''} );
					});
					res.result.box_type_availabel.forEach((item,index)=>{
						self.config.radioData.boxType.push( { value : item.BoxId, text:item.BoxName, lengthF:item.LengthF, widthF:item.WidthF } )
					});
					res.result.config.BuildTonLen.forEach((item,index)=>{
						self.config.radioData.tonLen.push({ value: item, text: item });
					});
					res.result.config.BuildULen.forEach((item,index)=>{
						self.config.radioData.uLen.push({ value: item, text: item });
					});
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.timeFilter.isFinishLoad = true;
					})
				});
			},
			saveOrder( data ){
				let self = this;
				this.$request.client.orderBooking.cBuildSave( data ).then(res=>{

				});
			},
			calcBdLW(){
				let self = this;
				this.validator.calcBdLW.validate(this.formData).then(()=>{
					
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message);
				});
			},
			getBoxFormula( boxType ){
				if( this.formData.materialType ){
					let self = this;
					this.$request.client.orderBooking.getBoxFormula( boxType ).then(res=>{
						console.log(res);
					});
				}
			},
			getClackAdjust( materialType ){
				let self = this;
				this.$request.client.orderBooking.getClackAdjust( materialType ).then(res=>{
					console.log(res);
				});
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','纸箱纸板下单');
		},
		mounted(){
			if( typeof( this.$route.params.orderId ) != 'undefined' && this.$route.params.orderId != null ){
				this.getConfig( this.$route.params.orderId )
			}else{
				this.getConfig( '' );
			}
			this.validator.calcBdLW   = new schema(this.rules.calcBdLW);
			this.validator.buildOrder = new schema(this.rules.buildOrder);
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			boxTypeChange(){
				return this.formData.boxType;
			}
		},
		watch:{
			boxTypeChange( newV,oldV ){
				if( newV != '' ){
					for (var i = this.config.radioData.boxType.length - 1; i >= 0; i--) {
						if(this.config.radioData.boxType[i].value == newV){
							this.formData.lengthF = this.config.radioData.boxType[i].lengthF;
							this.formData.widthF  = this.config.radioData.boxType[i].widthF;
							break;
						}
					}
				}
			}
		}
	}
</script>