<!-- 支付方式 -->
<template>
	<div>
		<div class="pay-way-header">
			<div class="pay-way-header-item">{{  }}</div>
			<div class="pay-way-header-item"></div>
			<div class="pay-way-header-item"></div>
		</div>
	</div>
</template>

<script>
	/*vant组件*/
	import { Cell, CellGroup, Popup, SwitchCell } from "vant"

	export default {
		data() {
			return {
				/*订单信息*/
				info: {

				}
			}
		}
	}
</script>

<style type="text/css" scoped>
	.pay-way-header {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.pay-way-header-item {
		text-align: center;
		width: 100%;
	}
</style>