<template>
	<div>
		<wx-scan :scanResult.sync="formData.inNo" urlType="2"></wx-scan>
		<van-field readonly v-model="formData.inNo" placeholder="订单信息" label="条形码编号" input-align="center">
		</van-field>
		<div class="van-row" style="text-align:left;">
			<div class="van-col van-col--12">
				<van-field v-model="formData.inNo" placeholder="入库数" label="入库数" input-align="center" type="number" :maxlength="3">
				</van-field>
			</div>
			<div class="van-col van-col--12">
				<van-field v-model="formData.inNo" placeholder="班次" label="班次" input-align="center" :maxlength="10">
				</van-field>
			</div>
		</div>
		<div class="van-row" style="text-align:left;">
			<div class="van-col van-col--12">
				<van-field readonly v-model="formData.inNo" label="已入库数" input-align="center" type="number" :maxlength="3" placeholder="已入库数">
				</van-field>
			</div>
			<div class="van-col van-col--12">
				<van-field readonly v-model="formData.inNo" label="传单库区" input-align="center" :maxlength="10" placeholder="传单库区">
				</van-field>
			</div>
		</div>
		<van-field readonly clickable label="库区"></van-field>
		<van-field readonly clickable label="入库日期" v-model="formData.dInDate" input-align="center"  @click="config.popup.timePicker.show = true " placeholder="选择入库日期">
			<van-icon slot="right-icon" size="16" name="arrow"/>
		</van-field>
	   	<van-field v-model="message" autosize label="备注" type="textarea" maxlength="50" placeholder="请输入备注" rows="2" show-word-limit/>
	   	<div class="van-row" style="text-align:center;margin-top:50px;" >
			<div class="van-col van-col--12">
				<van-button type="primary" size="normal" style="width:60%">入库</van-button>
			</div>
			<div class="van-col van-col--12">
				<van-button type="primary" size="normal" style="width:60%">重置</van-button>
			</div>
		</div>
		<new-time-picker v-if="pickerLoad" :dateTimeShow.sync="config.popup.timePicker.show" :dateTime.sync="formData.dInDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate"></new-time-picker>
	</div>
</template>
<script>
	import { Button, Icon, Field } from 'vant';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import WxScan from '@/components/subject/WxScan.vue';
	import { dateTimeFormat } from '@/util/index';
	export default {
		components:{
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Field.name]: Field,

			NewTimePicker,
			WxScan
		},
		data(){
			return {
				pickerLoad:false,
				message:'',
				formData:{
					inNo:'',
					dInDate:'',
				},
				config:{
					popup:{
						timePicker:{
							show : false
						}
					}
				},
				formData:{
					strOrderId   : '',
					strOrderInfo : '',
					dInDate : ''
				},
				pageConfig:{
					maxDate    : '',
					minDate    : '',
				}
			}
		},
		methods:{
			directInConfig(){
				let self = this;
				this.$request.staff.paper.directInConfig().then(res=>{
					self.pageConfig.maxDate = res.result.time.DirectInStockMaxDate;
					self.pageConfig.minDate = res.result.time.DirectInStockMinDate;
					self.formData.dInDate   = res.result.time.DirectInStockDate;
				}).then(()=>{
					this.$nextTick(()=>{
						this.pickerLoad = true;
					})
				});
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','直接入库');
		},
		mounted(){
			this.directInConfig();
		},
		computed:{
			dInDateChange(){
				return this.formData.dInDate;
			}
		},
		watch:{
			dInDateChange( newVal, oldVal ){
				console.log(newVal)
			}
		}
	}
</script>
<style>
	.van-field__word-limit{
		line-height: 1rem;
	}
</style>