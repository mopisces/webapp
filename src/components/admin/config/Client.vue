<template>
	<div>
		<van-collapse v-model="activeName" accordion>
			<van-collapse-item title="用户权限" name="0">
				<van-switch-cell v-model="formData.Wap1Right" title="用户权限" />
			</van-collapse-item>
			<van-collapse-item title="客户每日订单" name="1">
				<van-row justify="center">
					<van-col span="5">默认日期</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="5">日期范围</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="ERP订单" name="2">
				<van-row justify="center">
					<van-col span="5">默认日期</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="5">日期范围</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="统计下的ERP订单" name="3">
				<van-row justify="center">
					<van-col span="5">日期范围</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="订单统计" name="4">
				<van-row justify="center">
					<van-col span="5">默认日期</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="5">日期范围</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="退货统计" name="5">
				<van-row justify="center">
					<van-col span="5">默认日期</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="5">日期范围</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="传单统计" name="6">
				<van-row justify="center">
					<van-col span="5">默认日期</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="5">日期范围</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="库存统计" name="7">
				<van-row justify="center">
					<van-col span="5">默认日期</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="5">日期范围</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="7">在库超期天数</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="7">交货超期天数</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="生产分析总计" name="8">
				<van-row justify="center">
					<van-col span="5">默认日期</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="5">日期范围</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="原纸采购" name="9">
				<van-row justify="center">
					<van-col span="5">默认日期</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="5">日期范围</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="原纸出库" name="10">
				<van-row justify="center">
					<van-col span="7">默认出库日期</van-col>
					<van-col span="8">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="7">出库日期范围</van-col>
					<van-col span="8">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="8">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="原纸入库" name="11">
				<van-row justify="center">
					<van-col span="7">默认入库日期</van-col>
					<van-col span="8">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="7">入库日期范围</van-col>
					<van-col span="8">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="8">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="库区控制" name="13">
				<van-switch-cell v-model="formData.bMStockArea" title="是否显示库区" />
				<van-switch-cell v-model="formData.bSAreaControl" title="库区控制" />
			</van-collapse-item>
			<van-collapse-item title="直接入库" name="14">
				<van-row justify="center">
					<van-col span="7">默认入库日期</van-col>
					<van-col span="8">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="7">入库日期范围</van-col>
					<van-col span="8">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="8">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="扫描装货（列表）" name="15">
				<van-row justify="center">
					<van-col span="5">默认日期</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="5">日期范围</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="扫描装货（详情）" name="16">
				<van-switch-cell v-model="formData.bSAreaControl" title="订单号装货默认带出库存数" />
			</van-collapse-item>
			<van-collapse-item title="订单试算" name="17">
				<van-switch-cell v-model="formData.bSAreaControl" title="自动获取客户是否默认加修边＆加面积" />
				<van-switch-cell v-model="formData.bSAreaControl" title="自动获取默认的箱舌＆封箱调整" />
				<van-switch-cell v-model="formData.bSAreaControl" title="自动获取平方报价" />
			</van-collapse-item>
			<van-collapse-item title="收款调账" name="18">
				<van-row justify="center">
					<van-col span="5">默认日期</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="5">日期范围</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.field" style="width:100%;">
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
	import { Button, CellGroup, Row, Col, Field, SwitchCell, Dialog, Collapse, CollapseItem } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[CellGroup.name]: CellGroup,
			[Row.name]: Row,
			[Col.name]: Col,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[Collapse.name]: Collapse,
			[CollapseItem.name]: CollapseItem,
		},
		data(){
			return {
				formData : {
					Wap1Right     : '',
					bMStockArea   : '',
					bSAreaControl : '',
					field:''
				},
				activeName : '1',
			}
		},
		methods:{
			getConfig(){
				let self = this;
				this.$request.admin.config.getConfig().then((res)=>{
					
				});
			},
			saveConfig(){

			}
		},
		created(){
			this.$store.commit('admin/setHeaderTitle','内部参数修改');
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