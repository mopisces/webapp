<template>
	<div>
		<van-field v-model="formData.cusOrderId" input-align="center" label="客订单号" placeholder="未填写则系统自动生成"/>
		<popup-select :selectValue.sync="formData.materialType" :fieldConfig="config.fieldConfig.material" :radioData="config.radioData.material" selectType="material"></popup-select>
		<van-field v-model="value" clearable label="纸板规格(mm)" right-icon="question-o" @click-right-icon="$toast('板长范围:' + pageConfig.minLength + 'mm~' + pageConfig.maxLength + 'mm\n板宽范围:' + pageConfig.minWidth +'mm~' + pageConfig.maxWidth + 'mm' )">
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
		<new-time-picker :dateTime.sync="formData.date" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="交货日期"></new-time-picker>
		<van-field v-model="formData.deliveryRemark" rows="1" autosize label="送货备注" type="textarea"  maxlength="50" placeholder="填写送货备注" show-word-limit/>
		<van-field v-model="formData.productionRemark" rows="1" autosize label="生产备注" type="textarea"  maxlength="50" placeholder="填写生产备注" show-word-limit/>
		<van-button  type="primary" size="normal" style="width:100%;" @click="buildOrder()">下单</van-button>
	</div>
</template>
<script>
	import { Button, Icon, Popup, Field, Toast } from 'vant';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import PopupSelect from '@/components/subject/build/PopupSelect.vue';
	import schema from 'async-validator';
	export default {
		components:{
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Field.name]: Field,

			NewTimePicker,
			PopupSelect
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
					/*cusOrderId : [
						{ regexp }
					],
					materialType : [
						{ required : true, message : '请选择材质' }
					],*/
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

				},
				validator : {}
			}
		},
		methods:{
			getConfig( fastOrderId ){
				let self = this;
				this.$request.client.orderBooking.sBuildConfig( fastOrderId ).then(res=>{
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
				});
			},
			buildOrder(){
				let self = this;
				this.validator.validate(this.formData).then(()=>{
					/*self.changePass( self.formData );*/
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message);
				});
				//this.calc();
			},
			calc(){
				this.formData.area = this.formData.boardLength * this.formData.boardWidth * this.formData.orderQuantities / 1000000;
				if( this.formData.area > this.pageConfig.maxArea || this.formData.area < this.pageConfig.minArea ){
					Toast.fail('下单面积范围:' + this.pageConfig.minArea + '㎡~' + this.pageConfig.maxArea + '㎡');
					this.formData.area            = '';
					this.formData.orderQuantities = '';
				}
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