<template>
	<div>
		<van-field v-model="formData.inNo" placeholder="请输入订单号" label="条形码编号" input-align="center">
		 	<van-icon class-prefix="iconfont" size="18" name="saomiao4" slot="right-icon" color="#0bf147" />
		</van-field>
		<van-field readonly v-model="formData.inNo" placeholder="订单信息" label="条形码编号" input-align="center">
		</van-field>
		<div class="van-row" style="text-align:center;">
			<div class="van-col van-col--12">
				<van-field v-model="formData.inNo" placeholder="入库数" label="入库数" input-align="center" type="number" :maxlength="3">
				</van-field>
			</div>
			<div class="van-col van-col--12">
				<van-field v-model="formData.inNo" placeholder="班次" label="班次" input-align="center" :maxlength="10">
				</van-field>
			</div>
		</div>
		<div class="van-row" style="text-align:center;">
			<div class="van-col van-col--12">
				<van-field readonly v-model="formData.inNo" label="已入库数" input-align="center" type="number" :maxlength="3">
				</van-field>
			</div>
			<div class="van-col van-col--12">
				<van-field readonly v-model="formData.inNo" label="传单库区" input-align="center" :maxlength="10">
				</van-field>
			</div>
		</div>
		<van-field readonly clickable label="入库日期" v-model="formData.inOpTime" input-align="center"  @click="pageConfig.show = true "></van-field>
	   	<van-field v-model="message" autosize label="备注" type="textarea" maxlength="50" placeholder="请输入备注" rows="2"  show-word-limit/>
	   	<div class="van-row" style="text-align:center;margin-top:50px;" >
			<div class="van-col van-col--12">
				<van-button type="primary" size="normal" style="width:60%">入库</van-button>
			</div>
			<div class="van-col van-col--12">
				<van-button type="primary" size="normal" style="width:60%">重置</van-button>
			</div>
		</div>
	</div>
</template>
<script>
	import { Button, Icon, Field } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Field.name]: Field,
		},
		data(){
			return {
				message:'',
				formData:{
					inNo:'',
					inOpTime:'',
				},
				pageConfig:{
					show:false,

				}
			}
		},
		methods:{

		},
		mounted(){

		},
		created(){
			this.$store.commit('staff/setHeaderTitle','直接入库');
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>
<style>
	.van-field__word-limit{
		line-height: 1rem;
	}
</style>