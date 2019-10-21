<template>
	<div>
		<van-field v-model="formData.stockOutNo" placeholder="请输入用户名" label="条形码编号" input-align="center">
		 	<van-icon class-prefix="iconfont" size="18" name="saomiao4" slot="right-icon"/>
		</van-field>
		<van-field readonly label="门幅(mm)" v-model="value" placeholder="自动查询" input-align="center"></van-field>
		<van-field readonly label="纸质" v-model="value" placeholder="自动查询" input-align="center"></van-field>
		<van-field readonly label="克重(g)" v-model="value" placeholder="自动查询" input-align="center"></van-field>
		<van-field readonly label="重量(kg)" v-model="value" placeholder="自动查询" input-align="center"></van-field>
		<van-field label="班次" v-model="formData.stockOutOpClass" placeholder="输入班次" input-align="center"></van-field>
		<van-field label="机台" v-model="formData.stockOutSFlute" placeholder="输入班次" input-align="center"></van-field>
		<van-field label="剥纸重量" v-model="formData.stockOutBzwt" type="number" input-align="center"></van-field>
		<van-field readonly clickable label="出库日期" v-model="formData.stockOutOpTime" input-align="center"  @click="pageConfig.show = true "></van-field>
		<time-picker :dateTimeShow="pageConfig.show" :dateTime="pageConfig.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" @clickOverlay="timePickerCancel" @onCancel="timePickerCancel" @onConfirm="timePickerConfirm">
		</time-picker>
	</div>
</template>
<script>
	import { Field, Icon } from 'vant';
	import TimePicker from '@/components/subject/TimePicker.vue';
	import { dateTimeFormat } from '@/util/index';
	export default {
		components:{
			[Field.name]: Field,
			[Icon.name]: Icon,

			TimePicker
		},
		data(){
			return {
				value:'',
				pageConfig:{
					minDate:new Date(),
					maxDate:new Date('2019-10-23'),
					beginDate:new Date(),
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
				console.log(val.value)
				this.pageConfig.beginDate = val.value;
				this.timePickerCancel();
			}
		},
		mounted(){

		},
		created(){
			
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
				
			}
		}
	}
</script>