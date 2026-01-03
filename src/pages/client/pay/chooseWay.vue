<!-- 支付选择页面 -->
<template>
	<div>
		<div class="choose-way-header">
			<div class="choose-way-header-box">
				{{ info.orderName }}
			</div>
			<div class="choose-way-header-box choose-way-header-cost">
				¥{{ info.total }}
			</div>
			<div class="choose-way-header-box">
				
			</div>
		</div>
	</div>
</template>

<script>
	/*api接口*/
	import { fetchList } from "@/api/client/customer.js"
	// 第三方库
	import QRCode from "qrcodejs2"
	// 自定义方法
	import { submitForm } from "@/util"

	export default {
		data() {
			return {
				/*配置*/
				config: {},
				// 表单数据
				formData: {
					// 数据类型
					dataType: 25,
					// 订单号
					cusPoNoList: null,
					
				},
				// 页面信息
				info: {
					// 是否是微信环境
					isWx: false,
					// 订单名称
					orderName: "",
					// 订单总金额
					total: 0,
					// 支付宝支付
					useAlipay: 0,
					// 微信支付
					useWechat: 0,
					// 信用额度支付
					useCredit: 0,
					// 易收宝付款
					useYSB: 0,
					// 信用额度剩余
					leftMinAmtCond: 0,
					// 支付过期时间
					deadLine: null,
					// 是否1分钱支付
					oneCent: 0,
				}
			}
		},
		async created() {
			await this.$store.commit("client/setHeaderTitle", "支付方式")
		},
		async mounted() {
			const cusPoNoList = this.$route.params.cusOrderId
			this.info.isWx = window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger" ? true : false
			if( cusPoNoList ){
				this.formData.cusPoNoList = Array.isArray(cusPoNoList)? cusPoNoList.join(',') : cusPoNoList
				await this.queryData()
			}else{
				this.formData = this.$options.data().formData
				this.info = this.$options.data().info
				this.$router.go(-1)	
			}
		},
		methods: {
			async queryData() {
				this.info = this.$options.data().info
				const { result } = await fetchList(this.formData)
				this.info = result
			},
		}
	}
</script>

<style type="text/css" scoped>
	.choose-way-header {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.choose-way-header-box {
		width: 100%;
		padding: 20px;
		text-align: center;
	}

	.choose-way-header-cost {
		color: rgb(26, 173, 25);
		font-size: 28px;
	}
</style>
