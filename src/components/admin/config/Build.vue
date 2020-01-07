<template>
	<div>
		<van-collapse v-model="activeName" accordion>
			<van-collapse-item title="常用材质使用报价价格材质" name="0">
				<van-switch-cell v-model="formData.UseQuoBoard" title="常用材质使用报价价格材质" />
			</van-collapse-item>
			<van-collapse-item title="板长范围" name="1">
				<van-row justify="center">
					<van-col span="5">板长范围</van-col>
					<van-col span="7">
						<input v-model="formData.BuildMinLength" style="width:100%;">
					</van-col>
					<van-col span="2">mm</van-col>
					<van-col span="1">~</van-col>
					<van-col span="7">
						<input v-model="formData.BuildMaxLength" style="width:100%;">
					</van-col>
					<van-col span="2">mm</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="板宽范围" name="2">
				<van-row justify="center">
					<van-col span="5">板宽范围</van-col>
					<van-col span="7">
						<input v-model="formData.BuildMinWidth" style="width:100%;">
					</van-col>
					<van-col span="2">mm</van-col>
					<van-col span="1">~</van-col>
					<van-col span="7">
						<input v-model="formData.BuildMaxWidth" style="width:100%;">
					</van-col>
					<van-col span="2">mm</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="箱长范围" name="3">
				<van-row justify="center">
					<van-col span="5">箱长范围</van-col>
					<van-col span="7">
						<input v-model="formData.BuildMinBoxL" style="width:100%;">
					</van-col>
					<van-col span="2">mm</van-col>
					<van-col span="1">~</van-col>
					<van-col span="7">
						<input v-model="formData.BuildMaxBoxL" style="width:100%;">
					</van-col>
					<van-col span="2">mm</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="箱宽范围" name="4">
				<van-row justify="center">
					<van-col span="5">箱宽范围</van-col>
					<van-col span="7">
						<input v-model="formData.BuildMinBoxW" style="width:100%;">
					</van-col>
					<van-col span="2">mm</van-col>
					<van-col span="1">~</van-col>
					<van-col span="7">
						<input v-model="formData.BuildMaxBoxW" style="width:100%;">
					</van-col>
					<van-col span="2">mm</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="箱高范围" name="5">
				<van-row justify="center">
					<van-col span="5">箱高范围</van-col>
					<van-col span="7">
						<input v-model="formData.BuildMinBoxH" style="width:100%;">
					</van-col>
					<van-col span="2">mm</van-col>
					<van-col span="1">~</van-col>
					<van-col span="7">
						<input v-model="formData.BuildMaxBoxH" style="width:100%;">
					</van-col>
					<van-col span="2">mm</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="箱舌(mm)" name="6">
				<van-row justify="center">
					<van-col span="5">箱舌(mm)</van-col>
					<van-col span="15">
						<input v-model="formData.BuildTonLen" style="width:100%;">
					</van-col>
					<van-col span="4">
						用,隔开
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="封箱调整(mm)" name="7">
				<van-row justify="center">
					<van-col span="5">封箱调整(mm)</van-col>
					<van-col span="15">
						<input v-model="formData.BuildULen" style="width:100%;">
					</van-col>
					<van-col span="4">
						用,隔开
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="自动获取默认的箱舌＆封箱调整" name="8">
				<van-switch-cell v-model="formData.BuildAutoGetTonLenAndULen" title="自动获取默认的箱舌＆封箱调整" />
			</van-collapse-item>
			<van-collapse-item title="压线名称" name="9">
				<van-row justify="center">
					<van-col span="5">压线名称</van-col>
					<van-col span="15">
						<input v-model="formData.BuildScoreName" style="width:100%;">
					</van-col>
					<van-col span="4">
						用,隔开
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="纸板下单面积范围" name="10">
				<van-row justify="center">
					<van-col span="5">面积范围</van-col>
					<van-col span="7">
						<input v-model="formData.BuildMinArea" style="width:100%;">
					</van-col>
					<van-col span="2">㎡</van-col>
					<van-col span="1">~</van-col>
					<van-col span="7">
						<input v-model="formData.BuildMaxArea" style="width:100%;">
					</van-col>
					<van-col span="2">㎡</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="纸箱下单订单数范围" name="11">
				<van-row justify="center">
					<van-col span="5">订单数范围</van-col>
					<van-col span="9">
						<input v-model="formData.BuildMinOrdQty" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.BuildMaxOrdQty" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="默认交货日期" name="12">
				<van-row justify="center">
					<van-col span="5">默认日期</van-col>
					<van-col span="9">
						<input v-model="formData.BuildDeliveryDate" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="5">日期范围</van-col>
					<van-col span="9">
						<input v-model="formData.BuildMinDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.BuildMaxDate" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
		</van-collapse>
		<div style="width:100%;height:3.125rem;"></div>
		<div style="width:100%;position:fixed;bottom:3.125rem;">
			<van-button round type="primary" style="width:50%;" @click="saveConfig()">
				保存
			</van-button>
			<van-button round type="info" style="width:50%;" @click="getConfig()">
				重置
			</van-button>
		</div>
	</div>
