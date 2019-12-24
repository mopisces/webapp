<template>
	<div>
		<van-card>
			<div slot="title">
				{{ cardInfo.boardId }}
				<span style="color:#000;" v-if="cardInfo.title">,{{ cardInfo.title }}</span>
			</div>
			<van-count-down :time="cardInfo.countDown.time" slot="desc" v-if="cardInfo.countDown.show">
				<template v-slot="timeData">
					<span>距团购结束：</span>
					<span class="build-item">{{ timeData.days }}</span>
					<span>天</span>
					<span class="build-item">{{ timeData.hours }}</span>
					<span>:</span>
					<span class="build-item">{{ timeData.minutes }}</span>
					<span>:</span>
					<span class="build-item">{{ timeData.seconds }}</span>
				</template>
			</van-count-down>
			<div slot="price">¥{{ cardInfo.productPrice }}/㎡</div>
			<div slot="origin-price">¥{{ cardInfo.marketPrice }}/㎡</div>
			<van-image :src="cardInfo.pic" slot="thumb"/>
		</van-card>
		<van-field v-model="formData.cusOrderId" label="客订单号" input-align="center" placeholder="未填写则系统自动生成"></van-field>
		<popup-select :selectValue.sync="formData.boxType" :fieldConfig="config.fieldConfig.boxType" :radioData="config.radioData.boxType" selectType="boxType" @boxTypeConfirm="getBoxFormula( formData.boxType )"></popup-select>
		<van-field label="纸箱规格(mm)" right-icon="question-o">
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
		<popup-select :selectValue.sync="formData.tonLen" :fieldConfig="config.fieldConfig.tonLen" :radioData="config.radioData.tonLen" selectType="tonLen" @lenConfirm="calcBdLW()"></popup-select>
		<popup-select :selectValue.sync="formData.uLen" :fieldConfig="config.fieldConfig.uLen" :radioData="config.radioData.uLen" selectType="uLen" @lenConfirm="calcBdLW()"></popup-select>
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
		<van-field v-model="formData.bdMultiple" input-align="center" label="张数" placeholder="待选择箱型" readonly right-icon="question-o" />
		<van-field v-model="formData.ordQty" input-align="center" label="订单数" placeholder="输入订单数" @blur="calcBdQty()"/>
		<van-field v-model="formData.bdQty" input-align="center" label="纸板数" placeholder="待计算" readonly/>
		<van-field v-model="formData.area" input-align="center" label="下单面积(㎡)" placeholder="待计算" readonly right-icon="question-o" @click-right-icon="clickQuestion(3)" />
		<popup-select :selectValue.sync="formData.address" :fieldConfig="config.fieldConfig.address" :radioData="config.radioData.address" selectType="cusInfo"></popup-select>
		<new-time-picker :dateTime.sync="formData.date" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="交货日期" v-if="config.popup.timeFilter.isFinishLoad"></new-time-picker>
		<van-field v-model="formData.deliveryRemark" rows="1" autosize label="送货备注" type="textarea"  maxlength="50" placeholder="填写送货备注" show-word-limit/>
		<van-field v-model="formData.productionRemark" rows="1" autosize label="生产备注" type="textarea"  maxlength="50" placeholder="填写生产备注" show-word-limit/>
		<van-submit-bar :price=" formData.cost * 100 " button-text="提交订单">
			<div slot="top" style="font-size:1rem;text-align:center;" v-if="formData.isRangePrice">
				当前价格:<span style="color: rgb(224, 24, 53);">¥{{ formData.price }}/㎡</span>
				<van-tag mark type="danger" v-if=" helpInfo.sheetQuantities == 0 && helpInfo.price == 0 ">最低价</van-tag><br/>
				<template  v-if=" helpInfo.sheetQuantities != 0 && helpInfo.price != 0 ">
					订单数满<span style="color: rgb(68, 187, 0); text-decoration: underline; cursor: pointer;font-size:1rem;" @click="maxOrderQty()">{{ helpInfo.sheetQuantities }}</span>价格减至 <span style="color: rgb(224, 24, 53);">¥{{ helpInfo.price }}/㎡</span><br/>
				</template>
				<template>
					节省金额：<span style="color:rgb(224, 24, 53);">¥{{ formData.saveCost }}</span>
				</template>
			</div>
		</van-submit-bar>
		<build-sku :skuShow.sync="config.popup.sku.show" :orderInfo="formData" orderType="c" @saveOrder="saveOrder" :isGroup="true"></build-sku>
		<build-result :resultShow.sync="config.result.show" :isGroup="false" :isSuccess="config.result.isSuccess" @clearFormData="clearFormData()" v-if="config.result.show" :cusOrderId="config.result.cusOrderId"></build-result>
	</div>
</template>
<script>
	import { Image, Field, Tag, Card, SubmitBar } from 'vant';
	import PopupSelect from '@/components/subject/build/PopupSelect.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import BuildSku from '@/components/subject/build/BuildSku.vue';
	import BuildResult from '@/components/subject/build/BuildResult.vue';
	import schema from 'async-validator';
	export default {
		components:{
			[Image.name]: Image,
			[Field.name]: Field,
			[Tag.name]: Tag,
			[Card.name]: Card,
			[SubmitBar.name]: SubmitBar,

			PopupSelect,
			NewTimePicker,
			BuildSku,
			BuildResult
		},
		data(){
			return {
				config : {
					fieldConfig:{
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
						boxType : [],
						tonLen  : [],
						uLen    : [],
						address : [],
					},
					popup:{
						timeFilter : {
							isFinishLoad : false
						},
						sku : {
							show : false,
						}
					},
					result : {
						show       : false,
						isSuccess  : false,
						cusOrderId : ''
					}
				},
				cardInfo:{
					boardId      : '',
					title        : '',
					productPrice : '',
					marketPrice  : '',
					pic          : require('@/assets/groupImg/zwtp.png'),
					countDown    :{
						time : 0,
						show : false,
					}
				},
				formData : {
					cusOrderId       : '',
					boxType          : '',
					boxLength        : '',
					boxWidth         : '',
					boxHeight        : '',
					tonLen           : '',
					uLen             : '',
					lengthF          : '',
					widthF           : '',
					length           : '',
					width            : '',
					bdMultiple       : '',
					ordQty           : '',
					bdQty            : '',
					area             : '',
					address          : '',
					date             : '',
					deliveryRemark   : '',
					productionRemark : '',
					cost             : '',
					price            : '',
					isRangePrice     : false,

				},
				pageConfig : {
					minDate : '',
					maxDate : '',
				},
				helpInfo:{
					sheetQuantities : '',
					price           : '',
				},
				validator : {},
				rules : {}
			}
		},
		methods:{
			getBoxFormula(){

			},
			calcBdLW(){

			},
			saveOrder( postData ){

			},
			clearFormData(){

			},
			
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