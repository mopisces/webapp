<template>
	<div>
		<van-field 
			v-model="cust" 
			clickable 
			placeholder="选择客户名称" 
			input-align="center" 
			label="客户名称" 
			readonly 
			:error-message="cusCHN"
			@click="popupShow = true" 
		>
			<van-icon name="arrow" slot="right-icon"/>
		</van-field>
	</div>
</template>

<script>
	/*vant组件*/
	import { Icon, Popup, Picker, Field, Search } from "vant"
	/*api接口*/
	import { fetchDataList } from "@/api/common/webConfig.js"

	export default {
		name: "KarryCusPicker",
		props: {
			cusId: {
				type: String,
				required: true,
				default: ""
			},
			showCHN: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {

			}
		},
	}
</script>