</template>
<script>
	import { Button, Row, Col, SwitchCell, Dialog, Collapse, CollapseItem } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[Row.name]: Row,
			[Col.name]: Col,
			[SwitchCell.name]: SwitchCell,
			[Collapse.name]: Collapse,
			[CollapseItem.name]: CollapseItem,
		},
		data(){
			return {
				activeName:'',
				formData : {
					UseQuoBoard               : '',  //常用材质使用报价价格材质
					BuildMinLength            : '',  //板长范围
					BuildMaxLength            : '',  //板长范围
					BuildMinWidth             : '',  //板宽范围
					BuildMaxWidth             : '',  //板宽范围
					BuildMinBoxL              : '',  //箱长范围
					BuildMaxBoxL              : '',  //箱长范围
					BuildMinBoxW              : '',  //箱宽范围
					BuildMaxBoxW              : '',  //箱宽范围
					BuildMinBoxH              : '',  //箱高范围
					BuildMaxBoxH              : '',  //箱高范围
					BuildAutoGetTonLenAndULen : '',  //自动获取默认的箱舌＆封箱调整
					BuildScoreName            : '',  //压线名称
					BuildMinArea              : '',  //纸板下单面积范围
					BuildMaxArea              : '',  //纸板下单面积范围
					BuildMinOrdQty            : '',  //纸箱下单订单数范围
					BuildMaxOrdQty            : '',  //纸箱下单订单数范围
					BuildDeliveryDate         : '',  //交货日期(默认)
					BuildMinDate              : '',  //交货日期(范围)
					BuildMaxDate              : '',  //交货日期
				}
			}
		},
		methods:{
			getConfig(){
				let self = this;
				this.$request.admin.config.getConfig().then((res)=>{
					Object.assign(self.formData,res.result);
				}).then(()=>{
					if( this.formData.UseQuoBoard == 1 ){
						this.formData.UseQuoBoard = true;
					}else{
						this.formData.UseQuoBoard = false;
					}
					if( this.formData.BuildAutoGetTonLenAndULen == 1 ){
						this.formData.BuildAutoGetTonLenAndULen = true;
					}else{
						this.formData.BuildAutoGetTonLenAndULen = false;
					}
				});
			},
			saveConfig(){
				let postData = Object.assign({},this.formData);
				postData.UseQuoBoard = this.formData.UseQuoBoard ? 1 : 0;
				postData.BuildAutoGetTonLenAndULen = this.formData.BuildAutoGetTonLenAndULen ? 1 : 0;
				this.$request.admin.config.saveConfig( JSON.stringify( postData ) ).then(res=>{
					let message = ''
					if( res.errorCode == '00000' ){
						message = '修改成功!';
					}else{
						message = '修改失败!';
					}
					Dialog.alert({
						message : message
					}).then(()=>{
						Dialog.close();
					});
				}).then(()=>{
					this.getConfig();
				});
			},
		},
		created(){
			this.$store.commit('admin/setHeaderTitle','下单参数');
		},
		mounted(){
			this.getConfig();
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