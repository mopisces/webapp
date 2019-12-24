<template>
	<div>
		<van-card thumb="https://img.yzcdn.cn/vant/t-thirt.jpg">
			<div slot="title">-323B/BA</div>
			<van-count-down :time="time" slot="desc">
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
			<div slot="price">¥0.25~0.30/㎡</div>
			<div slot="origin-price">¥0.35/㎡</div>
		</van-card>
		<van-field v-model="formData.cusOrderId" label="客订单号" input-align="center" placeholder="未填写则系统自动生成"></van-field>
		<van-field clearable label="纸板规格(mm)" right-icon="question-o" >
			<div class="van-row van-row--flex van-row--justify-center" slot="input">
				<div class="van-col van-col--8">
					<input type="number" placeholder="板长" v-model="formData.boardLength" class="van-field__control van-field__control--center" style="border:1px solid #000;"/>
				</div>
				<div class="van-col van-col--3" style="text-align:center;">
					x 
				</div>
				<div class="van-col van-col--8">
					<input type="number" placeholder="板宽" v-model="formData.boardWidth" class="van-field__control van-field__control--center" style="border:1px solid #000;"/>
				</div>
			</div>
		</van-field>
		<popup-select :selectValue.sync="formData.lineBallInfo" :fieldConfig="config.fieldConfig.lineBall" :radioData="config.radioData.lineBall" selectType="lineBall"></popup-select>
		<van-field v-model="formData.lineBallFormula" input-align="center" label="压线信息" placeholder="压线和=板宽(格式:x+x+x)"/>
		<van-field v-model="formData.orderQuantities" input-align="center" type="number" label="订单数" placeholder="输入订单数"/>
		<van-field v-model="formData.area" clearable readonly input-align="center" label="下单面积(㎡)" placeholder="待计算" right-icon="question-o" >
		</van-field>
		<popup-select :selectValue.sync="formData.address" :fieldConfig="config.fieldConfig.cusInfo" :radioData="config.radioData.cusInfo" selectType="cusInfo"></popup-select>
		<new-time-picker :dateTime.sync="formData.date" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="交货日期" v-if="config.popup.timeFilter.isFinishLoad"></new-time-picker>
		<van-field v-model="formData.deliveryRemark" rows="1" autosize label="送货备注" type="textarea"  maxlength="50" placeholder="填写送货备注" show-word-limit/>
		<van-field v-model="formData.productionRemark" rows="1" autosize label="生产备注" type="textarea"  maxlength="50" placeholder="填写生产备注" show-word-limit/>
		<div style="height:2rem;width:100%;"></div>
		<van-submit-bar :price="3050" button-text="提交订单">
			<div slot="default">
				节省金额：<span style="color:rgb(224, 24, 53);">¥200.00</span>
			</div>
			<div slot="top" style="font-size:1rem;text-align:center;" >
				当前价格:<span style="color: rgb(224, 24, 53);">¥0.30/㎡</span><br/>
				订单数满<span style="color: rgb(68, 187, 0); text-decoration: underline; cursor: pointer;font-size:1rem;">200000</span>价格减至 <span style="color: rgb(224, 24, 53);">¥0.25/㎡</span>
			</div>
		</van-submit-bar>
	</div>
</template>
<script>
	import { Field, CountDown, Card, SubmitBar  } from 'vant';
	import PopupSelect from '@/components/subject/build/PopupSelect.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	export default {
		components:{
			[Field.name]: Field,
			[CountDown.name]: CountDown,
			[Card.name]: Card,
			[SubmitBar.name]: SubmitBar,
		
			PopupSelect,
			NewTimePicker
		},
		data(){
			return {
				time:10000000000 - 38000,
				config : {
					fieldConfig: {
						lineBall : {
							label       : '压线名称',
							placeholder : '选择压线名称'
						},
						cusInfo : {
							label       : '送货公司',
							placeholder : '选择送货公司'
						}
					},
					radioData : {
						lineBall : [],
						cusInfo  : []
					},
					popup:{
						timeFilter : {
							isFinishLoad : false
						}
					},
					countDown:{
						time : 0
					}
				},
				formData : {
					cusOrderId      : '',
					boardLength     : '',
					boardWidth      : '',
					lineBallInfo    : '',
					lineBallFormula : '',
					orderQuantities : 0,
					area            : 0,
					address         : '',
					date            : '',
					deliveryRemark  : '',
					productionRemark: ''
				},
				pageConfig : {
					minDate   : '',
					maxDate   : '',
					minLength : 0,
					maxLength : 0,
					minWidth  : 0,
					maxWidth  : 0,
				},
				cardInfo : {

				},
			}
		},
		methods:{
			getConfig( goodsId ){
				let self = this;
				this.$request.client.groupBuying.getSConfig( goodsId ).then(res=>{
					console.log(res)
					self.pageConfig.minDate   = res.result.page_config.BuildMinDate;
					self.pageConfig.maxDate   = res.result.page_config.BuildMaxDate;
					self.pageConfig.minLength = res.result.page_config.BuildMinLength;
					self.pageConfig.maxLength = res.result.page_config.BuildMaxLength;
					self.pageConfig.minWidth  = res.result.page_config.BuildMinWidth;
					self.pageConfig.maxWidth  = res.result.page_config.BuildMaxWidth;
					self.formData.date = res.result.page_config.BuildDeliveryDate;
					res.result.page_config.BuildScoreName.forEach((item,index)=>{
						self.config.radioData.lineBall.push( { value:item, text:'' } );
					});
					res.result.cus_info.forEach((item,index)=>{
						self.config.radioData.cusInfo.push( { value : item.CusSubNo, text:item.SubDNAddress} );
					});
					self.formData.address = res.result.ERPId;

				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.timeFilter.isFinishLoad = true;
					});
				});
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','简单纸板下单');
		},
		mounted(){
			this.getConfig( 5 );
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
<style>
	.build-item{
		width: 2.5625rem;
		color: #fff;
		font-size: 1rem;
		text-align: center;
		background-color: #ee0a24;
		border-radius: 0.1875rem;
		/* margin-right: 0.3125rem; */
	}
</style>
