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
		<van-field v-model="formData.cusOrderId" input-align="center" label="横向公式" placeholder="待选择箱型" readonly/>
		<van-field v-model="formData.cusOrderId" input-align="center" label="纵向公式" placeholder="待选择箱型" readonly/>
		<van-field label="纸板规格(mm)">
			<div class="van-row van-row--flex van-row--justify-center" slot="input">
				<div class="van-col van-col--8" >
					<input placeholder="板长" v-model="formData.length" style="width:100%;"/>
				</div>
				<div class="van-col van-col--1">
					x
				</div>
				<div class="van-col van-col--8" >
					<input placeholder="板宽" v-model="formData.width" style="width:100%;"/>
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
	</div>
</template>
<script>
	import { Button, Field, Dialog } from 'vant';
	import PopupSelect from '@/components/subject/build/PopupSelect.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,

			PopupSelect,
			NewTimePicker
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
				},
				pageConfig:{
					minDate : '',
					maxDate : ''
				}
			}
		},
		methods:{
			clickQuestion( type ){
				let info = '';
				if( type == 1 ){
					info = '箱长范围:'; 
				}
				if( type == 2 ){

				}
				if( type == 3 ){

				}
				Dialog.alert({
					message : info
				}).then(()=>{
					Dialog.close();
				});
			},
			buildOrder(){
				
			},
			saveOrder( data ){
				console.log(data)
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','纸箱纸板下单');
		},
		mounted(){

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