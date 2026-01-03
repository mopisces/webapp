<!-- 银行账单查询 弃用 -->
<template>
	<div>
		<van-field 
			v-model="outTradeNo" 
			label="炜盛流水号" 
			placeholder="请输入" 
		/>
		<van-field 
			v-model="transactionId" 
			label="商户流水号" 
			placeholder="请输入" 
		/>
		<div class="button-container">
			<van-button 
				type="primary" 
				size="normal"
				:disabled="checkBtn"
				:round="true"
				@click="queryStatus"
			>
				查询银行账单
			</van-button>
		</div>
		<div v-if="!checkBtn">
			<card 
				:title="banckBillInfo.mchntCnNm"
				:extra="banckBillInfo.transStatusDesc"
				:is-shadow="true"
			>
				<div class="card-body-container">
					<div class="card-body-item card-body-item-100">
						<span>交易时间:
							<span class="mg-left-20">{{ banckBillInfo.transDatetime }}</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>商户流水号:
							<span class="mg-left-20">{{ banckBillInfo.traceNo }}</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>银行:
							<span class="mg-left-20">{{ banckBillInfo.outTradeNo }}</span>
						</span>
					</div>
					<div class="card-body-item card-body-item-100">
						<span>交易信息:
							<span class="mg-left-20 green-color">{{ formattedAmount }}</span>
							<span class="mg-left-20 blue-color">{{ banckBillInfo.fundTypeName }}</span>
						</span>
					</div>
				</div>
				<div v-if="banckBillInfo.isWebPayPaid != 1" slot="actions" class="card-actions">
					<div class="card-actions-item" @click="updateStatus"> 
						<van-icon color="#3c9cff" class-prefix="iconfont" name="shuaxin" size="18"/>
						<span class="card-actions-item-text blue-color">更新状态</span>
					</div>
				</div>
			</card>
		</div>
	</div>
</template>

<script>
	import { Button, Icon, Field, Toast } from 'vant';
	/*自定义卡片组件*/
	import Card from "@/components/subject/card/Card.vue";
	/*api接口*/
	import { fetchList, doOpData } from "@/api/client/customer.js"

	export default {
		components: {
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Field.name]: Field,
			[Toast.name]: Toast,

			Card
		},
		computed: {
			outTradeNo: {
				get: function(){
					return this.formData.wxOutTradeNo;
				},
				set: function(newValue) {
					this.formData.wxOutTradeNo = newValue.trim();
				}
			},
			transactionId:  {
				get: function(){
					return this.formData.wxTransactionId;
				},
				set: function(newValue) {
					this.formData.wxTransactionId = newValue.trim();
				}
			},
			checkBtn() {
				return !this.formData.wxOutTradeNo && !this.formData.wxTransactionId
			},
			formattedAmount() {
				if (!this.banckBillInfo.totalFee) return '0.00';

				return (this.banckBillInfo.totalFee / 100).toFixed(2);
			}
		},
		watch: {
			checkBtn(newVal, oldVal) {
				if( newVal ) {
					this.banckBillInfo = this.$options.data().banckBillInfo
				}
			}
		},
		data() {
			return {
				config: {
					showRefresh: false
				},
				// 银行帐单信息
				banckBillInfo: {
					// 商户名称
					mchntCnNm: '',
					// 交易状态描述
					transStatusDesc: '',
					// 交易时间
					transDatetime: '',
					// 交易金额
					totalFee: 0,
					// 商户流水号
					traceNo: '',
					// 资金类
					fundTypeName: '',
					// 订单流水号
					outTradeNo: '',
					// 是否已支付
					isWebPayPaid: 1
				},
				formData: {
					dataType: 26,
					// 内部流水号
					wxOutTradeNo: '',
					// 微信商户流水号
					wxTransactionId: ''
				}
			}
		},
		async created() {
			await this.$store.commit('client/setHeaderTitle', '银行账单查询')
		},
		methods: {
			async queryStatus(){
				this.banckBillInfo = this.$options.data().banckBillInfo
				const { result } = await fetchList(this.formData)
				this.banckBillInfo = result
			},
			// 更新订单状态
			async updateStatus() {
				const { result } = await doOpData({
					dataType: 13,
					wxOutTradeNo: this.formData.wxOutTradeNo,
					wxTransactionId: this.formData.wxTransactionId
				})
			}
		}
	}
</script>

<style type="text/css">
	@import '~@/assets/style/card.css';

	.button-container {
		display: flex;
		justify-content: center; 
		margin-top: 20px;
	}
</style>
