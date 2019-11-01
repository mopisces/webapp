<template>
	<div>
		<van-field v-model="formData.stockInNo" placeholder="请输入订单号" label="条形码编号" input-align="center">
		 	<van-icon class-prefix="iconfont" size="18" name="saomiao4" slot="right-icon" color="#0bf147" />
		</van-field>
		<van-field readonly label="门幅(mm)" v-model="value" placeholder="自动查询" input-align="center"></van-field>
		<van-field readonly label="纸质" v-model="value" placeholder="自动查询" input-align="center"></van-field>
		<van-field readonly label="克重(g)" v-model="value" placeholder="自动查询" input-align="center"></van-field>
		<van-field readonly label="重量(kg)" v-model="value" placeholder="自动查询" input-align="center"></van-field>
		<van-field label="回仓重量" v-model="value" placeholder="输入回仓重量" input-align="center"></van-field>
		<van-field readonly clickable label="入库日期" v-model="formData.inOpTime" input-align="center"  @click="pageConfig.show = true "></van-field>
		<time-picker :dateTimeShow="pageConfig.show" :dateTime="pageConfig.pickerDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" @clickOverlay="timePickerCancel" @onCancel="timePickerCancel" @onConfirm="timePickerConfirm">
		</time-picker>
		<van-button type="primary" size="normal" style="width:100%;position:fixed;bottom:100px;">入库</van-button>
	</div>
</template>
<script>
	import { Button, Icon, Field } from 'vant';
	import TimePicker from '@/components/subject/TimePicker.vue';
	import { dateTimeFormat } from '@/util/index';
	export default {
		components:{
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Field.name]: Field,
			TimePicker
		},
		data(){
			return {
				value:'',
				formData:{
					stockInNo:'',
					inOpTime:''
				},
				autoData:{

				},
				pageConfig:{
					show:false,
					maxDate:new Date(),
					minDate:new Date(),
					pickerDate:new Date(),
				}
			}
		},
		methods:{
			getPageConfig(){
				let self = this;
				this.$request.staff.paper.paperWxConfig().then(res=>{
					self.pageConfig.maxDate = new Date(res.result.time.DoRStockInMaxDate);
					self.pageConfig.minDate = new Date(res.result.time.DoRStockInMinDate);
					self.pageConfig.pickerDate = new Date(res.result.time.DoRStockInOpTime);

					self.formData.inOpTime = res.result.time.DoRStockInOpTime;
				});
			},
			timePickerConfirm( val ){
				this.formData.inOpTime = dateTimeFormat(val.value,'yyyy-MM-dd');
				this.timePickerCancel();
			},
			timePickerCancel(){
				this.pageConfig.show = false;
			}
		},
		mounted(){
			this.getPageConfig();
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','原纸入库');
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>