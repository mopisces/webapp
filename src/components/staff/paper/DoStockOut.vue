<template>
	<div>
		<wx-scan :scanResult.sync="formData.stockOutNo" urlType="0"></wx-scan>
		{{ formData.stockOutNo }}
		<van-field readonly label="门幅(mm)" v-model="value" placeholder="自动查询" input-align="center"></van-field>
		<van-field readonly label="纸质" v-model="value" placeholder="自动查询" input-align="center"></van-field>
		<van-field readonly label="克重(g)" v-model="value" placeholder="自动查询" input-align="center"></van-field>
		<van-field readonly label="重量(kg)" v-model="value" placeholder="自动查询" input-align="center"></van-field>
		<van-field label="班次" v-model="formData.stockOutOpClass" placeholder="输入班次" input-align="center"></van-field>
		<van-field label="机台" v-model="formData.stockOutSFlute" placeholder="输入班次" input-align="center"></van-field>
		<van-field label="剥纸重量" v-model="formData.stockOutBzwt" type="number" input-align="center"></van-field>
		<van-field readonly clickable label="出库日期" v-model="formData.stockOutOpTime" input-align="center"  @click="pageConfig.show = true "></van-field>
		<time-picker :dateTimeShow.sync="pageConfig.show" :dateTime.sync="pageConfig.pickerDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" @onCancel="timePickerCancel" @onConfirm="timePickerConfirm">
		</time-picker>
		<van-button type="primary" size="normal" style="width:100%;position:fixed;bottom:55px;">出库</van-button>
	</div>
</template>
<script>
	import { Button, Field   } from 'vant';
	import TimePicker from '@/components/subject/TimePicker.vue';
	import { dateTimeFormat } from '@/util/index';
	import WxScan from '@/components/subject/WxScan.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,

			TimePicker,
			WxScan
		},
		data(){
			return {
				value:'',
				pageConfig:{
					minDate:new Date(),
					maxDate:new Date(),
					pickerDate:new Date(),
					show:false
				},
				formData:{
					stockOutNo:'',
					stockOutOpClass:'',
					stockOutOpTime:'',
					stockOutSFlute:'',
					stockOutBzwt:0
				}
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
					self.pageConfig.maxDate      = new Date(res.result.DoStockOutMaxDate);
					self.pageConfig.minDate      = new Date(res.result.DoStockOutMinDate);
					self.pageConfig.pickerDate   = new Date(res.result.DoStockOutOpTime);
					self.formData.stockOutOpTime = res.result.DoStockOutOpTime;
				});
			}
			
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','原纸出库');
		},
		mounted(){
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
				if( newV.length === 12 ){
					console.log(1)
				}
			}
		}
	}
</script>