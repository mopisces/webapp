<template>
	<div>
		<van-field v-model="value" input-align="center" label="客订单号" placeholder="未填写则系统自动生成"/>
		<van-field v-model="value" input-align="center" clickable readonly label="材质" placeholder="选择材质" >
			<van-icon slot="right-icon" name="arrow"/>
		</van-field>
		<van-field v-model="value" clearable label="纸板规格(mm)" right-icon="question-o" @click-right-icon="$toast('板长范围:10000~99999\n板宽范围:10000~99999')">
			<div class="van-row van-row--flex van-row--justify-center" slot="input">
				<div class="van-col van-col--12">
					<input type="number" placeholder="板宽" v-model="value" class="van-field__control van-field__control--center"/>
				</div>
				<div class="van-col van-col--1">
					x 
				</div>
				<div class="van-col van-col--11">
					<input type="number" placeholder="板长" v-model="value" class="van-field__control van-field__control--center"/>
				</div>
			</div>
		</van-field>
		<van-field v-model="value" input-align="center" clickable readonly label="压线名称" placeholder="选择压线名称" >
			<van-icon slot="right-icon" name="arrow"/>
		</van-field>
		<van-field v-model="value" input-align="center" label="压线信息" placeholder="压线和=板宽（格式：x+x+x）"/>
		<van-field v-model="value" input-align="center" type="number" label="订单数" placeholder="输入订单数"/>
		<van-field v-model="value" clearable readonly input-align="center" label="下单面积(㎡)" placeholder="待计算" right-icon="question-o" @click-right-icon="$toast('下单面积范围:')">
		</van-field>
		<van-field v-model="value" input-align="center" clickable readonly label="送货公司" placeholder="选择送货公司" >
			<van-icon slot="right-icon" name="arrow"/>
		</van-field>
		<new-time-picker :dateTime.sync="value" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="交货日期"></new-time-picker>
		<van-field v-model="value" rows="1" autosize label="送货备注" type="textarea"  maxlength="50" placeholder="填写送货备注" show-word-limit/>
		<van-field v-model="value" rows="1" autosize label="生产备注" type="textarea"  maxlength="50" placeholder="填写生产备注" show-word-limit/>
		<van-button  type="primary" size="normal" style="width:100%;">下单</van-button>
		
	</div>
</template>
<script>
	import { Button, Icon, Popup, Field, Toast } from 'vant';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Popup.name]: Popup,
			[Field.name]: Field,

			NewTimePicker
		},
		data(){
			return {
				value:'',
				pageConfig : {
					minDate : '',
					maxDate : ''
				},
				formData : {

				}
			}
		},
		methods:{
			getConfig( fastOrderId ){
				let self = this;
				this.$request.client.orderBooking.sBuildConfig( fastOrderId ).then(res=>{

				});
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','简单纸板下单');
			if( typeof( this.$route.params.orderId ) != 'undefined' && this.$route.params.orderId != null ){

			}
			console.log();
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