<template>
	<van-field 
		v-model="res" 
		placeholder="请输入订单号" 
		label="条形码编号" 
		input-align="center" 
		maxlength="12"
	>
	 	<van-icon 
	 		v-if="isWx"
	 		class-prefix="iconfont" 
	 		size="18" 
	 		name="saomiao4" 
	 		slot="right-icon" 
	 		color="#0bf147" 
	 		@click="scan()"
	 	/>
	</van-field>
</template>

<script>
	/*vant组件*/
	import { Icon, Field } from "vant"
	/*自定义方法*/
	import { submitForm } from "@/util"

	export default {
		name: "ScanField",
		props: {
			result: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				/*是否是微信环境*/
				isWx: false
			}
		},
		computed: {
			res: {
				get() {
					return this.$props.result
				},
				set( nVal ) {
					this.$emit("update:result", nVal)
				}
			}
		},
		methods: {
			scan() {
				
			},
			checkEnv() {
				let ua = window.navigator.userAgent.toLowerCase()
				if( ua.match(/MicroMessenger/i) == 'micromessenger' ) this.isWx = true
			}
		},
	}
</script>